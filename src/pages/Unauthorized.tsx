// pages/Unauthorized.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">403 - Unauthorized</h1>
        <p className="text-gray-600 mb-8">You don't have permission to access this page.</p>
        <Link 
          to="/" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;