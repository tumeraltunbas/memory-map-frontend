import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../stores/store';

export const HeroSection = () => {
   const navigate = useNavigate();
   const isAuthenticated = useSelector(
      (state: RootState) => state.user.isAuthenticated
   );
   return (
      <section className="min-h-screen bg-[#FAFAFA] relative overflow-hidden">
         {/* Background Gradient Blur */}
         <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#FFE4E1] blur-[100px] opacity-30" />
            <div className="absolute bottom-[-10%] right-[-20%] w-[60%] h-[60%] rounded-full bg-[#9E7B9B] blur-[120px] opacity-20" />
         </div>

         <div className="max-w-7xl mx-auto px-4 md:px-8 h-screen flex items-center relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
               <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
               >
                  <h1 className="text-4xl md:text-7xl font-bold text-[#2D3748] mb-6 leading-tight">
                     Your Journey, Beautifully
                     <span className="text-[#9E7B9B]"> Remembered</span>
                  </h1>

                  <p className="text-lg md:text-xl text-[#4A5568] mb-8 leading-relaxed">
                     Turn moments into memories with a digital journal. Write
                     notes, add photos, and preserve your life’s
                     journey—beautifully organized, forever yours.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                     <motion.button
                        onClick={() =>
                           navigate(isAuthenticated ? '/map' : '/login')
                        }
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-[#9E7B9B] text-white px-8 py-4 rounded-lg text-lg font-medium 
                           shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                     >
                        Start Mapping
                        <svg
                           className="w-5 h-5 ml-2"
                           fill="none"
                           stroke="currentColor"
                           viewBox="0 0 24 24"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                           />
                        </svg>
                     </motion.button>
                  </div>

                  <div className="mt-12 flex items-center gap-8">
                     <div>
                        <div className="text-2xl font-bold text-[#2D3748]">
                           2,000+
                        </div>
                        <div className="text-[#4A5568]">Active Users</div>
                     </div>
                     <div>
                        <div className="text-2xl font-bold text-[#2D3748]">
                           10,000+
                        </div>
                        <div className="text-[#4A5568]">Memories Mapped</div>
                     </div>
                  </div>
               </motion.div>

               <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="relative"
               >
                  <div className="relative">
                     <img
                        src="/hero-illustration.svg"
                        alt="Memory Map Preview"
                        className="w-full rounded-lg shadow-2xl"
                     />
                     <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="absolute top-[-20px] right-[-20px] bg-white p-4 rounded-lg shadow-lg"
                     >
                        <div className="flex items-center gap-3">
                           <div className="w-2 h-2 rounded-full bg-[#9E7B9B]" />
                           <span className="text-sm text-[#4A5568]">
                              New memory added
                           </span>
                        </div>
                     </motion.div>
                  </div>
               </motion.div>
            </div>
         </div>
      </section>
   );
};
