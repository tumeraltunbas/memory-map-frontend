import {
   IconHandStop,
   IconMapPin,
   IconUser,
   IconSettings,
} from '@tabler/icons-react';
import { useState, useRef, useEffect } from 'react';

export const Header = () => {
   const [openMapTools, setOpenMapTools] = useState<boolean>(false);
   const [openProfile, setOpenProfile] = useState<boolean>(false);
   const [activeMapTool, setActiveMapTool] = useState<'hand' | 'location'>(
      'hand'
   );
   const mapToolsRef = useRef<HTMLDivElement>(null);
   const profileRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (
            mapToolsRef.current &&
            !mapToolsRef.current.contains(event.target as Node)
         ) {
            setOpenMapTools(false);
         }
         if (
            profileRef.current &&
            !profileRef.current.contains(event.target as Node)
         ) {
            setOpenProfile(false);
         }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () =>
         document.removeEventListener('mousedown', handleClickOutside);
   }, []);

   const getMapToolIcon = () => {
      return activeMapTool === 'hand' ? (
         <IconHandStop className="w-5 h-5" />
      ) : (
         <IconMapPin className="w-5 h-5" />
      );
   };

   const getDropdownToolIcon = () => {
      return activeMapTool === 'hand' ? (
         <IconMapPin className="w-5 h-5" />
      ) : (
         <IconHandStop className="w-5 h-5" />
      );
   };

   return (
      <header className="p-3 flex justify-between items-center">
         <div className="flex-1" /> {/* Spacer */}
         <div className="flex gap-3">
            <div className="relative" ref={mapToolsRef}>
               <button
                  onClick={() => setOpenMapTools(!openMapTools)}
                  className="inline-flex items-center justify-center rounded-full border border-gray-300 shadow-sm p-3 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  aria-expanded={openMapTools}
                  aria-haspopup="true"
               >
                  {getMapToolIcon()}
                  <svg
                     className={`ml-1.5 h-5 w-5 transition-transform duration-200 ${
                        openMapTools ? 'transform rotate-180' : ''
                     }`}
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                     />
                  </svg>
               </button>

               {openMapTools && (
                  <div className="absolute right-0 mt-2 min-w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 transition-all duration-200 ease-out">
                     <ul
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                     >
                        <li
                           onClick={() => {
                              setActiveMapTool(
                                 activeMapTool === 'hand' ? 'location' : 'hand'
                              );
                              setOpenMapTools(false);
                           }}
                           className="flex justify-center items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150 cursor-pointer"
                           role="menuitem"
                        >
                           {getDropdownToolIcon()}
                        </li>
                     </ul>
                  </div>
               )}
            </div>

            <div className="relative" ref={profileRef}>
               <button
                  onClick={() => setOpenProfile(!openProfile)}
                  className="inline-flex items-center justify-center rounded-full border border-gray-300 shadow-sm p-3 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  aria-expanded={openProfile}
                  aria-haspopup="true"
               >
                  <IconUser className="w-5 h-5" />
               </button>

               {openProfile && (
                  <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                     <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                     >
                        <a
                           href="/profile"
                           className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                           role="menuitem"
                        >
                           <IconUser className="w-5 h-5 mr-3" />
                           <span>Profile</span>
                        </a>
                        <a
                           href="/settings"
                           className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                           role="menuitem"
                        >
                           <IconSettings className="w-5 h-5 mr-3" />
                           <span>Settings</span>
                        </a>
                     </div>
                  </div>
               )}
            </div>
         </div>
      </header>
   );
};
