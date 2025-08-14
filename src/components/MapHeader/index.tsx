import {
   IconHandStop,
   IconUser,
   IconSettings,
   IconLogout,
} from '@tabler/icons-react';
import { IconMapPin } from '../Icons/MapPin';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from 'react-redux';
import { logout } from '../../stores/slices/userSlice';
import { authAPI } from '../../services/authApi';
import { useCursor } from '../../contexts/CursorContext';
import { mapboxSearchAPI as searchAPI } from '../../services/mapboxSearchApi';

export interface MapLocation {
   longitude: number;
   latitude: number;
}

interface MapHeaderProps {
   onLocationSelect?: (location: MapLocation) => void;
}

// Header visibility state
export const setHeaderVisibility = (visible: boolean) => {
   const header = document.querySelector('header');
   if (header) {
      header.style.display = visible ? 'flex' : 'none';
   }
};

export const MapHeader = ({ onLocationSelect }: MapHeaderProps) => {
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const [openMapTools, setOpenMapTools] = useState<boolean>(false);
   const [openProfile, setOpenProfile] = useState<boolean>(false);
   const [activeMapTool, setActiveMapTool] = useState<'hand' | 'location'>(
      'hand'
   );
   const [searchQuery, setSearchQuery] = useState('');
   const [searchResults, setSearchResults] = useState<any[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const searchAbortController = useRef<AbortController | null>(null);
   const sessionToken = useRef<string>(uuidv4()); // Yeni oturum için UUID oluştur
   const { setCursorType } = useCursor();
   const mapToolsRef = useRef<HTMLDivElement>(null);
   const profileRef = useRef<HTMLDivElement>(null);

   // Sayfa görünürlüğü değiştiğinde yeni session token oluştur
   useEffect(() => {
      const handleVisibilityChange = () => {
         if (document.visibilityState === 'visible') {
            sessionToken.current = uuidv4(); // Yeni session token oluştur
            setSearchResults([]); // Önceki sonuçları temizle
            setSearchQuery(''); // Arama sorgusunu temizle
         }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => {
         document.removeEventListener(
            'visibilitychange',
            handleVisibilityChange
         );
      };
   }, []);

   // Set initial cursor type
   useEffect(() => {
      setCursorType(activeMapTool);
   }, [activeMapTool, setCursorType]);

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

   const handleToolChange = () => {
      const newTool = activeMapTool === 'hand' ? 'location' : 'hand';
      setActiveMapTool(newTool);
      setCursorType(newTool);
      setOpenMapTools(false);
   };

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

   const handleSearch = useCallback(async (query: string) => {
      // Önceki isteği iptal et
      if (searchAbortController.current) {
         searchAbortController.current.abort();
      }

      // Yeni istek için controller oluştur
      searchAbortController.current = new AbortController();

      if (!query.trim()) {
         setSearchResults([]);
         setIsLoading(false);
         return;
      }

      setIsLoading(true);
      try {
         const results = await searchAPI.suggest(
            query,
            sessionToken.current,
            searchAbortController.current.signal
         );
         setSearchResults(results);
      } catch (error) {
         console.error('Search error:', error);
         setSearchResults([]);
      } finally {
         setIsLoading(false);
      }
   }, []);

   // Debounce search
   useEffect(() => {
      const timer = setTimeout(() => {
         handleSearch(searchQuery);
      }, 300);

      return () => clearTimeout(timer);
   }, [searchQuery, handleSearch]);

   const handleLogout = () => {
      authAPI.logout();
      dispatch(logout());
      navigate('/');
   };

   return (
      <header
         className="fixed top-0 left-0 right-0 px-4 py-3 flex items-center justify-between gap-2 sm:gap-3 z-[100] bg-transparent"
         data-cursor-block="true"
      >
         <div className="flex-1 min-w-0 max-w-2xl md:max-w-sm lg:max-w-sm">
            <div className="relative">
               <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search locations..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-full border border-gray-300 shadow-sm bg-white text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-10"
                  data-cursor-block="true"
               />
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                     className="h-4 w-4 text-gray-400"
                     fill="none"
                     viewBox="0 0 24 24"
                     stroke="currentColor"
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                     />
                  </svg>
               </div>
               {(searchResults.length > 0 || isLoading) && (
                  <div
                     className="absolute left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto z-50"
                     data-cursor-block="true"
                  >
                     {isLoading ? (
                        <div className="px-4 py-2 text-sm text-gray-500">
                           Searching...
                        </div>
                     ) : (
                        <ul>
                           {searchResults.map((result) => (
                              <li
                                 key={result.mapbox_id}
                                 className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                 onClick={async () => {
                                    try {
                                       const coords = await searchAPI.retrieve(
                                          result.mapbox_id,
                                          sessionToken.current
                                       );

                                       if (onLocationSelect) {
                                          const [longitude, latitude] = coords;

                                          try {
                                             onLocationSelect({
                                                longitude,
                                                latitude,
                                             });
                                          } catch (error) {
                                             console.error(
                                                'Error in onLocationSelect:',
                                                error
                                             );
                                          }
                                       }
                                    } catch (error) {
                                       console.error(
                                          'Error retrieving coordinates:',
                                          error
                                       );
                                    } finally {
                                       setSearchResults([]);
                                       setSearchQuery('');
                                    }
                                 }}
                              >
                                 <div className="flex items-center gap-2">
                                    <div className="flex-1">
                                       <div className="font-medium">
                                          {result.name}
                                       </div>
                                       <div className="text-gray-500 text-xs">
                                          {result.full_address ||
                                             result.place_formatted}
                                       </div>
                                    </div>
                                    {result.poi_category &&
                                       result.poi_category.length > 0 && (
                                          <div className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                                             {result.poi_category[0]}
                                          </div>
                                       )}
                                 </div>
                                 <div className="mt-1 text-xs text-gray-400 flex gap-2">
                                    {result.feature_type && (
                                       <span className="capitalize">
                                          {result.feature_type}
                                       </span>
                                    )}
                                    {result.context?.place?.name && (
                                       <span>
                                          • {result.context.place.name}
                                       </span>
                                    )}
                                    {result.context?.country?.name && (
                                       <span>
                                          • {result.context.country.name}
                                       </span>
                                    )}
                                 </div>
                              </li>
                           ))}
                        </ul>
                     )}
                  </div>
               )}
            </div>
         </div>
         <div className="flex gap-2 sm:gap-3 flex-shrink-0">
            <div
               className="relative"
               ref={mapToolsRef}
               data-cursor-block="true"
            >
               <button
                  onClick={() => setOpenMapTools(!openMapTools)}
                  className="inline-flex items-center justify-center rounded-full border border-gray-300 shadow-sm p-2.5 md:p-3 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  aria-expanded={openMapTools}
                  aria-haspopup="true"
               >
                  {getMapToolIcon()}
                  <svg
                     className={`ml-1.5 h-4 w-4 md:h-5 md:w-5 transition-transform duration-200 ${
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
                  <div
                     className="absolute right-0 mt-2 min-w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-[101] transition-all duration-200 ease-out"
                     data-cursor-block="true"
                  >
                     <ul
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                     >
                        <li
                           onClick={handleToolChange}
                           className="flex justify-center items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150 cursor-pointer"
                           role="menuitem"
                        >
                           {getDropdownToolIcon()}
                        </li>
                     </ul>
                  </div>
               )}
            </div>

            <div className="relative" ref={profileRef} data-cursor-block="true">
               <button
                  onClick={() => setOpenProfile(!openProfile)}
                  className="inline-flex items-center justify-center rounded-full border border-gray-300 shadow-sm p-2.5 md:p-3 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  aria-expanded={openProfile}
                  aria-haspopup="true"
               >
                  <IconUser className="w-4 h-4 md:w-5 md:h-5" />
               </button>

               {openProfile && (
                  <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-[101]">
                     <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                     >
                        <button
                           onClick={() => {
                              navigate('/profile');
                              setOpenProfile(false);
                           }}
                           className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                           role="menuitem"
                        >
                           <IconUser className="w-5 h-5 mr-3" />
                           <span>Profile</span>
                        </button>
                        <button
                           onClick={() => {
                              navigate('/settings');
                              setOpenProfile(false);
                           }}
                           className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                           role="menuitem"
                        >
                           <IconSettings className="w-5 h-5 mr-3" />
                           <span>Settings</span>
                        </button>
                        <button
                           onClick={() => {
                              handleLogout();
                              setOpenProfile(false);
                           }}
                           className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                           role="menuitem"
                        >
                           <IconLogout className="w-5 h-5 mr-3" />
                           <span>Logout</span>
                        </button>
                     </div>
                  </div>
               )}
            </div>
         </div>
      </header>
   );
};
