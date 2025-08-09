import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../stores/store';
import { AccountLayout } from '../AccountLayout';
import { authAPI } from '../../services/api';

export const Settings = () => {
   const user = useSelector((state: RootState) => state.user.user);
   const [showChangePassword, setShowChangePassword] = useState<boolean>(false);
   const [currentPassword, setCurrentPassword] = useState<string>('');
   const [newPassword, setNewPassword] = useState<string>('');
   const [confirmPassword, setConfirmPassword] = useState<string>('');

   const handlePasswordChange = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!currentPassword || !newPassword || !confirmPassword) {
         return;
      }

      if (newPassword !== confirmPassword) {
         return;
      }

      try {
         await authAPI.changePassword(currentPassword, newPassword);
      } catch (error) {
         console.error('Error changing password:', error);
      }

      setShowChangePassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
   };

   return (
      <AccountLayout>
         <div className="p-6">
            <div className="border-b border-gray-200 pb-6">
               <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
               <p className="mt-1 text-sm text-gray-500">
                  Manage your account settings
               </p>
            </div>

            <div className="py-6">
               <div className="max-w-xl">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">
                     Account Settings
                  </h3>

                  <div className="space-y-6">
                     {/* Email */}
                     <div>
                        <label
                           htmlFor="email"
                           className="block text-sm font-medium text-gray-700 mb-2"
                        >
                           Email Address
                        </label>
                        <div className="relative">
                           <input
                              type="email"
                              name="email"
                              id="email"
                              value={user?.email}
                              disabled
                              className="block w-full rounded-lg border-gray-300 bg-gray-50 py-3 px-4 text-gray-900 
                                       focus:ring-2 focus:ring-[#9E7B9B] focus:border-transparent disabled:opacity-75
                                       shadow-sm transition-colors duration-200"
                           />
                           <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                              <svg
                                 className="h-5 w-5 text-gray-400"
                                 fill="none"
                                 stroke="currentColor"
                                 viewBox="0 0 24 24"
                              >
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                 />
                              </svg>
                           </div>
                        </div>
                     </div>

                     {/* Password */}
                     <div>
                        <div className="flex items-center justify-between mb-2">
                           <label
                              htmlFor="password"
                              className="block text-sm font-medium text-gray-700"
                           >
                              Password
                           </label>
                           {!showChangePassword && (
                              <button
                                 onClick={() => setShowChangePassword(true)}
                                 className="text-sm font-medium text-[#9E7B9B] hover:text-[#8B6B8B] 
                                          transition-colors duration-200"
                              >
                                 Change Password
                              </button>
                           )}
                        </div>

                        {showChangePassword && (
                           <form
                              onSubmit={handlePasswordChange}
                              className="bg-gray-50 rounded-lg p-6 space-y-4 border border-gray-200"
                           >
                              <div>
                                 <label
                                    htmlFor="currentPassword"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                 >
                                    Current Password
                                 </label>
                                 <div className="relative">
                                    <input
                                       type="password"
                                       id="currentPassword"
                                       value={currentPassword}
                                       onChange={(e) =>
                                          setCurrentPassword(e.target.value)
                                       }
                                       className="block w-full rounded-lg border-gray-300 py-3 px-4 text-gray-900 
                                                focus:ring-2 focus:ring-[#9E7B9B] focus:border-transparent
                                                shadow-sm transition-colors duration-200"
                                       required
                                    />
                                 </div>
                              </div>

                              <div>
                                 <label
                                    htmlFor="newPassword"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                 >
                                    New Password
                                 </label>
                                 <div className="relative">
                                    <input
                                       type="password"
                                       id="newPassword"
                                       value={newPassword}
                                       onChange={(e) =>
                                          setNewPassword(e.target.value)
                                       }
                                       className="block w-full rounded-lg border-gray-300 py-3 px-4 text-gray-900 
                                                focus:ring-2 focus:ring-[#9E7B9B] focus:border-transparent
                                                shadow-sm transition-colors duration-200"
                                       required
                                    />
                                 </div>
                              </div>

                              <div>
                                 <label
                                    htmlFor="confirmPassword"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                 >
                                    Confirm New Password
                                 </label>
                                 <div className="relative">
                                    <input
                                       type="password"
                                       id="confirmPassword"
                                       value={confirmPassword}
                                       onChange={(e) =>
                                          setConfirmPassword(e.target.value)
                                       }
                                       className="block w-full rounded-lg border-gray-300 py-3 px-4 text-gray-900 
                                                focus:ring-2 focus:ring-[#9E7B9B] focus:border-transparent
                                                shadow-sm transition-colors duration-200"
                                       required
                                    />
                                 </div>
                              </div>

                              <div className="flex justify-end space-x-3 pt-2">
                                 <button
                                    type="button"
                                    onClick={() => {
                                       setShowChangePassword(false);
                                       setCurrentPassword('');
                                       setNewPassword('');
                                       setConfirmPassword('');
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900
                                             transition-colors duration-200"
                                 >
                                    Cancel
                                 </button>
                                 <button
                                    type="submit"
                                    className="bg-[#9E7B9B] text-white px-6 py-2 rounded-lg text-sm font-medium
                                             hover:bg-[#8B6B8B] focus:outline-none focus:ring-2 focus:ring-offset-2 
                                             focus:ring-[#9E7B9B] transition-all duration-200"
                                 >
                                    Update Password
                                 </button>
                              </div>
                           </form>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </AccountLayout>
   );
};
