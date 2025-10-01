import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    id: string | null;
    email: string | null;
    name: string | null;
    token: string | null;
}

const initialState: UserState = {
    id: null,
    email: null,
    name: null,
    token: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserState>) {
            state.id = action.payload.id;
            state.email = action.payload.email;
            state.name = action.payload.name;
            state.token = action.payload.token;
        },
        clearUser(state) {
            state.id = null;
            state.email = null;
            state.name = null;
            state.token = null;
        },
    },
});

export const isUserLoggedIn = (state: { user: UserState }) => true;
// export const isUserLoggedIn = (state: { user: UserState }) => state.user.token !== null;


export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;