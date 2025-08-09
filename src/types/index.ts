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

