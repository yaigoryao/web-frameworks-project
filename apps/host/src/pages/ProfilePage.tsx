import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { CustomerUpdateUserRequest } from '../types';
import './ProfilePage.css';

export function ProfilePage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    surname: user?.surname || '',
    patronymic: user?.patronymic || '',
    phoneNumber: user?.phoneNumber || '',
  });
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      if (!user?.login) {
        setMessage('Ошибка: информация о пользователе недоступна');
        setIsLoading(false);
        return;
      }

      const updateData: CustomerUpdateUserRequest = {
        login: user.login,
        name: formData.name || null,
        surname: formData.surname || null,
        patronymic: formData.patronymic || null,
        phoneNumber: formData.phoneNumber || null,
      };
      
      if (password) {
        updateData.password = password;
      }
      
      await api.updateUserInfo(updateData);
      setMessage('Профиль успешно обновлён!');
      setPassword('');
    } catch (error) {
      setMessage('Ошибка при обновлении профиля');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <h1>👤 Профиль пользователя</h1>
      
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar">
            {user?.name?.charAt(0)}{user?.surname?.charAt(0)}
          </div>
          <div className="profile-title">
            <h2>{user?.name} {user?.surname}</h2>
            <p className="role-badge">{user?.role?.roleName}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {message && (
            <div className={`message ${message.includes('успешно') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="surname">Фамилия</label>
              <input
                type="text"
                id="surname"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="name">Имя</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
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
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Телефон</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Новый пароль (оставьте пустым, чтобы не менять)</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите новый пароль"
            />
          </div>

          <button type="submit" disabled={isLoading} className="btn-save">
            {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </form>

        <div className="profile-info-section">
          <h3>Информация об аккаунте</h3>
          <div className="info-row">
            <span className="info-label">Логин:</span>
            <span className="info-value">{user?.login}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Статус:</span>
            <span className={`info-value ${user?.isActive ? 'active' : 'inactive'}`}>
              {user?.isActive ? 'Активен' : 'Неактивен'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
