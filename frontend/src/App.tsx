import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Navigation & Layout
import Navbar from './components/navigation/Navbar';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/home/HomePage';
import VehiclesPage from './pages/vehicles/VehiclesPage';
import VehicleDetailPage from './pages/vehicles/VehicleDetailPage';
import DestinationsPage from './pages/destinations/DestinationsPage';
import DestinationDetailPage from './pages/destinations/DestinationDetailPage';
import MyBookingsPage from './pages/bookings/MyBookingsPage';
import ProfilePage from './pages/account/ProfilePage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AboutPage from './pages/about/AboutPage';
import ContactPage from './pages/contact/ContactPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Scroll to top helper on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Protected Route wrapper
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#0B3B3C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// 404 Not Found Page
const NotFoundPage: React.FC = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 pt-24 text-center">
    <div className="max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
      <span className="text-5xl font-black text-[#0B3B3C]">404</span>
      <h2 className="text-xl font-bold text-slate-800 mt-3 mb-2">Page Not Found</h2>
      <p className="text-xs text-slate-500 mb-6">
        The page you are looking for doesn't exist or has moved. Explore Sri Lanka with TourLynk!
      </p>
      <a
        href="/"
        className="inline-block px-6 py-2.5 bg-[#0B3B3C] hover:bg-[#0E4D52] text-white text-xs font-bold rounded-xl transition"
      >
        Return Home
      </a>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/vehicles" element={<VehiclesPage />} />
              <Route path="/vehicles/:id" element={<VehicleDetailPage />} />
              <Route path="/destinations" element={<DestinationsPage />} />
              <Route path="/destinations/:slug" element={<DestinationDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/auth/login" element={<Navigate to="/login" replace />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/auth/register" element={<Navigate to="/register" replace />} />

              {/* User Protected Routes */}
              <Route
                path="/bookings"
                element={
                  <ProtectedRoute>
                    <MyBookingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;