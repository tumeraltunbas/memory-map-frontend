import api from './api';
import type {
   CreateMarkdownNoteRequest,
   CreateMarkdownRequest,
   UpdateMarkdownNoteRequest,
   UpdateMarkdownRequest,
} from '../types';

export const markdownAPI = {
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
