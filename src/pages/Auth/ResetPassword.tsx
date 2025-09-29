import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Header from '../../components/header';
import SignUp from '../../assets/SignUp.mp4'; 
import { FiLock, FiCheck, FiX } from 'react-icons/fi';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [token, setToken] = useState<string | null>(null);

  // Effect for parallax background
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    setToken(tokenFromUrl);
    
    if (!tokenFromUrl) {
      setError('Invalid or expired reset link. Please request a new password reset.');
    }
  }, [searchParams]);

  const validateForm = () => {
    if (!password || !confirmPassword) {
      setError('Both password fields are required');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (!token) {
      setError('Invalid or expired reset link. Please request a new one.');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Fixed: Include confirmPassword in the request body
        body: JSON.stringify({ 
          password, 
          confirmPassword, 
          token 
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Password reset successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(data.message || 'Failed to reset password. The link may have expired.');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError('An error occurred. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Password strength indicator
  const getPasswordStrength = () => {
    if (password.length === 0) return { strength: 0, color: 'gray', text: '' };
    if (password.length < 6) return { strength: 33, color: 'red', text: 'Weak' };
    if (password.length < 10) return { strength: 66, color: 'yellow', text: 'Medium' };
    return { strength: 100, color: 'green', text: 'Strong' };
  };

  const passwordStrength = getPasswordStrength();
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const inputStyle = "w-full border border-gray-600 bg-gray-800/50 rounded-md pl-10 pr-4 py-2.5 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500";

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay muted loop
        className="fixed top-0 left-0 min-w-full min-h-full w-auto h-auto object-cover z-0 brightness-50"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        src={SignUp}
      />

      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-8 ring-1 ring-white/10">
            <h2 className="text-2xl font-bold text-center text-white mb-2">Reset Your Password</h2>
            <p className="text-gray-400 text-center mb-6">Enter your new password below</p>
            
            {message && (
              <div className="bg-green-900/50 border border-green-500/50 text-green-300 text-sm px-4 py-3 rounded-md mb-4 flex items-center">
                <FiCheck className="mr-2" />
                {message}
              </div>
            )}
            
            {error && (
              <div className="bg-red-900/50 border border-red-500/50 text-red-300 text-sm px-4 py-3 rounded-md mb-4 flex items-center">
                <FiX className="mr-2" />
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <FiLock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputStyle}
                    placeholder="Enter new password"
                    required
                  />
                </div>
                {password && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Password Strength</span>
                      <span className={`text-${passwordStrength.color}-400`}>
                        {passwordStrength.text}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`bg-${passwordStrength.color}-500 h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${passwordStrength.strength}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <FiLock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={inputStyle}
                    placeholder="Confirm new password"
                    required
                  />
                </div>
                {confirmPassword && (
                  <div className="mt-2 flex items-center text-sm">
                    {passwordsMatch ? (
                      <span className="text-green-400 flex items-center">
                        <FiCheck className="mr-1" /> Passwords match
                      </span>
                    ) : (
                      <span className="text-red-400 flex items-center">
                        <FiX className="mr-1" /> Passwords do not match
                      </span>
                    )}
                  </div>
                )}
              </div>
              
              <button
                type="submit"
                disabled={isLoading || !token}
                className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 text-white font-bold py-2.5 px-4 rounded-md disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </form>

            <div className="mt-6 text-center space-y-3">
              <Link to="/login" className="block text-sm text-cyan-400 hover:underline">
                Back to Log In
              </Link>
              <Link to="/forgot-password" className="block text-sm text-gray-400 hover:underline">
                Request new reset link
              </Link>
            </div>

            {!token && (
              <div className="mt-4 p-3 bg-yellow-900/50 border border-yellow-500/50 rounded-md">
                <p className="text-yellow-300 text-sm">
                  <strong>Invalid reset link:</strong> Please check your email for the correct link or request a new one.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResetPassword;