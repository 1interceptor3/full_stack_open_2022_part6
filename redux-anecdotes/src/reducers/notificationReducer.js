import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: "notification",
    initialState: null,
    reducers: {
        set(state, action) {
            return action.payload;
        },
        clear: () => null
    }
});

export const { set, clear } = notificationSlice.actions;

export const setNotification = (text, time) => {
    return async dispatch => {
        dispatch(set(text));

        setTimeout(() => {
            dispatch(clear());
        }, time * 1000);
    };
}

export default notificationSlice.reducer;