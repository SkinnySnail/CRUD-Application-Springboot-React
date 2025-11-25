import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AddProduct from '../../product/AddProduct';
import axios from 'axios';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

jest.mock('axios');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('AddProduct Component - Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
  });

  describe('TC_PRODUCT_INT_01-05: Form Validation', () => {
    test('TC_PRODUCT_INT_01: Hiển thị lỗi khi name rỗng', async () => {
      renderWithRouter(<AddProduct />);
      
      fireEvent.change(screen.getByPlaceholderText(/enter price/i), { 
        target: { value: '15000000' } 
      });
      fireEvent.change(screen.getByPlaceholderText(/enter quantity/i), { 
        target: { value: '10' } 
      });
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith(
          expect.stringMatching(/Validation failed.*Product name is required/i)
        );
      });
    });

    test('TC_PRODUCT_INT_02: Hiển thị lỗi khi price = 0', async () => {
      renderWithRouter(<AddProduct />);
      
      fireEvent.change(screen.getByPlaceholderText(/enter product name/i), { 
        target: { value: 'Laptop Dell' } 
      });
      fireEvent.change(screen.getByPlaceholderText(/enter price/i), { 
        target: { value: '0' } 
      });
      fireEvent.change(screen.getByPlaceholderText(/enter quantity/i), { 
        target: { value: '10' } 
      });
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith(
          expect.stringMatching(/Validation failed.*Price must be greater than 0/i)
        );
      });
    });

    test('TC_PRODUCT_INT_03: Hiển thị lỗi khi quantity âm', async () => {
      renderWithRouter(<AddProduct />);
      
      fireEvent.change(screen.getByPlaceholderText(/enter product name/i), { 
        target: { value: 'Laptop Dell' } 
      });
      fireEvent.change(screen.getByPlaceholderText(/enter price/i), { 
        target: { value: '15000000' } 
      });
      fireEvent.change(screen.getByPlaceholderText(/enter quantity/i), { 
        target: { value: '-1' } 
      });
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith(
          expect.stringMatching(/Validation failed.*Quantity cannot be negative/i)
        );
      });
    });

    test('TC_PRODUCT_INT_04: Hiển thị lỗi khi name quá ngắn', async () => {
      renderWithRouter(<AddProduct />);
      
      fireEvent.change(screen.getByPlaceholderText(/enter product name/i), { 
        target: { value: 'ab' } 
      });
      fireEvent.change(screen.getByPlaceholderText(/enter price/i), { 
        target: { value: '15000000' } 
      });
      fireEvent.change(screen.getByPlaceholderText(/enter quantity/i), { 
        target: { value: '10' } 
      });
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith(
          expect.stringMatching(/Validation failed.*Product name too short/i)
        );
      });
    });

    test('TC_PRODUCT_INT_05: Hiển thị lỗi khi description quá dài', async () => {
      renderWithRouter(<AddProduct />);
      
      const longDescription = 'a'.repeat(501);
      fireEvent.change(screen.getByPlaceholderText(/enter product name/i), { 
        target: { value: 'Laptop Dell' } 
      });
      fireEvent.change(screen.getByPlaceholderText(/enter price/i), { 
        target: { value: '15000000' } 
      });
      fireEvent.change(screen.getByPlaceholderText(/enter quantity/i), { 
        target: { value: '10' } 
      });
      fireEvent.change(screen.getByPlaceholderText(/enter description/i), { 
        target: { value: longDescription } 
      });
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith(
          expect.stringMatching(/Validation failed.*Description too long/i)
        );
      });
    });
  });

  describe('TC_PRODUCT_INT_06-10: API Integration & User Interaction', () => {
    test('TC_PRODUCT_INT_06: Tạo product thành công - gọi API và redirect', async () => {
      axios.post.mockResolvedValueOnce({ data: { id: 1 } });

      renderWithRouter(<AddProduct />);
      
      fireEvent.change(screen.getByPlaceholderText(/enter product name/i), { 
        target: { value: 'Laptop Dell' } 
      });
      fireEvent.change(screen.getByPlaceholderText(/enter price/i), { 
        target: { value: '15000000' } 
      });
      fireEvent.change(screen.getByPlaceholderText(/enter quantity/i), { 
        target: { value: '10' } 
      });
      
      const categorySelect = screen.getByRole('combobox');
      fireEvent.change(categorySelect, { target: { value: 'Electronics' } });
      
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/product', {
          name: 'Laptop Dell',
          price: '15000000',
          quantity: '10',
          description: '',
          category: 'Electronics'
        });
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    test('TC_PRODUCT_INT_07: Dropdown category hiển thị đúng options', () => {
      renderWithRouter(<AddProduct />);
      
      const categorySelect = screen.getByRole('combobox');
      const options = categorySelect.querySelectorAll('option');
      
      expect(options).toHaveLength(6); // 1 placeholder + 5 categories
      expect(options[0].textContent).toBe('Select a category');
      expect(options[1].textContent).toBe('Electronics');
    });

    test('TC_PRODUCT_INT_08: Cancel button redirect về home', () => {
      renderWithRouter(<AddProduct />);
      
      const cancelButton = screen.getByRole('link', { name: /cancel/i });
      expect(cancelButton).toHaveAttribute('href', '/');
    });

    test('TC_PRODUCT_INT_09: Form hiển thị đầy đủ các fields', () => {
      renderWithRouter(<AddProduct />);
      
      expect(screen.getByText('Register Product')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/enter product name/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/enter price/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/enter quantity/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/enter description/i)).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    test('TC_PRODUCT_INT_10: Input change cập nhật state đúng', () => {
      renderWithRouter(<AddProduct />);
      
      const nameInput = screen.getByPlaceholderText(/enter product name/i);
      const priceInput = screen.getByPlaceholderText(/enter price/i);
      
      fireEvent.change(nameInput, { target: { value: 'Test Product' } });
      fireEvent.change(priceInput, { target: { value: '1000' } });
      
      expect(nameInput.value).toBe('Test Product');
      expect(priceInput.value).toBe('1000');
    });
  });
});