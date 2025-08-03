import { HeroSection } from './HeroSection';
import { Footer } from './Footer';
import { LandingHeader } from './LandingHeader';

export const Landing = () => {
   return (
      <div className="min-h-screen bg-white">
         <LandingHeader />
         <main>
            <HeroSection />
         </main>
         <Footer />
      </div>
   );
};
