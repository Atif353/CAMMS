import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';

import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import EditUserPage from './pages/admin/EditUserPage';
import AdminActivitiesPage from './pages/admin/AdminActivitiesPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import SettingsPage from './pages/admin/SettingsPage';
import InstructorDashboardPage from './pages/instructor/InstructorDashboardPage';
import LogActivityPage from './pages/instructor/LogActivityPage';
import ActivitiesListPage from './pages/instructor/ActivitiesListPage';
import EditActivityPage from './pages/instructor/EditActivityPage';
import InstructorReportsPage from './pages/instructor/InstructorReportsPage';
import NotificationsPage from './pages/instructor/NotificationsPage';
import ProfilePage from './pages/ProfilePage';

import { ToastProvider } from './components/Toast';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <ManageUsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users/create"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <EditUserPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users/:id/edit"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <EditUserPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/activities"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminActivitiesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminReportsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/profile"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/instructor/dashboard"
              element={
                <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                  <InstructorDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/log-activity"
              element={
                <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                  <LogActivityPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/activities"
              element={
                <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                  <ActivitiesListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/activities/:id/edit"
              element={
                <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                  <EditActivityPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/reports"
              element={
                <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                  <InstructorReportsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/notifications"
              element={
                <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/profile"
              element={
                <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

