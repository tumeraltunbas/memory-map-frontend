import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../stores/store';
import { setLoading } from '../../stores/slices/userSlice';
import { authAPI } from '../../services/authApi';
import type { UserProfileResponse } from '../../types';

import { AccountLayout } from '../AccountLayout';
import { IconBookmark, IconBuilding, IconWorld } from '@tabler/icons-react';

export const Profile = () => {
   const [profile, setProfile] = useState<UserProfileResponse>();

   const dispatch = useDispatch();
   const isLoading = useSelector((state: RootState) => state.user.isLoading);

   useEffect(() => {
      const fetchUserProfile = async () => {
         dispatch(setLoading(true));
         try {
            const profile = await authAPI.profile();
            setProfile(profile);
            dispatch(setLoading(false));
         } catch (error) {
            console.error('Error fetching user profile:', error);
            dispatch(setLoading(false));
         }
      };

      fetchUserProfile();
   }, [dispatch]);

   if (isLoading) {
      return (
         <AccountLayout>
            <div className="p-6">
               <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9E7B9B] mx-auto"></div>
                     <p className="mt-4 text-gray-500">Loading profile...</p>
                  </div>
               </div>
            </div>
         </AccountLayout>
      );
   }

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
               <div className="flex items-center space-x-6">
                  <div className="h-20 w-20 sm:h-24 sm:w-24 bg-[#9E7B9B] rounded-full flex items-center justify-center text-white text-3xl font-medium flex-shrink-0">
                     {profile?.user.email?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div className="min-w-0">
                     <h3 className="text-sm sm:text-xl font-medium text-gray-900 break-words leading-snug">
                        {profile?.user?.email || 'Loading...'}
                     </h3>
                     <p className="text-sm text-gray-500">
                        Member since{' '}
                        {profile?.user?.createdAt
                           ? new Date(
                                profile?.user.createdAt
                             ).toLocaleDateString('en-US', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                             })
                           : 'Loading...'}
                     </p>
                  </div>
               </div>

               <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                     Your Activity
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                     <div className="bg-[#F7FAFC] rounded-lg p-5">
                        <div className="text-sm text-gray-500 mt-1">
                           <div className="flex items-center gap-1">
                              <IconBookmark />
                              Total Memories
                           </div>
                        </div>
                        <div className="text-3xl font-bold text-[#2D3748] mt-2">
                           {profile?.totalMarkdownCount || 0}
                        </div>
                     </div>

                     <div className="bg-[#F7FAFC] rounded-lg p-6">
                        <div className="flex items-center gap-1">
                           <IconWorld />
                           Countries with memories
                        </div>
                        <div className="text-3xl font-bold text-[#2D3748] mt-2">
                           {profile?.totalCountryCount || 0}
                        </div>
                     </div>

                     <div className="bg-[#F7FAFC] rounded-lg p-6">
                        <div className="text-sm text-gray-500 mt-1">
                           <div className="flex items-center gap-1">
                              <IconBuilding />
                              Cities with memories
                           </div>
                        </div>
                        <div className="text-3xl font-bold text-[#2D3748] mt-2">
                           {profile?.totalCityCount || 0}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </AccountLayout>
   );
};
