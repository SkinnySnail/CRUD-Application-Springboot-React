// utils/productValidation.js

export const VALID_CATEGORIES = ['Electronics', 'Clothing', 'Food', 'Books', 'Toys'];

export function validateProduct(product) {
  const errors = {};

  // Validate Product Name
  if (!product.name || product.name.trim() === '') {
    errors.name = 'Product name is required';
  } else if (product.name.length < 3) {
    errors.name = 'Product name too short';
  } else if (product.name.length > 100) {
    errors.name = 'Product name too long';
  }

  // Validate Price
  if (product.price <= 0) {
    errors.price = 'Price must be greater than 0';
  } else if (product.price > 999999999) {
    errors.price = 'Price too high';
  }

  // Validate Quantity
  if (product.quantity < 0) {
    errors.quantity = 'Quantity cannot be negative';
  } else if (product.quantity > 99999) {
    errors.quantity = 'Quantity too high';
  }

  // Validate Description
  if (product.description && product.description.length > 500) {
    errors.description = 'Description too long';
  }

  // Validate Category
  if (product.category && !VALID_CATEGORIES.includes(product.category)) {
    errors.category = 'Invalid category';
  }

  return errors;
}