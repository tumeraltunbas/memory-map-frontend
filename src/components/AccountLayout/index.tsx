import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { logout } from '../../stores/slices/userSlice';
import { useDispatch } from 'react-redux';
import { IconLogout, IconSettings, IconUser } from '@tabler/icons-react';
import { useState } from 'react';
import { ConfirmModal } from '../Modals/ConfirmModal';

interface AccountLayoutProps {
   children: React.ReactNode;
}

export const AccountLayout = ({ children }: AccountLayoutProps) => {
   const location = useLocation();
   const navigate = useNavigate();
   const dispatch = useDispatch();

   const isActive = (path: string) => location.pathname === path;

   const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);

   const performLogout = () => {
      authAPI.logout();
      dispatch(logout());
      navigate('/login');
   };

   return (
      <div className="min-h-screen bg-[#FAFAFA]">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-6 flex items-center justify-between">
               <Link
                  to="/map"
                  className="inline-flex items-center text-[#9E7B9B] hover:text-[#8B6B8B] transition-colors"
               >
                  <svg
                     className="w-5 h-5 mr-2"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                     />
                  </svg>
                  Back to Map
               </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
               {/* Sidebar */}
               <div className="w-full md:w-64 flex-shrink-0">
                  <div className="bg-white rounded-lg shadow-sm p-4">
                     <nav className="space-y-1">
                        <Link
                           to="/profile"
                           className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                              isActive('/profile')
                                 ? 'bg-[#9E7B9B] text-white'
                                 : 'text-gray-900 hover:bg-gray-50'
                           }`}
                        >
                           <IconUser className="w-5 h-5 mr-3" />
                           Profile
                        </Link>

                        <Link
                           to="/settings"
                           className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                              isActive('/settings')
                                 ? 'bg-[#9E7B9B] text-white'
                                 : 'text-gray-900 hover:bg-gray-50'
                           }`}
                        >
                           <IconSettings className="w-5 h-5 mr-3" />
                           Settings
                        </Link>

                        <button
                           onClick={() => setShowLogoutConfirm(true)}
                           className="flex cursor-pointer items-center px-4 py-3 text-sm font-medium rounded-md transition-colors w-full text-red-500 hover:bg-red-50"
                           role="menuitem"
                        >
                           <IconLogout className="w-5 h-5 mr-3" />
                           <span>Logout</span>
                        </button>
                     </nav>
                  </div>
               </div>

               {/* Main Content */}
               <div className="flex-1">
                  <div className="bg-white rounded-lg shadow-sm">
                     {children}
                  </div>
               </div>
            </div>

            <ConfirmModal
               isOpen={showLogoutConfirm}
               title="Are you sure you want to log out?"
               description="If you confirm, you will be logged out and redirected to the login page."
               confirmText="Yes"
               cancelText="Cancel"
               onConfirm={() => {
                  setShowLogoutConfirm(false);
                  performLogout();
               }}
               onCancel={() => setShowLogoutConfirm(false)}
            />
         </div>
      </div>
   );
};
