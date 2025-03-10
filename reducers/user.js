import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: { username: null, token: null, diets: [], bookmarks: [] },
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.value.username = action.payload.username;
            state.value.token = action.payload.token;
            state.value.diets = [];
            state.value.bookmarks = [];
        },
        logout: (state) => {
            state.value.username = null;
            state.value.token = null;
            state.value.diets = [];
            state.value.bookmarks = [];
        },
        toggleDiet: (state, action) => {
            if (state.value.diets.includes(action.payload)) {
                state.value.diets = state.value.diets.filter(diet => diet != action.payload);
            } else {
                state.value.diets.push(action.payload);
            }
        },
        importDiets: (state, action) => {
            state.value.diets = action.payload;
        },
        addBookmark: (state, action) => {
            state.value.bookmarks.push(action.payload);
        },
        removeBookmark: (state, action) => {
            state.value.bookmarks = state.value.bookmarks.filter(bookmark => bookmark != action.payload);
        },
        importBookmarks: (state, action) => {
            state.value.bookmarks = action.payload;
        }
    }
})

export const { login, logout, toggleDiet, importDiets, addBookmark, removeBookmark, importBookmarks } = userSlice.actions;
export default userSlice.reducer;