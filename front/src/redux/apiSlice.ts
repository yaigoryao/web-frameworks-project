import { createApi, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import axios from 'axios';

const AUTH_API_BASE_URL = import.meta.env.VITE_AUTH_API_BASE ?? 'http://localhost:3001';
const DATA_API_BASE_URL = import.meta.env.VITE_DATA_API_BASE ?? 'http://localhost:3002';

const axiosInstance = axios.create();

interface ApiErrorResponse {
    message?: string;
    code?: string;
    status?: number;
}

export const customBaseQuery: BaseQueryFn<
    FetchArgs | { url: string; method: string; data?: unknown; params?: unknown; baseURL?: string },
    unknown,
    FetchBaseQueryError & { data?: ApiErrorResponse }
> = async (args, { getState }: any) => {
    let url: string = '';
    let method: string = 'GET';
    let data: unknown;
    let params: unknown;
    let baseURL: string = DATA_API_BASE_URL;

    if (typeof args === 'string') {
        url = args;
        method = 'GET';
    } else {
        url = (args as any).url;
        method = ((args as any).method || 'GET').toUpperCase();
        data = (args as any).data;
        params = (args as any).params;
        baseURL = (args as any).baseURL || DATA_API_BASE_URL;
    }

    const state: any = getState();
    const token = state.auth?.accessToken;
    const refreshToken = localStorage.getItem('refreshToken');

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (token && !url.includes('/auth')) {
        headers.Authorization = `Bearer ${token}`;
    }

    try {
        const response = await axiosInstance({
            url,
            method,
            data,
            params,
            baseURL: baseURL || (url.includes('/auth') ? AUTH_API_BASE_URL : DATA_API_BASE_URL),
            headers,
        });

        return { data: response.data };
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401 && refreshToken && token) {
            try {
                const refreshResponse = await axiosInstance.post(
                    '/refresh',
                    {
                        accessToken: token,
                        refreshToken,
                    },
                    {
                        baseURL: AUTH_API_BASE_URL,
                        headers: { 'Content-Type': 'application/json' },
                    }
                );

                if (refreshResponse.data?.accessToken) {
                    localStorage.setItem('accessToken', refreshResponse.data.accessToken);

                    const retryHeaders = {
                        ...headers,
                        Authorization: `Bearer ${refreshResponse.data.accessToken}`,
                    };

                    const retryResponse = await axiosInstance({
                        url,
                        method,
                        data,
                        params,
                        baseURL: baseURL || (url.includes('/auth') ? AUTH_API_BASE_URL : DATA_API_BASE_URL),
                        headers: retryHeaders,
                    });

                    return { data: retryResponse.data };
                }
            } catch (refreshError) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
            }
        }

        if (axios.isAxiosError(error)) {
            return {
                error: {
                    status: error.response?.status || 500,
                    data: error.response?.data as ApiErrorResponse,
                } as FetchBaseQueryError & { data?: ApiErrorResponse },
            };
        }

        return {
            error: {
                status: 500,
                data: { message: 'Unknown error occurred' },
            } as FetchBaseQueryError & { data?: ApiErrorResponse },
        };
    }
};

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: customBaseQuery,
    tagTypes: ['User', 'Cars', 'Orders', 'OrderStatuses', 'Roles', 'Users', 'UserCars'],
    endpoints: () => ({}),
});
