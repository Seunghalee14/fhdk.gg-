import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { createWrapper } from "next-redux-wrapper";
import rootReducer from "./reducers";
// import localForage from 'localForage';

// const persistConfig = {
//   key: 'root',
//   version: 1,
//   storage: localForage,
//   whitelist: [''],
//   // storage,
//   // NOTE: blacklist any api(s) that have been configured with RTK Query
//   blacklist: ['api'],
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = (context) =>
  configureStore({
    // reducer: persistedReducer,
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => [
      ...getDefaultMiddleware({
        serializableCheck: false,
      }),
    ],
  });

// declare global {
//   interface Window {
//     store: typeof store;
//   }
// }

// export const persistor = persistStore(store);

// export default persistor;
export default store;

export const AppDispatch = typeof store.dispatch;
// export const RootState = ReturnType<typeof store.getState>;
export const ReduxStore = typeof store;
// export const AppThunk = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

export const reduxWrapper = createWrapper(store, {
  debug: process.env.NODE_ENV !== "production",
});
