import { apiSlice } from '../apiSlice';
import { Role } from '../../types';

const DATA_API_BASE_URL = import.meta.env.VITE_DATA_API_BASE ?? 'http://localhost:3002';

interface GetRolesParams {
    id?: number;
    limit: number;
    offset: number;
}

export const rolesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getRoles: builder.query<Role[], GetRolesParams>({
            query: (params) => ({
                url: '/manager/role',
                method: 'GET',
                params,
                baseURL: DATA_API_BASE_URL,
            }),
            providesTags: ['Roles'],
            keepUnusedDataFor: 3600,
        }),
    }),
});

export const { useGetRolesQuery } = rolesApiSlice;
