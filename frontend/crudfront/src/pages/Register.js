import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { validateUsername, validatePassword } from "../util/validation";

export default function Register() {
    const navigate = useNavigate();

    const [registerData, setRegisterData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const { username, password, confirmPassword } = registerData;

    const onInputChange = (e) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
        // Clear specific error when user starts typing
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: "" });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Username validation
        const usernameError = validateUsername(username);
        if (usernameError !== true) {
            newErrors.username = usernameError;
        }

        // Password validation
        const passwordError = validatePassword(password);
        if (passwordError !== true) {
            newErrors.password = passwordError;
        } else if (username && password.toLowerCase().includes(username.toLowerCase())) {
            newErrors.password = "Password cannot contain username";
        }

        // Confirm password validation
        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        return newErrors;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        // Client-side validation
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post("http://localhost:8080/auth/register", {
                username,
                password,
            });

            if (response.data.success) {
                alert("Registration successful! Please login.");
                navigate("/login");
            }
        } catch (err) {
            if (err.response && err.response.data) {
                if (err.response.data.errors) {
                    setErrors(err.response.data.errors);
                } else {
                    setErrors({ general: err.response.data.message || "Registration failed" });
                }
            } else {
                setErrors({ general: "Network error. Please try again." });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-5 shadow">
                    <h2 className="text-center m-4">Register</h2>

                    {errors.general && (
                        <div className="alert alert-danger" role="alert">
                            {errors.general}
                        </div>
                    )}

                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">
                                Username
                            </label>
                            <input
                                type="text"
                                className={`form-control ${errors.username ? "is-invalid" : ""}`}
                                placeholder="Enter username"
                                name="username"
                                value={username}
                                onChange={(e) => onInputChange(e)}
                                required
                            />
                            {errors.username && (
                                <div className="invalid-feedback">{errors.username}</div>
                            )}
                            <small className="form-text text-muted">
                                3-50 characters. Letters, numbers, dots, hyphens, and underscores only.
                            </small>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <input
                                type="password"
                                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                placeholder="Enter password"
                                name="password"
                                value={password}
                                onChange={(e) => onInputChange(e)}
                                required
                            />
                            {errors.password && (
                                <div className="invalid-feedback">{errors.password}</div>
                            )}
                            <small className="form-text text-muted">
                                6-100 characters. Must contain at least one letter and one number.
                            </small>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                                placeholder="Confirm password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => onInputChange(e)}
                                required
                            />
                            {errors.confirmPassword && (
                                <div className="invalid-feedback">{errors.confirmPassword}</div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={loading}
                        >
                            {loading ? "Registering..." : "Register"}
                        </button>

                        <div className="text-center mt-3">
                            <p>
                                Already have an account?{" "}
                                <Link to="/login" className="text-primary">
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
