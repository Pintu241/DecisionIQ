import React from 'react';
import { motion } from 'framer-motion';

export const SidebarItem = ({ icon: Icon, label, isActive, isExpanded, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        flex items-center p-2 mx-2 rounded-xl cursor-pointer transition-all group
        ${isActive 
          ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-semibold' 
          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
        }
      `}
    >
      <div className={`flex-shrink-0 flex items-center justify-center ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`}>
        <Icon size={20} stroke={isActive ? 2 : 1.5} />
      </div>
      
      <motion.div
        initial={false}
        animate={{
          width: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0,
          marginLeft: isExpanded ? '12px' : '0px',
        }}
        className="whitespace-nowrap overflow-hidden text-sm"
      >
        {label}
      </motion.div>
    </div>
  );
};
