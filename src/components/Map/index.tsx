import { useEffect, useRef, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import mapboxgl, { Map as MapboxMap } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import type { MapLocation } from '../MapHeader';
import { useCursor } from '../../contexts/CursorContext';
import type { MarkdownResponse } from '../../services/markdownApi';
import {
   addMarkdown,
   setLoading,
   setError,
   setMarkdowns,
} from '../../stores/slices/markdownsSlice';
import { markdownAPI } from '../../services/markdownApi';

import { ViewMarkdownModal } from '../Modals/ViewMarkdownModal';
import '../../styles/marker.css';
import '../../styles/cursor.css';
import LocationMarker from '../../../public/cursors/location.svg';

// Mapbox token'ı ayarla
mapboxgl.accessToken = import.meta.env.VITE_MAP_BOX_ACCESS_KEY || '';

interface MapProps {
   targetLocation: MapLocation | null;
}

export const Map = ({ targetLocation }: MapProps) => {
   const dispatch = useDispatch();
   const { cursorType } = useCursor();

   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
   const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);

   const mapContainerRef = useRef<HTMLDivElement>(null);
   const mapInstanceRef = useRef<MapboxMap | null>(null);

   useEffect(() => {
      const map = mapInstanceRef.current;
      if (!targetLocation || !map) return;

      try {
         map.stop();

         const current = map.getCenter();
         const dx = Math.abs(current.lng - targetLocation.longitude);
         const dy = Math.abs(current.lat - targetLocation.latitude);
         const isNearby = dx < 0.0005 && dy < 0.0005;

         const target = [targetLocation.longitude, targetLocation.latitude] as [
            number,
            number,
         ];

         if (isNearby) {
            map.easeTo({
               center: target,
               duration: 2000,
               easing: (t) => t,
            });
         } else {
            map.flyTo({
               center: target,
               zoom: 20,
               duration: 6000,
               speed: 1.2,
               curve: 1.2,
               easing: (t) => t,
               essential: true,
            });
         }
      } catch (error) {
         console.error('Error flying to location:', error);
      }
   }, [targetLocation]);
   const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});

   const isNearby = (
      coord1: mapboxgl.LngLat,
      coord2: mapboxgl.LngLat
   ): boolean => {
      const THRESHOLD = 0.00001;
      return (
         Math.abs(coord1.lng - coord2.lng) < THRESHOLD &&
         Math.abs(coord1.lat - coord2.lat) < THRESHOLD
      );
   };

   const handleMapClick = useCallback(
      async (event: mapboxgl.MapMouseEvent) => {
         if (cursorType !== 'location' || !mapInstanceRef.current) return;

         const { lngLat } = event;

         const existingMarker = Object.values(markersRef.current).find(
            (marker) => isNearby(marker.getLngLat(), lngLat)
         );

         if (existingMarker) {
            return;
         }

         dispatch(setLoading(true));
         try {
            const createResponse = await markdownAPI.createMarkdown({
               title: `Memory at ${new Date().toLocaleString()}`,
               coordinates: [lngLat.lng, lngLat.lat],
            });

            const markdownId = createResponse.markdownId;

            const markerElement = document.createElement('div');
            markerElement.className = 'marker';

            const img = document.createElement('img');
            img.src = LocationMarker;
            markerElement.appendChild(img);

            markerElement.addEventListener('click', async (e) => {
               e.stopPropagation();
               try {
                  const markdownDetails =
                     await markdownAPI.getSingleMarkdown(markdownId);
                  dispatch(
                     addMarkdown({
                        ...markdownDetails,
                        createdAt: new Date(markdownDetails.createdAt),
                        updatedAt: new Date(markdownDetails.updatedAt),
                     })
                  );
                  setActiveMarkerId(markdownId);
                  setIsViewModalOpen(true);
               } catch (error) {
                  console.error('Error fetching markdown details:', error);
                  dispatch(
                     setError(
                        error instanceof Error
                           ? error.message
                           : 'Failed to fetch markdown details'
                     )
                  );
               }
            });

            const marker = new mapboxgl.Marker({
               element: markerElement,
               anchor: 'bottom',
               draggable: false,
            })
               .setLngLat([lngLat.lng, lngLat.lat])
               .addTo(mapInstanceRef.current);

            markersRef.current[markdownId] = marker;

            const markdownDetails =
               await markdownAPI.getSingleMarkdown(markdownId);

            dispatch(
               addMarkdown({
                  ...markdownDetails,
                  createdAt: new Date(markdownDetails.createdAt),
                  updatedAt: new Date(markdownDetails.updatedAt),
               })
            );

            setActiveMarkerId(markdownId);
            setIsViewModalOpen(true);
         } catch (error) {
            console.error('Error creating markdown:', error);
            dispatch(
               setError(
                  error instanceof Error
                     ? error.message
                     : 'Failed to create markdown'
               )
            );
         }
      },
      [cursorType, dispatch]
   );

   useEffect(() => {
      if (!mapInstanceRef.current) return;

      mapInstanceRef.current.on('click', handleMapClick);

      return () => {
         if (mapInstanceRef.current) {
            mapInstanceRef.current.off('click', handleMapClick);
         }
      };
   }, [handleMapClick]);

   useEffect(() => {
      if (!mapContainerRef.current) return;
      if (mapInstanceRef.current) return;

      const map = new mapboxgl.Map({
         container: mapContainerRef.current,
         config: {
            basemap: {
               lightPreset: 'night',
               showRoadLabels: false,
               font: 'Inter',
            },
         },

         zoom: 2,
         center: [28.9795, 41.015137],
         cooperativeGestures: true,
      });

      map.on('load', () => {
         mapInstanceRef.current = map;
      });

      map.on('style.load', () => {});

      const loadMarkdowns = async () => {
         dispatch(setLoading(true));
         try {
            const response = await markdownAPI.getAllMarkdowns();

            response.markdowns.forEach((markdown: MarkdownResponse) => {
               const markerId = markdown.markdownId;

               const markerElement = document.createElement('div');
               markerElement.className = 'marker';

               const img = document.createElement('img');
               img.src = LocationMarker;
               img.className = 'w-6 h-6';
               markerElement.appendChild(img);

               markerElement.addEventListener('click', async (e) => {
                  e.stopPropagation();
                  try {
                     const markdownDetails =
                        await markdownAPI.getSingleMarkdown(markerId);
                     dispatch(
                        addMarkdown({
                           ...markdownDetails,
                           createdAt: new Date(markdownDetails.createdAt),
                           updatedAt: new Date(markdownDetails.updatedAt),
                        })
                     );
                     setActiveMarkerId(markerId);
                     setIsViewModalOpen(true);
                  } catch (error) {
                     console.error('Error fetching markdown details:', error);
                     dispatch(
                        setError(
                           error instanceof Error
                              ? error.message
                              : 'Failed to fetch markdown details'
                        )
                     );
                  }
               });

               const marker = new mapboxgl.Marker({
                  element: markerElement,
                  anchor: 'bottom',
                  draggable: false,
               })
                  .setLngLat([markdown.geoLocation.x, markdown.geoLocation.y])
                  .addTo(map);

               markersRef.current[markerId] = marker;
            });

            dispatch(setMarkdowns(response.markdowns));
         } catch (error) {
            console.error('Error loading markdowns:', error);
            dispatch(
               setError(
                  error instanceof Error
                     ? error.message
                     : 'Failed to load markdowns'
               )
            );
         }
      };

      loadMarkdowns();

      return () => {
         Object.values(markersRef.current).forEach((marker) => marker.remove());
         map.remove();
         mapInstanceRef.current = null;
      };
   }, [dispatch]);

   useEffect(() => {
      if (!mapContainerRef.current || !mapInstanceRef.current) return;

      mapContainerRef.current.classList.remove(
         'cursor-hand',
         'cursor-location',
         'cursor-default'
      );

      mapContainerRef.current.classList.add(`cursor-${cursorType}`);

      const canvas = mapInstanceRef.current.getCanvas();
      if (canvas) {
         canvas.style.cursor =
            cursorType === 'hand'
               ? 'grab'
               : cursorType === 'location'
                 ? "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNMTIgMkM4LjEzIDIgNSA1LjEzIDUgOWMwIDUuMjUgNyAxMyA3IDEzczctNy43NSA3LTEzYzAtMy44Ny0zLjEzLTctNy03eiIgZmlsbD0id2hpdGUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4=') 12 24, crosshair"
                 : 'default';
      }
   }, [cursorType]);

   return (
      <>
         <div
            ref={mapContainerRef}
            className={`h-screen w-screen cursor-${cursorType}`}
            style={{
               position: 'fixed',
               top: 0,
               left: 0,
               right: 0,
               bottom: 0,
               overflow: 'hidden',
               cursor: `${cursorType === 'hand' ? 'grab' : cursorType === 'location' ? "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNMTIgMkM4LjEzIDIgNSA1LjEzIDUgOWMwIDUuMjUgNyAxMyA3IDEzczctNy43NSA3LTEzYzAtMy44Ny0zLjEzLTctNy03eiIgZmlsbD0id2hpdGUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4=') 12 24, crosshair" : 'default'} !important`,
            }}
         />

         <ViewMarkdownModal
            isOpen={isViewModalOpen}
            onClose={() => {
               setIsViewModalOpen(false);
               setActiveMarkerId(null);
            }}
            markdownId={activeMarkerId || ''}
            onDelete={() => {
               if (!activeMarkerId) return;
               // Remove locally so the marker disappears immediately
               const marker = markersRef.current[activeMarkerId];
               if (marker) {
                  marker.remove();
                  delete markersRef.current[activeMarkerId];
               }
               // Also update list in store by refetching or relying on backend
               // Here we just close the modal; list views would be updated on next fetch
               setIsViewModalOpen(false);
               setActiveMarkerId(null);
            }}
         />
      </>
   );
};
