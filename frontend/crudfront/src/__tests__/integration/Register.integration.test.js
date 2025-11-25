import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from '../../pages/Register';
import axios from 'axios';

jest.mock('axios');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>
}));

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Register Component - Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
  });

  describe('TC_REGISTER_INT_01-05: Form Rendering & Validation', () => {
    test('TC_REGISTER_INT_01: Hiển thị form register đầy đủ', () => {
      renderWithRouter(<Register />);
      
      expect(screen.getByRole('heading', { name: /register/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/enter username/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/^enter password$/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/confirm password/i)).toBeInTheDocument();
    });

    test('TC_REGISTER_INT_02: Hiển thị helper text cho fields', () => {
      renderWithRouter(<Register />);
      
      expect(screen.getByText(/3-50 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/6-100 characters/i)).toBeInTheDocument();
    });

    test('TC_REGISTER_INT_03: Username rỗng - hiển thị lỗi', async () => {
      renderWithRouter(<Register />);
      
      fireEvent.change(screen.getByPlaceholderText(/^enter password$/i), {
        target: { value: 'Test123' }
      });
      fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
        target: { value: 'Test123' }
      });
      fireEvent.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/username is required/i)).toBeInTheDocument();
      });
    });

    test('TC_REGISTER_INT_04: Passwords không khớp - hiển thị lỗi', async () => {
      renderWithRouter(<Register />);
      
      fireEvent.change(screen.getByPlaceholderText(/enter username/i), {
        target: { value: 'newuser' }
      });
      fireEvent.change(screen.getByPlaceholderText(/^enter password$/i), {
        target: { value: 'Test123' }
      });
      fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
        target: { value: 'Test456' }
      });
      fireEvent.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });
    });

    test('TC_REGISTER_INT_05: Password chứa username - hiển thị lỗi', async () => {
      renderWithRouter(<Register />);
      
      fireEvent.change(screen.getByPlaceholderText(/enter username/i), {
        target: { value: 'testuser' }
      });
      fireEvent.change(screen.getByPlaceholderText(/^enter password$/i), {
        target: { value: 'testuser123' }
      });
      fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
        target: { value: 'testuser123' }
      });
      fireEvent.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/password cannot contain username/i)).toBeInTheDocument();
      });
    });
  });

  describe('TC_REGISTER_INT_06-10: API Integration', () => {
    test('TC_REGISTER_INT_06: Register thành công - redirect to login', async () => {
      axios.post.mockResolvedValueOnce({
        data: { success: true }
      });

      renderWithRouter(<Register />);
      
      fireEvent.change(screen.getByPlaceholderText(/enter username/i), {
        target: { value: 'newuser' }
      });
      fireEvent.change(screen.getByPlaceholderText(/^enter password$/i), {
        target: { value: 'Test123' }
      });
      fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
        target: { value: 'Test123' }
      });
      fireEvent.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/auth/register', {
          username: 'newuser',
          password: 'Test123'
        });
        expect(window.alert).toHaveBeenCalledWith('Registration successful! Please login.');
        expect(mockNavigate).toHaveBeenCalledWith('/login');
      });
    });

    test('TC_REGISTER_INT_07: Register fail - username đã tồn tại', async () => {
      axios.post.mockRejectedValueOnce({
        response: {
          data: {
            message: 'Username already exists'
          }
        }
      });

      renderWithRouter(<Register />);
      
      fireEvent.change(screen.getByPlaceholderText(/enter username/i), {
        target: { value: 'existinguser' }
      });
      fireEvent.change(screen.getByPlaceholderText(/^enter password$/i), {
        target: { value: 'Test123' }
      });
      fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
        target: { value: 'Test123' }
      });
      fireEvent.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/username already exists/i)).toBeInTheDocument();
      });
    });

    test('TC_REGISTER_INT_08: Network error', async () => {
      axios.post.mockRejectedValueOnce(new Error('Network Error'));

      renderWithRouter(<Register />);
      
      fireEvent.change(screen.getByPlaceholderText(/enter username/i), {
        target: { value: 'newuser' }
      });
      fireEvent.change(screen.getByPlaceholderText(/^enter password$/i), {
        target: { value: 'Test123' }
      });
      fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
        target: { value: 'Test123' }
      });
      fireEvent.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });

    test('TC_REGISTER_INT_09: Error cleared khi input change', async () => {
      renderWithRouter(<Register />);
      
      fireEvent.change(screen.getByPlaceholderText(/enter username/i), {
        target: { value: 'ab' }
      });
      fireEvent.change(screen.getByPlaceholderText(/^enter password$/i), {
        target: { value: 'Test123' }
      });
      fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
        target: { value: 'Test123' }
      });
      fireEvent.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/username too short/i)).toBeInTheDocument();
      });

      // Clear error by typing
      fireEvent.change(screen.getByPlaceholderText(/enter username/i), {
        target: { value: 'newuser' }
      });

      await waitFor(() => {
        expect(screen.queryByText(/username too short/i)).not.toBeInTheDocument();
      });
    });

    test('TC_REGISTER_INT_10: Button disabled khi loading', async () => {
      axios.post.mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({ data: { success: true } }), 1000))
      );

      renderWithRouter(<Register />);
      
      fireEvent.change(screen.getByPlaceholderText(/enter username/i), {
        target: { value: 'newuser' }
      });
      fireEvent.change(screen.getByPlaceholderText(/^enter password$/i), {
        target: { value: 'Test123' }
      });
      fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
        target: { value: 'Test123' }
      });
      
      const submitButton = screen.getByRole('button', { name: /register/i });
      fireEvent.click(submitButton);

      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent(/registering/i);
    });
  });
});
