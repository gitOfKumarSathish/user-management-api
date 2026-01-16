import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, User, LogOut, Menu, X } from 'lucide-react';
import { cn } from '../utils/cn';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
          <span className="text-xl font-bold text-indigo-600">UserMgmt</span>
          <button 
            className="md:hidden p-1 text-gray-400 hover:text-gray-500"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex flex-col flex-1 h-0 overflow-y-auto">
           <nav className="flex-1 px-4 py-4 space-y-1">
             {navigation.map((item) => {
               const Icon = item.icon;
               const isActive = location.pathname === item.href;
               return (
                 <Link
                   key={item.name}
                   to={item.href}
                   className={cn(
                     "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                     isActive 
                       ? "bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600"
                       : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                   )}
                 >
                   <Icon className={cn("w-5 h-5 mr-3", isActive ? "text-indigo-600" : "text-gray-400")} />
                   {item.name}
                 </Link>
               );
             })}
           </nav>
           
           <div className="p-4 border-t border-gray-100">
              <div className="flex items-center px-4 py-3 mb-2">
                 <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                 </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-h-screen md:pl-64 transition-all duration-200">
        <header className="flex items-center justify-between h-16 px-6 bg-white shadow-sm">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-1 text-gray-400 hover:text-gray-500 focus:outline-none"
            >
                <Menu className="w-6 h-6" />
            </button>
            <span className="text-lg font-bold text-gray-900 md:hidden">User Management</span>
            {/* Desktop Header Content (Spacer on mobile, Title on Desktop maybe? Or just right aligned items) */}
             <div className="hidden md:flex flex-1 justify-end items-center">
                 <Link to="/profile" className="mr-4 text-sm text-gray-700 hover:text-indigo-600 flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    <span>Welcome, <b>{user?.name}</b></span>
                 </Link>
                 <button
                    onClick={logout}
                    className="flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
                    title="Logout"
                >
                    <LogOut className="w-5 h-5 mr-2" />
                    Logout
                </button>
             </div>

            {/* Mobile Logout (stays same place or adjust?)
                The current mobile logout is nice. Let's keep it mobile only if we add a desktop one.
            */}
            <button
                onClick={logout}
                className="md:hidden p-1 text-gray-400 hover:text-gray-500 focus:outline-none"
            >
                <LogOut className="w-6 h-6" />
            </button>
        </header>

        <main className="flex-1 py-8 px-6">
           {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
