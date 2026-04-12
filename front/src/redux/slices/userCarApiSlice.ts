import { apiSlice } from '../apiSlice';
import { UserCar } from '../../types';

const DATA_API_BASE_URL = import.meta.env.VITE_DATA_API_BASE ?? 'http://localhost:3002';

interface AddUserCarRequest {
    userId: number;
    carId: number;
    ownsNow: boolean;
}

interface UpdateUserCarRequest extends AddUserCarRequest { }

interface GetUserCarsParams {
    userId?: number;
    carId?: number;
    ownsNow?: boolean;
    limit: number;
    offset: number;
}

export const userCarApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUserCarLinks: builder.query<UserCar[], GetUserCarsParams>({
            query: (params) => ({
                url: '/manager/usercar',
                method: 'GET',
                params,
                baseURL: DATA_API_BASE_URL,
            }),
            providesTags: ['UserCars'],
        }),

        addUserCar: builder.mutation<number, AddUserCarRequest>({
            query: (data) => ({
                url: '/manager/usercar',
                method: 'POST',
                data,
                baseURL: DATA_API_BASE_URL,
            }),
            invalidatesTags: ['UserCars', 'Cars'],
        }),

        updateUserCar: builder.mutation<number, UpdateUserCarRequest>({
            query: (data) => ({
                url: '/manager/usercar',
                method: 'PUT',
                data,
                baseURL: DATA_API_BASE_URL,
            }),
            invalidatesTags: ['UserCars', 'Cars'],
        }),

        deleteUserCar: builder.mutation<number, { userId: number; carId: number }>({
            query: ({ userId, carId }) => ({
                url: '/manager/usercar',
                method: 'DELETE',
                params: { userId, carId },
                baseURL: DATA_API_BASE_URL,
            }),
            invalidatesTags: ['UserCars', 'Cars'],
        }),
    }),
});

export const {
    useGetUserCarLinksQuery,
    useAddUserCarMutation,
    useUpdateUserCarMutation,
    useDeleteUserCarMutation,
} = userCarApiSlice;
