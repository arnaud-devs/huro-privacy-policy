import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';

import batchesReducer from './slices/batchesSlice';
import cartReducer from './slices/cartSlice';
import categoriesReducer from './slices/categoriesSlice';
import deliveryZonesReducer from './slices/deliveryZonesSlice';
import gatesReducer from './slices/gatesSlice';
import ordersReducer from './slices/ordersSlice';
import productsReducer from './slices/productsSlice';
import riderReducer from './slices/riderSlice';
import userReducer from './slices/userSlice';
import marketplaceReducer from './slices/marketplaceSlice';
import messagingReducer from './slices/messagingSlice';

// Only persist the fields needed to resume a delivery session
const riderPersistConfig = {
  key: 'rider',
  storage: AsyncStorage,
  whitelist: ['deliveryPhase', 'claimedOrderIds', 'currentBatchId', 'deliveredOrderIds', 'pickedUpOrderIds', 'orderDetailsMap'],
};

const persistedRiderReducer = persistReducer(riderPersistConfig, riderReducer);

export const store = configureStore({
  reducer: {
    user: userReducer,
    categories: categoriesReducer,
    products: productsReducer,
    cart: cartReducer,
    batches: batchesReducer,
    deliveryZones: deliveryZonesReducer,
    orders: ordersReducer,
    gates: gatesReducer,
    rider: persistedRiderReducer,
    marketplace: marketplaceReducer,
    messaging: messagingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
