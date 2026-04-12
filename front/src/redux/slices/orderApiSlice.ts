import { apiSlice } from '../apiSlice';
import { Order, CustomerGetOrdersRequest } from '../../types';

const DATA_API_BASE_URL = import.meta.env.VITE_DATA_API_BASE ?? 'http://localhost:3002';

interface CustomerAddOrderRequest {
    carId: number;
    totalPrice: number;
    description: string | null;
    plannedEndDate: string;
    orderStatusId: number;
}

interface CustomerUpdateOrderRequest {
    id: number;
    orderStatusId?: number;
    totalPrice?: number;
    description?: string | null;
    plannedEndDate?: string;
}

interface StaffAddOrderRequest {
    userId: number;
    carId: number;
    totalPrice: number;
    description: string | null;
    startDate?: string;
    plannedEndDate: string;
    endDate?: string | null;
    orderStatusId: number;
}

interface StaffUpdateOrderRequest {
    id: number;
    orderStatusId?: number;
    totalPrice?: number;
    description?: string | null;
    plannedEndDate?: string;
    endDate?: string | null;
    startDate?: string;
    carId?: number;
}

interface GetOrdersParams {
    id?: number;
    userId?: number;
    orderStatusId?: number | null;
    startDate?: string;
    endDate?: string;
    userLogin?: string;
    limit: number;
    offset: number;
}

export const orderApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Get customer orders
        getCustomerOrders: builder.query<Order[], Partial<CustomerGetOrdersRequest>>({
            query: (params) => ({
                url: '/customer/order',
                method: 'GET',
                params: { id: 0, limit: 100, offset: 0, ...params },
                baseURL: DATA_API_BASE_URL,
            }),
            providesTags: ['Orders'],
        }),

        // Create customer order
        createCustomerOrder: builder.mutation<number, CustomerAddOrderRequest>({
            query: (data) => ({
                url: '/customer/order',
                method: 'POST',
                data,
                baseURL: DATA_API_BASE_URL,
            }),
            invalidatesTags: ['Orders'],
        }),

        // Update customer order
        updateCustomerOrder: builder.mutation<number, CustomerUpdateOrderRequest>({
            query: (data) => ({
                url: '/customer/order',
                method: 'PUT',
                data,
                baseURL: DATA_API_BASE_URL,
            }),
            invalidatesTags: ['Orders'],
        }),

        // Delete customer order
        deleteCustomerOrder: builder.mutation<number, number>({
            query: (orderId) => ({
                url: `/customer/order/${orderId}`,
                method: 'DELETE',
                baseURL: DATA_API_BASE_URL,
            }),
            invalidatesTags: ['Orders'],
        }),

        // Get staff orders (manager/order or owner/order)
        getStaffOrders: builder.query<Order[], GetOrdersParams>({
            query: (params) => ({
                url: '/manager/order',
                method: 'GET',
                params: { id: 0, ...params },
                baseURL: DATA_API_BASE_URL,
            }),
            providesTags: (result) =>
                result
                    ? [...result.map(({ id }) => ({ type: 'Orders' as const, id })), { type: 'Orders', id: 'LIST' }]
                    : [{ type: 'Orders', id: 'LIST' }],
        }),

        // Create staff order
        createStaffOrder: builder.mutation<number, StaffAddOrderRequest>({
            query: (data) => ({
                url: '/manager/order',
                method: 'POST',
                data,
                baseURL: DATA_API_BASE_URL,
            }),
            invalidatesTags: ['Orders'],
        }),

        // Update staff order
        updateStaffOrder: builder.mutation<number, StaffUpdateOrderRequest>({
            query: (data) => ({
                url: '/manager/order',
                method: 'PUT',
                data,
                baseURL: DATA_API_BASE_URL,
            }),
            invalidatesTags: ['Orders'],
        }),

        // Delete staff order
        deleteStaffOrder: builder.mutation<number, number>({
            query: (orderId) => ({
                url: `/manager/order/${orderId}`,
                method: 'DELETE',
                baseURL: DATA_API_BASE_URL,
            }),
            invalidatesTags: ['Orders'],
        }),
    }),
});

export const {
    useGetCustomerOrdersQuery,
    useCreateCustomerOrderMutation,
    useUpdateCustomerOrderMutation,
    useDeleteCustomerOrderMutation,
    useGetStaffOrdersQuery,
    useCreateStaffOrderMutation,
    useUpdateStaffOrderMutation,
    useDeleteStaffOrderMutation,
} = orderApiSlice;
