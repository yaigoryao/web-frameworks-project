import { apiSlice } from '../apiSlice';
import { OrderStatus } from '../../types';

const DATA_API_BASE_URL = import.meta.env.VITE_DATA_API_BASE ?? 'http://localhost:3002';

interface GetOrderStatusesParams {
    id?: number;
    limit: number;
    offset: number;
}

export const orderStatusApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Get order statuses (cached, used by manager/owner)
        getOrderStatuses: builder.query<OrderStatus[], GetOrderStatusesParams>({
            query: (params) => ({
                url: '/manager/orderstatus',
                method: 'GET',
                params,
                baseURL: DATA_API_BASE_URL,
            }),
            providesTags: ['OrderStatuses'],
            // Aggressive cache for reference data
            keepUnusedDataFor: 3600, // 1 hour
        }),
    }),
});

export const { useGetOrderStatusesQuery } = orderStatusApiSlice;
