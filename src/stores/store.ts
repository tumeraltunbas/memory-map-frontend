import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import markdownsReducer from './slices/markdownsSlice';

export const store = configureStore({
   reducer: {
      user: userReducer,
      markdowns: markdownsReducer,
   },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
