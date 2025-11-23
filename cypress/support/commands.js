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
    cy.clearSessionStorage()
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