import { toast } from 'react-toastify';
import type {
   MapboxSearchResponse,
   RetrieveResponse,
   SearchSuggestion,
} from '../types';

export const mapboxSearchAPI = {
   retrieve: async (
      mapboxId: string,
      sessionToken: string
   ): Promise<[number, number]> => {
      const accessToken = import.meta.env.VITE_MAP_BOX_ACCESS_KEY;
      const endpoint = `https://api.mapbox.com/search/searchbox/v1/retrieve/${mapboxId}`;

      try {
         const response = await fetch(
            `${endpoint}?session_token=${sessionToken}&access_token=${accessToken}`
         );

         if (!response.ok) {
            throw new Error('Retrieve request failed');
         }

         const data: RetrieveResponse = await response.json();
         if (data.features.length > 0) {
            const feature = data.features[0];
            if (feature.geometry?.coordinates) {
               return feature.geometry.coordinates;
            }
         }
         throw new Error('No coordinates found');
      } catch (error) {
         if (!(error instanceof Error && error.name === 'AbortError')) {
            toast.error(
               error instanceof Error
                  ? error.message
                  : 'Failed to retrieve location details'
            );
         }
         throw error;
      }
   },

   suggest: async (
      query: string,
      sessionToken: string,
      signal?: AbortSignal
   ): Promise<SearchSuggestion[]> => {
      const accessToken = import.meta.env.VITE_MAP_BOX_ACCESS_KEY;
      const endpoint = `https://api.mapbox.com/search/searchbox/v1/suggest`;

      try {
         const response = await fetch(
            `${endpoint}?q=${encodeURIComponent(query)}&access_token=${accessToken}&session_token=${sessionToken}`,
            { signal }
         );

         if (!response.ok) {
            throw new Error('Search request failed');
         }

         const data: MapboxSearchResponse = await response.json();
         return data.suggestions;
      } catch (error) {
         if (error instanceof Error && error.name === 'AbortError') {
            return [];
         }
         toast.error(
            error instanceof Error ? error.message : 'Search request failed'
         );
         throw error;
      }
   },
};
