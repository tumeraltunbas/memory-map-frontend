import { createSlice } from '@reduxjs/toolkit';
import { SliceNames } from '../../constants/enums';
import type { User } from '../../types';

interface UserState {
   user: User;
   isAuthenticated: boolean;
   isLoading: boolean;
}

const initialState: UserState = {
   user: {
      userId: '',
      email: '',
      isActive: false,
      createdAt: '',
      updatedAt: '',
      markdowns: [],
   },
   isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
   isLoading: false,
};

const userSlice = createSlice({
   name: SliceNames.USER,
   initialState: initialState,
   reducers: {
      setUser(state, action) {
         state.user = { ...action.payload };
         state.isAuthenticated = true;
         state.isLoading = false;
         localStorage.setItem('isAuthenticated', 'true');
      },
      setLoading(state, action) {
         state.isLoading = action.payload;
      },
      logout(state) {
         state.user = { ...initialState.user };
         state.isAuthenticated = false;
         state.isLoading = false;
      },
   },
});

export const { setUser, setLoading, logout } = userSlice.actions;
export default userSlice.reducer;
