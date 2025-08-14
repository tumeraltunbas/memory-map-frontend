import { useEffect, useRef, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import mapboxgl, { Map as MapboxMap } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import type { MapLocation } from '../MapHeader';
import { useCursor } from '../../contexts/CursorContext';
import type { MarkdownResponse } from '../../types';
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
import type { Feature, FeatureCollection, Point } from 'geojson';

mapboxgl.accessToken = import.meta.env.VITE_MAP_BOX_ACCESS_KEY || '';

interface MapProps {
   targetLocation: MapLocation | null;
   onLoadingChange?: (loading: boolean) => void;
}

export const Map = ({ targetLocation, onLoadingChange }: MapProps) => {
   const dispatch = useDispatch();
   const { cursorType } = useCursor();

   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
   const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);
   const [geoJsonData, setGeoJsonData] = useState<FeatureCollection<Point>>({
      type: 'FeatureCollection',
      features: [],
   });
   const geoJsonDataRef = useRef<FeatureCollection<Point>>({
      type: 'FeatureCollection',
      features: [],
   });

   const mapContainerRef = useRef<HTMLDivElement>(null);
   const mapInstanceRef = useRef<MapboxMap | null>(null);

   useEffect(() => {
      geoJsonDataRef.current = geoJsonData;
   }, [geoJsonData]);

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

         // Skip proximity duplicate creation (client-side) to reduce noise
         const existingMarker = Object.values(markersRef.current).find(
            (marker) => isNearby(marker.getLngLat(), lngLat)
         );
         if (existingMarker) return;

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
                  setIsViewModalOpen(true);
                  setActiveMarkerId(markdownId);
                  const markdownDetails =
                     await markdownAPI.getSingleMarkdown(markdownId);
                  dispatch(
                     addMarkdown({
                        ...markdownDetails,
                        createdAt: new Date(markdownDetails.createdAt),
                        updatedAt: new Date(markdownDetails.updatedAt),
                     })
                  );
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

            setIsViewModalOpen(true);
            setActiveMarkerId(markdownId);
            const markdownDetails =
               await markdownAPI.getSingleMarkdown(markdownId);

            dispatch(
               addMarkdown({
                  ...markdownDetails,
                  createdAt: new Date(markdownDetails.createdAt),
                  updatedAt: new Date(markdownDetails.updatedAt),
               })
            );

            // modal already open; content will render once data arrives
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

         if (!map.getSource('markdowns')) {
            map.addSource('markdowns', {
               type: 'geojson',
               data: geoJsonDataRef.current,
            });

            // Fallback circle layer for immediate visibility
            if (!map.getLayer('markdowns-circle')) {
               map.addLayer({
                  id: 'markdowns-circle',
                  type: 'circle',
                  source: 'markdowns',
                  paint: {
                     'circle-radius': 6,
                     'circle-color': '#9E7B9B',
                     'circle-stroke-color': '#FFFFFF',
                     'circle-stroke-width': 1.5,
                  },
               });
            }

            // Ensure custom icon is registered
            if (!map.hasImage('markdown-icon')) {
               const img = new Image(24, 24);
               img.crossOrigin = 'anonymous';
               img.onload = () => {
                  if (!map.hasImage('markdown-icon')) {
                     map.addImage('markdown-icon', img as any);
                  }
                  if (!map.getLayer('markdowns-layer')) {
                     map.addLayer({
                        id: 'markdowns-layer',
                        type: 'symbol',
                        source: 'markdowns',
                        layout: {
                           'icon-image': 'markdown-icon',
                           'icon-size': 1,
                           'icon-allow-overlap': true,
                        },
                     });
                  }
                  if (map.getLayer('markdowns-circle')) {
                     map.removeLayer('markdowns-circle');
                  }
               };
               img.src = LocationMarker as unknown as string;
            } else {
               if (!map.getLayer('markdowns-layer')) {
                  map.addLayer({
                     id: 'markdowns-layer',
                     type: 'symbol',
                     source: 'markdowns',
                     layout: {
                        'icon-image': 'markdown-icon',
                        'icon-size': 1,
                        'icon-allow-overlap': true,
                     },
                  });
               }
               if (map.getLayer('markdowns-circle')) {
                  map.removeLayer('markdowns-circle');
               }
            }

            const handleClick = async (e: any) => {
               const feature = e.features && e.features[0];
               const id = feature && (feature.properties as any)?.markdownId;
               if (!id) return;
               try {
                  setIsViewModalOpen(true);
                  setActiveMarkerId(id);
                  const markdownDetails =
                     await markdownAPI.getSingleMarkdown(id);
                  dispatch(
                     addMarkdown({
                        ...markdownDetails,
                        createdAt: new Date(markdownDetails.createdAt),
                        updatedAt: new Date(markdownDetails.updatedAt),
                     })
                  );
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
            };
            map.on('click', 'markdowns-layer', handleClick);
            map.on('click', 'markdowns-circle', handleClick);

            // Add cursor change on hover
            map.on('mouseenter', 'markdowns-layer', () => {
               map.getCanvas().style.cursor = 'pointer';
            });
            map.on('mouseleave', 'markdowns-layer', () => {
               map.getCanvas().style.cursor =
                  cursorType === 'hand'
                     ? 'grab'
                     : cursorType === 'location'
                       ? 'none'
                       : 'default';
            });
            map.on('mouseenter', 'markdowns-circle', () => {
               map.getCanvas().style.cursor = 'pointer';
            });
            map.on('mouseleave', 'markdowns-circle', () => {
               map.getCanvas().style.cursor =
                  cursorType === 'hand'
                     ? 'grab'
                     : cursorType === 'location'
                       ? 'none'
                       : 'default';
            });
         }
      });

      map.on('style.load', () => {
         // Some basemap configs reload style; ensure our source/layer exists
         if (!map.getSource('markdowns')) {
            map.addSource('markdowns', {
               type: 'geojson',
               data: geoJsonDataRef.current,
            });

            // Fallback circle layer for immediate visibility
            if (!map.getLayer('markdowns-circle')) {
               map.addLayer({
                  id: 'markdowns-circle',
                  type: 'circle',
                  source: 'markdowns',
                  paint: {
                     'circle-radius': 6,
                     'circle-color': '#9E7B9B',
                     'circle-stroke-color': '#FFFFFF',
                     'circle-stroke-width': 1.5,
                  },
               });
            }

            // Re-register icon after style reload
            if (!map.hasImage('markdown-icon')) {
               const img = new Image(24, 24);
               img.crossOrigin = 'anonymous';
               img.onload = () => {
                  if (!map.hasImage('markdown-icon')) {
                     map.addImage('markdown-icon', img as any);
                  }
                  if (!map.getLayer('markdowns-layer')) {
                     map.addLayer({
                        id: 'markdowns-layer',
                        type: 'symbol',
                        source: 'markdowns',
                        layout: {
                           'icon-image': 'markdown-icon',
                           'icon-size': 1,
                           'icon-allow-overlap': true,
                        },
                     });
                  }
                  if (map.getLayer('markdowns-circle')) {
                     map.removeLayer('markdowns-circle');
                  }
               };
               img.src = LocationMarker as unknown as string;
            } else {
               if (!map.getLayer('markdowns-layer')) {
                  map.addLayer({
                     id: 'markdowns-layer',
                     type: 'symbol',
                     source: 'markdowns',
                     layout: {
                        'icon-image': 'markdown-icon',
                        'icon-size': 1,
                        'icon-allow-overlap': true,
                     },
                  });
               }
               if (map.getLayer('markdowns-circle')) {
                  map.removeLayer('markdowns-circle');
               }
            }

            const src = map.getSource('markdowns') as
               | mapboxgl.GeoJSONSource
               | undefined;
            if (src) src.setData(geoJsonDataRef.current as any);

            const handleClick = async (e: any) => {
               const feature = e.features && e.features[0];
               const id = feature && (feature.properties as any)?.markdownId;
               if (!id) return;
               try {
                  setIsViewModalOpen(true);
                  setActiveMarkerId(id);
                  const markdownDetails =
                     await markdownAPI.getSingleMarkdown(id);
                  dispatch(
                     addMarkdown({
                        ...markdownDetails,
                        createdAt: new Date(markdownDetails.createdAt),
                        updatedAt: new Date(markdownDetails.updatedAt),
                     })
                  );
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
            };
            map.on('click', 'markdowns-layer', handleClick);
            map.on('click', 'markdowns-circle', handleClick);

            // Add cursor change on hover
            map.on('mouseenter', 'markdowns-layer', () => {
               map.getCanvas().style.cursor = 'pointer';
            });
            map.on('mouseleave', 'markdowns-layer', () => {
               map.getCanvas().style.cursor =
                  cursorType === 'hand'
                     ? 'grab'
                     : cursorType === 'location'
                       ? 'none'
                       : 'default';
            });
            map.on('mouseenter', 'markdowns-circle', () => {
               map.getCanvas().style.cursor = 'pointer';
            });
            map.on('mouseleave', 'markdowns-circle', () => {
               map.getCanvas().style.cursor =
                  cursorType === 'hand'
                     ? 'grab'
                     : cursorType === 'location'
                       ? 'none'
                       : 'default';
            });
         } else {
            const src = map.getSource('markdowns') as
               | mapboxgl.GeoJSONSource
               | undefined;
            if (src) src.setData(geoJsonDataRef.current as any);
         }
      });

      const loadMarkdowns = async () => {
         dispatch(setLoading(true));
         onLoadingChange?.(true);
         try {
            const response = await markdownAPI.getAllMarkdowns();
            const features: Feature<Point>[] = response.markdowns.map(
               (markdown: MarkdownResponse) => ({
                  type: 'Feature',
                  geometry: {
                     type: 'Point',
                     coordinates: [
                        markdown.geoLocation.x,
                        markdown.geoLocation.y,
                     ],
                  },
                  properties: { markdownId: markdown.markdownId },
               })
            );
            const collection: FeatureCollection<Point> = {
               type: 'FeatureCollection',
               features,
            };
            setGeoJsonData(collection);
            // Also push directly to map source if available now
            // If map source already exists, update immediately; otherwise, rely on refs on style/load
            const src = map.getSource('markdowns') as
               | mapboxgl.GeoJSONSource
               | undefined;
            if (src) src.setData(collection as any);
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
         } finally {
            onLoadingChange?.(false);
         }
      };

      loadMarkdowns();

      return () => {
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
                 ? 'none'
                 : 'default';
      }
   }, [cursorType]);

   // Keep map source synced when geoJsonData changes
   useEffect(() => {
      const map = mapInstanceRef.current;
      if (!map) return;
      const src = map.getSource('markdowns') as
         | mapboxgl.GeoJSONSource
         | undefined;
      if (src) {
         src.setData(geoJsonData as any);
      }
   }, [geoJsonData]);

   return (
      <>
         <div
            ref={mapContainerRef}
            className={`h-screen w-screen cursor-${cursorType}`}
            data-cursor-scope="map"
            style={{
               position: 'fixed',
               top: 0,
               left: 0,
               right: 0,
               bottom: 0,
               overflow: 'hidden',
               cursor: `${cursorType === 'hand' ? 'grab' : cursorType === 'location' ? 'none' : 'default'} !important`,
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

               // Marker'ı haritadan kaldır
               const marker = markersRef.current[activeMarkerId];
               if (marker) {
                  marker.remove(); // Haritadan kaldır
                  delete markersRef.current[activeMarkerId]; // Referansı temizle
               }

               // GeoJSON'dan kaldır
               setGeoJsonData((prev) => ({
                  type: 'FeatureCollection',
                  features: prev.features.filter(
                     (f) => (f.properties as any)?.markdownId !== activeMarkerId
                  ),
               }));

               // Modalı kapat
               setIsViewModalOpen(false);
               setActiveMarkerId(null);
            }}
         />
      </>
   );
};
