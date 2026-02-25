import React from 'react';
import { IconUser, IconMail, IconCalendar } from '@tabler/icons-react';

export const ProfilePage = ({ onLogout }) => {
  let userInfo = { name: "Guest User", email: "guest@decisioniq.com" };
  
  try {
    const stored = localStorage.getItem('userInfo');
    if (stored) {
      userInfo = JSON.parse(stored);
    }
  } catch (e) {}

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-transparent p-6 md:p-12 relative z-10 font-sans transition-colors">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">User Profile</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your account settings and preferences.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
            <div className="absolute -bottom-12 left-8">
              <div className="h-24 w-24 bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-md transition-colors">
                <div className="h-full w-full bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-700 dark:text-indigo-400 text-4xl font-bold transition-colors">
                  {userInfo.name.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-16 pb-8 px-8">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{userInfo.name}</h2>
                <p className="text-indigo-600 dark:text-indigo-400 font-medium text-sm mt-1 flex items-center gap-1.5">
                  Pro Plan Member
                </p>
              </div>
              <button 
                onClick={onLogout}
                className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800 transition-colors text-sm shadow-sm"
              >
                Sign Out
              </button>
            </div>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Info Card 1 */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5 border border-gray-100/50 dark:border-gray-700 transition-colors">
                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 mb-2">
                  <IconUser size={18} />
                  <span className="text-sm font-medium">Full Name</span>
                </div>
                <p className="text-gray-900 dark:text-gray-200 font-medium pl-8">{userInfo.name}</p>
              </div>

              {/* Info Card 2 */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5 border border-gray-100/50 dark:border-gray-700 transition-colors">
                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 mb-2">
                  <IconMail size={18} />
                  <span className="text-sm font-medium">Email Address</span>
                </div>
                <p className="text-gray-900 dark:text-gray-200 font-medium pl-8">{userInfo.email}</p>
              </div>
              
              {/* Info Card 3 */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5 border border-gray-100/50 dark:border-gray-700 transition-colors">
                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 mb-2">
                  <IconCalendar size={18} />
                  <span className="text-sm font-medium">Member Since</span>
                </div>
                <p className="text-gray-900 dark:text-gray-200 font-medium pl-8">February 2026</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
