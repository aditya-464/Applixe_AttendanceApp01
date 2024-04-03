import {configureStore} from '@reduxjs/toolkit';
import authReducer from './auth.js';
import refreshHomeReducer from './refreshHomeScreen.js';
import refreshClassReducer from './refreshViewClassScreen.js';
import refreshTotalAttendanceReducer from './refreshTotalAttendance.js';
import refreshNotesReducer from './refreshNotesScreen.js';

export const store = configureStore({
  reducer: {
    authDetails: authReducer,
    refreshHomeDetails: refreshHomeReducer,
    refreshClassDetails: refreshClassReducer,
    refreshTotalAttendanceDetails: refreshTotalAttendanceReducer,
    refreshNotesDetails: refreshNotesReducer,
  },
});
