import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  refreshClassValue: true,
};

export const refreshClassSlice = createSlice({
  name: 'refreshClassDetails',
  initialState,
  reducers: {
    refreshClassDetailsFunc: state => {
      state.refreshClassValue = !state.refreshClassValue;
    },
  },
});

// Action creators are generated for each case reducer function
export const {refreshClassDetailsFunc} = refreshClassSlice.actions;

export default refreshClassSlice.reducer;
