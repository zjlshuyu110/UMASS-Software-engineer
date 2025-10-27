import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getToken, deleteToken } from '@/src/utils/token';

export const loadToken = createAsyncThunk('auth/loadToken', async () => {
  const token = await getToken();
  return token;
});

export const logout = createAsyncThunk('auth/logout', async () => {
    await deleteToken();
  });

interface UserState {
    email: string | null;
    name: string | null;
    token: string | null;
}

const initialState: UserState = {
    email: null,
    name: null,
    token: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login(state, action: PayloadAction<{ email: string, token: string }>) {
            state.email = action.payload.email;
            state.token = action.payload.token;
        },
        updateUser(state, action: PayloadAction<UserState>) {
            return action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loadToken.fulfilled, (state, action) => {
            state.token = action.payload;
        });
        builder.addCase(logout.fulfilled, (state) => {
            state.token = null;
        });
    },
});

export const { login, updateUser } = userSlice.actions;
export default userSlice.reducer;