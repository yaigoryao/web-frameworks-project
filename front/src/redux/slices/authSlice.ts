import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

interface AuthState {
    accessToken: string | null;
    user: User | null;
    userRole: string | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    accessToken: localStorage.getItem('accessToken'),
    user: null,
    userRole: null,
    isLoading: false,
    error: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Set auth token
        setToken: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
            state.accessToken = action.payload.accessToken;
            localStorage.setItem('accessToken', action.payload.accessToken);
            localStorage.setItem('refreshToken', action.payload.refreshToken);
        },

        // Update current user
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            // Extract and store user role
            if (action.payload.role?.roleName) {
                state.userRole = action.payload.role.roleName.toLowerCase();
            }
            state.error = null;
        },

        // Clear auth state (logout)
        clearAuth: (state) => {
            state.accessToken = null;
            state.user = null;
            state.userRole = null;
            state.error = null;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        },

        // Set loading state
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        // Set error
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },

        // Refresh token (after successful refresh)
        refreshToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
            localStorage.setItem('accessToken', action.payload);
        },
    },
});

export const { setToken, setUser, clearAuth, setLoading, setError, refreshToken } = authSlice.actions;
export default authSlice.reducer;
