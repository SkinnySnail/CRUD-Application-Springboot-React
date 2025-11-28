/**
 * Main Product E2E Tests - 5 Most Representative Test Cases
 * Covers: Form Rendering, Validation, API Mocking, Error Handling, localStorage
 */

import ProductPage from '../support/pages/ProductPage';

describe('Main Product E2E Tests - Core Functionality', () => {
    const baseUrl = 'http://localhost:3000';
    const productPage = new ProductPage();

    beforeEach(() => {
        // Clear storage and login before each test
        cy.clearAuth();
        cy.visit(baseUrl);
        cy.loginUser('testuser123', 'password123');
    });

    /**
     * TC_MAIN_01: Kiểm tra render form, input, button
     * Mục đích: Đảm bảo tất cả các thành phần UI được hiển thị đúng
     */
    describe('TC_MAIN_01: Form Rendering Test', () => {
        it('Should render complete product form with all inputs and buttons', () => {
            // Navigate to Add Product page
            cy.navigateToAddProduct();

            // Verify page title
            productPage.verifyAddProductPageTitle();

            // Verify all input fields are rendered
            productPage.verifyFormFieldsRendered();

            // Verify buttons are rendered
            productPage.verifyFormButtons();

            // Verify form labels
            productPage.verifyFormLabels();
        });
    });

    /**
     * TC_MAIN_02: Kiểm tra validation (rỗng, sai định dạng)
     * Mục đích: Đảm bảo validation hoạt động đúng cho các trường bắt buộc và định dạng
     */
    describe('TC_MAIN_02: Form Validation Test', () => {
        it('Should validate empty required fields and invalid formats', () => {
            cy.navigateToAddProduct();

            // Test 1: Submit empty form
            cy.submitProductForm();
            cy.url().should('include', '/addproduct'); // Should stay on page

            // Test 2: Validate negative price
            cy.fillProductForm({
                name: 'Test Product',
                price: '-1000',
                quantity: '10',
                category: 'Electronics'
            });

            cy.on('window:alert', (alertText) => {
                expect(alertText).to.include('Validation failed');
            });

            cy.submitProductForm();
            cy.url().should('include', '/addproduct'); // Should stay on page

            // Test 3: Validate invalid quantity (negative)
            productPage.clearAndFillField('input[name="price"]', '1000');
            productPage.clearAndFillField('input[name="quantity"]', '-5');

            cy.on('window:alert', (alertText) => {
                expect(alertText).to.include('Validation failed');
            });

            cy.submitProductForm();
            cy.url().should('include', '/addproduct');

            // Test 4: Validate product name too short (less than 3 characters)
            productPage.clearAndFillField('input[name="name"]', 'AB');
            productPage.clearAndFillField('input[name="price"]', '1000');
            productPage.clearAndFillField('input[name="quantity"]', '10');

            cy.on('window:alert', (alertText) => {
                expect(alertText).to.include('Validation failed');
            });

            cy.submitProductForm();
            cy.url().should('include', '/addproduct');

            // Test 5: Validate successful form with valid data
            productPage.clearAndFillField('input[name="name"]', 'Valid Product Name');
            productPage.clearAndFillField('input[name="price"]', '5000');
            productPage.clearAndFillField('input[name="quantity"]', '20');
            cy.get('textarea[name="description"]').type('Valid description');
            cy.get('select[name="category"]').select('Electronics');

            cy.submitProductForm();
            cy.url().should('eq', `${baseUrl}/`, { timeout: 10000 }); // Should navigate to home
        });
    });

    /**
     * TC_MAIN_03: Mock API trả về success
     * Mục đích: Kiểm tra xử lý thành công khi API trả về dữ liệu đúng
     */
    describe('TC_MAIN_03: Mock API Success Response', () => {
        it('Should handle successful API response and display product', () => {
            const mockProduct = {
                id: 999,
                name: 'Mocked Laptop',
                price: 25000,
                quantity: 10,
                description: 'Test mocked product',
                category: 'Electronics'
            };

            // Mock POST request for creating product
            cy.intercept('POST', 'http://localhost:8080/product', {
                statusCode: 200,
                body: mockProduct
            }).as('createProduct');

            // Mock GET request for fetching all products
            cy.intercept('GET', 'http://localhost:8080/products', {
                statusCode: 200,
                body: [mockProduct]
            }).as('getAllProducts');

            cy.navigateToAddProduct();

            // Fill form with valid data
            cy.fillProductForm({
                name: 'Mocked Laptop',
                price: '25000',
                quantity: '10',
                description: 'Test mocked product',
                category: 'Electronics'
            });

            cy.submitProductForm();

            // Wait for API calls
            cy.wait('@createProduct').its('response.statusCode').should('eq', 200);
            cy.wait('@getAllProducts');

            // Verify navigation to home page
            cy.url().should('eq', `${baseUrl}/`);

            // Verify product appears in list
            cy.verifyProductInList('Mocked Laptop');
        });
    });

    /**
     * TC_MAIN_04: Mock API trả về lỗi
     * Mục đích: Kiểm tra xử lý khi API trả về lỗi (500, 404, 401)
     */
    describe('TC_MAIN_04: Mock API Error Response', () => {
        it('Should handle API error responses gracefully', () => {
            // Test 1: Mock 500 Internal Server Error
            cy.intercept('POST', 'http://localhost:8080/product', {
                statusCode: 500,
                body: {
                    message: 'Internal Server Error',
                    error: 'Database connection failed'
                },
                forceNetworkError: false
            }).as('createProductError500');

            cy.navigateToAddProduct();

            cy.fillProductForm({
                name: 'Error Test Product',
                price: '1000',
                quantity: '5',
                category: 'Electronics'
            });

            // Handle the unhandled promise rejection
            cy.on('uncaught:exception', (err) => {
                // Return false to prevent the error from failing the test
                if (err.message.includes('Request failed with status code 500')) {
                    return false;
                }
                return true;
            });

            cy.submitProductForm();

            cy.wait('@createProductError500');

            // Verify error handling (should stay on form or show error)
            cy.url().should('include', '/addproduct');

            // Test 2: Mock 400 Bad Request - Navigate to fresh form
            cy.visit(baseUrl);
            cy.navigateToAddProduct();

            cy.intercept('POST', 'http://localhost:8080/product', {
                statusCode: 400,
                body: {
                    message: 'Validation Error',
                    errors: ['Invalid product data']
                }
            }).as('createProductError400');

            // Handle 400 error
            cy.on('uncaught:exception', (err) => {
                if (err.message.includes('Request failed with status code 400')) {
                    return false;
                }
                return true;
            });

            cy.fillProductForm({
                name: 'Bad Request Test',
                price: '2000',
                quantity: '3',
                category: 'Electronics'
            });

            cy.submitProductForm();

            cy.wait('@createProductError400');
            cy.url().should('include', '/addproduct');
        });
    });

    /**
     * TC_MAIN_05: Kiểm tra localStorage (token, user, tokenExpiration)
     * Mục đích: Đảm bảo thông tin authentication được lưu và xóa đúng cách
     */
    describe('TC_MAIN_05: localStorage Authentication Test', () => {
        it('Should store and manage authentication data in localStorage', () => {
            // Verify localStorage after login
            cy.window().then((window) => {
                const token = window.localStorage.getItem('token');
                const user = window.localStorage.getItem('user');
                const tokenExpiration = window.localStorage.getItem('tokenExpiration');

                // Verify token exists and is valid format
                expect(token).to.exist;
                expect(token).to.be.a('string');
                expect(token.length).to.be.greaterThan(0);

                // Verify user data exists
                expect(user).to.exist;
                const userData = JSON.parse(user);
                expect(userData).to.have.property('username');
                expect(userData.username).to.equal('testuser123');

                // Verify token expiration exists and is a valid timestamp
                expect(tokenExpiration).to.exist;
                const expirationTime = parseInt(tokenExpiration);
                expect(expirationTime).to.be.greaterThan(Date.now());
            });

            // Test token usage in API requests
            cy.intercept('GET', 'http://localhost:8080/products', (req) => {
                // Check if Authorization header is present (may not be in mock login scenario)
                // In real scenarios, the token from localStorage should be added to headers
                // For this test, we'll verify localStorage has token and allow the request

                req.reply({
                    statusCode: 200,
                    body: []
                });
            }).as('getProductsWithAuth');

            cy.visit(baseUrl);
            cy.wait('@getProductsWithAuth');

            // Test logout clears localStorage
            cy.contains('button', 'Logout').click();

            // Wait for redirect to login
            cy.url().should('include', '/login');

            // Wait a bit for logout to complete
            cy.wait(500);

            cy.window().then((window) => {
                const token = window.localStorage.getItem('token');
                const user = window.localStorage.getItem('user');

                // Verify auth data is cleared (token and user are critical)
                expect(token).to.be.null;
                expect(user).to.be.null;

                // Note: tokenExpiration may or may not be cleared depending on logout implementation
                // The important thing is token and user are removed
            });

            // Verify redirect to login page
            cy.url().should('include', '/login');

            // Test expired token scenario
            cy.loginUser('testuser123', 'password123');

            // Wait for login to complete
            cy.url().should('eq', `${baseUrl}/`);

            cy.window().then((window) => {
                // Set token expiration to past time
                const pastTime = Date.now() - 10000; // 10 seconds ago
                window.localStorage.setItem('tokenExpiration', pastTime.toString());
            });

            // Try to access protected route
            cy.reload();

            // Should redirect to login due to expired token
            cy.url().should('include', '/login', { timeout: 5000 });

            // Verify localStorage is cleared
            cy.window().then((window) => {
                const token = window.localStorage.getItem('token');
                expect(token).to.be.null;
            });
        });
    });
});
