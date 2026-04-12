import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { StoreProvider } from './stores/StoreContext';
import { useAuth } from './hooks/useAuth';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { CarsPage } from './pages/CarsPage';
import { OrdersPage } from './pages/OrdersPage';
import { ProfilePage } from './pages/ProfilePage';
import { UsersPage } from './pages/UsersPage';
import { StaffProfilePage } from './pages/StaffProfilePage';
import { StaffUserCarsPage } from './pages/StaffUserCarsPage';
import { StaffUserOrdersPage } from './pages/StaffUserOrdersPage';
import { Toast } from './components/Toast';
import { useToast } from './components/Toast';

const ProtectedRoute = observer(function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && auth.user?.role?.roleName) {
    const userRole = auth.user.role.roleName.toLowerCase();
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
});

const PublicRoute = observer(function PublicRoute({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
});

const AppRoutes = observer(function AppRoutes() {
  const auth = useAuth();
  const { toasts, removeToast } = useToast();
  const userRole = auth.user?.role?.roleName?.toLowerCase() || '';

  const canManageUsers = userRole === 'owner' || userRole === 'manager';

  return (
    <Layout allowedRoles={canManageUsers ? [userRole] : []}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
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
              <CarsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toast toasts={toasts} onRemove={removeToast} />
    </Layout>
  );
});

function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <AppRoutes />
      </StoreProvider>
    </BrowserRouter>
  );
}

export default App;
