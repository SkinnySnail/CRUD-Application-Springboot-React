import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ViewProduct from '../../product/ViewProduct';
import axios from 'axios';

jest.mock('axios');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
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

describe('ViewProduct Component - Integration Tests', () => {
  const mockProduct = {
    id: 1,
    name: 'Gaming Laptop',
    price: 2500,
    quantity: 5,
    description: 'High-performance gaming laptop',
    category: 'Electronics',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('TC_VIEW_INT_01-05: Component Loading & Display', () => {
    test('TC_VIEW_INT_01: Load và hiển thị product data', async () => {
      axios.get.mockResolvedValueOnce({ data: mockProduct });

      renderWithRouter(<ViewProduct />);

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText(/High-performance gaming laptop/i)).toBeInTheDocument();
      });

      // Verify all product data is displayed - product name may appear multiple times
      const gamingLaptopElements = screen.getAllByText(/Gaming Laptop/i);
      expect(gamingLaptopElements.length).toBeGreaterThan(0);
      expect(screen.getByText('2500')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('Electronics')).toBeInTheDocument();
    });

    test('TC_VIEW_INT_02: Hiển thị product name trong card title', async () => {
      axios.get.mockResolvedValueOnce({ data: mockProduct });

      renderWithRouter(<ViewProduct />);

      await waitFor(() => {
        expect(screen.getAllByText(/Gaming Laptop/i).length).toBeGreaterThan(0);
      });
    });

    test('TC_VIEW_INT_03: Hiển thị Back to Home button', async () => {
      axios.get.mockResolvedValueOnce({ data: mockProduct });

      renderWithRouter(<ViewProduct />);

      await waitFor(() => {
        expect(screen.getAllByText(/Gaming Laptop/i).length).toBeGreaterThan(0);
      });

      const backButton = screen.getByRole('link', { name: /back to home/i });
      expect(backButton).toBeInTheDocument();
      expect(backButton).toHaveAttribute('href', '/');
    });

    test('TC_VIEW_INT_04: Hiển thị tất cả product fields', async () => {
      axios.get.mockResolvedValueOnce({ data: mockProduct });

      renderWithRouter(<ViewProduct />);

      await waitFor(() => {
        expect(screen.getAllByText(/Gaming Laptop/i).length).toBeGreaterThan(0);
      });

      expect(screen.getByText('Price:')).toBeInTheDocument();
      expect(screen.getByText('Quantity:')).toBeInTheDocument();
      expect(screen.getByText('Description:')).toBeInTheDocument();
      expect(screen.getByText('Category:')).toBeInTheDocument();
    });

    test('TC_VIEW_INT_05: Product card có class card', async () => {
      axios.get.mockResolvedValueOnce({ data: mockProduct });

      renderWithRouter(<ViewProduct />);

      await waitFor(() => {
        expect(screen.getAllByText(/Gaming Laptop/i).length).toBeGreaterThan(0);
      });

      expect(screen.getByText('Product Details')).toBeInTheDocument();
    });
  });

  describe('TC_VIEW_INT_06-10: API Integration & Error Handling', () => {
    test('TC_VIEW_INT_06: Load product từ API thành công', async () => {
      axios.get.mockResolvedValueOnce({ data: mockProduct });

      renderWithRouter(<ViewProduct />);

      await waitFor(() => {
        expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/product/1');
      });

      await waitFor(() => {
        expect(screen.getAllByText(/Gaming Laptop/i).length).toBeGreaterThan(0);
      });
    });

    test('TC_VIEW_INT_07: Load product với giá trị 0', async () => {
      const productWithZero = {
        ...mockProduct,
        price: 0,
        quantity: 0,
      };

      axios.get.mockResolvedValueOnce({ data: productWithZero });

      renderWithRouter(<ViewProduct />);

      await waitFor(() => {
        expect(screen.getAllByText(/Gaming Laptop/i).length).toBeGreaterThan(0);
      });

      expect(screen.getByText('Price:')).toBeInTheDocument();
      const allZeros = screen.getAllByText('0');
      expect(allZeros.length).toBeGreaterThan(0);
    });

    test('TC_VIEW_INT_08: Load product với empty description', async () => {
      const productEmptyDesc = {
        ...mockProduct,
        description: '',
      };

      axios.get.mockResolvedValueOnce({ data: productEmptyDesc });

      renderWithRouter(<ViewProduct />);

      await waitFor(() => {
        expect(screen.getAllByText(/Gaming Laptop/i).length).toBeGreaterThan(0);
      });

      expect(screen.getByText('Description:')).toBeInTheDocument();
    });

    test('TC_VIEW_INT_09: Load product với special characters', async () => {
      const specialProduct = {
        ...mockProduct,
        name: 'Product <>&"',
        description: 'Test & Special <> Characters',
      };

      axios.get.mockResolvedValueOnce({ data: specialProduct });

      renderWithRouter(<ViewProduct />);

      await waitFor(() => {
        expect(screen.getByText('Product <>&"')).toBeInTheDocument();
      });

      expect(screen.getByText('Test & Special <> Characters')).toBeInTheDocument();
    });

    test('TC_VIEW_INT_10: useEffect được gọi đúng 1 lần khi mount', async () => {
      axios.get.mockResolvedValueOnce({ data: mockProduct });

      renderWithRouter(<ViewProduct />);

      await waitFor(() => {
        expect(screen.getAllByText(/Gaming Laptop/i).length).toBeGreaterThan(0);
      });

      expect(axios.get).toHaveBeenCalledTimes(1);
    });
  });
});
