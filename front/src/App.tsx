import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
import { useGetCurrentUserQuery } from './redux/slices/userApiSlice';
import { setUser } from './redux/slices/authSlice';
import type { RootState } from './redux/store';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user, accessToken } = useSelector((state: RootState) => state.auth);
  const { data: currentUser, isLoading } = useGetCurrentUserQuery(undefined, {
    skip: !accessToken,
  });
  
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (currentUser && !user) {
      dispatch(setUser(currentUser));
    }
  }, [currentUser, dispatch, user]);
  
  const isAuthenticated = !!accessToken;

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
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!accessToken;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { userRole } = useSelector((state: RootState) => state.auth);
  const { toasts, removeToast } = useToast();
  
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
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;