import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import categoriesReducer from './slices/categoriesSlice';
import productsReducer from './slices/productsSlice';
import cartReducer from './slices/cartSlice';
import batchesReducer from './slices/batchesSlice';
import deliveryZonesReducer from './slices/deliveryZonesSlice';
import ordersReducer from './slices/ordersSlice';
import gatesReducer from './slices/gatesSlice';
import riderReducer from './slices/riderSlice';

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
    rider: riderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
