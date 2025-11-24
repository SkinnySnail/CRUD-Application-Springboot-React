import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function SearchProduct() {
    const [searchType, setSearchType] = useState('keyword'); // keyword, name, or category
    const [searchValue, setSearchValue] = useState('');
    const [products, setProducts] = useState([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!searchValue.trim()) {
            alert('Please enter a search term');
            return;
        }

        setLoading(true);
        try {
            const params = {};
            params[searchType] = searchValue.trim();

            const result = await axios.get('http://localhost:8080/products/search', {
                params: params
            });

            setProducts(result.data);
            setSearched(true);
        } catch (error) {
            console.error('Error searching products:', error);
            alert('Failed to search products. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setSearchValue('');
        setProducts([]);
        setSearched(false);
    };

    const deleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await axios.delete(`http://localhost:8080/product/${id}`);
                // Remove deleted product from the list
                setProducts(products.filter(product => product.id !== id));
                alert('Product deleted successfully');
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Failed to delete product. Please try again.');
            }
        }
    };

    return (
        <div className='container'>
            <div className='py-4'>
                <h2 className='mb-4'>Search Products</h2>

                {/* Search Form */}
                <div className='card mb-4'>
                    <div className='card-body'>
                        <form onSubmit={handleSearch}>
                            <div className='row g-3'>
                                <div className='col-md-3'>
                                    <label htmlFor='searchType' className='form-label'>Search By</label>
                                    <select
                                        className='form-select'
                                        id='searchType'
                                        value={searchType}
                                        onChange={(e) => setSearchType(e.target.value)}
                                    >
                                        <option value='keyword'>Keyword (Name or Category)</option>
                                        <option value='name'>Product Name</option>
                                        <option value='category'>Category</option>
                                    </select>
                                </div>
                                <div className='col-md-6'>
                                    <label htmlFor='searchValue' className='form-label'>Search Term</label>
                                    <input
                                        type='text'
                                        className='form-control'
                                        id='searchValue'
                                        placeholder='Enter search term...'
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                    />
                                </div>
                                <div className='col-md-3 d-flex align-items-end'>
                                    <button
                                        type='submit'
                                        className='btn btn-primary me-2'
                                        disabled={loading}
                                    >
                                        {loading ? 'Searching...' : 'Search'}
                                    </button>
                                    <button
                                        type='button'
                                        className='btn btn-secondary'
                                        onClick={handleClear}
                                        disabled={loading}
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Search Results */}
                {searched && (
                    <>
                        <div className='d-flex justify-content-between align-items-center mb-3'>
                            <h4>Search Results ({products.length} found)</h4>
                        </div>

                        {products.length > 0 ? (
                            <div className='table-responsive'>
                                <table className='table table-bordered table-hover shadow'>
                                    <thead className='table-dark'>
                                        <tr>
                                            <th scope='col'>S.N</th>
                                            <th scope='col'>Product Name</th>
                                            <th scope='col'>Category</th>
                                            <th scope='col'>Price</th>
                                            <th scope='col'>Quantity</th>
                                            <th scope='col'>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product, index) => (
                                            <tr key={product.id}>
                                                <th scope='row'>{index + 1}</th>
                                                <td>{product.productName}</td>
                                                <td>{product.category}</td>
                                                <td>${product.price ? product.price.toFixed(2) : '0.00'}</td>
                                                <td>{product.quantity}</td>
                                                <td>
                                                    <Link
                                                        className='btn btn-primary btn-sm mx-1'
                                                        to={`/viewproduct/${product.id}`}
                                                    >
                                                        View
                                                    </Link>
                                                    <Link
                                                        className='btn btn-outline-primary btn-sm mx-1'
                                                        to={`/editproduct/${product.id}`}
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        className='btn btn-danger btn-sm mx-1'
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
                        ) : (
                            <div className='alert alert-info' role='alert'>
                                No products found matching your search criteria.
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
