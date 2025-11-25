import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EditProduct from '../../product/EditProduct';
import axios from 'axios';

jest.mock('axios');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '1' }),
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="*" element={component} />
      </Routes>
    </BrowserRouter>
  );
};

describe('EditProduct Component - Integration Tests', () => {
  const mockProduct = {
    id: 1,
    name: 'Laptop',
    price: 1000,
    quantity: 10,
    description: 'High-end laptop',
    category: 'Electronics',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
  });

  describe('TC_EDIT_INT_01-05: Form Loading & Display', () => {
    test('TC_EDIT_INT_01: Load product data khi component mount', async () => {
      axios.get.mockResolvedValueOnce({ data: mockProduct });

      renderWithRouter(<EditProduct />);

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/product/1');
      });

      await waitFor(() => {
        expect(screen.getByDisplayValue('Laptop')).toBeInTheDocument();
        expect(screen.getByDisplayValue('1000')).toBeInTheDocument();
        expect(screen.getByDisplayValue('10')).toBeInTheDocument();
      });
    });

    test('TC_EDIT_INT_02: Hiển thị heading "Edit Product"', () => {
      axios.get.mockResolvedValueOnce({ data: mockProduct });

      renderWithRouter(<EditProduct />);

      expect(screen.getByRole('heading', { name: /edit product/i })).toBeInTheDocument();
    });

    test('TC_EDIT_INT_03: Hiển thị tất cả input fields', async () => {
      axios.get.mockResolvedValueOnce({ data: mockProduct });

      renderWithRouter(<EditProduct />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Laptop')).toBeInTheDocument();
      });

      expect(screen.getByPlaceholderText(/enter product name/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/enter price/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/enter quantity/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/enter description/i)).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument(); // Category is a select dropdown
    });

    test('TC_EDIT_INT_04: Hiển thị Submit và Cancel buttons', async () => {
      axios.get.mockResolvedValueOnce({ data: mockProduct });

      renderWithRouter(<EditProduct />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /cancel/i })).toBeInTheDocument();
      });
    });

    test('TC_EDIT_INT_05: Cancel button có link về home', async () => {
      axios.get.mockResolvedValueOnce({ data: mockProduct });

      renderWithRouter(<EditProduct />);

      await waitFor(() => {
        const cancelLink = screen.getByRole('link', { name: /cancel/i });
        expect(cancelLink).toHaveAttribute('href', '/');
      });
    });
  });

  describe('TC_EDIT_INT_06-10: Form Input & Validation', () => {
    test('TC_EDIT_INT_06: Input change cập nhật giá trị', async () => {
      axios.get.mockResolvedValueOnce({ data: mockProduct });

      renderWithRouter(<EditProduct />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Laptop')).toBeInTheDocument();
      });

      const nameInput = screen.getByPlaceholderText(/enter product name/i);
      fireEvent.change(nameInput, { target: { value: 'Updated Laptop' } });

      expect(nameInput.value).toBe('Updated Laptop');
    });

    test('TC_EDIT_INT_07: Validation lỗi khi name rỗng', async () => {
      axios.get.mockResolvedValueOnce({ data: mockProduct });

      renderWithRouter(<EditProduct />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Laptop')).toBeInTheDocument();
      });

      const nameInput = screen.getByPlaceholderText(/enter product name/i);
      fireEvent.change(nameInput, { target: { value: '' } });

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalled();
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    test('TC_EDIT_INT_08: Validation lỗi khi price = 0', async () => {
      axios.get.mockResolvedValueOnce({ data: mockProduct });

      renderWithRouter(<EditProduct />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('1000')).toBeInTheDocument();
      });

      const priceInput = screen.getByPlaceholderText(/enter price/i);
      fireEvent.change(priceInput, { target: { value: '0' } });

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalled();
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    test('TC_EDIT_INT_09: Validation lỗi khi quantity âm', async () => {
      axios.get.mockResolvedValueOnce({ data: mockProduct });

      renderWithRouter(<EditProduct />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('10')).toBeInTheDocument();
      });

      const quantityInput = screen.getByPlaceholderText(/enter quantity/i);
      fireEvent.change(quantityInput, { target: { value: '-5' } });

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalled();
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    test('TC_EDIT_INT_10: Update thành công với dữ liệu hợp lệ', async () => {
      axios.get.mockResolvedValueOnce({ data: mockProduct });
      axios.put.mockResolvedValueOnce({ data: { success: true } });

      renderWithRouter(<EditProduct />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Laptop')).toBeInTheDocument();
      });

      const nameInput = screen.getByPlaceholderText(/enter product name/i);
      fireEvent.change(nameInput, { target: { value: 'Updated Laptop' } });

      const priceInput = screen.getByPlaceholderText(/enter price/i);
      fireEvent.change(priceInput, { target: { value: '1500' } });

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(axios.put).toHaveBeenCalledWith('http://localhost:8080/product/1', {
          id: 1,
          name: 'Updated Laptop',
          price: '1500',
          quantity: 10,
          description: 'High-end laptop',
          category: 'Electronics',
        });
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });
  });

  describe('TC_EDIT_INT_11-15: API Integration & Error Handling', () => {
    test('TC_EDIT_INT_11: Load product từ API', async () => {
      axios.get.mockResolvedValueOnce({ data: mockProduct });

      renderWithRouter(<EditProduct />);

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/product/1');
      });

      await waitFor(() => {
        expect(screen.getByDisplayValue('Laptop')).toBeInTheDocument();
      });
    });

    test('TC_EDIT_INT_12: API được gọi khi submit form', async () => {
      axios.get.mockResolvedValueOnce({ data: mockProduct });
      axios.put.mockResolvedValueOnce({ data: { success: true } });

      renderWithRouter(<EditProduct />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Laptop')).toBeInTheDocument();
      });

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(axios.put).toHaveBeenCalled();
      });
    });

    test('TC_EDIT_INT_13: Update tất cả fields', async () => {
      axios.get.mockResolvedValueOnce({ data: mockProduct });
      axios.put.mockResolvedValueOnce({ data: { success: true } });

      renderWithRouter(<EditProduct />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Laptop')).toBeInTheDocument();
      });

      // Change product name only
      const nameInput = screen.getByPlaceholderText(/enter product name/i);
      fireEvent.change(nameInput, { target: { value: 'New Laptop' } });

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(axios.put).toHaveBeenCalledWith('http://localhost:8080/product/1', 
          expect.objectContaining({
            name: 'New Laptop',
          })
        );
      });
    });

    test('TC_EDIT_INT_14: Load product với empty values', async () => {
      const emptyProduct = {
        id: 1,
        name: '',
        price: '',
        quantity: '',
        description: '',
        category: '',
      };

      axios.get.mockResolvedValueOnce({ data: emptyProduct });

      renderWithRouter(<EditProduct />);

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/product/1');
      });

      const nameInput = screen.getByPlaceholderText(/enter product name/i);
      expect(nameInput.value).toBe('');
    });

    test('TC_EDIT_INT_15: Submit form bằng Enter key', async () => {
      axios.get.mockResolvedValueOnce({ data: mockProduct });
      axios.put.mockResolvedValueOnce({ data: { success: true } });

      renderWithRouter(<EditProduct />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Laptop')).toBeInTheDocument();
      });

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(axios.put).toHaveBeenCalledWith('http://localhost:8080/product/1', {
          id: 1,
          name: 'Laptop',
          price: 1000,
          quantity: 10,
          description: 'High-end laptop',
          category: 'Electronics',
        });
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });
  });
});
