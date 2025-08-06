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
   updateMarkdown,
} from '../../stores/slices/markdownsSlice';
import { markdownAPI } from '../../services/markdownApi';

import { PhotoModal } from '../Modals/PhotoModal';
import { MemoryModal } from '../Modals/MemoryModal';
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

   // Modal states
   const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
   const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
   const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);

   // Map container için ref
   const mapContainerRef = useRef<HTMLDivElement>(null);
   // Map instance'ı için ref
   const mapInstanceRef = useRef<MapboxMap | null>(null);

   // targetLocation değiştiğinde haritayı hareket ettir
   useEffect(() => {
      if (!targetLocation || !mapInstanceRef.current) return;

      try {
         mapInstanceRef.current.flyTo({
            center: [targetLocation.longitude, targetLocation.latitude],
            zoom: 15,
            duration: 1500,
         });
      } catch (error) {
         console.error('Error flying to location:', error);
      }
   }, [targetLocation]);
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
      async (event: mapboxgl.MapMouseEvent) => {
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

         // Create markdown in backend first to get the real ID
         dispatch(setLoading(true));
         try {
            const createResponse = await markdownAPI.createMarkdown({
               title: `Memory at ${new Date().toLocaleString()}`,
               coordinates: [lngLat.lng, lngLat.lat], // [lng, lat] formatında gönderiyoruz
            });

            const markdownId = createResponse.markdownId;

            // Create marker element
            const markerElement = document.createElement('div');
            markerElement.className = 'marker';

            // Create SVG element
            const img = document.createElement('img');
            img.src = LocationMarker;
            // Boyut artık CSS'ten kontrol ediliyor
            markerElement.appendChild(img);

            // Add click handler to marker element with the real markdown ID
            markerElement.addEventListener('click', async (e) => {
               e.stopPropagation(); // Prevent map click
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

            // Add marker to map with fixed position
            const marker = new mapboxgl.Marker({
               element: markerElement,
               anchor: 'bottom',
               draggable: false,
            })
               .setLngLat([lngLat.lng, lngLat.lat])
               .addTo(mapInstanceRef.current);

            // Store marker reference with the real markdown ID
            markersRef.current[markdownId] = marker;

            // Get markdown details and update store
            const markdownDetails =
               await markdownAPI.getSingleMarkdown(markdownId);

            dispatch(
               addMarkdown({
                  ...markdownDetails,
                  createdAt: new Date(markdownDetails.createdAt),
                  updatedAt: new Date(markdownDetails.updatedAt),
               })
            );

            // Automatically open ViewMarkdownModal for the new markdown
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
            // No need to remove marker as it's created after successful API call
         }
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

   // Initialize map and load markdowns
   useEffect(() => {
      if (!mapContainerRef.current) return; // container yoksa çık
      if (mapInstanceRef.current) return; // map zaten oluşturulmuşsa çık

      const map = new mapboxgl.Map({
         container: mapContainerRef.current,
         config: {
            basemap: {
               lightPreset: 'night',
               showRoadLabels: false,
               font: 'Inter',
            },
         },

         zoom: 9,
      });

      // Map yüklendiğinde
      map.on('load', () => {
         // Map instance'ını ref'e kaydet
         mapInstanceRef.current = map;
      });

      // Style yüklendiğinde
      map.on('style.load', () => {});

      // Load existing markdowns
      const loadMarkdowns = async () => {
         dispatch(setLoading(true));
         try {
            const response = await markdownAPI.getAllMarkdowns();

            // Add markers for each markdown
            response.markdowns.forEach((markdown: MarkdownResponse) => {
               const markerId = markdown.markdownId;

               // Create marker element
               const markerElement = document.createElement('div');
               markerElement.className = 'marker';

               // Create SVG element
               const img = document.createElement('img');
               img.src = LocationMarker;
               img.className = 'w-6 h-6';
               markerElement.appendChild(img);

               // Add click handler to marker element
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

               // Add marker to map
               const marker = new mapboxgl.Marker({
                  element: markerElement,
                  anchor: 'bottom',
                  draggable: false,
               })
                  .setLngLat([markdown.geoLocation.x, markdown.geoLocation.y])
                  .addTo(map);

               // Store marker reference
               markersRef.current[markerId] = marker;
            });

            // Update Redux store
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

      // Load markdowns when map is initialized
      loadMarkdowns();

      // Cleanup function
      return () => {
         // Marker'ları temizle
         Object.values(markersRef.current).forEach((marker) => marker.remove());
         // Map'i temizle
         map.remove();
         // Ref'i temizle
         mapInstanceRef.current = null;
      };
   }, [dispatch]); // dispatch'i dependency array'e ekledik

   // Cursor type değiştiğinde map container'ın cursor'ını güncelle
   useEffect(() => {
      if (!mapContainerRef.current || !mapInstanceRef.current) return;

      // Önce tüm cursor class'larını kaldır
      mapContainerRef.current.classList.remove(
         'cursor-hand',
         'cursor-location',
         'cursor-default'
      );

      // Yeni cursor class'ını ekle
      mapContainerRef.current.classList.add(`cursor-${cursorType}`);

      // Mapbox canvas elementinin cursor'ını güncelle
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

   const handlePhotoSave = async (files: File[]) => {
      if (!activeMarkerId || !files.length) return;

      dispatch(setLoading(true));
      try {
         // Fotoğrafları yükle
         await markdownAPI.uploadMarkdownPhotos(activeMarkerId, files);

         // Güncel markdown'ı al
         const updatedMarkdown =
            await markdownAPI.getSingleMarkdown(activeMarkerId);

         // Redux store'u güncelle
         dispatch(
            updateMarkdown({
               ...updatedMarkdown,
               createdAt: new Date(updatedMarkdown.createdAt),
               updatedAt: new Date(updatedMarkdown.updatedAt),
            })
         );

         setIsPhotoModalOpen(false);
         setActiveMarkerId(null);
      } catch (error) {
         console.error('Error uploading photos:', error);
         dispatch(
            setError(
               error instanceof Error
                  ? error.message
                  : 'Failed to upload photos'
            )
         );
      }
   };

   const handleMemorySave = async (text: string) => {
      if (!activeMarkerId) return;

      dispatch(setLoading(true));
      try {
         await markdownAPI.createMarkdownNote({
            markdownId: activeMarkerId,
            text: text,
         });

         // Güncel markdown'ı al
         const updatedMarkdown =
            await markdownAPI.getSingleMarkdown(activeMarkerId);

         // Redux store'u güncelle
         dispatch(
            updateMarkdown({
               ...updatedMarkdown,
               createdAt: new Date(updatedMarkdown.createdAt),
               updatedAt: new Date(updatedMarkdown.updatedAt),
            })
         );

         setIsMemoryModalOpen(false);
         setActiveMarkerId(null);
      } catch (error) {
         console.error('Error saving note:', error);
         dispatch(
            setError(
               error instanceof Error ? error.message : 'Failed to save note'
            )
         );
      }
   };

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

         <PhotoModal
            isOpen={isPhotoModalOpen}
            onClose={() => {
               setIsPhotoModalOpen(false);
               setActiveMarkerId(null);
            }}
            onSave={handlePhotoSave}
            markerId={activeMarkerId || ''}
         />

         <MemoryModal
            isOpen={isMemoryModalOpen}
            onClose={() => {
               setIsMemoryModalOpen(false);
               setActiveMarkerId(null);
            }}
            onSave={handleMemorySave}
            markerId={activeMarkerId || ''}
         />

         <ViewMarkdownModal
            isOpen={isViewModalOpen}
            onClose={() => {
               setIsViewModalOpen(false);
               setActiveMarkerId(null);
            }}
            markdownId={activeMarkerId || ''}
            onAddPhoto={() => {
               setIsViewModalOpen(false);
               setIsPhotoModalOpen(true);
            }}
            onAddNote={() => {
               setIsViewModalOpen(false);
               setIsMemoryModalOpen(true);
            }}
         />
      </>
   );
};
