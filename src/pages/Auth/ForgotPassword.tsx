import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/header';     
import SignUp from '../../assets/SignUp.mp4';      
import { FiMail } from 'react-icons/fi';           
import { apiCall } from '../../utils/api';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Effect for parallax background
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await apiCall('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      if (result.success) {
      setMessage('If an account with that email exists, password reset instructions have been sent.');
      setEmail(''); // Clear the input on success
    } else {
      setError(result.message || 'Failed to send reset instructions');
    }
  } catch (error) {
    setError('An error occurred. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  // Reusable style for the input field
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

        <main className="flex-grow flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-8 ring-1 ring-white/10">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">Forgot Your Password?</h2>
              <p className="mt-2 text-sm text-gray-400">
                No problem. Enter your email address below and we'll send you instructions to reset it.
              </p>
            </div>
            
            <div className="mt-8">
              {message && (
                <div className="bg-green-900/50 border border-green-500/50 text-green-300 text-sm px-4 py-3 rounded-md mb-4">
                  {message}
                </div>
              )}
              
              {error && (
                <div className="bg-red-900/50 border border-red-500/50 text-red-300 text-sm px-4 py-3 rounded-md mb-4">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <FiMail className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputStyle}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2.5 px-4 rounded-md disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Instructions'}
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <Link to="/login" className="text-sm text-cyan-400 hover:underline">
                  Back to Log In
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ForgotPassword;