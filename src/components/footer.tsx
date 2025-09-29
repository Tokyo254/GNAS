import React from 'react';
import { Link } from 'react-router-dom'; // Use Link for internal navigation
import { FaTwitter, FaLinkedin, FaFacebook } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Top Section: Branding and Newsletter */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-white">PR Portal</h2>
            <p className="mt-2 text-sm text-gray-400">The future of public relations is here.</p>
          </div>
          <div className="w-full md:w-auto">
            <h3 className="font-semibold text-white mb-2 text-center md:text-left">Stay Updated</h3>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full sm:w-auto flex-grow px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
              />
              <button
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <hr className="border-gray-700" />

        {/* Middle Section: Link Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 text-sm">
          <div>
            <h3 className="font-semibold text-white mb-4">Topics</h3>
            <ul className="space-y-3">
              <li><Link to="/topics/health" className="hover:text-cyan-400 transition-colors">Health</Link></li>
              <li><Link to="/topics/finance" className="hover:text-cyan-400 transition-colors">Finance</Link></li>
              <li><Link to="/topics/tech" className="hover:text-cyan-400 transition-colors">Tech</Link></li>
              <li><Link to="/topics/politics" className="hover:text-cyan-400 transition-colors">Politics</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="hover:text-cyan-400 transition-colors">About Us</Link></li>
              <li><Link to="/features" className="hover:text-cyan-400 transition-colors">Features</Link></li>
              <li><Link to="/contact" className="hover:text-cyan-400 transition-colors">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-cyan-400 transition-colors">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link to="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-cyan-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li>info@prp.com</li>
              <li>+254 (111) 978-418</li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-700" />

        {/* Bottom Section: Copyright and Socials */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 text-sm">
          <p className="text-gray-400 order-2 md:order-1 mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} Press Release Portal. All rights reserved.
          </p>
          <div className="flex space-x-4 order-1 md:order-2">
            <a href="#" className="hover:text-cyan-400 transition-colors"><FaTwitter size={20} /></a>
            <a href="#" className="hover:text-cyan-400 transition-colors"><FaLinkedin size={20} /></a>
            <a href="#" className="hover:text-cyan-400 transition-colors"><FaFacebook size={20} /></a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;