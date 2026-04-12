import { apiSlice } from '../apiSlice';
import { LoginRequest, RegisterRequest, LoginResponse, User, CustomerUpdateUserRequest, StaffUpdateUserRequest } from '../../types';

const AUTH_API_BASE_URL = import.meta.env.VITE_AUTH_API_BASE ?? 'http://localhost:3001';
const DATA_API_BASE_URL = import.meta.env.VITE_DATA_API_BASE ?? 'http://localhost:3002';

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                data: credentials,
                baseURL: AUTH_API_BASE_URL,
            }),
            invalidatesTags: ['User'],
        }),

        register: builder.mutation<LoginResponse, RegisterRequest>({
            query: (data) => ({
                url: '/register',
                method: 'POST',
                data,
                baseURL: AUTH_API_BASE_URL,
            }),
            invalidatesTags: ['User'],
        }),

        getCurrentUser: builder.query<User, void>({
            query: () => ({
                url: '/customer/user',
                method: 'GET',
                baseURL: DATA_API_BASE_URL,
            }),
            providesTags: ['User'],
        }),

        updateCurrentUser: builder.mutation<number, CustomerUpdateUserRequest>({
            query: (data) => ({
                url: '/customer/user',
                method: 'PUT',
                data,
                baseURL: DATA_API_BASE_URL,
            }),
            invalidatesTags: ['User'],
        }),

        getStaffUser: builder.query<User, number>({
            query: (userId) => ({
                url: '/manager/user',
                method: 'GET',
                params: { id: userId },
                baseURL: DATA_API_BASE_URL,
            }),
            providesTags: ['User'],
        }),

        updateStaffUser: builder.mutation<number, StaffUpdateUserRequest>({
            query: (data) => ({
                url: '/manager/user',
                method: 'PUT',
                data,
                baseURL: DATA_API_BASE_URL,
            }),
            invalidatesTags: ['User', 'Users'],
        }),

        deleteUserByLogin: builder.mutation<number, string>({
            query: (login) => ({
                url: `/manager/users/${encodeURIComponent(login)}`,
                method: 'DELETE',
                baseURL: DATA_API_BASE_URL,
            }),
            invalidatesTags: ['Users'],
        }),

        checkLoginAvailability: builder.query<{ available: boolean }, string>({
            query: (login) => ({
                url: '/manager/users/check-login',
                method: 'GET',
                params: { login },
                baseURL: DATA_API_BASE_URL,
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useGetCurrentUserQuery,
    useUpdateCurrentUserMutation,
    useGetStaffUserQuery,
    useUpdateStaffUserMutation,
    useDeleteUserByLoginMutation,
    useCheckLoginAvailabilityQuery,
} = userApiSlice;
