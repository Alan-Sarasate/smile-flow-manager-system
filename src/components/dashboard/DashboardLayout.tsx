
import React, { useState } from 'react';
import { Navbar } from './Navbar';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-dental-gray/50">
      {/* Navbar fixo */}
      <div className="fixed top-0 left-0 right-0 z-40">
        <Navbar onToggleSidebar={toggleSidebar} />
      </div>
      
      <div className="flex flex-1 pt-16">
        {/* Sidebar fixo */}
        <div className={`fixed top-16 bottom-0 left-0 z-30 ${sidebarOpen ? 'block' : 'hidden'} md:block transition-all duration-200`}>
          <Sidebar />
        </div>
        
        {/* Conteúdo principal com rolagem */}
        <main className={`flex-1 p-6 overflow-auto mt-16 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
