import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  refreshTotalAttendanceValue: true,
};

export const refreshTotalAttendanceSlice = createSlice({
  name: 'refreshTotalAttendanceDetails',
  initialState,
  reducers: {
    refreshTotalAttendanceFunc: state => {
      state.refreshTotalAttendanceValue = !state.refreshTotalAttendanceValue;
    },
  },
});

// Action creators are generated for each case reducer function
export const {refreshTotalAttendanceFunc} = refreshTotalAttendanceSlice.actions;

export default refreshTotalAttendanceSlice.reducer;
