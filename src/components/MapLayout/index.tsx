import { MapHeader } from '../MapHeader';
import { Map } from '../Map';
import '../../styles/cursor.css';

export const MapLayout = () => {
   return (
      <div className="relative h-screen w-screen">
         <div className="absolute top-0 left-0 z-10 bg-transparent w-screen">
            <MapHeader />
         </div>
         <div className="absolute top-0 left-0 w-full h-full z-0">
            <Map />
         </div>
      </div>
   );
};
