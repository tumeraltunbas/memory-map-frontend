import api from './api';

export interface GeoLocation {
   x: number;
   y: number;
}

export interface MarkdownResponse {
   markdownId: string;
   title: string;
   geoLocation: GeoLocation;
   photos: { id: string; url: string }[]; // S3 presigned URLs
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

export const markdownAPI = {
   // Markdown endpoints
   createMarkdown: async (data: CreateMarkdownRequest) => {
      const response = await api.post('/markdowns', data);
      return response.data;
   },

   getAllMarkdowns: async () => {
      const response = await api.get('/markdowns');
      return response.data;
   },

   deleteMarkdown: async (markdownId: string) => {
      await api.delete(`/markdowns/${markdownId}`);
   },

   getSingleMarkdown: async (markdownId: string) => {
      const response = await api.get(`/markdowns/${markdownId}`);
      return response.data;
   },

   updateMarkdown: async (markdownId: string, data: UpdateMarkdownRequest) => {
      await api.patch(`/markdowns/${markdownId}`, data);
   },

   // Markdown Note endpoints
   createMarkdownNote: async (data: CreateMarkdownNoteRequest) => {
      const response = await api.post('/markdown-notes', data);
      return response.data;
   },

   updateMarkdownNote: async (
      noteId: string,
      data: UpdateMarkdownNoteRequest
   ) => {
      await api.patch(`/markdown-notes/${noteId}`, data);
   },

   deleteMarkdownNote: async (markdownId: string, noteId: string) => {
      await api.post(`/markdown-notes/${noteId}/delete`, {
         markdownId,
      });
   },

   // Markdown Photo endpoints
   uploadMarkdownPhotos: async (markdownId: string, files: File[]) => {
      const formData = new FormData();
      formData.append('markdownId', markdownId);
      files.forEach((file) => {
         formData.append('files', file);
      });

      await api.post('/markdown-photos', formData, {
         headers: {
            'Content-Type': 'multipart/form-data',
         },
      });
   },

   deleteMarkdownPhoto: async (markdownId: string, photoId: string) => {
      await api.post(`/markdown-photos/${photoId}/delete`, {
         markdownId,
      });
   },
};
