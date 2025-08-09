import { toast } from 'react-toastify';
interface SearchSuggestion {
   name: string;
   mapbox_id: string;
   feature_type: string;
   address?: string;
   full_address?: string;
   place_formatted: string;
   context?: {
      country?: {
         name?: string;
         country_code?: string;
         country_code_alpha_3?: string;
      };
      region?: {
         name?: string;
         region_code?: string;
      };
      place?: {
         name?: string;
      };
      postcode?: {
         name?: string;
      };
      street?: {
         name?: string;
      };
   };
   language: string;
   maki: string;
   poi_category?: string[];
   distance: number;
   coordinates?: {
      longitude: number;
      latitude: number;
   };
}

interface MapboxSearchResponse {
   suggestions: SearchSuggestion[];
}

interface RetrieveResponse {
   type: string;
   features: Array<{
      type: string;
      geometry: {
         coordinates: [number, number]; // [longitude, latitude]
         type: string;
      };
      properties: {
         name: string;
         mapbox_id: string;
         coordinates: {
            latitude: number;
            longitude: number;
         };
      };
   }>;
}

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
               // Mapbox coordinates are in [longitude, latitude] format
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
            // İstek iptal edildi, normal bir durum
            return [];
         }
         toast.error(
            error instanceof Error ? error.message : 'Search request failed'
         );
         throw error;
      }
   },
};
