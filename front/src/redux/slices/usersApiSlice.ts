import { apiSlice } from '../apiSlice';
import { User, CreateUserRequest, CreateUserResponse } from '../../types';

const DATA_API_BASE_URL = import.meta.env.VITE_DATA_API_BASE ?? 'http://localhost:3002';

interface GetUsersParams {
    role?: string;
    search?: string;
    limit?: number;
    offset?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Get users list (manager/owner)
        getUsers: builder.query<User[], GetUsersParams | void>({
            query: (params) => ({
                url: '/manager/users',
                method: 'GET',
                params,
                baseURL: DATA_API_BASE_URL,
            }),
            transformResponse: (response: any) => {
                // Ensure response is always an array
                if (Array.isArray(response)) {
                    return response;
                }
                if (response && Array.isArray(response.users)) {
                    return response.users;
                }
                return [];
            },
            providesTags: ['Users'],
        }),

        // Create user (manager/owner)
        createUser: builder.mutation<CreateUserResponse, CreateUserRequest>({
            query: (data) => ({
                url: '/manager/users',
                method: 'POST',
                data,
                baseURL: DATA_API_BASE_URL,
            }),
            invalidatesTags: ['Users'],
        }),
    }),
});

export const { useGetUsersQuery, useCreateUserMutation } = usersApiSlice;
