import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';

export const MainLayout = ({ children, isAuthenticated, onRequireAuth, onLogout, activeTab, setActiveTab, isDarkMode, setIsDarkMode }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative transition-colors dark:bg-gray-900">
      <Sidebar
        isExpanded={isSidebarExpanded}
        setIsExpanded={setIsSidebarExpanded}
        onLogout={onLogout}
        isAuthenticated={isAuthenticated}
        onRequireAuth={onRequireAuth}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      <main className="flex-1 flex flex-col border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-950 rounded-b-2xl md:rounded-tl-2xl mb-4 mx-4 md:ml-2 mt-0 z-10 overflow-hidden relative min-h-0 min-w-0 transition-colors">
        <Navbar isAuthenticated={isAuthenticated} onRequireAuth={onRequireAuth} />
        <div className="flex-1 overflow-hidden relative bg-white dark:bg-transparent flex flex-col min-h-0 transition-colors">
          {children}
        </div>
      </main>
    </div>
  );
};
