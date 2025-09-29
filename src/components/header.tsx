import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence, easeIn, easeOut } from "framer-motion";
import { FiSearch, FiUser, FiUserPlus, FiMenu, FiX } from "react-icons/fi";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Effect to handle scroll-based style changes
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: easeOut } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: easeIn } },
  };
  
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-cyan-400' : 'text-gray-300 hover:text-cyan-400'}`;

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-900/80 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-cyan-400">PRP</Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/journalist-signup" className={navLinkClass}>For Journalists</NavLink>
            <NavLink to="/signup" className={navLinkClass}>For Comms Proffesionals</NavLink>
          </nav> 

          {/* Desktop Right Side: Search & Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-48 py-2 pl-4 pr-10 text-sm text-white bg-gray-800 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <Link to="/login" className="flex items-center text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors">
              <FiUser className="mr-1" /> Log In
            </Link>
            <Link to="/signup" className="flex items-center px-4 py-2 border border-transparent rounded-full text-sm font-medium text-white bg-cyan-500 hover:bg-cyan-600 transition-colors">
              <FiUserPlus className="mr-1" /> Sign Up
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-300">
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="md:hidden bg-gray-900/95 backdrop-blur-sm pb-6"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <nav className="px-4 flex flex-col space-y-4">
              <NavLink to="/" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>Home</NavLink>
              <NavLink to="/journalists" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>For Journalists</NavLink>
              <NavLink to="/comms" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>For Comms</NavLink>
              <hr className="border-gray-700"/>
              <div className="flex items-center space-x-4">
                <Link to="/login" className="flex-1 text-center py-2 rounded-full border border-gray-700 text-gray-300 hover:bg-gray-800">Log In</Link>
                <Link to="/signup" className="flex-1 text-center py-2 rounded-full bg-cyan-500 text-white hover:bg-cyan-600">Sign Up</Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;