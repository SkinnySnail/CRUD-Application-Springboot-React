import { validateProduct, VALID_CATEGORIES } from '../../util/productValidation';

describe('validateProduct - Unit Tests', () => {
  describe('TC_PRODUCT_BE_05-08: Product Name Validation', () => {
    test('TC_PRODUCT_BE_05: Name rỗng - trả về lỗi', () => {
      const product = { name: '', price: 1000, quantity: 10 };
      const errors = validateProduct(product);
      expect(errors.name).toBe('Product name is required');
    });

    test('TC_PRODUCT_BE_06: Name quá ngắn (< 3)', () => {
      const product = { name: 'ab', price: 1000, quantity: 10 };
      const errors = validateProduct(product);
      expect(errors.name).toBe('Product name too short');
    });

    test('TC_PRODUCT_BE_07: Name quá dài (> 100)', () => {
      const product = { name: 'a'.repeat(101), price: 1000, quantity: 10 };
      const errors = validateProduct(product);
      expect(errors.name).toBe('Product name too long');
    });

    test('TC_PRODUCT_BE_08: Name hợp lệ', () => {
      const product = { name: 'Laptop Dell', price: 1000, quantity: 10 };
      const errors = validateProduct(product);
      expect(errors.name).toBeUndefined();
    });
  });

  describe('TC_PRODUCT_BE_09-14: Price Validation', () => {
    test('TC_PRODUCT_BE_09: Price = 0 - trả về lỗi', () => {
      const product = { name: 'Laptop', price: 0, quantity: 10 };
      const errors = validateProduct(product);
      expect(errors.price).toBe('Price must be greater than 0');
    });

    test('TC_PRODUCT_BE_10: Price âm - trả về lỗi', () => {
      const product = { name: 'Laptop', price: -1000, quantity: 10 };
      const errors = validateProduct(product);
      expect(errors.price).toBe('Price must be greater than 0');
    });

    test('TC_PRODUCT_BE_11: Price vượt max (> 999,999,999)', () => {
      const product = { name: 'Laptop', price: 1000000000, quantity: 10 };
      const errors = validateProduct(product);
      expect(errors.price).toBe('Price too high');
    });

    test('TC_PRODUCT_BE_12: Price hợp lệ (min = 1)', () => {
      const product = { name: 'Laptop', price: 1, quantity: 10 };
      const errors = validateProduct(product);
      expect(errors.price).toBeUndefined();
    });

    test('TC_PRODUCT_BE_13: Price hợp lệ (max = 999,999,999)', () => {
      const product = { name: 'Laptop', price: 999999999, quantity: 10 };
      const errors = validateProduct(product);
      expect(errors.price).toBeUndefined();
    });

    test('TC_PRODUCT_BE_14: Price hợp lệ (15,000,000)', () => {
      const product = { name: 'Laptop', price: 15000000, quantity: 10 };
      const errors = validateProduct(product);
      expect(errors.price).toBeUndefined();
    });
  });

  describe('TC_PRODUCT_BE_15-19: Quantity Validation', () => {
    test('TC_PRODUCT_BE_15: Quantity âm - trả về lỗi', () => {
      const product = { name: 'Laptop', price: 1000, quantity: -1 };
      const errors = validateProduct(product);
      expect(errors.quantity).toBe('Quantity cannot be negative');
    });

    test('TC_PRODUCT_BE_16: Quantity vượt max (> 99,999)', () => {
      const product = { name: 'Laptop', price: 1000, quantity: 100000 };
      const errors = validateProduct(product);
      expect(errors.quantity).toBe('Quantity too high');
    });

    test('TC_PRODUCT_BE_17: Quantity = 0 - hợp lệ', () => {
      const product = { name: 'Laptop', price: 1000, quantity: 0 };
      const errors = validateProduct(product);
      expect(errors.quantity).toBeUndefined();
    });

    test('TC_PRODUCT_BE_18: Quantity = 99,999 - hợp lệ', () => {
      const product = { name: 'Laptop', price: 1000, quantity: 99999 };
      const errors = validateProduct(product);
      expect(errors.quantity).toBeUndefined();
    });

    test('TC_PRODUCT_BE_19: Quantity hợp lệ (10)', () => {
      const product = { name: 'Laptop', price: 1000, quantity: 10 };
      const errors = validateProduct(product);
      expect(errors.quantity).toBeUndefined();
    });
  });

  describe('TC_PRODUCT_BE_20-23: Description Validation', () => {
    test('TC_PRODUCT_BE_20: Description rỗng - hợp lệ', () => {
      const product = { name: 'Laptop', price: 1000, quantity: 10, description: '' };
      const errors = validateProduct(product);
      expect(errors.description).toBeUndefined();
    });

    test('TC_PRODUCT_BE_21: Description quá dài (> 500)', () => {
      const product = { 
        name: 'Laptop', 
        price: 1000, 
        quantity: 10, 
        description: 'a'.repeat(501) 
      };
      const errors = validateProduct(product);
      expect(errors.description).toBe('Description too long');
    });

    test('TC_PRODUCT_BE_22: Description = 500 ký tự - hợp lệ', () => {
      const product = { 
        name: 'Laptop', 
        price: 1000, 
        quantity: 10, 
        description: 'a'.repeat(500) 
      };
      const errors = validateProduct(product);
      expect(errors.description).toBeUndefined();
    });

    test('TC_PRODUCT_BE_23: Description hợp lệ', () => {
      const product = { 
        name: 'Laptop', 
        price: 1000, 
        quantity: 10, 
        description: 'This is a valid description' 
      };
      const errors = validateProduct(product);
      expect(errors.description).toBeUndefined();
    });
  });

  describe('Category Validation', () => {
    test('Category không hợp lệ - trả về lỗi', () => {
      const product = { 
        name: 'Laptop', 
        price: 1000, 
        quantity: 10, 
        category: 'InvalidCategory' 
      };
      const errors = validateProduct(product);
      expect(errors.category).toBe('Invalid category');
    });

    test('Category hợp lệ - không có lỗi', () => {
      VALID_CATEGORIES.forEach(category => {
        const product = { 
          name: 'Laptop', 
          price: 1000, 
          quantity: 10, 
          category 
        };
        const errors = validateProduct(product);
        expect(errors.category).toBeUndefined();
      });
    });
  });

  describe('Happy Path', () => {
    test('Product hợp lệ đầy đủ - không có lỗi', () => {
      const product = {
        name: 'Laptop Dell XPS 13',
        price: 15000000,
        quantity: 10,
        category: 'Electronics',
        description: 'A high-performance laptop'
      };
      const errors = validateProduct(product);
      expect(Object.keys(errors).length).toBe(0);
    });
  });
});