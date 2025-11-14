import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from "../util/axiosConfig";

export const useAuth = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Check token expiration on component mount
        const checkAuth = () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            if (isTokenExpired()) {
                alert("Your session has expired. Please login again.");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("tokenExpiration");
                navigate("/login");
            }
        };

        checkAuth();

        // Check token expiration every minute
        const interval = setInterval(checkAuth, 60000);

        return () => clearInterval(interval);
    }, [navigate]);
};

export default useAuth;
