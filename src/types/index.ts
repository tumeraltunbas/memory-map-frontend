export interface Markdown {
   id: string;
   content: string;
   photos: string[];
   createdAt: string;
   updatedAt: string;
}

export interface User {
   userId: string;
   email: string;
   isActive: boolean;
   createdAt: string;
   updatedAt: string;
   markdowns: Markdown[];
}
