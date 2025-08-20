import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../stores/store';
import { AccountLayout } from '../AccountLayout';
import { authAPI } from '../../services/authApi';

export const Settings = () => {
   useSelector((state: RootState) => state.user.user); // keep store subscription in case of future needs
   const [currentPassword, setCurrentPassword] = useState<string>('');
   const [newPassword, setNewPassword] = useState<string>('');
   const [confirmPassword, setConfirmPassword] = useState<string>('');
   const [showCurrent, setShowCurrent] = useState<boolean>(false);
   const [showNew, setShowNew] = useState<boolean>(false);
   const [showConfirm, setShowConfirm] = useState<boolean>(false);

   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
   const isPasswordValid = passwordRegex.test(newPassword);
   const isMatch =
      newPassword === confirmPassword && confirmPassword.length > 0;

   const handlePasswordChange = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!currentPassword || !isPasswordValid || !isMatch) return;

      try {
         await authAPI.changePassword(currentPassword, newPassword);
      } catch (error) {
         console.error('Error changing password:', error);
      }

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
                     Security
                  </h3>

                  <div className="space-y-6">
                     <div>
                        <label
                           htmlFor="password"
                           className="block text-sm font-medium text-gray-700 mb-2"
                        >
                           Change Password
                        </label>
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
                                    type={showCurrent ? 'text' : 'password'}
                                    id="currentPassword"
                                    value={currentPassword}
                                    onChange={(e) =>
                                       setCurrentPassword(e.target.value)
                                    }
                                    className="block w-full rounded-lg border border-gray-300 py-3 pl-4 pr-10 text-gray-900 focus:ring-2 focus:ring-[#9E7B9B] focus:border-transparent focus:outline-none shadow-sm transition-colors duration-200"
                                    required
                                 />
                                 <button
                                    type="button"
                                    onClick={() => setShowCurrent((v) => !v)}
                                    className="absolute inset-y-0 right-2 my-auto p-2 text-gray-400 hover:text-gray-600 rounded focus:outline-none"
                                    aria-label={
                                       showCurrent
                                          ? 'Hide password'
                                          : 'Show password'
                                    }
                                    aria-pressed={showCurrent}
                                 >
                                    {showCurrent ? (
                                       <svg
                                          className="w-5 h-5"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                       >
                                          <path
                                             strokeLinecap="round"
                                             strokeLinejoin="round"
                                             strokeWidth="2"
                                             d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-7 0-10-7-10-7a18.836 18.836 0 0 1 5.058-5.943m3.14-1.57A9.966 9.966 0 0 1 12 5c7 0 10 7 10 7a18.87 18.87 0 0 1-3.478 4.568M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                          />
                                          <path
                                             strokeLinecap="round"
                                             strokeLinejoin="round"
                                             strokeWidth="2"
                                             d="M3 3l18 18"
                                          />
                                       </svg>
                                    ) : (
                                       <svg
                                          className="w-5 h-5"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                       >
                                          <path
                                             strokeLinecap="round"
                                             strokeLinejoin="round"
                                             strokeWidth="2"
                                             d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z"
                                          />
                                          <circle
                                             cx="12"
                                             cy="12"
                                             r="3"
                                             strokeWidth="2"
                                          />
                                       </svg>
                                    )}
                                 </button>
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
                                    type={showNew ? 'text' : 'password'}
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) =>
                                       setNewPassword(e.target.value)
                                    }
                                    className={`block w-full rounded-lg border py-3 pl-4 pr-10 text-gray-900 focus:ring-2 focus:outline-none focus:border-transparent shadow-sm transition-colors duration-200 ${
                                       newPassword && !isPasswordValid
                                          ? 'border-red-300 focus:ring-red-500'
                                          : 'border-gray-300 focus:ring-[#9E7B9B]'
                                    }`}
                                    required
                                 />
                                 <button
                                    type="button"
                                    onClick={() => setShowNew((v) => !v)}
                                    className="absolute inset-y-0 right-2 my-auto p-2 text-gray-400 hover:text-gray-600 rounded focus:outline-none"
                                    aria-label={
                                       showNew
                                          ? 'Hide password'
                                          : 'Show password'
                                    }
                                    aria-pressed={showNew}
                                 >
                                    {showNew ? (
                                       <svg
                                          className="w-5 h-5"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                       >
                                          <path
                                             strokeLinecap="round"
                                             strokeLinejoin="round"
                                             strokeWidth="2"
                                             d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-7 0-10-7-10-7a18.836 18.836 0 0 1 5.058-5.943m3.14-1.57A9.966 9.966 0 0 1 12 5c7 0 10 7 10 7a18.87 18.87 0 0 1-3.478 4.568M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                          />
                                          <path
                                             strokeLinecap="round"
                                             strokeLinejoin="round"
                                             strokeWidth="2"
                                             d="M3 3l18 18"
                                          />
                                       </svg>
                                    ) : (
                                       <svg
                                          className="w-5 h-5"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                       >
                                          <path
                                             strokeLinecap="round"
                                             strokeLinejoin="round"
                                             strokeWidth="2"
                                             d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z"
                                          />
                                          <circle
                                             cx="12"
                                             cy="12"
                                             r="3"
                                             strokeWidth="2"
                                          />
                                       </svg>
                                    )}
                                 </button>
                              </div>
                              {newPassword && !isPasswordValid && (
                                 <p className="mt-1 text-xs text-red-600">
                                    Must be at least 8 characters, include
                                    uppercase, lowercase and a number.
                                 </p>
                              )}
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
                                    type={showConfirm ? 'text' : 'password'}
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                       setConfirmPassword(e.target.value)
                                    }
                                    className={`block w-full rounded-lg border py-3 pl-4 pr-10 text-gray-900 focus:ring-2 focus:outline-none focus:border-transparent shadow-sm transition-colors duration-200 ${
                                       confirmPassword && !isMatch
                                          ? 'border-red-300 focus:ring-red-500'
                                          : 'border-gray-300 focus:ring-[#9E7B9B]'
                                    }`}
                                    required
                                 />
                                 <button
                                    type="button"
                                    onClick={() => setShowConfirm((v) => !v)}
                                    className="absolute inset-y-0 right-2 my-auto p-2 text-gray-400 hover:text-gray-600 rounded focus:outline-none"
                                    aria-label={
                                       showConfirm
                                          ? 'Hide password'
                                          : 'Show password'
                                    }
                                    aria-pressed={showConfirm}
                                 >
                                    {showConfirm ? (
                                       <svg
                                          className="w-5 h-5"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                       >
                                          <path
                                             strokeLinecap="round"
                                             strokeLinejoin="round"
                                             strokeWidth="2"
                                             d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-7 0-10-7-10-7a18.836 18.836 0 0 1 5.058-5.943m3.14-1.57A9.966 9.966 0 0 1 12 5c7 0 10 7 10 7a18.87 18.87 0 0 1-3.478 4.568M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                          />
                                          <path
                                             strokeLinecap="round"
                                             strokeLinejoin="round"
                                             strokeWidth="2"
                                             d="M3 3l18 18"
                                          />
                                       </svg>
                                    ) : (
                                       <svg
                                          className="w-5 h-5"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                       >
                                          <path
                                             strokeLinecap="round"
                                             strokeLinejoin="round"
                                             strokeWidth="2"
                                             d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z"
                                          />
                                          <circle
                                             cx="12"
                                             cy="12"
                                             r="3"
                                             strokeWidth="2"
                                          />
                                       </svg>
                                    )}
                                 </button>
                              </div>
                              {confirmPassword && !isMatch && (
                                 <p className="mt-1 text-xs text-red-600">
                                    Passwords do not match.
                                 </p>
                              )}
                           </div>

                           <div className="flex justify-end space-x-3 pt-2">
                              <button
                                 type="submit"
                                 disabled={
                                    !currentPassword ||
                                    !isPasswordValid ||
                                    !isMatch
                                 }
                                 className={`px-6 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                    !currentPassword ||
                                    !isPasswordValid ||
                                    !isMatch
                                       ? 'bg-[#9E7B9B]/60 cursor-not-allowed'
                                       : 'bg-[#9E7B9B] hover:bg-[#8B6B8B] focus:ring-[#9E7B9B]'
                                 }`}
                              >
                                 Update Password
                              </button>
                           </div>
                        </form>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </AccountLayout>
   );
};
