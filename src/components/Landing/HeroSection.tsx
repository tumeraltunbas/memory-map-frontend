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
                  <div className="relative rounded-2xl shadow-2xl overflow-hidden bg-white">
                     {/* Soft map-like background */}
                     <svg
                        className="absolute inset-0 w-full h-full text-gray-200"
                        viewBox="0 0 800 600"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden
                     >
                        <rect width="800" height="600" fill="#F8F9FA" />
                        <path
                           d="M100,100 Q400,50 700,150 T800,300"
                           stroke="#E9ECEF"
                           strokeWidth="2"
                        />
                        <path
                           d="M0,200 Q300,250 600,150 T800,400"
                           stroke="#E9ECEF"
                           strokeWidth="2"
                        />
                     </svg>

                     {/* Collage photos */}
                     <div className="relative aspect-[4/3]">
                        <motion.div
                           initial={{ y: 20, opacity: 0 }}
                           animate={{ y: 0, opacity: 1 }}
                           transition={{ delay: 0.25, duration: 0.6 }}
                           className="absolute left-10 top-10 w-40 h-40 bg-white rounded-lg border border-[#DED3D7] shadow-md overflow-hidden rotate-[-6deg]"
                        >
                           <img
                              src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=60"
                              alt="Sunset over mountains"
                              className="w-full h-full object-cover"
                              loading="lazy"
                           />
                        </motion.div>

                        <motion.div
                           initial={{ y: 30, opacity: 0 }}
                           animate={{ y: 0, opacity: 1 }}
                           transition={{ delay: 0.35, duration: 0.6 }}
                           className="absolute right-12 top-24 w-40 h-40 bg-white rounded-lg border border-[#DED3D7] shadow-md overflow-hidden rotate-[5deg]"
                        >
                           <img
                              src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=60"
                              alt="Hikers by lake"
                              className="w-full h-full object-cover"
                              loading="lazy"
                           />
                        </motion.div>

                        <motion.div
                           initial={{ y: 40, opacity: 0 }}
                           animate={{ y: 0, opacity: 1 }}
                           transition={{ delay: 0.45, duration: 0.6 }}
                           className="absolute left-20 bottom-10 w-40 h-40 bg-white rounded-lg border border-[#DED3D7] shadow-md overflow-hidden rotate-[2deg]"
                        >
                           <img
                              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=60"
                              alt="Friends on a trip"
                              className="w-full h-full object-cover"
                              loading="lazy"
                           />
                        </motion.div>
                     </div>

                     {/* Floating toast */}
                     <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.4 }}
                        className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg"
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
