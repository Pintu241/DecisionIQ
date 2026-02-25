import React from 'react';
import { motion } from 'framer-motion';

export const UserProfile = ({ isExpanded }) => {
  let userName = "Guest Account";
  
  try {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      userName = JSON.parse(storedUser).name || "User";
    }
  } catch (e) {}

  return (
    <div className="flex items-center p-2 mt-auto border-t border-gray-200 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
        {userName.charAt(0).toUpperCase()}
      </div>
      
      <motion.div
        initial={false}
        animate={{
          width: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0,
          marginLeft: isExpanded ? '12px' : '0px',
        }}
        className="overflow-hidden whitespace-nowrap"
      >
        <div className="text-sm font-medium text-gray-900">{userName}</div>
        <div className="text-xs text-gray-500">Decision IQ User</div>
      </motion.div>
    </div>
  );
};
