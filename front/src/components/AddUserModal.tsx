import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  TextField,
  CircularProgress,
} from '@mui/material';
import { api } from '../services/api';
import { CreateUserRequest } from '../types';

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

const emptyForm = (): CreateUserRequest => ({
  name: '',
  surname: '',
  patronymic: '',
  login: '',
  password: '',
  phoneNumber: '',
  role: 'user',
});

export function AddUserModal({ isOpen, onClose, onSuccess, currentUserRole }: AddUserModalProps) {
  const [formData, setFormData] = useState<CreateUserRequest>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingLogin, setIsCheckingLogin] = useState(false);
  const [loginChecked, setLoginChecked] = useState(false);

  const isOwner = currentUserRole === 'owner';
  const loginDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setFormData(emptyForm());
      setErrors({});
      setLoginChecked(false);
      if (loginDebounceRef.current) {
        clearTimeout(loginDebounceRef.current);
        loginDebounceRef.current = null;
      }
    } else if (isOwner) {
      setFormData((prev) => ({ ...prev, role: 'user' }));
    }
  }, [isOpen, isOwner]);

  const validateField = useCallback((name: string, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Имя обязательно';
        if (value.trim().length < 2) return 'Минимум 2 символа';
        if (!/^[а-яА-ЯёЁa-zA-Z]+$/.test(value.trim())) return 'Только буквы';
        return undefined;
      case 'surname':
        if (!value.trim()) return 'Фамилия обязательна';
        if (value.trim().length < 2) return 'Минимум 2 символа';
        if (!/^[а-яА-ЯёЁa-zA-Z]+$/.test(value.trim())) return 'Только буквы';
        return undefined;
      case 'login':
        if (!value.trim()) return 'Логин обязателен';
        if (value.trim().length < 3) return 'Минимум 3 символа';
        if (!/^[a-zA-Z0-9@.]+$/.test(value.trim())) return 'Недопустимые символы';
        return undefined;
      case 'password':
        if (!value) return 'Пароль обязателен';
        if (value.length < 6) return 'Минимум 6 символов';
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

  const scheduleLoginCheck = useCallback((login: string) => {
    if (loginDebounceRef.current) clearTimeout(loginDebounceRef.current);
    const trimmed = login.trim();
    if (trimmed.length < 3) {
      setLoginChecked(false);
      return;
    }
    loginDebounceRef.current = setTimeout(async () => {
      setIsCheckingLogin(true);
      try {
        const result = await api.checkEmailAvailability(trimmed);
        setErrors((prev) => ({
          ...prev,
          login: result.available ? undefined : 'Логин уже занят',
        }));
        setLoginChecked(result.available);
      } catch {
        setLoginChecked(false);
      } finally {
        setIsCheckingLogin(false);
      }
    }, 500);
  }, []);

  useEffect(() => {
    return () => {
      if (loginDebounceRef.current) clearTimeout(loginDebounceRef.current);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const err = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));

    if (name === 'login') {
      setLoginChecked(false);
      scheduleLoginCheck(value);
    }
  };

  const handleRoleChange = (e: SelectChangeEvent<'manager' | 'user'>) => {
    const value = e.target.value as 'manager' | 'user';
    setFormData((prev) => ({ ...prev, role: value }));
    setErrors((prev) => ({ ...prev, role: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    newErrors.name = validateField('name', formData.name) || undefined;
    newErrors.surname = validateField('surname', formData.surname) || undefined;
    newErrors.login = validateField('login', formData.login) || undefined;
    newErrors.password = validateField('password', formData.password) || undefined;
    newErrors.phoneNumber = validateField('phoneNumber', formData.phoneNumber || '') || undefined;
    if (isOwner && !formData.role) {
      newErrors.role = 'Выберите роль';
    }
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (errors.login === 'Логин уже занят') return;

    setIsLoading(true);
    setErrors({});

    const payload: CreateUserRequest = {
      name: formData.name.trim(),
      surname: formData.surname.trim(),
      patronymic: formData.patronymic?.trim() || undefined,
      login: formData.login.trim(),
      password: formData.password,
      phoneNumber: formData.phoneNumber?.trim() || undefined,
    };
    if (isOwner && formData.role) {
      payload.role = formData.role;
    }

    try {
      await api.createUser(payload);
      onSuccess();
      onClose();
    } catch (error) {
      const apiError = api.parseApiError(error);
      if (apiError.status === 409 || apiError.message.toLowerCase().includes('логин')) {
        setErrors((prev) => ({ ...prev, login: 'Логин уже занят' }));
      } else if (apiError.status === 403) {
        setErrors((prev) => ({ ...prev, general: 'Недостаточно прав' }));
      } else {
        setErrors((prev) => ({ ...prev, general: apiError.message }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm" aria-labelledby="add-user-dialog-title">
      <DialogTitle id="add-user-dialog-title">Новый пользователь</DialogTitle>
      <form onSubmit={handleSubmit} noValidate>
        <DialogContent>
          {errors.general && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.general}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
            <TextField
              required
              name="surname"
              label="Фамилия"
              value={formData.surname}
              onChange={handleChange}
              error={!!errors.surname}
              helperText={errors.surname}
              disabled={isLoading}
              autoFocus
              sx={{ flex: '1 1 200px' }}
            />
            <TextField
              required
              name="name"
              label="Имя"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              disabled={isLoading}
              sx={{ flex: '1 1 200px' }}
            />
          </Box>

          <TextField
            margin="normal"
            fullWidth
            name="patronymic"
            label="Отчество"
            value={formData.patronymic}
            onChange={handleChange}
            disabled={isLoading}
          />

          <TextField
            margin="normal"
            fullWidth
            required
            name="login"
            label="Логин"
            value={formData.login}
            onChange={handleChange}
            error={!!errors.login}
            helperText={
              errors.login ||
              (isCheckingLogin ? 'Проверка…' : loginChecked && formData.login.trim().length >= 3 ? 'Логин свободен' : ' ')
            }
            disabled={isLoading}
            slotProps={{
              input: {
                endAdornment: isCheckingLogin ? <CircularProgress size={20} sx={{ mr: 1 }} /> : undefined,
              },
            }}
          />

          <TextField
            margin="normal"
            fullWidth
            required
            name="password"
            type="password"
            label="Пароль"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            disabled={isLoading}
            autoComplete="new-password"
          />

          <TextField
            margin="normal"
            fullWidth
            name="phoneNumber"
            label="Телефон"
            placeholder="+79001234567"
            value={formData.phoneNumber}
            onChange={handleChange}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
            disabled={isLoading}
          />

          {isOwner && (
            <FormControl margin="normal" fullWidth error={!!errors.role}>
              <InputLabel id="new-user-role-label">Роль</InputLabel>
              <Select
                labelId="new-user-role-label"
                label="Роль"
                value={formData.role ?? 'user'}
                onChange={handleRoleChange}
                disabled={isLoading}
              >
                <MenuItem value="user">Клиент</MenuItem>
                <MenuItem value="manager">Менеджер</MenuItem>
              </Select>
              {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
            </FormControl>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={isLoading}>
            Отмена
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading || isCheckingLogin}>
            {isLoading ? 'Создание…' : 'Создать'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
