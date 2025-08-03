import { HeroSection } from './HeroSection';
import { Footer } from './Footer';

export const Landing = () => {
   return (
      <div className="min-h-screen bg-white">
         <main>
            <HeroSection />
         </main>
         <Footer />
      </div>
   );
};
