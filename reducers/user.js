import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: { username: null, email: null, token: null },
  }; 

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.value.username = action.payload;
            state.value.email = action.payload;
            state.value.token = action.payload;
        },
        logout: (state) => {
            state.value.username = null;
            state.value.email = null;
            state.value.token = null;
        }
    }
})

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;