import {configureStore,getDefaultMiddleware } from '@reduxjs/toolkit';

import authReducer from './auth/authSlice';
import foodCartReducer from './foodCart/foodCartSlice';
import eventCartReducer from './eventCart/eventSlice';
import stateReducer from './state/stateSlice'
import orderCartReducer from './ordersCart/orderCartSlice'

// Function to save Redux state to local storage
const saveStateToLocalStorage = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('reduxState', serializedState);
    } catch (error) {
        console.error('Error saving state to local storage:', error);
    }
};

// Function to load Redux state from local storage
const loadStateFromLocalStorage = () => {
    try {
        const serializedState = localStorage.getItem('reduxState');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (error) {
        console.error('Error loading state from local storage:', error);
        return undefined;
    }
};

const persistedState = loadStateFromLocalStorage();
const store = configureStore({
    reducer: {
        auth: authReducer,
        foodCart: foodCartReducer,
        eventCart: eventCartReducer,
        state: stateReducer,
        orderCart: orderCartReducer
    },
    middleware: getDefaultMiddleware({
        serializableCheck: false, // Disables the warning for serializable state
    }),

    devTools: true,
    preloadedState: persistedState
})

// Subscribe to Redux store updates and save state to local storage
store.subscribe(() => {
    saveStateToLocalStorage(store.getState());
});

export default store;



