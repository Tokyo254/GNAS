// AppRoutes.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { ToastProvider } from '../context/ToastContext';
import ToastContainer from '../components/ToastContainer';
import ProtectedRoute from "../components/ProtectedRoute";
import LandingPage from "../pages/LandingPage/LandingPage";
import AdminDashboard from "../pages/Admin/admin";
import JournalistDashboard from "../pages/Journalist/JournalistDashboard";
import CommsDashboard from "../pages/Comms/CommsDashboard";
import NotFound from "../pages/Notfound";
import SignUp from "../pages/Auth/SignUp"; 
import Login from "../pages/Auth/LogIn";
import Unauthorized from "../pages/Unauthorized";
import EmailVerification from "../pages/Auth/EmailVerification";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import JournalistSignUp from "../pages/Auth/JournalistSignUp";
import AdminSignUp from "../pages/Auth/AdminSignUp"; 
import BlogPostPage from "../pages/PressRelease/BlogPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <ToastContainer />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUp />} /> {/* Comms professional */}
            <Route path="/journalist-signup" element={<JournalistSignUp />} />
            <Route path="/admin-signup" element={<AdminSignUp />} /> {/* Invite-only */}
            <Route path="/login" element={<Login />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/blog/:id" element={<BlogPostPage />} />

            
            {/* Role-Based Protected Routes */}
            
            {/* Journalist Routes */}
            <Route 
              path="/journalist/*" 
              element={
                <ProtectedRoute requiredRole="journalist">
                  <JournalistDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Communications Professional Routes */}
            <Route 
              path="/comms/*" 
              element={
                <ProtectedRoute requiredRole="comms">
                  <CommsDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all route - 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default AppRoutes;