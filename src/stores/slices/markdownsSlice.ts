import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { SliceNames } from '../../constants/enums';

export interface Markdown {
   id: string;
   latitude: number;
   longitude: number;
   createdAt: string;
   content?: string;
   photos?: string[];
}

interface MarkdownsState {
   markdowns: Markdown[];
   selectedMarkdownId: string | null;
}

const initialState: MarkdownsState = {
   markdowns: [],
   selectedMarkdownId: null,
};

const markdownsSlice = createSlice({
   name: SliceNames.MARKDOWN,
   initialState,
   reducers: {
      addMarkdown: (state, action: PayloadAction<Markdown>) => {
         state.markdowns.push(action.payload);
      },
      removeMarkdown: (state, action: PayloadAction<string>) => {
         state.markdowns = state.markdowns.filter(
            (markdown) => markdown.id !== action.payload
         );
      },
      setSelectedMarkdown: (state, action: PayloadAction<string | null>) => {
         state.selectedMarkdownId = action.payload;
      },
      clearMarkdowns: (state) => {
         state.markdowns = [];
         state.selectedMarkdownId = null;
      },
   },
});

export const {
   addMarkdown,
   removeMarkdown,
   setSelectedMarkdown,
   clearMarkdowns,
} = markdownsSlice.actions;
export default markdownsSlice.reducer;
