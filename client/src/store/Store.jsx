
// import { configureStore } from '@reduxjs/toolkit';
// import travelPlanReducer from './Travelplanslice';

// const store = configureStore({
//   reducer: {
//     travelPlan: travelPlanReducer,
//   },
// });

// export default store;


// src/redux/store.js
import { createStore } from 'redux';
import { emailReducer } from './emailSlice';

const store = createStore(emailReducer);

export default store;
