import React, { useState } from 'react';
import { IconBell, IconPalette, IconRobot, IconDatabase, IconTrash, IconCheck } from '@tabler/icons-react';

export const SettingsPage = () => {
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState(true);
  const [model, setModel] = useState('gemini-2.5-flash');

  const handleClearHistory = () => {
    alert("Chat history cleared successfully.");
  };

  return (
    <div className="flex-1 overflow-y-auto bg-transparent p-6 md:p-12 relative z-10 font-sans transition-colors">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your app preferences and AI configurations.</p>
        </div>

        {/* Appearance Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3 bg-gray-50/50 dark:bg-gray-800/50">
            <IconPalette className="text-indigo-600 dark:text-indigo-400" size={24} />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Appearance</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-200">Theme Preference</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Choose how Decision IQ looks to you.</p>
              </div>
              <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-xl">
                <button 
                  onClick={() => setTheme('light')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${theme === 'light' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                  Light
                </button>
                <button 
                  onClick={() => setTheme('dark')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${theme === 'dark' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm' : 'text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                  Dark
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* AI Model Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3 bg-gray-50/50 dark:bg-gray-800/50">
            <IconRobot className="text-indigo-600 dark:text-indigo-400" size={24} />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">AI Configuration</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-200">Default Model</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Select the Gemini model for your queries.</p>
              </div>
              <select 
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none cursor-pointer"
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Fast)</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (Advanced)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3 bg-gray-50/50 dark:bg-gray-800/50">
            <IconBell className="text-indigo-600 dark:text-indigo-400" size={24} />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Notifications</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-200">Push Notifications</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive alerts when long tasks complete.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 dark:peer-checked:bg-indigo-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3 bg-gray-50/50 dark:bg-gray-800/50">
            <IconDatabase className="text-indigo-600 dark:text-indigo-400" size={24} />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Data & Privacy</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-200">Clear Chat History</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Permanently delete your conversation data from this device.</p>
              </div>
              <button 
                onClick={handleClearHistory}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800/50 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-sm font-medium shrink-0"
              >
                <IconTrash size={16} stroke={2} />
                Clear Data
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
