import axios from "axios";

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
});

// Add request interceptor to include JWT token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("tokenExpiration");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

// Check if token is expired
export const isTokenExpired = () => {
    const expirationTime = localStorage.getItem("tokenExpiration");
    if (!expirationTime) {
        return true;
    }
    return new Date().getTime() > parseInt(expirationTime);
};

// Logout function
export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("tokenExpiration");
    window.dispatchEvent(new Event("storage"));
    window.location.href = "/login";
};

export default axiosInstance;
