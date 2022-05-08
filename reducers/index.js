import { combineReducers } from "@reduxjs/toolkit";
import loaReducer from "features/loa/loaSlice";
// import localForage from 'localforage';

const rootReducer = combineReducers({
  loa: loaReducer,
  //   [createAPI.reducerPath]: createAPI.reducer,
});

// used for caching, invalidation, polling, ...
// export const { middleware } = createAPI;

export default rootReducer;
