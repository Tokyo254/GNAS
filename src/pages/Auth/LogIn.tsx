import React, { useState, useEffect } from "react";
import Header from "../../components/header";
import { Link, useNavigate } from "react-router-dom";
import SignUp from "../../assets/SignUp.mp4";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { FiMail, FiLock } from "react-icons/fi";
import { apiCall } from "../../utils/api";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!email || !password) {
    setError("Email and password are required.");
    addToast("Please fill in email and password", "error");
    return;
  }
  
  setIsLoading(true);
  setError("");
  
  try {
    const result = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email, 
        password,
      }),
    });

  console.log('Login response:', result); 
    
    if (result.success && result.data) {
      addToast("Login successful!", "success");
      login(result.data.token, result.data.refreshToken, result.data.user, (path) => {
        navigate(path);
      });
    } else {
      const errorMessage = result.message || 'Login failed';
      setError(errorMessage);
      addToast(errorMessage, "error");
      
      // Log for debugging
      console.error('Login failed:', result);
    }
  } catch (error) {
    console.error('Login network error:', error);
    setError('Network error. Please check your connection and try again.');
    addToast('Network error occurred', "error");
  } finally {
    setIsLoading(false);
  }
};
  // Reusable style for text inputs
  const inputStyle = "w-full border border-gray-600 bg-gray-800/50 rounded-md pl-10 pr-4 py-2.5 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500";

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        className="fixed top-0 left-0 min-w-full min-h-full w-auto h-auto object-cover z-0 brightness-50"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        src={SignUp}
      />

      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-8 mt-6 ring-1 ring-white/10">
            <h1 className="text-2xl font-bold text-center text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-400 text-center text-sm mb-6">
              Sign in to your account
            </p>

            {error && (
              <div className="bg-red-900/50 border border-red-500/50 text-red-300 text-sm px-4 py-3 rounded-md mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Input */}
              <div className="relative">
                <FiMail className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputStyle}
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <FiLock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputStyle}
                  required
                />
              </div>
              
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-cyan-400 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2.5 bg-cyan-500 text-white rounded-md text-sm font-bold hover:bg-cyan-600 disabled:opacity-70 transition-colors"
              >
                {isLoading ? "Logging in..." : "Log In"}
              </button>
            </form>

            <div className="mt-8 border-t border-gray-700 pt-6">
              <p className="text-sm text-gray-400 text-center mb-4">
                Don't have an account? Choose your role:
              </p>
              <div className="flex flex-col space-y-2">
                <Link
                  to="/journalist-signup"
                  className="text-center px-4 py-2 bg-gray-700 text-white rounded-md text-sm hover:bg-gray-600 transition-colors"
                >
                  Join as Journalist
                </Link>
                <Link
                  to="/signup"
                  className="text-center px-4 py-2 bg-gray-700 text-white rounded-md text-sm hover:bg-gray-600 transition-colors"
                >
                  Join as Communications Professional
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Login;