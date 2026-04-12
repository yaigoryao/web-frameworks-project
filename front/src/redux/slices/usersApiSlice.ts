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
        getUsers: builder.query<User[], GetUsersParams | void>({
            query: (params) => ({
                url: '/manager/users',
                method: 'GET',
                params,
                baseURL: DATA_API_BASE_URL,
            }),
            transformResponse: (response: any) => {
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
