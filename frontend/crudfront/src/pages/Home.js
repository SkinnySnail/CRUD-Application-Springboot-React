import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../util/axiosConfig";
import useAuth from "../hooks/useAuth";

export default function Home() {
  useAuth(); // Check authentication

  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [searchType, setSearchType] = useState('keyword');
  const [searchValue, setSearchValue] = useState('');

  const { id } = useParams();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const result = await axiosInstance.get("/products");
    setProducts(result.data);
    setAllProducts(result.data);
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchValue.trim()) {
      setProducts(allProducts);
      return;
    }

    try {
      const params = {};
      params[searchType] = searchValue.trim();

      const result = await axiosInstance.get('/products/search', {
        params: params
      });

      setProducts(result.data);
    } catch (error) {
      console.error('Error searching products:', error);
      alert('Failed to search products. Please try again.');
    }
  };

  const handleClear = () => {
    setSearchValue('');
    setProducts(allProducts);
  };

  const deleteProduct = async (id) => {
    await axiosInstance.delete(`/product/${id}`);
    loadProducts();
  };

  return (
    <div className="container">
      <div className="py-4">
        {/* Search Bar */}
        <div className="card mb-4">
          <div className="card-body">
            <form onSubmit={handleSearch}>
              <div className="row g-3">
                <div className="col-md-3">
                  <label htmlFor="searchType" className="form-label">Search By</label>
                  <select
                    className="form-select"
                    id="searchType"
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                  >
                    <option value="keyword">Keyword (Name or Category)</option>
                    <option value="name">Product Name</option>
                    <option value="category">Category</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="searchValue" className="form-label">Search</label>
                  <input
                    type="text"
                    className="form-control"
                    id="searchValue"
                    placeholder="Enter search term..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </div>
                <div className="col-md-3 d-flex align-items-end">
                  <button type="submit" className="btn btn-primary me-2">
                    Search
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleClear}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Products Table */}
        <table className="table border shadow">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Product Name</th>
              <th scope="col">Price</th>
              <th scope="col">Quantity</th>
              <th scope="col">Description</th>
              <th scope="col">Category</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                <th scope="row">{product.id}</th>
                <td>{product.productName}</td>
                <td>{product.price}</td>
                <td>{product.quantity}</td>
                <td>{product.description}</td>
                <td>{product.category}</td>
                <td>
                  <Link
                    className="btn btn-primary mx-2"
                    to={`/viewproduct/${product.id}`}
                  >
                    View
                  </Link>
                  <Link
                    className="btn btn-outline-primary mx-2"
                    to={`/editproduct/${product.id}`}
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-danger mx-2"
                    onClick={() => deleteProduct(product.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}