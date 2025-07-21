// src/slices/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  subcategory_id: string;
  subcategory_name: string;
  [key: string]: any; // for other optional fields like image, volume, etc.
}

interface CartState {
  items: Product[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const {
        id,
        name,
        price,
        quantity,
        subcategory_id,
        subcategory_name,
        ...rest
      } = action.payload;

      const existingIndex = state.items.findIndex(item => item.id === id);

      if (existingIndex >= 0) {
        // If product already exists in cart, increase quantity
        state.items[existingIndex].quantity += quantity;
      } else {
        // Add item with all relevant fields
        state.items.push({
          id,
          name,
          price,
          quantity,
          subcategory_id,
          subcategory_name,
          ...rest,
        });
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },

    clearCart: (state) => {
      state.items = [];
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
  },
});

export const selectCartItems = (state: RootState) => state.cart.items;

export const {
  addToCart,
  removeFromCart,
  clearCart,
  updateQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;
