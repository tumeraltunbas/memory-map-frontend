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
};

const userSlice = createSlice({
   name: SliceNames.USER,
   initialState: initialState,
   reducers: {
      login(state, action) {
         //TODO: Example reducer function
         state.user = { ...action.payload };
      },
   },
});

const { login } = userSlice.actions;
export default userSlice.reducer;
