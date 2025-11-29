import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../../pages/Login";
import axios from "axios";

// Mock axios như authService
jest.mock("axios");

// Mock localStorage
const localStorageMock = {
  store: {},
  getItem: jest.fn((key) => localStorageMock.store[key] || null),
  setItem: jest.fn((key, value) => {
    localStorageMock.store[key] = value;
  }),
  removeItem: jest.fn((key) => {
    delete localStorageMock.store[key];
  }),
  clear: jest.fn(() => {
    localStorageMock.store = {};
  }),
};
global.localStorage = localStorageMock;

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Helper function to render with Router
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("Login Mock Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear localStorage store completely
    localStorageMock.store = {};
    localStorageMock.clear();
  });

  // a) Mock authService.loginUser() (1 điểm)
  describe("TC_MOCK_LOGIN_01-03: Mock axios.post như authService", () => {
    test("TC_MOCK_LOGIN_01: Mock - Login thành công", async () => {
      // Mock successful response
      const mockResponse = {
        data: {
          success: true,
          token: "mock-token-123",
          user: { username: "testuser", id: 1 },
          expiresIn: 3600000,
        },
      };

      axios.post.mockResolvedValue(mockResponse);

      renderWithRouter(<Login />);

      const usernameInput = screen.getByPlaceholderText(/enter username/i);
      const passwordInput = screen.getByPlaceholderText(/enter password/i);
      const submitButton = screen.getByRole("button", { name: /login/i });

      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(passwordInput, { target: { value: "Test123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          "http://localhost:8080/auth/login",
          {
            username: "testuser",
            password: "Test123",
          }
        );
      });

      // Verify success response handling
      // Wait for token to be stored in localStorage
      await waitFor(
        () => {
          expect(localStorage.getItem("token")).toBe("mock-token-123");
        },
        { timeout: 2000 }
      );

      // Also verify navigate was called
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/");
      });
    });

    // b) Test với mocked successful/failed responses (1 điểm)
    test("TC_MOCK_LOGIN_02: Mock - Login thất bại", async () => {
      // Mock failed response
      const mockError = {
        response: {
          status: 401,
          data: {
            success: false,
            message: "Invalid credentials",
          },
        },
      };

      axios.post.mockRejectedValue(mockError);

      renderWithRouter(<Login />);

      const usernameInput = screen.getByPlaceholderText(/enter username/i);
      const passwordInput = screen.getByPlaceholderText(/enter password/i);
      const submitButton = screen.getByRole("button", { name: /login/i });

      fireEvent.change(usernameInput, { target: { value: "wronguser" } });
      fireEvent.change(passwordInput, { target: { value: "WrongPass123" } }); // Fix: password must have numbers
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          "http://localhost:8080/auth/login",
          {
            username: "wronguser",
            password: "WrongPass123", // Fix: password must have numbers to pass validation
          }
        );
      });

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });

      // Verify token is NOT stored on failure - check store directly
      expect(localStorageMock.store["token"]).toBeUndefined();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    test("TC_MOCK_LOGIN_03: Mock - Network error", async () => {
      // Mock network error
      axios.post.mockRejectedValue(new Error("Network Error"));

      renderWithRouter(<Login />);

      const usernameInput = screen.getByPlaceholderText(/enter username/i);
      const passwordInput = screen.getByPlaceholderText(/enter password/i);
      const submitButton = screen.getByRole("button", { name: /login/i });

      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(passwordInput, { target: { value: "Test123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });
  });

  // c) Verify mock calls (0.5 điểm)
  describe("TC_MOCK_LOGIN_04-05: Verify mock calls", () => {
    test("TC_MOCK_LOGIN_04: Verify mock được gọi đúng số lần", async () => {
      const mockResponse = {
        data: {
          success: true,
          token: "mock-token",
          user: { username: "testuser" },
          expiresIn: 3600000,
        },
      };

      axios.post.mockResolvedValue(mockResponse);

      renderWithRouter(<Login />);

      const usernameInput = screen.getByPlaceholderText(/enter username/i);
      const passwordInput = screen.getByPlaceholderText(/enter password/i);
      const submitButton = screen.getByRole("button", { name: /login/i });

      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(passwordInput, { target: { value: "Test123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledTimes(1);
      });

      // Verify được gọi với đúng parameters
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:8080/auth/login",
        {
          username: "testuser",
          password: "Test123",
        }
      );
    });

    test("TC_MOCK_LOGIN_05: Verify mock không được gọi khi validation fail", async () => {
      renderWithRouter(<Login />);

      const submitButton = screen.getByRole("button", { name: /login/i });

      // Submit form rỗng - validation sẽ fail
      fireEvent.click(submitButton);

      // Đợi một chút để đảm bảo không có API call
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify mock KHÔNG được gọi
      expect(axios.post).not.toHaveBeenCalled();
    });
  });
});
