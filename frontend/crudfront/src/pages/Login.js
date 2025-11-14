import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { validateUsername, validatePassword } from "../util/validation";

export default function Login() {
    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({
        username: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { username, password } = loginData;

    const onInputChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
        setError("");
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Client-side validation
        const usernameError = validateUsername(username);
        if (usernameError !== true) {
            setError(usernameError);
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError !== true) {
            setError(passwordError);
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post("http://localhost:8080/auth/login", loginData);

            if (response.data.success) {
                // Store user info and JWT token
                localStorage.setItem("user", JSON.stringify(response.data.user));
                localStorage.setItem("token", response.data.token);

                // Store token expiration time
                const expirationTime = new Date().getTime() + response.data.expiresIn;
                localStorage.setItem("tokenExpiration", expirationTime.toString());

                // Trigger storage event for other components
                window.dispatchEvent(new Event("storage"));

                // Show success message
                alert("Login successful!");

                // Redirect to home page
                navigate("/");
            }
        } catch (err) {
            if (err.response) {
                setError(err.response.data.message || "Login failed");
            } else {
                setError("Network error. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-5 shadow">
                    <h2 className="text-center m-4">Login</h2>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">
                                Username
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter username"
                                name="username"
                                value={username}
                                onChange={(e) => onInputChange(e)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Enter password"
                                name="password"
                                value={password}
                                onChange={(e) => onInputChange(e)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>

                        <div className="text-center mt-3">
                            <p>
                                Don't have an account?{" "}
                                <a href="/register" className="text-primary">
                                    Register here
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
