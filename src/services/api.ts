import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "https://dummyjson.com";

interface RetryAxiosRequestConfig
    extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});

let isRefreshing = false;

let failedQueue: {
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
}[] = [];

const processQueue = (
    error: unknown,
    token: string | null = null
) => {
    failedQueue.forEach((request) => {
        if (error) {
            request.reject(error);
        } else if (token) {
            request.resolve(token);
        }
    });

    failedQueue = [];
};

api.interceptors.request.use(
    async (
        config: InternalAxiosRequestConfig
    ): Promise<InternalAxiosRequestConfig> => {
        try {
            const token = await AsyncStorage.getItem("token");

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;

        } catch (error) {
            console.log("Token fetch error:", error);
            return config;
        }
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest =
            error.config as RetryAxiosRequestConfig;

        const status = error.response?.status;

        if (
            status === 401 &&
            !originalRequest._retry
        ) {

            if (isRefreshing) {
                return new Promise((resolve, reject) => {

                    failedQueue.push({
                        resolve,
                        reject,
                    });

                }).then((token) => {

                    originalRequest.headers.Authorization =
                        `Bearer ${token}`;

                    return api(originalRequest);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken =
                    await AsyncStorage.getItem("refreshToken");

                if (!refreshToken) {
                    throw new Error("No refresh token found");
                }

                const refreshResponse = await axios.post(
                    `${API_BASE_URL}/auth/refresh`,
                    {
                        refreshToken,
                    }
                );

                const newAccessToken =
                    refreshResponse.data.accessToken;

                await AsyncStorage.setItem(
                    "token",
                    newAccessToken
                );

                api.defaults.headers.common.Authorization =
                    `Bearer ${newAccessToken}`;


                processQueue(
                    null,
                    newAccessToken
                );

                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;


                return api(originalRequest);

            } catch (refreshError) {

                processQueue(refreshError, null);

                await Promise.all([
                    AsyncStorage.removeItem("token"),
                    AsyncStorage.removeItem("refreshToken"),
                ]);

                // Optional:
                // Navigate user to Login screen here

                return Promise.reject(refreshError);

            } finally {
                isRefreshing = false;
            }
        }

        if (status >= 500) {
            console.log(
                "Server error. Please try again later."
            );
        }

        return Promise.reject(error);
    }
);

const apiService = {
    get: <T>(
        endpoint: string,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> =>
        api.get<T>(endpoint, config),


    post: <T, D = unknown>(
        endpoint: string,
        data?: D,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> =>
        api.post<T>(
            endpoint,
            data,
            config
        ),

    put: <T, D = unknown>(
        endpoint: string,
        data?: D,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> =>
        api.put<T>(
            endpoint,
            data,
            config
        ),

    patch: <T, D = unknown>(
        endpoint: string,
        data?: D,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> =>
        api.patch<T>(
            endpoint,
            data,
            config
        ),

    delete: <T>(
        endpoint: string,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> =>
        api.delete<T>(
            endpoint,
            config
        ),
};


export default apiService;