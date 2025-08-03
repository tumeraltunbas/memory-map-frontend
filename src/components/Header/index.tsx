import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../stores/store';

export const Header = () => {
   const isAuthenticated = useSelector(
      (state: RootState) => state.user.isAuthenticated
   );

   return (
      <header className="absolute top-0 left-0 right-0 z-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
               <Link to="/" className="text-2xl font-bold text-[#2D3748]">
                  Memory Map
               </Link>

               <div className="flex items-center space-x-6">
                  {isAuthenticated ? (
                     <Link
                        to="/map"
                        className="bg-[#9E7B9B] text-white px-6 py-2.5 rounded-lg hover:bg-[#8B6B8B] transition-colors duration-300"
                     >
                        Go to Map
                     </Link>
                  ) : (
                     <>
                        <Link
                           to="/login"
                           className="text-[#4A5568] hover:text-[#2D3748] font-medium transition-colors duration-300"
                        >
                           Sign In
                        </Link>
                        <Link
                           to="/register"
                           className="bg-[#9E7B9B] text-white px-6 py-2.5 rounded-lg hover:bg-[#8B6B8B] transition-colors duration-300"
                        >
                           Get Started
                        </Link>
                     </>
                  )}
               </div>
            </div>
         </div>
      </header>
   );
};
