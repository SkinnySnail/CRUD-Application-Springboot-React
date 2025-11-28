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

    describe('TC_MAIN_01: Form Rendering Test', () => {
        it('Should render complete product form with all inputs and buttons', () => {
            cy.navigateToAddProduct();
            productPage.verifyAddProductPageTitle();
            productPage.verifyFormFieldsRendered();
            productPage.verifyFormButtons();
            productPage.verifyFormLabels();
        });
    });

    describe('TC_MAIN_02: Form Validation Test', () => {
        it('Should validate empty required fields and invalid formats', () => {
            cy.navigateToAddProduct();

            cy.submitProductForm();
            cy.url().should('include', '/addproduct');

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
            cy.url().should('include', '/addproduct');

            productPage.clearAndFillField('input[name="price"]', '1000');
            productPage.clearAndFillField('input[name="quantity"]', '-5');

            cy.on('window:alert', (alertText) => {
                expect(alertText).to.include('Validation failed');
            });

            cy.submitProductForm();
            cy.url().should('include', '/addproduct');

            productPage.clearAndFillField('input[name="name"]', 'AB');
            productPage.clearAndFillField('input[name="price"]', '1000');
            productPage.clearAndFillField('input[name="quantity"]', '10');

            cy.on('window:alert', (alertText) => {
                expect(alertText).to.include('Validation failed');
            });

            cy.submitProductForm();
            cy.url().should('include', '/addproduct');

            productPage.clearAndFillField('input[name="name"]', 'Valid Product Name');
            productPage.clearAndFillField('input[name="price"]', '5000');
            productPage.clearAndFillField('input[name="quantity"]', '20');
            cy.get('textarea[name="description"]').type('Valid description');
            cy.get('select[name="category"]').select('Electronics');

            cy.submitProductForm();
            cy.url().should('eq', `${baseUrl}/`, { timeout: 10000 }); // Should navigate to home
        });
    });

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

            cy.intercept('POST', 'http://localhost:8080/product', {
                statusCode: 200,
                body: mockProduct
            }).as('createProduct');

            cy.intercept('GET', 'http://localhost:8080/products', {
                statusCode: 200,
                body: [mockProduct]
            }).as('getAllProducts');

            cy.navigateToAddProduct();

            cy.fillProductForm({
                name: 'Mocked Laptop',
                price: '25000',
                quantity: '10',
                description: 'Test mocked product',
                category: 'Electronics'
            });

            cy.submitProductForm();

            cy.wait('@createProduct').its('response.statusCode').should('eq', 200);
            cy.wait('@getAllProducts');

            cy.url().should('eq', `${baseUrl}/`);

            cy.verifyProductInList('Mocked Laptop');
        });
    });

    describe('TC_MAIN_04: Mock API Error Response', () => {
        it('Should handle API error responses gracefully', () => {
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

            cy.on('uncaught:exception', (err) => {
                if (err.message.includes('Request failed with status code 500')) {
                    return false;
                }
                return true;
            });

            cy.submitProductForm();

            cy.wait('@createProductError500');

            cy.url().should('include', '/addproduct');

            cy.visit(baseUrl);
            cy.navigateToAddProduct();

            cy.intercept('POST', 'http://localhost:8080/product', {
                statusCode: 400,
                body: {
                    message: 'Validation Error',
                    errors: ['Invalid product data']
                }
            }).as('createProductError400');

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

    describe('TC_MAIN_05: localStorage Authentication Test', () => {
        it('Should store and manage authentication data in localStorage', () => {
            cy.window().then((window) => {
                const token = window.localStorage.getItem('token');
                const user = window.localStorage.getItem('user');
                const tokenExpiration = window.localStorage.getItem('tokenExpiration');

                expect(token).to.exist;
                expect(token).to.be.a('string');
                expect(token.length).to.be.greaterThan(0);

                expect(user).to.exist;
                const userData = JSON.parse(user);
                expect(userData).to.have.property('username');
                expect(userData.username).to.equal('testuser123');

                expect(tokenExpiration).to.exist;
                const expirationTime = parseInt(tokenExpiration);
                expect(expirationTime).to.be.greaterThan(Date.now());
            });

            cy.intercept('GET', 'http://localhost:8080/products', (req) => {
                req.reply({
                    statusCode: 200,
                    body: []
                });
            }).as('getProductsWithAuth');

            cy.visit(baseUrl);
            cy.wait('@getProductsWithAuth');

            cy.contains('button', 'Logout').click();

            cy.url().should('include', '/login');

            cy.wait(500);

            cy.window().then((window) => {
                const token = window.localStorage.getItem('token');
                const user = window.localStorage.getItem('user');

                expect(token).to.be.null;
                expect(user).to.be.null;
            });

            cy.url().should('include', '/login');

            cy.loginUser('testuser123', 'password123');

            cy.url().should('eq', `${baseUrl}/`);

            cy.window().then((window) => {
                const pastTime = Date.now() - 10000;
                window.localStorage.setItem('tokenExpiration', pastTime.toString());
            });

            cy.reload();

            cy.url().should('include', '/login', { timeout: 5000 });

            cy.window().then((window) => {
                const token = window.localStorage.getItem('token');
                expect(token).to.be.null;
            });
        });
    });
});
