import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  refreshNotesValue: true,
};

export const refreshNotesSlice = createSlice({
  name: 'refreshNotesDetails',
  initialState,
  reducers: {
    refreshNotesDetails: state => {
      state.refreshNotesValue = !state.refreshNotesValue;
    },
  },
});

// Action creators are generated for each case reducer function
export const {refreshNotesDetails} = refreshNotesSlice.actions;

export default refreshNotesSlice.reducer;
