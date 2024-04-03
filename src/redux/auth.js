import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  uid: '',
};

export const authSlice = createSlice({
  name: 'authDetails',
  initialState,
  reducers: {
    saveAuthDetails: (state, action) => {
      state.uid = action.payload;
    },

    removeAuthDetails: state => {
      state.uid = '';
    },
  },
});

// Action creators are generated for each case reducer function
export const {saveAuthDetails, removeAuthDetails} = authSlice.actions;

export default authSlice.reducer;
