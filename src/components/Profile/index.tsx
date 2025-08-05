import { useSelector } from 'react-redux';
import type { RootState } from '../../stores/store';

import { AccountLayout } from '../AccountLayout';

export const Profile = () => {
   const user = useSelector((state: RootState) => state.user.user);

   return (
      <AccountLayout>
         <div className="p-6">
            <div className="border-b border-gray-200 pb-6">
               <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
               <p className="mt-1 text-sm text-gray-500">
                  Manage your account information and view your activity.
               </p>
            </div>

            <div className="py-6">
               {/* Profile Info */}
               <div className="flex items-center space-x-6">
                  <div className="h-24 w-24 bg-[#9E7B9B] rounded-full flex items-center justify-center text-white text-3xl font-medium">
                     {user?.email?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                     <h3 className="text-xl font-medium text-gray-900">
                        {user?.email || 'Loading...'}
                     </h3>
                     <p className="text-sm text-gray-500">
                        Member since{' '}
                        {user?.createdAt
                           ? new Date(user.createdAt).toLocaleDateString(
                                'en-US',
                                {
                                   day: 'numeric',
                                   month: 'long',
                                   year: 'numeric',
                                }
                             )
                           : 'Loading...'}
                     </p>
                  </div>
               </div>

               {/* Stats */}
               <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                     Your Activity
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="bg-[#F7FAFC] rounded-lg p-6">
                        <div className="text-3xl font-bold text-[#2D3748]">
                           {user?.markdowns?.length || 0}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                           Total Memories
                        </div>
                     </div>
                     <div className="bg-[#F7FAFC] rounded-lg p-6">
                        <div className="text-3xl font-bold text-[#2D3748]">
                           {user?.markdowns?.filter((m) => m.photos?.length > 0)
                              ?.length || 0}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                           Memories with Photos
                        </div>
                     </div>
                     <div className="bg-[#F7FAFC] rounded-lg p-6">
                        <div className="text-3xl font-bold text-[#2D3748]">
                           {user?.markdowns?.reduce(
                              (acc, curr) => acc + (curr.photos?.length || 0),
                              0
                           ) || 0}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                           Total Photos
                        </div>
                     </div>
                  </div>
               </div>

               {/* Recent Activity */}
               <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                     Recent Activity
                  </h3>
                  <div className="bg-[#F7FAFC] rounded-lg p-6">
                     <div className="space-y-4">
                        {user?.markdowns?.length ? (
                           user.markdowns.slice(0, 5).map((markdown, index) => (
                              <div
                                 key={index}
                                 className="flex items-center justify-between"
                              >
                                 <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-[#9E7B9B] rounded-full" />
                                    <div>
                                       <p className="text-sm font-medium text-gray-900">
                                          New memory added
                                       </p>
                                       <p className="text-xs text-gray-500">
                                          {new Date(
                                             markdown.createdAt
                                          ).toLocaleDateString('en-US', {
                                             day: 'numeric',
                                             month: 'long',
                                             year: 'numeric',
                                          })}
                                       </p>
                                    </div>
                                 </div>
                                 <span className="text-xs text-gray-500">
                                    {markdown.photos?.length || 0} photos
                                 </span>
                              </div>
                           ))
                        ) : (
                           <div className="text-center text-gray-500">
                              No recent activity
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </AccountLayout>
   );
};
