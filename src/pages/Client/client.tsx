// pages/Client/client.tsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import RoleBasedComponent from '../../components/RoleBasedComponent';

const ClientDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user?.fullName} ({user?.role})</span>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Dashboard Content</h2>
            
            <RoleBasedComponent allowedRoles={['journalist', 'comms']}>
              <div className="mb-4 p-4 bg-blue-100 rounded">
                <h3 className="font-semibold">Journalist & Comms Features</h3>
                <p>This content is visible to journalists and communications professionals.</p>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-2">
                  Create Article
                </button>
              </div>
            </RoleBasedComponent>
            
            <RoleBasedComponent allowedRoles={['comms']}>
              <div className="mb-4 p-4 bg-green-100 rounded">
                <h3 className="font-semibold">Comms Professional Features</h3>
                <p>This content is only visible to communications professionals.</p>
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-2">
                  Manage Campaigns
                </button>
              </div>
            </RoleBasedComponent>
            
            <RoleBasedComponent allowedRoles={['journalist']}>
              <div className="mb-4 p-4 bg-yellow-100 rounded">
                <h3 className="font-semibold">Journalist Features</h3>
                <p>This content is only visible to journalists.</p>
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded mt-2">
                  Submit Story
                </button>
              </div>
            </RoleBasedComponent>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientDashboard;