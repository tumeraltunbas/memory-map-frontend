import { createSlice } from '@reduxjs/toolkit';
import { SliceNames } from '../../constants/enums';

const initialState = {
   user: {
      id: '',
      email: '',
      isActive: false,
      createdAt: null,
      updateAt: null,
      markdowns: [],
   },
   isAuthenticated: false,
};

const userSlice = createSlice({
   name: SliceNames.USER,
   initialState: initialState,
   reducers: {
      login(state, action) {
         state.user = { ...action.payload };
         state.isAuthenticated = true;
      },
      logout(state) {
         state.user = { ...initialState.user };
         state.isAuthenticated = false;
      },
   },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
