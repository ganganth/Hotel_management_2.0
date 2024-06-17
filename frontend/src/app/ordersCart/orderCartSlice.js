import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: []
}

const orderCartSlice = createSlice({
    name: 'orderCart',
    initialState,
    reducers: {
        addItemToCart: (state, action) => {
            const item = action.payload;
            let itemUpdated = false;

            if (state.items.find(i => i.reservationType === 'rooms')) {
                const found = state.items.find(i => i.reservationType === 'rooms' && i.id === item.id && i.name === item.name);
                if (found) {
                    found.quantity += item.quantity;
                    found.Total_price = found.quantity * item.price;
                    itemUpdated = true;
                }
            }
            if (state.items.find(i => i.reservationType === 'foods')) {
                const isFound = state.items.find(i => (i.mealId === item.mealId && i.menuId === item.menuId && i.categoryId === item.categoryId && i.name.toLowerCase() === item.name.toLowerCase() && new Date(i.reservedDate).getTime() === new Date(item.reservedDate).getTime()));
                if (isFound) {
                    isFound.quantity += item.quantity;
                    isFound.Total_price = isFound.quantity * item.price;
                    itemUpdated = true;
                }
            }
            if (state.items.find(i => i.reservationType === 'vehicle')) {
                const found = state.items.find(i => i.id === item.id);
                if (found) {
                    found.quantity += item.quantity;
                    itemUpdated = true;
                }
            }
            if (state.items.find(i => i.reservationType === 'events')) {
                const found = state.items.find(i => i.id === item.id);
                if (found) {
                    found.quantity += item.quantity;
                    itemUpdated = true;
                }
            }

            if (!itemUpdated) {
                state.items.push(item);
            }
        },
        removeRoomItemFromCart: (state, action) => {
            const item = action.payload;
            state.items = state.items.filter(e => e.id !== item.id && e.name !== item.name);
        },
        removeFoodItemFromCart: (state, action) => {
            const {menuId, categoryId,mealId,reservedDate} = action.payload;
            state.items = state.items.filter(i => !(i.mealId ===mealId && i.menuId === menuId && i.categoryId === categoryId &&  new Date(i.reservedDate).getTime() === new Date(reservedDate).getTime()));
        },
        removeEventItemFromCart: (state, action) => {
            const item = action.payload;
            state.items = state.items.filter(e => e.id !== item.id && e.name !== item.name);
        },
        removeVehicleItemFromCart: (state, action) => {
            const item = action.payload;
            state.items = state.items.filter(e => e.id !== item.id && e.name !== item.name);
        },
                
        clearCart: (state) => {
            state.items = [];
        }
    }
});

export const { addItemToCart, removeFoodItemFromCart,removeVehicleItemFromCart,removeEventItemFromCart,removeRoomItemFromCart, clearCart } = orderCartSlice.actions;

export default orderCartSlice.reducer;
