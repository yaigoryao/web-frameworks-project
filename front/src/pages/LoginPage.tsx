import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import './AuthPage.css';

export function LoginPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // #region agent log
      fetch('http://127.0.0.1:7647/ingest/5dbce222-9957-4ad6-b6f1-d80f014d3c87', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'e0fe60' },
        body: JSON.stringify({
          sessionId: 'e0fe60',
          runId: 'post-fix',
          hypothesisId: 'H1',
          location: 'LoginPage.tsx:handleSubmit',
          message: 'about to call destructured authLogin',
          data: { authLoginType: typeof authLogin },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      await authLogin({ login, password });
      navigate('/dashboard');
    } catch (err) {
      const { message } = api.parseApiError(err);
      const text = Array.isArray(message) ? message.join(' ') : message;
      setError(text || 'Неверный логин или пароль');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Вход в систему</h1>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label htmlFor="login">Логин</label>
            <input
              type="text"
              id="login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={isLoading} className="btn-submit">
            {isLoading ? 'Вход...' : 'Войти'}
          </button>
        </form>
        <p className="auth-link">
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
}
