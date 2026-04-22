import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api: AxiosInstance = axios.create({
    baseURL: "https://dummyjson.com/",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    async (
        config: InternalAxiosRequestConfig
    ): Promise<InternalAxiosRequestConfig> => {

        try {
            const token = await AsyncStorage.getItem("token");

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error("Token fetch error:", error);
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.error("API error:", error);
        if (error.response?.status === 401) {
            await AsyncStorage.removeItem("token");
        }

        return Promise.reject(error);
    }
);

const apiService = {
    get: <T>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>> =>
        api.get<T>(url, config),

    post: <T, D = unknown>(
        url: string,
        data?: D
    ): Promise<AxiosResponse<T>> =>
        api.post<T>(url, data),

    put: <T, D = unknown>(
        url: string,
        data?: D
    ): Promise<AxiosResponse<T>> =>
        api.put<T>(url, data),

    patch: <T, D = unknown>(
        url: string,
        data?: D
    ): Promise<AxiosResponse<T>> =>
        api.patch<T>(url, data),

    delete: <T>(
        url: string
    ): Promise<AxiosResponse<T>> =>
        api.delete<T>(url),
};

export default apiService;