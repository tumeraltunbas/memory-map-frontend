import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import type { RootState } from '../../stores/store';
import { Header } from '../Header';

export const LandingHeader = () => {
   const isAuthenticated = useSelector(
      (state: RootState) => state.user.isAuthenticated
   );

   return (
      <header className="absolute top-0 left-0 right-0 z-50">
         {isAuthenticated ? (
            <Header />
         ) : (
            <div className="p-4 flex justify-between items-center max-w-7xl mx-auto">
               <Link to="/" className="text-2xl font-bold text-[#2D3748]">
                  Memory Map
               </Link>
               <div className="flex items-center gap-4">
                  <Link
                     to="/login"
                     className="text-[#4A5568] hover:text-[#2D3748] font-medium"
                  >
                     Sign In
                  </Link>
                  <Link
                     to="/register"
                     className="bg-[#9E7B9B] text-white px-4 py-2 rounded-lg hover:bg-[#8B6B8B] transition-colors duration-300"
                  >
                     Get Started
                  </Link>
               </div>
            </div>
         )}
      </header>
   );
};
