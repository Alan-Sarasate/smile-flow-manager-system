
import React from 'react';
import { Navbar } from './Navbar';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-dental-gray/50">
      <Navbar onToggleSidebar={() => {}} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
