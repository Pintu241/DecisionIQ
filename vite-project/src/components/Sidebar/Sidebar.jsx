import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  IconDashboard, 
  IconUser, 
  IconSettings, 
  IconLogout,
  IconBrain,
  IconMoon,
  IconSun
} from '@tabler/icons-react';

import { SidebarItem } from './SidebarItem';
import { UserProfile } from './UserProfile';

export const Sidebar = ({ isExpanded, setIsExpanded, activeTab, setActiveTab, onLogout, isDarkMode, setIsDarkMode }) => {

  const navItems = [
    { label: 'Dashboard', icon: IconDashboard },
    { label: 'Profile', icon: IconUser },
    { label: 'Settings', icon: IconSettings },
    { label: 'Logout', icon: IconLogout },
  ];

  return (
    <motion.div
      initial={false}
      animate={{
        width: isExpanded ? 240 : 64, // roughly 15rem expanded, 4rem collapsed
      }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 py-4 px-3 relative transition-colors"
      style={{ overflow: 'hidden' }}
    >
      {/* Brand / Logo */}
      <div className="flex items-center mb-8 px-2 cursor-pointer">
        <div className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 text-[#6366f1] dark:text-indigo-400">
          <IconBrain size={28} stroke={1.5} />
        </div>
        <motion.div
          initial={false}
          animate={{
            width: isExpanded ? 'auto' : 0,
            opacity: isExpanded ? 1 : 0,
            marginLeft: isExpanded ? '8px' : '0px',
          }}
          className="font-bold text-xl whitespace-nowrap overflow-hidden text-gray-700 dark:text-gray-100 flex items-center gap-1.5"
        >
          Decision <span className="text-[#6366f1] dark:text-indigo-400">IQ</span>
        </motion.div>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col space-y-2 flex-1">
        {navItems.map((item) => (
          <SidebarItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            isActive={activeTab === item.label}
            isExpanded={isExpanded}
            onClick={() => {
              if (item.label === 'Logout' && onLogout) {
                 onLogout();
              } else {
                 setActiveTab(item.label);
              }
            }}
          />
        ))}
      </div>

      {/* Theme Toggle */}
      <div 
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="flex items-center p-2 mb-4 mx-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
        title="Toggle Theme"
      >
        <div className="flex-shrink-0 flex items-center justify-center">
          {isDarkMode ? <IconSun size={20} className="text-amber-400" stroke={2} /> : <IconMoon size={20} stroke={2} />}
        </div>
        <motion.div
          initial={false}
          animate={{
            width: isExpanded ? 'auto' : 0,
            opacity: isExpanded ? 1 : 0,
            marginLeft: isExpanded ? '12px' : '0px',
          }}
          className="whitespace-nowrap overflow-hidden text-sm font-medium dark:text-gray-300"
        >
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </motion.div>
      </div>

      {/* User Profile */}
      <UserProfile isExpanded={isExpanded} />
    </motion.div>
  );
};
