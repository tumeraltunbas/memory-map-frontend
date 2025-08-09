import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { logout } from '../../stores/slices/userSlice';
import { useDispatch } from 'react-redux';
import { IconLogout } from '@tabler/icons-react';

interface AccountLayoutProps {
   children: React.ReactNode;
}

export const AccountLayout = ({ children }: AccountLayoutProps) => {
   const location = useLocation();
   const navigate = useNavigate();
   const dispatch = useDispatch();

   const isActive = (path: string) => location.pathname === path;

   const handleLogout = () => {
      authAPI.logout();
      dispatch(logout());
      navigate('/');
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
                           <svg
                              className={`mr-3 h-5 w-5 ${
                                 isActive('/profile')
                                    ? 'text-white'
                                    : 'text-gray-400'
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                           >
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 strokeWidth="2"
                                 d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                           </svg>
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
                           <svg
                              className={`mr-3 h-5 w-5 ${
                                 isActive('/settings')
                                    ? 'text-white'
                                    : 'text-gray-400'
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                           >
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 strokeWidth="2"
                                 d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                              />
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 strokeWidth="2"
                                 d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                           </svg>
                           Settings
                        </Link>

                        <button
                           onClick={handleLogout}
                           className="flex cursor-pointer items-center px-4 py-3 text-sm font-medium rounded-md transition-colors"
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
         </div>
      </div>
   );
};
