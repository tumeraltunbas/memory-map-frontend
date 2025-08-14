import { MapHeader } from '../MapHeader';
import { Map } from '../Map';
import '../../styles/cursor.css';
import { useState } from 'react';
import type { MapLocation } from '../MapHeader';
import { useState as useReactState } from 'react';

export const MapLayout = () => {
   const [targetLocation, setTargetLocation] = useState<MapLocation | null>(
      null
   );
   const [isLoadingMarkdowns, setIsLoadingMarkdowns] = useReactState(false);

   const handleLocationSelect = (location: MapLocation) => {
      setTargetLocation(location);
   };

   return (
      <div className="relative h-screen w-screen">
         <div className="absolute top-0 left-0 z-10 bg-transparent w-screen">
            <MapHeader onLocationSelect={handleLocationSelect} />
         </div>
         <div className="absolute top-0 left-0 w-full h-full z-0">
            <Map
               targetLocation={targetLocation}
               onLoadingChange={setIsLoadingMarkdowns}
            />
         </div>
         {isLoadingMarkdowns && (
            <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-[1px] pointer-events-none">
               <div className="flex items-center gap-3 text-white drop-shadow">
                  <span className="h-6 w-6 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">Loading memories...</span>
               </div>
            </div>
         )}
      </div>
   );
};
