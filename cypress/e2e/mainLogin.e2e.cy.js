/**
 * Main Login E2E Tests - 4 Most Representative Test Cases
 * Covers: Complete Login Flow, Validation, Success/Error Flows, UI Interactions
 */

import LoginPage from '../support/pages/LoginPage';

describe('Main Login E2E Tests - Core Functionality', () => {
    const loginPage = new LoginPage();
    const baseUrl = 'http://localhost:3000';

    beforeEach(() => {
        // Visit the application before each test
        loginPage.visitHome();
        // Clear any existing authentication
        cy.clearLocalStorage();
        cy.clearCookies();
    });

    /**
     * a) Test complete login flow (1 điểm)
     * TC_MAIN_LOGIN_01: Should complete successful login and logout flow
     * Covers: Navigation, Form filling, API mock, localStorage, Navbar state
     */
    describe('a) Complete Login Flow Test (1 point)', () => {
        it('TC_MAIN_LOGIN_01: Should complete successful login and logout flow', () => {
            // Step 1: Navigate to login page
            loginPage.clickLoginFromNavbar();
            loginPage.verifyOnLoginPage();

            // Step 2: Verify login page elements
            loginPage.verifyLoginPageElements();

            // Step 3: Mock successful login API response
            cy.intercept('POST', 'http://localhost:8080/auth/login', {
                statusCode: 200,
                body: {
                    success: true,
                    message: 'Login successful',
                    token: 'mock-jwt-token-123456789',
                    user: { id: 1, username: 'testuser123' },
                    expiresIn: 3600000
                }
            }).as('loginSuccess');

            // Step 4: Stub alert before action
            loginPage.stubAlert();

            // Step 5: Enter credentials and submit
            loginPage.login('testuser123', 'password123');

            // Step 6: Wait for API call
            cy.wait('@loginSuccess');

            // Step 7: Verify success alert
            loginPage.verifySuccessAlert();

            // Step 8: Verify redirect to home page
            loginPage.verifyOnHomePage();

            // Step 9: Verify navbar shows logged in state
            loginPage.verifyLoggedInNavbar('testuser123');

            // Step 10: Verify token and user data in localStorage
            loginPage.verifyAuthDataInLocalStorage('testuser123', 'mock-jwt-token-123456789');

            // Step 11: Test logout flow - need to reload window to get fresh alert stub
            loginPage.visitHome();

            cy.window().then((win) => {
                cy.stub(win, 'alert').as('windowAlert');
            });

            loginPage.clickLogout();

            // Step 12: Verify logout alert
            loginPage.verifyLogoutAlert();

            // Step 13: Verify redirect to login
            loginPage.verifyOnLoginPage();

            // Step 14: Verify navbar shows logged out state
            loginPage.visitHome();
            loginPage.verifyLoggedOutNavbar();

            // Step 15: Verify token is removed
            loginPage.verifyAuthDataCleared();
        });
    });

    /**
     * b) Test validation messages (0.5 điểm)
     * TC_MAIN_LOGIN_02: Should validate form inputs and show appropriate error messages
     * Covers: Empty fields, username format, password format, error clearing
     */
    describe('b) Validation Messages Test (0.5 points)', () => {
        beforeEach(() => {
            loginPage.visit();
        });

        it('TC_MAIN_LOGIN_02: Should validate form inputs and show error messages', () => {
            // Test 1: Submit empty form - should show required field error
            loginPage.submitForm();
            loginPage.verifyRequiredFieldError();

            // Test 2: Username too short
            loginPage.clearAndFillUsername('ab');
            loginPage.fillPassword('password123');
            loginPage.submitForm();
            loginPage.verifyErrorMessageVisible('Username too short');

            // Test 3: Username with invalid characters
            loginPage.clearAndFillUsername('user@#$%');
            loginPage.submitForm();
            loginPage.verifyErrorMessageVisible('Username contains invalid characters');

            // Test 4: Password too short
            loginPage.clearAndFillUsername('testuser123');
            loginPage.clearAndFillPassword('short');
            loginPage.submitForm();
            loginPage.verifyErrorMessageVisible('Password too short');

            // Test 5: Password without numbers
            loginPage.clearAndFillPassword('onlyletters');
            loginPage.submitForm();
            loginPage.verifyErrorMessageVisible('Password must contain both letters and numbers');

            // Test 6: Password with spaces
            loginPage.clearAndFillPassword('password with space');
            loginPage.submitForm();
            loginPage.verifyErrorMessageVisible('Password cannot contain spaces');

            // Test 7: Error should clear when user starts typing
            loginPage.getUsernameInput().clear();
            loginPage.submitForm();
            loginPage.verifyErrorMessageVisible('Username is required!');

            // Start typing - error should disappear
            loginPage.getUsernameInput().type('t');
            loginPage.verifyErrorMessageNotExist();

            // Test 8: Valid form should submit without errors
            loginPage.clearAndFillUsername('validuser123');
            loginPage.clearAndFillPassword('validpass123');

            cy.intercept('POST', 'http://localhost:8080/auth/login', {
                statusCode: 200,
                body: {
                    success: true,
                    token: 'mock-token',
                    user: { username: 'validuser123' },
                    expiresIn: 3600000
                }
            }).as('validLogin');

            loginPage.submitForm();
            cy.wait('@validLogin');
            loginPage.verifyOnHomePage();
        });
    });

    /**
     * c) Test success/error flows (0.5 điểm)
     * TC_MAIN_LOGIN_03: Should handle API responses correctly (success, 401, 500, network error)
     * Covers: Successful login, Invalid credentials, Server error, Network error
     */
    describe('c) Success/Error Flows Test (0.5 points)', () => {
        beforeEach(() => {
            loginPage.visit();
        });

        it('TC_MAIN_LOGIN_03: Should handle different API responses', () => {
            // Test 1: Successful login response
            cy.intercept('POST', 'http://localhost:8080/auth/login', {
                statusCode: 200,
                body: {
                    success: true,
                    message: 'Login successful',
                    token: 'mock-jwt-token',
                    user: { id: 1, username: 'testuser123' },
                    expiresIn: 3600000
                }
            }).as('loginSuccess');

            loginPage.stubAlert();
            loginPage.login('testuser123', 'password123');
            cy.wait('@loginSuccess');
            loginPage.verifySuccessAlert();
            loginPage.verifyOnHomePage();

            // Navigate back to login for next test
            loginPage.visit();

            // Test 2: Invalid credentials (401 error)
            cy.intercept('POST', 'http://localhost:8080/auth/login', {
                statusCode: 401,
                body: {
                    success: false,
                    message: 'Invalid username or password',
                    token: null,
                    user: null,
                    expiresIn: 0
                }
            }).as('loginError401');

            loginPage.login('wronguser', 'wrongpass123');
            cy.wait('@loginError401');
            loginPage.verifyOnLoginPage();
            loginPage.verifyInvalidCredentialsError();

            // Test 3: Server error (500)
            cy.intercept('POST', 'http://localhost:8080/auth/login', {
                statusCode: 500,
                body: { message: 'Internal server error' }
            }).as('serverError500');

            loginPage.clearAndFillUsername('testuser123');
            loginPage.clearAndFillPassword('password123');
            loginPage.submitForm();
            cy.wait('@serverError500');
            loginPage.verifyServerError();

            // Test 4: Network error
            cy.intercept('POST', 'http://localhost:8080/auth/login', {
                forceNetworkError: true
            }).as('networkError');

            loginPage.clearAndFillUsername('testuser123');
            loginPage.clearAndFillPassword('password123');
            loginPage.submitForm();
            cy.wait('@networkError');
            loginPage.verifyNetworkError();
        });
    });

    /**
     * d) Test UI elements interactions (0.5 điểm)
     * TC_MAIN_LOGIN_04: Should handle UI interactions and states correctly
     * Covers: Input focus/blur, Form states, Keyboard navigation, Loading state, Responsive design
     */
    describe('d) UI Elements Interactions Test (0.5 points)', () => {
        beforeEach(() => {
            loginPage.visit();
        });

        it('TC_MAIN_LOGIN_04: Should handle UI interactions and states', () => {
            // Test 1: Input focus and blur
            loginPage.focusUsernameInput();
            loginPage.verifyUsernameInputFocused();

            loginPage.fillUsername('testuser');
            loginPage.verifyInputValue('username', 'testuser');

            loginPage.blurUsernameInput();
            loginPage.verifyUsernameInputNotFocused();

            // Test 2: Password input type
            loginPage.verifyPasswordInputType();
            loginPage.fillPassword('password123');
            loginPage.verifyInputValue('password', 'password123');

            // Test 3: Submit button normal state
            loginPage.verifySubmitButtonEnabled();

            // Test 4: Loading state during API call
            cy.intercept('POST', 'http://localhost:8080/auth/login', {
                delay: 2000,
                statusCode: 200,
                body: {
                    success: true,
                    token: 'mock-token',
                    user: { username: 'testuser123' },
                    expiresIn: 3600000
                }
            }).as('slowLogin');

            loginPage.clearAndFillUsername('testuser123');
            loginPage.clearAndFillPassword('password123');
            loginPage.submitForm();

            // Check loading state
            loginPage.verifySubmitButtonDisabled();

            // Wait for completion
            cy.wait('@slowLogin');

            // Test 5: Keyboard navigation (Tab key)
            loginPage.visit();
            loginPage.focusUsernameInput();
            loginPage.verifyUsernameInputFocused();

            cy.realPress('Tab');
            loginPage.verifyPasswordInputFocused();

            // Test 6: Enter key submission
            cy.intercept('POST', 'http://localhost:8080/auth/login', {
                statusCode: 200,
                body: {
                    success: true,
                    token: 'mock-token',
                    user: { username: 'testuser123' },
                    expiresIn: 3600000
                }
            }).as('enterSubmit');

            loginPage.clearAndFillUsername('testuser123');
            loginPage.clearAndFillPassword('password123');
            loginPage.submitWithEnter();
            cy.wait('@enterSubmit');

            // Test 7: Navigation to register page
            loginPage.visit();
            loginPage.clickRegisterLink();
            loginPage.verifyOnRegisterPage();

            // Test 8: Responsive design - Mobile viewport
            loginPage.visit();
            loginPage.setMobileViewport();
            loginPage.verifyContainerVisible();
            loginPage.verifyUsernameInputVisible();

            // Test 9: Responsive design - Tablet viewport
            loginPage.setTabletViewport();
            loginPage.verifyContainerVisible();

            // Test 10: Responsive design - Desktop viewport
            loginPage.setDesktopViewport();
            loginPage.verifyContainerVisible();
        });
    });
});
