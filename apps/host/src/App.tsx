import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { UsersPage } from './pages/UsersPage';
import { StaffProfilePage } from './pages/StaffProfilePage';
import { StaffUserCarsPage } from './pages/StaffUserCarsPage';
import { StaffUserOrdersPage } from './pages/StaffUserOrdersPage';
import { Toast } from './components/Toast';
import { useToast } from './components/Toast';

const RemoteOrdersPage = React.lazy(() => import('mfeOrders/OrdersPage'));
const RemoteCarsPage = React.lazy(() => import('mfeCars/CarsPage'));

function MfFallback() {
  return <div className="loading">Загрузка модуля...</div>;
}

function MfUnavailablePage({ title }: { title: string }) {
  return (
    <div className="mf-unavailable">
      <h2>{title} временно недоступна</h2>
      <p>Микрофронт не отвечает. Попробуйте открыть страницу позже.</p>
      <Link to="/dashboard" className="mf-unavailable-link">
        Перейти на дашборд
      </Link>
    </div>
  );
}

class MfErrorBoundary extends React.Component<
  { children: React.ReactNode; fallbackTitle: string },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallbackTitle: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidUpdate(prevProps: { fallbackTitle: string }) {
    if (prevProps.fallbackTitle !== this.props.fallbackTitle && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return <MfUnavailablePage title={this.props.fallbackTitle} />;
    }

    return this.props.children;
  }
}

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user?.role?.roleName) {
    const userRole = user.role.roleName.toLowerCase();
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();
  const { toasts, removeToast } = useToast();
  const userRole = user?.role?.roleName?.toLowerCase() || '';
  
  const canManageUsers = userRole === 'owner' || userRole === 'manager';

  return (
    <Layout allowedRoles={canManageUsers ? [userRole] : []}>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cars"
          element={
            <ProtectedRoute>
              <MfErrorBoundary fallbackTitle="Страница машин">
                <Suspense fallback={<MfFallback />}>
                  <RemoteCarsPage />
                </Suspense>
              </MfErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <MfErrorBoundary fallbackTitle="Страница заказов">
                <Suspense fallback={<MfFallback />}>
                  <RemoteOrdersPage />
                </Suspense>
              </MfErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute allowedRoles={['owner', 'manager']}>
              <StaffUserOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute allowedRoles={['owner', 'manager']}>
              <StaffProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cards/:id"
          element={
            <ProtectedRoute allowedRoles={['owner', 'manager']}>
              <StaffUserCarsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={['owner', 'manager']}>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
      <Toast toasts={toasts} onRemove={removeToast} />
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;