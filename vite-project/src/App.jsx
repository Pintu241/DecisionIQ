import React, { useState } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { ChatInterface } from './components/Chat';
import { AuthModal } from './components/Auth';
import { ProfilePage } from './components/Profile/ProfilePage';
import { SettingsPage } from './components/Settings/SettingsPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setIsAuthenticated(false);
    
    setActiveTab('Dashboard'); // redirect home on logout

  };

  return (
    <>
      <MainLayout
        isAuthenticated={isAuthenticated}
        onRequireAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      >
        {activeTab === 'Settings' && isAuthenticated ? (
          <SettingsPage />
        ) : activeTab === 'Profile' && isAuthenticated ? (
          <ProfilePage onLogout={handleLogout} />
        ) : (
          <ChatInterface 
            isAuthenticated={isAuthenticated} 
            onRequireAuth={() => setIsAuthModalOpen(true)} 
          />
        )}
      </MainLayout>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLogin={() => setIsAuthenticated(true)} 
      />
    </>
  );
}

export default App;
