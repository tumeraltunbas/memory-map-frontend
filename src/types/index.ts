export interface GeoLocation {
   x: number;
   y: number;
}

export interface Markdown {
   markdownId: string;
   title: string;
   geoLocation: GeoLocation;
   photos: string[];
   notes: string[];
   createdAt: Date;
   updatedAt: Date;
}

export interface MarkdownNote {
   markdownNoteId: string;
   text: string;
   markdownId: string;
}

export interface MarkdownPhoto {
   markdownPhotoId: string;
   url: string;
   markdownId: string;
}

export interface User {
   userId: string;
   email: string;
   isActive: boolean;
   createdAt: string;
   updatedAt: string;
   markdowns: Markdown[];
}

// Auth API types
export type UserProfileResponse = {
   user: {
      userId: string;
      email: string;
      createdAt: Date;
   };
   totalMarkdownCount: number;
   totalCountryCount: number;
   totalCityCount: number;
};

// Markdown API types
export interface MarkdownResponse {
   markdownId: string;
   title: string;
   geoLocation: GeoLocation;
   photos: { id: string; url: string }[];
   notes: { id: string; text: string }[];
   createdAt: string;
   updatedAt: string;
}

export interface GetMarkdownsResponse {
   markdowns: MarkdownResponse[];
}

export interface CreateMarkdownRequest {
   title: string;
   coordinates: [number, number];
}

export interface UpdateMarkdownRequest {
   title: string;
}

export interface CreateMarkdownNoteRequest {
   markdownId: string;
   text: string;
}

export interface UpdateMarkdownNoteRequest {
   markdownId: string;
   text: string;
}

// Mapbox Search API types
export interface SearchSuggestion {
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

export interface MapboxSearchResponse {
   suggestions: SearchSuggestion[];
}

export interface RetrieveResponse {
   type: string;
   features: Array<{
      type: string;
      geometry: {
         coordinates: [number, number];
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
