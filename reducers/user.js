import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: { username: null, token: null },
  }; 

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.value.username = action.payload.username;
            state.value.token = action.payload.token;
        },
        logout: (state) => {
            state.value.username = null;
            state.value.token = null;
        }
    }
})

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;