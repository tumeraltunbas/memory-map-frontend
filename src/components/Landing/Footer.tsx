import { motion } from 'framer-motion';

export const Footer = () => {
   return (
      <footer className="bg-[#2D3748] text-white py-16 relative overflow-hidden">
         <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#9E7B9B] to-[#FFE4E1] opacity-50" />
         </div>

         <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
            <motion.div
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6, delay: 0.6 }}
               className="mt-12 pt-8 border-t border-gray-700 text-center"
            >
               <p className="text-gray-400 text-sm">
                  &copy; {new Date().getFullYear()} Memory Map. All rights
                  reserved.
               </p>
            </motion.div>
         </div>
      </footer>
   );
};
