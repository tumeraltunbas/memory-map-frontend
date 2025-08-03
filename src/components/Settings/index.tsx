import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../stores/store';
import { AccountLayout } from '../AccountLayout';

export const Settings = () => {
   const user = useSelector((state: RootState) => state.user.user);
   const [emailNotifications, setEmailNotifications] = useState(true);
   const [locationSharing, setLocationSharing] = useState(true);

   return (
      <AccountLayout>
         <div className="p-6">
            <div className="border-b border-gray-200 pb-6">
               <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
               <p className="mt-1 text-sm text-gray-500">
                  Manage your account settings and preferences.
               </p>
            </div>

            <div className="py-6">
               {/* Account Settings */}
               <div className="max-w-3xl">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">
                     Account Settings
                  </h3>

                  <div className="space-y-6">
                     {/* Email */}
                     <div>
                        <label
                           htmlFor="email"
                           className="block text-sm font-medium text-gray-700"
                        >
                           Email Address
                        </label>
                        <div className="mt-1">
                           <input
                              type="email"
                              name="email"
                              id="email"
                              value={user.email}
                              disabled
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#9E7B9B] focus:ring-[#9E7B9B] sm:text-sm bg-gray-50"
                           />
                        </div>
                     </div>

                     {/* Password */}
                     <div>
                        <label
                           htmlFor="password"
                           className="block text-sm font-medium text-gray-700"
                        >
                           Password
                        </label>
                        <div className="mt-1">
                           <button className="text-[#9E7B9B] hover:text-[#8B6B8B] text-sm font-medium">
                              Change Password
                           </button>
                        </div>
                     </div>
                  </div>

                  {/* Preferences */}
                  <div className="mt-10">
                     <h3 className="text-lg font-medium text-gray-900 mb-6">
                        Preferences
                     </h3>

                     <div className="space-y-6">
                        {/* Email Notifications */}
                        <div className="flex items-center justify-between">
                           <div>
                              <h4 className="text-sm font-medium text-gray-900">
                                 Email Notifications
                              </h4>
                              <p className="text-sm text-gray-500">
                                 Receive email updates about your memories and
                                 activity.
                              </p>
                           </div>
                           <button
                              onClick={() =>
                                 setEmailNotifications(!emailNotifications)
                              }
                              className={`${
                                 emailNotifications
                                    ? 'bg-[#9E7B9B]'
                                    : 'bg-gray-200'
                              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#9E7B9B] focus:ring-offset-2`}
                           >
                              <span
                                 className={`${
                                    emailNotifications
                                       ? 'translate-x-5'
                                       : 'translate-x-0'
                                 } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                              />
                           </button>
                        </div>

                        {/* Location Sharing */}
                        <div className="flex items-center justify-between">
                           <div>
                              <h4 className="text-sm font-medium text-gray-900">
                                 Location Sharing
                              </h4>
                              <p className="text-sm text-gray-500">
                                 Allow the app to access your location for
                                 better memory mapping.
                              </p>
                           </div>
                           <button
                              onClick={() =>
                                 setLocationSharing(!locationSharing)
                              }
                              className={`${
                                 locationSharing
                                    ? 'bg-[#9E7B9B]'
                                    : 'bg-gray-200'
                              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#9E7B9B] focus:ring-offset-2`}
                           >
                              <span
                                 className={`${
                                    locationSharing
                                       ? 'translate-x-5'
                                       : 'translate-x-0'
                                 } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                              />
                           </button>
                        </div>
                     </div>
                  </div>

                  {/* Save Button */}
                  <div className="mt-10 flex justify-end">
                     <button className="bg-[#9E7B9B] text-white px-4 py-2 rounded-md hover:bg-[#8B6B8B] focus:outline-none focus:ring-2 focus:ring-[#9E7B9B] focus:ring-offset-2">
                        Save Changes
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </AccountLayout>
   );
};
