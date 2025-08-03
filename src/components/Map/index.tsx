import { useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import mapboxgl, { Map as MapboxMap } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useCursor } from '../../contexts/CursorContext';
import { addMarkdown } from '../../stores/slices/markdownsSlice';
import '../../styles/marker.css';

// Mapbox token'ı ayarla
mapboxgl.accessToken = import.meta.env.VITE_MAP_BOX_ACCESS_KEY || '';

export const Map = () => {
   const dispatch = useDispatch();
   const { cursorType } = useCursor();

   // Map container için ref
   const mapContainerRef = useRef<HTMLDivElement>(null);
   // Map instance'ı için ref
   const mapInstanceRef = useRef<MapboxMap | null>(null);
   // Marker'lar için ref
   const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});

   // Koordinatların yakın olup olmadığını kontrol et (1 metre hassasiyetle)
   const isNearby = (
      coord1: mapboxgl.LngLat,
      coord2: mapboxgl.LngLat
   ): boolean => {
      const THRESHOLD = 0.00001; // Yaklaşık 1 metre
      return (
         Math.abs(coord1.lng - coord2.lng) < THRESHOLD &&
         Math.abs(coord1.lat - coord2.lat) < THRESHOLD
      );
   };

   // Map click handler
   const handleMapClick = useCallback(
      (event: mapboxgl.MapMouseEvent) => {
         if (cursorType !== 'location' || !mapInstanceRef.current) return;

         const { lngLat } = event;

         // Mevcut marker'ları kontrol et
         const existingMarker = Object.values(markersRef.current).find(
            (marker) => isNearby(marker.getLngLat(), lngLat)
         );

         if (existingMarker) {
            // Yakında bir marker varsa, yeni marker eklemeyi iptal et
            return;
         }

         const markerId = uuidv4();

         // Create marker element
         const markerElement = document.createElement('div');
         markerElement.className = 'marker';
         markerElement.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" 
                     fill="#9E7B9B"
                     stroke="#9E7B9B"/>
            </svg>
         `;

         // Add marker to map with fixed position
         const marker = new mapboxgl.Marker({
            element: markerElement,
            pitchAlignment: 'viewport',
            rotationAlignment: 'viewport',
            draggable: false,
         })
            .setLngLat(lngLat)
            .addTo(mapInstanceRef.current);

         // Store marker reference
         markersRef.current[markerId] = marker;

         // Add marker to Redux store
         dispatch(
            addMarkdown({
               id: markerId,
               latitude: lngLat.lat,
               longitude: lngLat.lng,
               createdAt: new Date().toISOString(),
            })
         );
      },
      [cursorType, dispatch]
   );

   // Click event listener'ı yönet
   useEffect(() => {
      if (!mapInstanceRef.current) return;

      mapInstanceRef.current.on('click', handleMapClick);

      return () => {
         if (mapInstanceRef.current) {
            mapInstanceRef.current.off('click', handleMapClick);
         }
      };
   }, [handleMapClick]);

   // Initialize map
   useEffect(() => {
      if (!mapContainerRef.current) return; // container yoksa çık
      if (mapInstanceRef.current) return; // map zaten oluşturulmuşsa çık

      const map = new MapboxMap({
         container: mapContainerRef.current,
         config: {
            basemap: {
               lightPreset: 'night',
               showRoadLabels: false,
               font: 'Inter',
            },
         },
      });

      // Map instance'ını ref'e kaydet
      mapInstanceRef.current = map;

      // Cleanup function
      return () => {
         // Marker'ları temizle
         Object.values(markersRef.current).forEach((marker) => marker.remove());
         // Map'i temizle
         map.remove();
         // Ref'i temizle
         mapInstanceRef.current = null;
      };
   }, []); // Boş dependency array ile sadece bir kere initialize et

   // Debug için cursor type'ı konsola yazdır
   useEffect(() => {
      console.log('Current cursor type:', cursorType);
   }, [cursorType]);

   return (
      <div
         ref={mapContainerRef}
         className={`h-screen w-screen cursor-${cursorType}`}
         style={{ position: 'relative' }}
      />
   );
};
