import { apiSlice } from '../apiSlice';
import { Car, CustomerGetCarsRequest } from '../../types';

const DATA_API_BASE_URL = import.meta.env.VITE_DATA_API_BASE ?? 'http://localhost:3002';

interface AddCarRequest {
    carNumber: string;
    modelName: string;
    vin: string;
    color: number;
}

interface UpdateCarRequest extends AddCarRequest {
    id: number;
}

interface GetCarsParams {
    id?: number;
    carNumber?: string;
    vin?: string;
    userId?: number;
    limit: number;
    offset: number;
}

export const carApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCustomerCars: builder.query<Car[], Omit<CustomerGetCarsRequest, 'limit' | 'offset'> & { limit: number; offset: number }>({
            query: (params) => ({
                url: '/customer/car',
                method: 'GET',
                params,
                baseURL: DATA_API_BASE_URL,
            }),
            providesTags: ['Cars'],
        }),

        getStaffCars: builder.query<Car[], GetCarsParams>({
            query: (params) => ({
                url: '/manager/car',
                method: 'GET',
                params,
                baseURL: DATA_API_BASE_URL,
            }),
            providesTags: (result) =>
                result
                    ? [...result.map(({ id }) => ({ type: 'Cars' as const, id })), { type: 'Cars', id: 'LIST' }]
                    : [{ type: 'Cars', id: 'LIST' }],
        }),

        createStaffCar: builder.mutation<number, AddCarRequest>({
            query: (data) => ({
                url: '/manager/car',
                method: 'POST',
                data,
                baseURL: DATA_API_BASE_URL,
            }),
            invalidatesTags: ['Cars'],
        }),

        updateStaffCar: builder.mutation<number, UpdateCarRequest>({
            query: (data) => ({
                url: '/manager/car',
                method: 'PUT',
                data,
                baseURL: DATA_API_BASE_URL,
            }),
            invalidatesTags: ['Cars'],
        }),
    }),
});

export const {
    useGetCustomerCarsQuery,
    useGetStaffCarsQuery,
    useCreateStaffCarMutation,
    useUpdateStaffCarMutation,
} = carApiSlice;
