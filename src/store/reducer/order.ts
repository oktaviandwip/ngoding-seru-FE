// src/store/slices/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CartItem = {
  Id: string;
  Product_id: string;
  User_id: string | undefined;
  Quantity: number;
  Size: string;
  Name: string;
  Slug: string;
  Description: string;
  Price: number;
  Image: string;
  Stock: number;
  Created_at: string;
  Updated_at: string | null;
};

interface CartState {
  items: CartItem[];
  selectedItems: CartItem[];
}

const initialState: CartState = {
  items: [],
  selectedItems: [],
};

const cartSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setCart(state, action) {
      state.items = action.payload;
    },
    addItemToCart(state, action: PayloadAction<CartItem>) {
      state.items.push(action.payload);
    },
    updateItemInCart(state, action: PayloadAction<CartItem>) {
      const index = state.items.findIndex(
        (item) => item.Product_id === action.payload.Product_id && item.Size === action.payload.Size
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    removeItemFromCart(state, action: PayloadAction<{ Product_id: string; Size: string }>) {
      state.items = state.items.filter(
        item => !(item.Product_id === action.payload.Product_id && item.Size === action.payload.Size)
      );
    },
    clearSelectedItems(state) {
      const selectedItemIds = state.selectedItems.map(item => ({ Product_id: item.Product_id, Size: item.Size }));
      state.items = state.items.filter(
        item => !selectedItemIds.some(selected => selected.Product_id === item.Product_id && selected.Size === item.Size)
      );
    },
    setOrders(state, action: PayloadAction<CartItem[]>) {
      state.selectedItems = action.payload;
    },
    clearCart(state) {
      state.items = [];
      state.selectedItems = [];
    },
  },
});

export const { setCart, addItemToCart, updateItemInCart, removeItemFromCart, clearSelectedItems, setOrders, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
