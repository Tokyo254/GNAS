import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Header from '../../components/header';
import SignUp from '../../assets/SignUp.mp4';
import { motion, AnimatePresence, easeIn, easeOut } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';

const EmailVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('Verifying your email, please wait...');
  const [scrollY, setScrollY] = useState(0);

  // Effect for parallax background
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link. The link is either missing a token or has expired.');
        return;
      }

      try {
        // Changed to POST request with token in body
        const response = await fetch('http://localhost:5000/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setStatus('success');
          setMessage('Email verified successfully! You will be redirected to the login page shortly.');
          setTimeout(() => navigate('/login'), 4000);
        } else {
          setStatus('error');
          setMessage(data.message || 'Email verification failed. The link may have expired.');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage('An error occurred during verification. Please check your connection and try again.');
      }
    };

    // Remove the setTimeout and verify immediately for better UX
    verifyEmail();
  }, [searchParams, navigate]);
  
  const statusVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: easeOut }}, // use imported easeOut
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: easeIn }}, // use imported easeIn
  };

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
          <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-8 ring-1 ring-white/10 text-center">
            <AnimatePresence mode="wait">
              {status === 'verifying' && (
                <motion.div 
                  key="verifying" 
                  variants={statusVariants} 
                  initial="hidden" 
                  animate="visible" 
                  exit="exit"
                  className="flex flex-col items-center"
                >
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                  <FiClock className="w-8 h-8 text-cyan-400 mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">Verifying Email</h2>
                  <p className="text-gray-400">{message}</p>
                </motion.div>
              )}
              
              {status === 'success' && (
                <motion.div 
                  key="success" 
                  variants={statusVariants} 
                  initial="hidden" 
                  animate="visible" 
                  exit="exit"
                >
                  <FiCheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
                  <h2 className="text-2xl font-bold text-white mb-2">Success!</h2>
                  <p className="text-gray-300 mb-6">{message}</p>
                  <div className="space-y-3">
                    <button 
                      onClick={() => navigate('/login')}
                      className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2.5 px-4 rounded-md transition-colors"
                    >
                      Go to Login Now
                    </button>
                    <button 
                      onClick={() => navigate('/')}
                      className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2.5 px-4 rounded-md transition-colors"
                    >
                      Back to Home
                    </button>
                  </div>
                </motion.div>
              )}
              
              {status === 'error' && (
                <motion.div 
                  key="error" 
                  variants={statusVariants} 
                  initial="hidden" 
                  animate="visible" 
                  exit="exit"
                >
                  <FiXCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
                  <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
                  <p className="text-gray-300 mb-6">{message}</p>
                  <div className="space-y-3">
                    <button 
                      onClick={() => window.location.reload()}
                      className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2.5 px-4 rounded-md transition-colors"
                    >
                      Try Again
                    </button>
                    <Link 
                      to="/login" 
                      className="block w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2.5 px-4 rounded-md transition-colors text-center"
                    >
                      Go to Login
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmailVerification;