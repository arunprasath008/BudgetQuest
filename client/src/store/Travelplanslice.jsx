import { createSlice } from '@reduxjs/toolkit';

const travelPlanSlice = createSlice({
  name: 'travelPlan',
  initialState: {
    plan: null,
  },
  reducers: {
    setTravelPlan: (state, action) => {
      state.plan = action.payload;
    },
    clearTravelPlan: (state) => {
      state.plan = null;
    },
  },
});

export const { setTravelPlan, clearTravelPlan } = travelPlanSlice.actions;
export default travelPlanSlice.reducer;




















// import { createSlice } from '@reduxjs/toolkit';

// const travelPlanSlice = createSlice({
//   name: 'travelPlan',
//   initialState: {
//     plan: {
//       tripName: '', // Default value to avoid undefined errors
//       duration: '',
//       budget: '',
//       bestTimetoVisit: '',
//       days: [],
//     },
//   },
//   reducers: {
//     setTravelPlan: (state, action) => {
//       state.plan = action.payload;
//     },
//     clearTravelPlan: (state) => {
//       state.plan = {
//         tripName: '',
//         duration: '',
//         budget: '',
//         bestTimetoVisit: '',
//         days: [],
//       };
//     },
//   },
// });

// export const { setTravelPlan, clearTravelPlan } = travelPlanSlice.actions;
// export default travelPlanSlice.reducer;
