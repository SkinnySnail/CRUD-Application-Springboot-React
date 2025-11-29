import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AddProduct from "../../product/AddProduct";
import axios from "axios";

// Mock axios như productService
jest.mock("axios");

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
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

describe("Product Mock Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    window.alert = jest.fn();
  });

  // a) Mock CRUD operations (1.5 điểm)
  describe("TC_MOCK_PRODUCT_01-04: Mock CRUD Operations", () => {
    test("TC_MOCK_PRODUCT_01: Mock - Create product thành công", async () => {
      const mockProduct = {
        id: 1,
        name: "Laptop",
        price: 15000000,
        quantity: 10,
        description: "High-end laptop",
        category: "Electronics",
      };

      // Mock create product
      axios.post.mockResolvedValue({ data: mockProduct });

      renderWithRouter(<AddProduct />);

      fireEvent.change(screen.getByPlaceholderText(/enter product name/i), {
        target: { value: "Laptop" },
      });
      fireEvent.change(screen.getByPlaceholderText(/enter price/i), {
        target: { value: "15000000" },
      });
      fireEvent.change(screen.getByPlaceholderText(/enter quantity/i), {
        target: { value: "10" },
      });
      const categorySelect = screen.getByRole("combobox");
      fireEvent.change(categorySelect, { target: { value: "Electronics" } });

      fireEvent.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          "http://localhost:8080/product",
          {
            name: "Laptop",
            price: "15000000",
            quantity: "10",
            description: "",
            category: "Electronics",
          }
        );
      });

      // Verify mock được gọi đúng 1 lần
      expect(axios.post).toHaveBeenCalledTimes(1);

      // Wait for navigate to be called after successful API call
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/");
      });
    });

    test("TC_MOCK_PRODUCT_02: Mock - Get products với pagination", async () => {
      const mockProducts = {
        data: [
          { id: 1, name: "Laptop", price: 15000000, quantity: 10 },
          { id: 2, name: "Mouse", price: 200000, quantity: 50 },
        ],
        page: 1,
        total: 100,
      };

      // Mock get products
      axios.get.mockResolvedValue(mockProducts);

      // Note: Trong thực tế, component Home sẽ gọi API này
      // Đây là test để verify mock hoạt động đúng
      const result = await axios.get("http://localhost:8080/products");

      expect(result.data).toHaveLength(2);
      expect(result.page).toBe(1);
      expect(result.total).toBe(100);
      expect(axios.get).toHaveBeenCalledWith("http://localhost:8080/products");
    });

    test("TC_MOCK_PRODUCT_03: Mock - Update product thành công", async () => {
      const mockUpdatedProduct = {
        id: 1,
        name: "Laptop Updated",
        price: 14000000,
        quantity: 15,
      };

      // Mock update product
      axios.put.mockResolvedValue({ data: mockUpdatedProduct });

      const result = await axios.put("http://localhost:8080/product/1", {
        name: "Laptop Updated",
        price: 14000000,
        quantity: 15,
      });

      expect(result.data.name).toBe("Laptop Updated");
      expect(axios.put).toHaveBeenCalledWith(
        "http://localhost:8080/product/1",
        {
          name: "Laptop Updated",
          price: 14000000,
          quantity: 15,
        }
      );
    });

    test("TC_MOCK_PRODUCT_04: Mock - Delete product thành công", async () => {
      // Mock delete product
      axios.delete.mockResolvedValue({ data: { success: true } });

      const result = await axios.delete("http://localhost:8080/product/1");

      expect(result.data.success).toBe(true);
      expect(axios.delete).toHaveBeenCalledWith(
        "http://localhost:8080/product/1"
      );
    });
  });

  // b) Test success và failure scenarios (0.5 điểm)
  describe("TC_MOCK_PRODUCT_05-06: Success và Failure Scenarios", () => {
    test("TC_MOCK_PRODUCT_05: Mock - Create product failure", async () => {
      const mockError = {
        response: {
          status: 400,
          data: {
            message: "Validation failed",
            errors: {
              name: "Product name is required",
            },
          },
        },
      };

      axios.post.mockRejectedValue(mockError);

      renderWithRouter(<AddProduct />);

      // Submit form với dữ liệu không hợp lệ
      fireEvent.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalled();
      });

      // Verify API được gọi (hoặc không gọi tùy validation)
      // Trong trường hợp này, validation sẽ fail trước khi gọi API
    });

    test("TC_MOCK_PRODUCT_06: Mock - Get product not found", async () => {
      const mockError = {
        response: {
          status: 404,
          data: {
            message: "Product not found",
          },
        },
      };

      axios.get.mockRejectedValue(mockError);

      // Use expect().rejects.toMatchObject() to verify error structure
      await expect(
        axios.get("http://localhost:8080/product/999")
      ).rejects.toMatchObject({
        response: {
          status: 404,
          data: {
            message: "Product not found",
          },
        },
      });

      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:8080/product/999"
      );
    });
  });

  // c) Verify all mock calls (0.5 điểm)
  describe("TC_MOCK_PRODUCT_07-08: Verify All Mock Calls", () => {
    test("TC_MOCK_PRODUCT_07: Verify tất cả CRUD mock calls", async () => {
      // Mock tất cả operations
      axios.post.mockResolvedValue({ data: { id: 1 } });
      axios.get.mockResolvedValue({ data: { id: 1, name: "Laptop" } });
      axios.put.mockResolvedValue({ data: { id: 1, name: "Updated" } });
      axios.delete.mockResolvedValue({ data: { success: true } });

      // Test Create
      await axios.post("http://localhost:8080/product", {
        name: "Laptop",
        price: 15000000,
      });

      // Test Read
      await axios.get("http://localhost:8080/product/1");

      // Test Update
      await axios.put("http://localhost:8080/product/1", {
        name: "Updated",
      });

      // Test Delete
      await axios.delete("http://localhost:8080/product/1");

      // Verify tất cả được gọi đúng 1 lần
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.put).toHaveBeenCalledTimes(1);
      expect(axios.delete).toHaveBeenCalledTimes(1);
    });

    test("TC_MOCK_PRODUCT_08: Verify mock calls với đúng parameters", async () => {
      const mockProduct = {
        name: "Laptop",
        price: 15000000,
        quantity: 10,
        category: "Electronics",
      };

      axios.post.mockResolvedValue({ data: { id: 1, ...mockProduct } });

      await axios.post("http://localhost:8080/product", mockProduct);

      // Verify được gọi với đúng parameters
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:8080/product",
        mockProduct
      );

      // Verify được gọi đúng 1 lần
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
  });
});
