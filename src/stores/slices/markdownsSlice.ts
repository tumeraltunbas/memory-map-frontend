import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { SliceNames } from '../../constants/enums';
import type { Markdown } from '../../types';

interface MarkdownsState {
   markdowns: Markdown[];
   selectedMarkdownId: string | null;
   loading: boolean;
   error: string | null;
}

const initialState: MarkdownsState = {
   markdowns: [],
   selectedMarkdownId: null,
   loading: false,
   error: null,
};

const markdownsSlice = createSlice({
   name: SliceNames.MARKDOWN,
   initialState,
   reducers: {
      setLoading: (state, action: PayloadAction<boolean>) => {
         state.loading = action.payload;
         state.error = null;
      },
      setError: (state, action: PayloadAction<string>) => {
         state.loading = false;
         state.error = action.payload;
      },
      setMarkdowns: (state, action: PayloadAction<Markdown[]>) => {
         state.markdowns = action.payload;
         state.loading = false;
         state.error = null;
      },
      addMarkdown: (state, action: PayloadAction<Markdown>) => {
         state.markdowns.push(action.payload);
         state.loading = false;
         state.error = null;
      },
      updateMarkdown: (state, action: PayloadAction<Markdown>) => {
         const index = state.markdowns.findIndex(
            (m) => m.markdownId === action.payload.markdownId
         );
         if (index !== -1) {
            state.markdowns[index] = action.payload;
         }
         state.loading = false;
         state.error = null;
      },
      removeMarkdown: (state, action: PayloadAction<string>) => {
         state.markdowns = state.markdowns.filter(
            (markdown) => markdown.markdownId !== action.payload
         );
         if (state.selectedMarkdownId === action.payload) {
            state.selectedMarkdownId = null;
         }
         state.loading = false;
         state.error = null;
      },
      setSelectedMarkdown: (state, action: PayloadAction<string | null>) => {
         state.selectedMarkdownId = action.payload;
      },
      addNote: (
         state,
         action: PayloadAction<{ markdownId: string; note: string }>
      ) => {
         const markdown = state.markdowns.find(
            (m) => m.markdownId === action.payload.markdownId
         );
         if (markdown) {
            markdown.notes.push(action.payload.note);
         }
      },
      updateNote: (
         state,
         action: PayloadAction<{
            markdownId: string;
            noteIndex: number;
            note: string;
         }>
      ) => {
         const markdown = state.markdowns.find(
            (m) => m.markdownId === action.payload.markdownId
         );
         if (markdown && markdown.notes[action.payload.noteIndex]) {
            markdown.notes[action.payload.noteIndex] = action.payload.note;
         }
      },
      removeNote: (
         state,
         action: PayloadAction<{ markdownId: string; noteIndex: number }>
      ) => {
         const markdown = state.markdowns.find(
            (m) => m.markdownId === action.payload.markdownId
         );
         if (markdown) {
            markdown.notes.splice(action.payload.noteIndex, 1);
         }
      },
      addPhoto: (
         state,
         action: PayloadAction<{ markdownId: string; photoUrl: string }>
      ) => {
         const markdown = state.markdowns.find(
            (m) => m.markdownId === action.payload.markdownId
         );
         if (markdown) {
            markdown.photos.push(action.payload.photoUrl);
         }
      },
      removePhoto: (
         state,
         action: PayloadAction<{ markdownId: string; photoUrl: string }>
      ) => {
         const markdown = state.markdowns.find(
            (m) => m.markdownId === action.payload.markdownId
         );
         if (markdown) {
            markdown.photos = markdown.photos.filter(
               (p) => p !== action.payload.photoUrl
            );
         }
      },
      clearMarkdowns: (state) => {
         state.markdowns = [];
         state.selectedMarkdownId = null;
         state.loading = false;
         state.error = null;
      },
   },
});

export const {
   setLoading,
   setError,
   setMarkdowns,
   addMarkdown,
   updateMarkdown,
   removeMarkdown,
   setSelectedMarkdown,
   addNote,
   updateNote,
   removeNote,
   addPhoto,
   removePhoto,
   clearMarkdowns,
} = markdownsSlice.actions;

export default markdownsSlice.reducer;
