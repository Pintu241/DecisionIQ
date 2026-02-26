import React, { useState } from 'react';
import { IconUser, IconMail, IconCalendar, IconLock, IconCheck, IconAlertCircle, IconEye, IconEyeOff } from '@tabler/icons-react';
import axios from 'axios';

export const ProfilePage = ({ onLogout }) => {
  // Using generic info as the local storage retrieval was removed
  const userInfo = { name: "User", email: "account@decisioniq.com" };

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('/api/auth/profile/password',
        { currentPassword, newPassword },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update password. Please try again.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

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
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5 border border-gray-100/50 dark:border-gray-700 transition-colors col-span-1 md:col-span-2">
                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 mb-2">
                  <IconCalendar size={18} />
                  <span className="text-sm font-medium">Member Since</span>
                </div>
                <p className="text-gray-900 dark:text-gray-200 font-medium pl-8">February 2026</p>
              </div>
            </div>

            {/* Change Password Section */}
            <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-6">
                <IconLock className="text-indigo-600 dark:text-indigo-400" size={22} />
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Password Management</h3>
              </div>

              <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
                {message.text && (
                  <div className={`p-3 rounded-xl flex items-center gap-3 text-sm font-medium ${message.type === 'success'
                    ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-800'
                    }`}>
                    {message.type === 'success' ? <IconCheck size={18} /> : <IconAlertCircle size={18} />}
                    {message.text}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white pr-12"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors p-1"
                    >
                      {showCurrentPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white pr-12"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors p-1"
                      >
                        {showNewPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">
                      Confirm New
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white pr-12"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors p-1"
                      >
                        {showConfirmPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full md:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
