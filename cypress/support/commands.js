// Custom commands for Login Flow Tests

// Login command for reusability
Cypress.Commands.add('loginUser', (username, password) => {
    cy.intercept('POST', 'http://localhost:8080/auth/login', {
        statusCode: 200,
        body: {
            success: true,
            token: 'mock-jwt-token',
            user: { id: 1, username: username },
            expiresIn: 3600000
        }
    }).as('mockLogin')

    cy.visit('http://localhost:3000/login')
    cy.get('input[name="username"]').type(username)
    cy.get('input[name="password"]').type(password)
    cy.get('button[type="submit"]').click()

    cy.wait('@mockLogin')
    cy.url().should('eq', 'http://localhost:3000/')
})// Tab navigation command
Cypress.Commands.add('tab', { prevSubject: 'element' }, (subject) => {
    cy.wrap(subject).trigger('keydown', { key: 'Tab' })
    return cy.focused()
})

// Clear all authentication data
Cypress.Commands.add('clearAuth', () => {
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.window().then((win) => {
        win.sessionStorage.clear()
    })
})

// Mock successful login response
Cypress.Commands.add('mockSuccessLogin', (username = 'testuser123') => {
    cy.intercept('POST', '**/auth/login', {
        statusCode: 200,
        body: {
            success: true,
            message: 'Login successful',
            token: 'mock-jwt-token-' + Date.now(),
            user: { id: 1, username },
            expiresIn: 3600000
        }
    }).as('loginSuccess')
})

// Mock failed login response
Cypress.Commands.add('mockFailedLogin', (message = 'Invalid username or password') => {
    cy.intercept('POST', '**/auth/login', {
        statusCode: 401,
        body: {
            success: false,
            message
        }
    }).as('loginError')
})

// Type and verify input value
Cypress.Commands.add('typeAndVerify', { prevSubject: 'element' }, (subject, text) => {
    cy.wrap(subject).clear().type(text).should('have.value', text)
})

// Verify form validation state
Cypress.Commands.add('checkValidationState', (inputSelector, errorSelector, isValid = false) => {
    if (isValid) {
        cy.get(inputSelector).should('not.have.class', 'error')
        cy.get(errorSelector).should('not.exist')
    } else {
        cy.get(inputSelector).should('have.class', 'error')
        cy.get(errorSelector).should('be.visible')
    }
})

// Product CRUD Commands
Cypress.Commands.add('navigateToAddProduct', () => {
    cy.contains('a', 'Add product').click()
    cy.url().should('include', '/addproduct')
    cy.contains('Register Product').should('be.visible')
})

Cypress.Commands.add('fillProductForm', (product) => {
    if (product.name) cy.get('input[name="name"]').type(product.name)
    if (product.price) cy.get('input[name="price"]').type(product.price)
    if (product.quantity) cy.get('input[name="quantity"]').type(product.quantity)
    if (product.description) cy.get('textarea[name="description"]').type(product.description)
    if (product.category) cy.get('select[name="category"]').select(product.category)
})

Cypress.Commands.add('submitProductForm', () => {
    cy.contains('button', 'Submit').click()
})

Cypress.Commands.add('createProduct', (product) => {
    cy.navigateToAddProduct()
    cy.fillProductForm(product)
    cy.submitProductForm()
    cy.url().should('eq', 'http://localhost:3000/', { timeout: 10000 })
})

Cypress.Commands.add('editFirstProduct', () => {
    cy.get('tbody tr').first().within(() => {
        cy.contains('a', 'Edit').click()
    })
    cy.url().should('include', '/editproduct/')
    cy.contains('Edit Product').should('be.visible')
})

Cypress.Commands.add('viewFirstProduct', () => {
    cy.get('tbody tr').first().within(() => {
        cy.contains('a', 'View').click()
    })
    cy.url().should('include', '/viewproduct/')
})

Cypress.Commands.add('deleteProduct', (productName) => {
    cy.contains('td', productName).parents('tr').within(() => {
        cy.contains('button', 'Delete').click()
    })
    cy.wait(1000)
})

Cypress.Commands.add('searchProducts', (searchType, searchValue) => {
    if (searchType) cy.get('select[id="searchType"]').select(searchType)
    cy.get('input[id="searchValue"]').type(searchValue)
    cy.contains('button', 'Search').click()
    cy.wait(500)
})

Cypress.Commands.add('clearSearch', () => {
    cy.contains('button', 'Clear').click()
    cy.wait(500)
})

Cypress.Commands.add('verifyProductInList', (productName) => {
    cy.contains('td', productName).should('be.visible')
})

Cypress.Commands.add('verifyProductNotInList', (productName) => {
    cy.contains('td', productName).should('not.exist')
})