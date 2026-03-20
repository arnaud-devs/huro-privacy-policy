import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import categoriesReducer from './slices/categoriesSlice';
import productsReducer from './slices/productsSlice';
import cartReducer from './slices/cartSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    categories: categoriesReducer,
    products: productsReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
