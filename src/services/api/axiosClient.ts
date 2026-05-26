import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';

const axiosClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to format requests or add tokens if needed
axiosClient.interceptors.request.use(
  (config) => {
    // We can add auth tokens here if we weren't using NextAuth session cookies
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Centralized error handling and notification
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    let message = 'An unexpected error occurred';

    if (error.code === 'ECONNABORTED') {
      message = 'Request timed out. Please try again.';
    } else if (status === 401) {
      message = 'Unauthorized. Please login again.';
    } else if (status === 403) {
      message = 'Forbidden. You do not have permission.';
    } else if (status === 404) {
      message = 'Resource not found.';
    } else if (status === 500) {
      message = 'Internal server error. Please try again later.';
    } else if (error.message) {
      message = error.message;
    }

    // Trigger toast notification
    if (typeof window !== 'undefined') {
      toast.error(message, { id: 'api-error' });
    }

    return Promise.reject(new Error(message));
  }
);

// Advanced custom retry helper
export async function retryRequest<T>(
  fn: () => Promise<AxiosResponse<T>>,
  retriesLeft = 3,
  interval = 1000
): Promise<AxiosResponse<T>> {
  try {
    return await fn();
  } catch (error) {
    if (retriesLeft === 0) {
      throw error;
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
    return retryRequest(fn, retriesLeft - 1, interval * 1.5);
  }
}

export default axiosClient;
