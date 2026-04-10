import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { CreateUserRequest, ALLOWED_ROLES } from '../types';
import './AddUserModal.css';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentUserRole: string;
}

interface FormErrors {
  name?: string;
  surname?: string;
  login?: string;
  password?: string;
  phoneNumber?: string;
  role?: string;
  general?: string;
}

export function AddUserModal({ isOpen, onClose, onSuccess, currentUserRole }: AddUserModalProps) {
  const [formData, setFormData] = useState<CreateUserRequest>({
    name: '',
    surname: '',
    patronymic: '',
    login: '',
    password: '',
    phoneNumber: '',
    role: 'client',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingLogin, setIsCheckingLogin] = useState(false);
  const [loginChecked, setLoginChecked] = useState(false);

  const allowedRoles = ALLOWED_ROLES[currentUserRole] || [];

  useEffect(() => {
    if (allowedRoles.length === 1 && allowedRoles[0] === 'client') {
      setFormData((prev) => ({ ...prev, role: 'client' }));
    }
  }, [allowedRoles]);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: '',
        surname: '',
        patronymic: '',
        login: '',
        password: '',
        phoneNumber: '',
        role: allowedRoles.length === 1 ? 'client' : allowedRoles[0],
      });
      setErrors({});
      setLoginChecked(false);
    }
  }, [isOpen, allowedRoles]);

  const validateField = useCallback((name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Имя обязательно';
        if (value.trim().length < 2) return 'Имя должно содержать минимум 2 символа';
        if (!/^[а-яА-ЯёЁa-zA-Z]+$/.test(value.trim())) return 'Имя должно содержать только буквы';
        return undefined;
      case 'surname':
        if (!value.trim()) return 'Фамилия обязательна';
        if (value.trim().length < 2) return 'Фамилия должна содержать минимум 2 символа';
        if (!/^[а-яА-ЯёЁa-zA-Z]+$/.test(value.trim())) return 'Фамилия должна содержать только буквы';
        return undefined;
      case 'login':
        if (!value.trim()) return 'Логин обязателен';
        if (value.trim().length < 3) return 'Логин должен содержать минимум 3 символа';
        if (!/^[a-zA-Z0-9@.]+$/.test(value.trim())) return 'Логин содержит недопустимые символы';
        return undefined;
      case 'password':
        if (!value) return 'Пароль обязателен';
        if (value.length < 6) return 'Пароль должен содержать минимум 6 символов';
        return undefined;
      case 'phoneNumber':
        if (value && !/^[+]?[0-9]{10,15}$/.test(value.replace(/\s/g, ''))) {
          return 'Неверный формат телефона';
        }
        return undefined;
      default:
        return undefined;
    }
  }, []);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
    
    if (name === 'login' && value.trim().length >= 3) {
      setLoginChecked(false);
      const timeoutId = setTimeout(async () => {
        setIsCheckingLogin(true);
        try {
          const result = await api.checkEmailAvailability(value.trim());
          if (!result.available) {
            setErrors((prev) => ({ ...prev, login: 'Логин уже занят' }));
          }
          setLoginChecked(true);
        } catch {
          setLoginChecked(false);
        } finally {
          setIsCheckingLogin(false);
        }
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    newErrors.name = validateField('name', formData.name) || undefined;
    newErrors.surname = validateField('surname', formData.surname) || undefined;
    newErrors.login = validateField('login', formData.login) || undefined;
    newErrors.password = validateField('password', formData.password) || undefined;
    newErrors.phoneNumber = validateField('phoneNumber', formData.phoneNumber || '') || undefined;
    
    if (!formData.role) {
      newErrors.role = 'Роль обязательна';
    }
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      await api.createUser({
        name: formData.name.trim(),
        surname: formData.surname.trim(),
        patronymic: formData.patronymic?.trim() || undefined,
        login: formData.login.trim(),
        password: formData.password,
        phoneNumber: formData.phoneNumber?.trim() || undefined,
        role: formData.role,
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      const apiError = api.parseApiError(error);
      if (apiError.status === 409 || apiError.message.toLowerCase().includes('логин')) {
        setErrors((prev) => ({ ...prev, login: 'Логин уже занят' }));
      } else if (apiError.status === 403) {
        setErrors((prev) => ({ ...prev, general: 'Недостаточно прав для создания пользователя' }));
      } else {
        setErrors((prev) => ({ ...prev, general: apiError.message }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      onClose();
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button 
          className="modal-close" 
          onClick={onClose} 
          aria-label="Закрыть модальное окно"
          type="button"
        >
          ×
        </button>
        
        <h2 id="modal-title" className="modal-title">Добавить пользователя</h2>
        
        <form onSubmit={handleSubmit} noValidate>
          {errors.general && (
            <div className="error-banner" role="alert">
              {errors.general}
            </div>
          )}
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="surname">Фамилия *</label>
              <input
                type="text"
                id="surname"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                className={errors.surname ? 'input-error' : ''}
                disabled={isLoading}
                aria-invalid={!!errors.surname}
                aria-describedby={errors.surname ? 'surname-error' : undefined}
                autoFocus
              />
              {errors.surname && <span id="surname-error" className="field-error">{errors.surname}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="name">Имя *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'input-error' : ''}
                disabled={isLoading}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && <span id="name-error" className="field-error">{errors.name}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="patronymic">Отчество</label>
            <input
              type="text"
              id="patronymic"
              name="patronymic"
              value={formData.patronymic}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="login">
              Логин (Email) *
              {isCheckingLogin && <span className="checking-indicator">Проверка...</span>}
              {loginChecked && !errors.login && <span className="available-indicator">✓</span>}
            </label>
            <input
              type="text"
              id="login"
              name="login"
              value={formData.login}
              onChange={handleChange}
              className={errors.login ? 'input-error' : ''}
              disabled={isLoading}
              aria-invalid={!!errors.login}
              aria-describedby={errors.login ? 'login-error' : undefined}
            />
            {errors.login && <span id="login-error" className="field-error">{errors.login}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Пароль *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'input-error' : ''}
              disabled={isLoading}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
              autoComplete="new-password"
            />
            {errors.password && <span id="password-error" className="field-error">{errors.password}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="phoneNumber">Телефон</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={errors.phoneNumber ? 'input-error' : ''}
              disabled={isLoading}
              aria-invalid={!!errors.phoneNumber}
              aria-describedby={errors.phoneNumber ? 'phone-error' : undefined}
              placeholder="+79001234567"
            />
            {errors.phoneNumber && <span id="phone-error" className="field-error">{errors.phoneNumber}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="role">Роль *</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={isLoading || allowedRoles.length === 1}
              aria-invalid={!!errors.role}
              aria-describedby={errors.role ? 'role-error' : undefined}
            >
              {allowedRoles.map((role) => (
                <option key={role} value={role}>
                  {role === 'manager' ? 'Менеджер' : 'Клиент'}
                </option>
              ))}
            </select>
            {errors.role && <span id="role-error" className="field-error">{errors.role}</span>}
          </div>
          
          <div className="modal-actions">
            <button 
              type="button" 
              className="btn-cancel"
              onClick={onClose}
              disabled={isLoading}
            >
              Отмена
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={isLoading || isCheckingLogin}
            >
              {isLoading ? 'Создание...' : 'Создать пользователя'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
