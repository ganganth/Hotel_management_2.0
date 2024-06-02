import { createSlice } from '@reduxjs/toolkit';

const initialState = JSON.parse(localStorage.getItem('reduxState')) || {
    allOrderFreeze: true,
    otherOrderFreeze: true
};

const stateSlice = createSlice({
    name: 'state',
    initialState: initialState,
    reducers: {
        addOtherOrderFreeze: (state) => {
            return { ...state, otherOrderFreeze: true };
        },
        removeOtherOrderFreeze: (state) => {
            return { ...state, otherOrderFreeze: false };
        },
        addAllOrderFreeze: (state) => {
            return { ...state, allOrderFreeze: true };
        },
        removeAllOrderFreeze: (state) => {
            return { ...state, allOrderFreeze: false };
        },
        resetState: (state) => {
            return { ...state, otherOrderFreeze: true, allOrderFreeze: true};
        }
    }
});

export const selectAllOrderFreeze = (state) => state.state.allOrderFreeze;
export const selectOtherOrderFreeze = (state) => state.state.otherOrderFreeze;
export const { addOtherOrderFreeze, removeOtherOrderFreeze, addAllOrderFreeze, removeAllOrderFreeze,resetState } = stateSlice.actions;

export default stateSlice.reducer;
