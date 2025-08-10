import { HeroSection } from './HeroSection';
import { LandingHeader } from './LandingHeader';

export const Landing = () => {
   return (
      <div className="min-h-screen bg-white">
         <LandingHeader />
         <main>
            <HeroSection />
         </main>
      </div>
   );
};
