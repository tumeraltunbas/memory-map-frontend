import { createSlice } from '@reduxjs/toolkit';
import { SliceNames } from '../../constants/enums';
import type { User } from '../../types';

interface UserState {
   user: User;
   isAuthenticated: boolean;
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
};

const userSlice = createSlice({
   name: SliceNames.USER,
   initialState: initialState,
   reducers: {
      setUser(state, action) {
         state.user = { ...action.payload };
         state.isAuthenticated = true;
         localStorage.setItem('isAuthenticated', 'true');
      },
      logout(state) {
         state.user = { ...initialState.user };
         state.isAuthenticated = false;
      },
   },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
