import React from 'react';
import { IconSparkles, IconShare, IconDotsVertical } from '@tabler/icons-react';

export const Navbar = ({ isAuthenticated, onRequireAuth }) => {
  const userInfo = isAuthenticated ? JSON.parse(localStorage.getItem('userInfo') || '{}') : null;
  const userName = userInfo?.name || "";
  return (
    <div className="h-16 flex items-center justify-between px-8 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 z-20 shrink-0 transition-colors">
      <div className="flex items-center gap-3">
        <span className="text-gray-800 dark:text-gray-100 font-semibold text-lg tracking-tight">Decision IQ Assistant</span>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 rounded-full text-indigo-700 dark:text-indigo-400 text-xs font-medium cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
          <IconSparkles size={14} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {!isAuthenticated ? (
          <button
            onClick={onRequireAuth}
            className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 px-5 py-2 rounded-full transition-colors shadow-sm ml-2"
          >
            Sign In
          </button>
        ) : (
          <div className="h-9 w-9 rounded-full overflow-hidden bg-indigo-100 dark:bg-indigo-900/50 border-2 border-indigo-100 dark:border-indigo-800 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors ml-2 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold text-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
};
