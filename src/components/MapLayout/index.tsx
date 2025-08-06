import { MapHeader } from '../MapHeader';
import { Map } from '../Map';
import '../../styles/cursor.css';
import { useState, useRef } from 'react';
import type { MapLocation } from '../MapHeader';

export const MapLayout = () => {
   const [targetLocation, setTargetLocation] = useState<MapLocation | null>(
      null
   );

   const handleLocationSelect = (location: MapLocation) => {
      setTargetLocation(location);
   };

   return (
      <div className="relative h-screen w-screen">
         <div className="absolute top-0 left-0 z-10 bg-transparent w-screen">
            <MapHeader onLocationSelect={handleLocationSelect} />
         </div>
         <div className="absolute top-0 left-0 w-full h-full z-0">
            <Map targetLocation={targetLocation} />
         </div>
      </div>
   );
};
