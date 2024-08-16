import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./reducer/auth";
import userReducer from "./reducer/user";
import orderReducer from './reducer/order';

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
};

// Combine reducers
const reducers = combineReducers({
  auth: authReducer,
  user: userReducer,
  order: orderReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, reducers);

// Configure store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // `ignoreActions` should be an array of action types to ignore
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Define types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
