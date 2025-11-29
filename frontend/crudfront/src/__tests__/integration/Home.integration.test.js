import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Home from "../../pages/Home";
import axiosInstance from "../../util/axiosConfig";

jest.mock("../../util/axiosConfig");
jest.mock("../../hooks/useAuth");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => ({}),
  Link: ({ children, to, className }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}));

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("Home Component - Integration Tests", () => {
  const mockProducts = [
    {
      id: 1,
      name: "Laptop",
      price: 1000,
      quantity: 10,
      description: "High-end laptop",
      category: "Electronics",
    },
    {
      id: 2,
      name: "Mouse",
      price: 20,
      quantity: 50,
      description: "Wireless mouse",
      category: "Accessories",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Clear console.error mock nếu có
    if (console.error.mockRestore) {
      console.error.mockRestore();
    }
  });

  describe("TC_HOME_INT_01-05: Product List Display", () => {
    test("TC_HOME_INT_01: Hiển thị table headers đầy đủ", () => {
      axiosInstance.get.mockResolvedValueOnce({ data: [] });

      renderWithRouter(<Home />);

      expect(screen.getByText("ID")).toBeInTheDocument();
      expect(screen.getAllByText("Product Name").length).toBeGreaterThan(0);
      expect(screen.getByText("Price")).toBeInTheDocument();
      expect(screen.getByText("Quantity")).toBeInTheDocument();
      expect(screen.getByText("Description")).toBeInTheDocument();
      expect(screen.getAllByText("Category").length).toBeGreaterThan(0);
      expect(screen.getByText("Actions")).toBeInTheDocument();
    });

    test("TC_HOME_INT_02: Load danh sách products thành công", async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: mockProducts });

      renderWithRouter(<Home />);

      await waitFor(() => {
        expect(axiosInstance.get).toHaveBeenCalledWith("/products");
      });

      await waitFor(() => {
        expect(screen.getByText("Laptop")).toBeInTheDocument();
        expect(screen.getByText("Mouse")).toBeInTheDocument();
        expect(screen.getByText("1000")).toBeInTheDocument();
        expect(screen.getByText("20")).toBeInTheDocument();
      });
    });

    test("TC_HOME_INT_03: Hiển thị empty list khi không có products", async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: [] });

      renderWithRouter(<Home />);

      await waitFor(() => {
        expect(axiosInstance.get).toHaveBeenCalledWith("/products");
      });

      // Table vẫn render nhưng không có rows
      const tbody = screen.getByRole("table").querySelector("tbody");
      expect(tbody.children.length).toBe(0);
    });

    test("TC_HOME_INT_04: Hiển thị đầy đủ thông tin mỗi product", async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: [mockProducts[0]] });

      renderWithRouter(<Home />);

      await waitFor(() => {
        expect(screen.getByText("1")).toBeInTheDocument();
        expect(screen.getByText("Laptop")).toBeInTheDocument();
        expect(screen.getByText("1000")).toBeInTheDocument();
        expect(screen.getByText("10")).toBeInTheDocument();
        expect(screen.getByText("High-end laptop")).toBeInTheDocument();
        expect(screen.getByText("Electronics")).toBeInTheDocument();
      });
    });

    test("TC_HOME_INT_05: Hiển thị action buttons cho mỗi product", async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: [mockProducts[0]] });

      renderWithRouter(<Home />);

      await waitFor(() => {
        const viewButtons = screen.getAllByText("View");
        const editButtons = screen.getAllByText("Edit");
        const deleteButtons = screen.getAllByText("Delete");

        expect(viewButtons.length).toBeGreaterThan(0);
        expect(editButtons.length).toBeGreaterThan(0);
        expect(deleteButtons.length).toBeGreaterThan(0);
      });
    });
  });

  describe("TC_HOME_INT_06-10: Product Actions", () => {
    test("TC_HOME_INT_06: View button có link đúng", async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: [mockProducts[0]] });

      renderWithRouter(<Home />);

      await waitFor(() => {
        const viewLink = screen.getByText("View").closest("a");
        expect(viewLink).toHaveAttribute("href", "/viewproduct/1");
      });
    });

    test("TC_HOME_INT_07: Edit button có link đúng", async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: [mockProducts[0]] });

      renderWithRouter(<Home />);

      await waitFor(() => {
        const editLink = screen.getByText("Edit").closest("a");
        expect(editLink).toHaveAttribute("href", "/editproduct/1");
      });
    });

    test("TC_HOME_INT_08: Delete product thành công", async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: mockProducts });
      axiosInstance.delete.mockResolvedValueOnce({ data: { success: true } });
      axiosInstance.get.mockResolvedValueOnce({ data: [mockProducts[1]] });

      renderWithRouter(<Home />);

      await waitFor(() => {
        expect(screen.getByText("Laptop")).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText("Delete");
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(axiosInstance.delete).toHaveBeenCalledWith("/product/1");
        expect(axiosInstance.get).toHaveBeenCalledTimes(2); // Initial load + reload after delete
      });
    });

    test("TC_HOME_INT_09: Delete nhiều products", async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: mockProducts });
      axiosInstance.delete.mockResolvedValue({ data: { success: true } });
      axiosInstance.get.mockResolvedValue({ data: [] });

      renderWithRouter(<Home />);

      await waitFor(() => {
        expect(screen.getByText("Laptop")).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText("Delete");

      // Delete first product
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(axiosInstance.delete).toHaveBeenCalledWith("/product/1");
      });

      // Delete second product
      fireEvent.click(deleteButtons[1]);

      await waitFor(() => {
        expect(axiosInstance.delete).toHaveBeenCalledWith("/product/2");
        expect(axiosInstance.get).toHaveBeenCalledTimes(3); // Initial + 2 reloads
      });
    });

    test("TC_HOME_INT_10: Reload products sau khi delete", async () => {
      const initialProducts = mockProducts;
      const afterDeleteProducts = [mockProducts[1]];

      axiosInstance.get.mockResolvedValueOnce({ data: initialProducts });
      axiosInstance.delete.mockResolvedValueOnce({ data: { success: true } });
      axiosInstance.get.mockResolvedValueOnce({ data: afterDeleteProducts });

      renderWithRouter(<Home />);

      await waitFor(() => {
        expect(screen.getByText("Laptop")).toBeInTheDocument();
        expect(screen.getByText("Mouse")).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText("Delete");
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(axiosInstance.get).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe("TC_HOME_INT_11-13: Edge Cases", () => {
    test("TC_HOME_INT_11: Render với product có giá trị đặc biệt", async () => {
      const specialProduct = {
        id: 999,
        name: "Special-Product_123",
        price: 0,
        quantity: 0,
        description: "",
        category: "Test",
      };

      axiosInstance.get.mockResolvedValueOnce({ data: [specialProduct] });

      renderWithRouter(<Home />);

      await waitFor(() => {
        expect(screen.getByText("999")).toBeInTheDocument();
      });

      expect(screen.getByText("Special-Product_123")).toBeInTheDocument();
      expect(screen.getAllByText("0").length).toBeGreaterThan(0); // Price and Quantity both are 0
    });

    test("TC_HOME_INT_12: Render nhiều products cùng lúc", async () => {
      const manyProducts = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: `Product ${i + 1}`,
        price: 100 * (i + 1),
        quantity: 10 * (i + 1),
        description: `Description ${i + 1}`,
        category: `Category ${(i % 3) + 1}`,
      }));

      axiosInstance.get.mockResolvedValueOnce({ data: manyProducts });

      renderWithRouter(<Home />);

      await waitFor(() => {
        expect(screen.getByText("Product 1")).toBeInTheDocument();
      });

      expect(screen.getByText("Product 20")).toBeInTheDocument();

      const deleteButtons = screen.getAllByText("Delete");
      expect(deleteButtons.length).toBe(20);
    });

    test("TC_HOME_INT_13: useAuth được gọi khi component mount", async () => {
      const useAuth = require("../../hooks/useAuth").default;
      axiosInstance.get.mockResolvedValueOnce({ data: [] });

      renderWithRouter(<Home />);

      expect(useAuth).toHaveBeenCalled();
    });
  });

  describe("TC_HOME_INT_14-20: Search Functionality", () => {
    test("TC_HOME_INT_14: Search by keyword thành công", async () => {
      const searchResults = [mockProducts[0]];
      axiosInstance.get.mockResolvedValueOnce({ data: mockProducts });
      axiosInstance.get.mockResolvedValueOnce({ data: searchResults });

      renderWithRouter(<Home />);

      await waitFor(() => {
        expect(screen.getByText("Laptop")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/enter search term/i);
      const searchButton = screen.getByRole("button", { name: /search/i });

      fireEvent.change(searchInput, { target: { value: "Laptop" } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(axiosInstance.get).toHaveBeenCalledWith("/products/search", {
          params: { keyword: "Laptop" },
        });
      });
    });

    test("TC_HOME_INT_15: Search với empty input - show tất cả products", async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: mockProducts });

      renderWithRouter(<Home />);

      await waitFor(() => {
        expect(screen.getByText("Laptop")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/enter search term/i);
      const searchButton = screen.getByRole("button", { name: /search/i });

      fireEvent.change(searchInput, { target: { value: "   " } });
      fireEvent.click(searchButton);

      // Should not call API when search is empty
      expect(axiosInstance.get).toHaveBeenCalledTimes(1); // Only initial load
    });

    test("TC_HOME_INT_16: Clear button reset search", async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: mockProducts });

      renderWithRouter(<Home />);

      await waitFor(() => {
        expect(screen.getByText("Laptop")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/enter search term/i);
      const clearButton = screen.getByRole("button", { name: /clear/i });

      fireEvent.change(searchInput, { target: { value: "Test" } });
      expect(searchInput.value).toBe("Test");

      fireEvent.click(clearButton);
      expect(searchInput.value).toBe("");
    });

    test("TC_HOME_INT_17: Search type dropdown works", async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: mockProducts });

      renderWithRouter(<Home />);

      const searchTypeSelect = screen.getByLabelText(/search by/i);

      expect(searchTypeSelect.value).toBe("keyword");

      fireEvent.change(searchTypeSelect, { target: { value: "name" } });
      expect(searchTypeSelect.value).toBe("name");

      fireEvent.change(searchTypeSelect, { target: { value: "category" } });
      expect(searchTypeSelect.value).toBe("category");
    });

    test("TC_HOME_INT_18: Search error handling", async () => {
      axiosInstance.get.mockResolvedValueOnce({ data: mockProducts });
      axiosInstance.get.mockRejectedValueOnce(new Error("Network error"));

      window.alert = jest.fn();

      renderWithRouter(<Home />);

      await waitFor(() => {
        expect(screen.getByText("Laptop")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/enter search term/i);
      const searchButton = screen.getByRole("button", { name: /search/i });

      fireEvent.change(searchInput, { target: { value: "Test" } });
      fireEvent.click(searchButton);

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith(
          "Failed to search products. Please try again."
        );
      });
    });
  });
});
