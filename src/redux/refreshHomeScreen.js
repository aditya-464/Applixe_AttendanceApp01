import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  refreshHomeValue: true,
};

export const refreshHomeSlice = createSlice({
  name: 'refreshHomeDetails',
  initialState,
  reducers: {
    refreshDetails: state => {
      state.refreshHomeValue = !state.refreshHomeValue;
    },
  },
});

// Action creators are generated for each case reducer function
export const {refreshDetails} = refreshHomeSlice.actions;

export default refreshHomeSlice.reducer;
