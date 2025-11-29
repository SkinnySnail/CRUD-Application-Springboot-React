import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../../pages/Login";
import axios from "axios";

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock axios
jest.mock("axios");

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

describe("Login Component - Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  describe("TC_LOGIN_INT_01-05: Form Rendering & Validation", () => {
    test("TC_LOGIN_INT_01: Hiển thị form login đầy đủ", () => {
      renderWithRouter(<Login />);

      expect(
        screen.getByRole("heading", { name: /login/i })
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/enter username/i)
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/enter password/i)
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /login/i })
      ).toBeInTheDocument();
    });

    test("TC_LOGIN_INT_02: Input fields are present and accessible", () => {
      renderWithRouter(<Login />);

      const usernameInput = screen.getByPlaceholderText(/enter username/i);
      const passwordInput = screen.getByPlaceholderText(/enter password/i);

      expect(usernameInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(usernameInput).toHaveAttribute("type", "text");
      expect(passwordInput).toHaveAttribute("type", "password");
    });

    test("TC_LOGIN_INT_03: Password field is type password", () => {
      renderWithRouter(<Login />);

      const passwordInput = screen.getByPlaceholderText(/enter password/i);

      expect(passwordInput).toHaveAttribute("type", "password");
    });

    test("TC_LOGIN_INT_04: Hiển thị lỗi khi username quá ngắn", async () => {
      renderWithRouter(<Login />);

      const usernameInput = screen.getByPlaceholderText(/enter username/i);
      const passwordInput = screen.getByPlaceholderText(/enter password/i);
      const submitButton = screen.getByRole("button", { name: /login/i });

      fireEvent.change(usernameInput, { target: { value: "ab" } });
      fireEvent.change(passwordInput, { target: { value: "Test123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/username too short/i)).toBeInTheDocument();
      });
    });

    test("TC_LOGIN_INT_05: Hiển thị lỗi khi password không có số", async () => {
      renderWithRouter(<Login />);

      const usernameInput = screen.getByPlaceholderText(/enter username/i);
      const passwordInput = screen.getByPlaceholderText(/enter password/i);
      const submitButton = screen.getByRole("button", { name: /login/i });

      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(passwordInput, { target: { value: "TestPassword" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/must contain both letters and numbers/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe("TC_LOGIN_INT_06-10: API Integration", () => {
    test("TC_LOGIN_INT_06: Login thành công - gọi API và redirect", async () => {
      const mockResponse = {
        data: {
          success: true,
          username: "testuser",
          token: "mock-jwt-token",
          expiresIn: 3600000,
        },
      };

      axios.post.mockResolvedValueOnce(mockResponse);

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
        expect(localStorage.getItem("token")).toBe("mock-jwt-token");
        expect(mockNavigate).toHaveBeenCalledWith("/");
      });
    });

    test("TC_LOGIN_INT_07: Login thất bại - hiển thị lỗi từ server", async () => {
      const mockError = {
        response: {
          data: {
            message: "Username không tồn tại",
          },
        },
      };

      axios.post.mockRejectedValueOnce(mockError);

      renderWithRouter(<Login />);

      const usernameInput = screen.getByPlaceholderText(/enter username/i);
      const passwordInput = screen.getByPlaceholderText(/enter password/i);
      const submitButton = screen.getByRole("button", { name: /login/i });

      fireEvent.change(usernameInput, { target: { value: "wronguser" } });
      fireEvent.change(passwordInput, { target: { value: "Test123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/username không tồn tại/i)).toBeInTheDocument();
      });
    });

    test("TC_LOGIN_INT_08: Network error - hiển thị lỗi mạng", async () => {
      axios.post.mockRejectedValueOnce(new Error("Network Error"));

      renderWithRouter(<Login />);

      const usernameInput = screen.getByPlaceholderText(/enter username/i);
      const passwordInput = screen.getByPlaceholderText(/enter password/i);
      const submitButton = screen.getByRole("button", { name: /login/i });

      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(passwordInput, { target: { value: "Test123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });

    test("TC_LOGIN_INT_09: Button disabled khi đang loading", async () => {
      axios.post.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ data: { success: true } }), 1000)
          )
      );

      renderWithRouter(<Login />);

      const usernameInput = screen.getByPlaceholderText(/enter username/i);
      const passwordInput = screen.getByPlaceholderText(/enter password/i);
      const submitButton = screen.getByRole("button", { name: /login/i });

      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(passwordInput, { target: { value: "Test123" } });
      fireEvent.click(submitButton);

      // Kiểm tra button bị disable
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent(/logging in/i);
    });

    test("TC_LOGIN_INT_10: Error message cleared khi có input mới", async () => {
      const mockError = {
        response: {
          data: {
            message: "Invalid credentials",
          },
        },
      };

      axios.post.mockRejectedValueOnce(mockError);

      renderWithRouter(<Login />);

      const usernameInput = screen.getByPlaceholderText(/enter username/i);
      const passwordInput = screen.getByPlaceholderText(/enter password/i);
      const submitButton = screen.getByRole("button", { name: /login/i });

      // Submit with wrong credentials
      fireEvent.change(usernameInput, { target: { value: "wronguser" } });
      fireEvent.change(passwordInput, { target: { value: "Wrong123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });

      // User starts typing again - error should clear
      fireEvent.change(usernameInput, { target: { value: "newuser" } });

      await waitFor(() => {
        expect(
          screen.queryByText(/invalid credentials/i)
        ).not.toBeInTheDocument();
      });
    });
  });
});
