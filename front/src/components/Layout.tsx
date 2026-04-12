import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearAuth } from '../redux/slices/authSlice';
import type { RootState } from '../redux/store';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export function Layout({ children, allowedRoles = [] }: LayoutProps) {
  const { user, accessToken } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const canSeeUsers = allowedRoles.includes('owner') || allowedRoles.includes('manager');
  const isAuthenticated = !!accessToken;

  const handleLogout = () => {
    dispatch(clearAuth());
    navigate('/login');
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/">🚗 Car Service</Link>
        </div>
        {isAuthenticated && (
          <div className="navbar-menu">
            <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
              Главная
            </Link>
            <Link to="/cars" className={isActive('/cars') ? 'active' : ''}>
              Машины
            </Link>
            <Link to="/orders" className={isActive('/orders') ? 'active' : ''}>
              Заказы
            </Link>
            {canSeeUsers && (
              <Link to="/users" className={isActive('/users') ? 'active' : ''}>
                Пользователи
              </Link>
            )}
            <Link to="/profile" className={isActive('/profile') ? 'active' : ''}>
              Профиль
            </Link>
          </div>
        )}
        <div className="navbar-user">
          {isAuthenticated ? (
            <>
              <span className="user-name">
                {user?.name} {user?.surname}
              </span>
              {user?.role?.roleName && (
                <span className={`user-role-badge role-${user.role.roleName.toLowerCase()}`}>
                  {user.role.roleName}
                </span>
              )}
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-login">
              Login
            </Link>
          )}
        </div>
      </nav>
      <main className="main-content">{children}</main>
    </div>
  );
}
