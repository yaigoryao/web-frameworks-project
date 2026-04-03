import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/">🚗 Car Service</Link>
        </div>
        {isAuthenticated && (
          <div className="navbar-menu">
            <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
              Dashboard
            </Link>
            <Link to="/cars" className={isActive('/cars') ? 'active' : ''}>
              Cars
            </Link>
            <Link to="/orders" className={isActive('/orders') ? 'active' : ''}>
              Orders
            </Link>
            <Link to="/profile" className={isActive('/profile') ? 'active' : ''}>
              Profile
            </Link>
          </div>
        )}
        <div className="navbar-user">
          {isAuthenticated ? (
            <>
              <span className="user-name">
                {user?.name} {user?.surname}
              </span>
              <button onClick={logout} className="btn-logout">
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
