import LoginPage from '../support/pages/LoginPage';

describe('Main Login E2E Tests - Core Functionality', () => {
    const loginPage = new LoginPage();
    const baseUrl = 'http://localhost:3000';

    beforeEach(() => {
        loginPage.visitHome();
        cy.clearLocalStorage();
        cy.clearCookies();
    });

    describe('a) Complete Login Flow Test (1 point)', () => {
        it('TC_MAIN_LOGIN_01: Should complete successful login and logout flow', () => {
            loginPage.clickLoginFromNavbar();
            loginPage.verifyOnLoginPage();
            loginPage.verifyLoginPageElements();

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

            loginPage.stubAlert();
            loginPage.login('testuser123', 'password123');
            cy.wait('@loginSuccess');
            loginPage.verifySuccessAlert();
            loginPage.verifyOnHomePage();
            loginPage.verifyLoggedInNavbar('testuser123');
            loginPage.verifyAuthDataInLocalStorage('testuser123', 'mock-jwt-token-123456789');

            loginPage.visitHome();

            cy.window().then((win) => {
                cy.stub(win, 'alert').as('windowAlert');
            });

            loginPage.clickLogout();
            loginPage.verifyLogoutAlert();
            loginPage.verifyOnLoginPage();
            loginPage.visitHome();
            loginPage.verifyLoggedOutNavbar();
            loginPage.verifyAuthDataCleared();
        });
    });

    describe('b) Validation Messages Test (0.5 points)', () => {
        beforeEach(() => {
            loginPage.visit();
        });

        it('TC_MAIN_LOGIN_02: Should validate form inputs and show error messages', () => {
            loginPage.submitForm();
            loginPage.verifyRequiredFieldError();

            loginPage.clearAndFillUsername('ab');
            loginPage.fillPassword('password123');
            loginPage.submitForm();
            loginPage.verifyErrorMessageVisible('Username too short');

            loginPage.clearAndFillUsername('user@#$%');
            loginPage.submitForm();
            loginPage.verifyErrorMessageVisible('Username contains invalid characters');

            loginPage.clearAndFillUsername('testuser123');
            loginPage.clearAndFillPassword('short');
            loginPage.submitForm();
            loginPage.verifyErrorMessageVisible('Password too short');

            loginPage.clearAndFillPassword('onlyletters');
            loginPage.submitForm();
            loginPage.verifyErrorMessageVisible('Password must contain both letters and numbers');

            loginPage.clearAndFillPassword('password with space');
            loginPage.submitForm();
            loginPage.verifyErrorMessageVisible('Password cannot contain spaces');

            loginPage.getUsernameInput().clear();
            loginPage.submitForm();
            loginPage.verifyErrorMessageVisible('Username is required!');
            loginPage.getUsernameInput().type('t');
            loginPage.verifyErrorMessageNotExist();

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

    describe('c) Success/Error Flows Test (0.5 points)', () => {
        beforeEach(() => {
            loginPage.visit();
        });

        it('TC_MAIN_LOGIN_03: Should handle different API responses', () => {
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

            loginPage.visit();

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

            cy.intercept('POST', 'http://localhost:8080/auth/login', {
                statusCode: 500,
                body: { message: 'Internal server error' }
            }).as('serverError500');

            loginPage.clearAndFillUsername('testuser123');
            loginPage.clearAndFillPassword('password123');
            loginPage.submitForm();
            cy.wait('@serverError500');
            loginPage.verifyServerError();

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

    describe('d) UI Elements Interactions Test (0.5 points)', () => {
        beforeEach(() => {
            loginPage.visit();
        });

        it('TC_MAIN_LOGIN_04: Should handle UI interactions and states', () => {
            loginPage.focusUsernameInput();
            loginPage.verifyUsernameInputFocused();
            loginPage.fillUsername('testuser');
            loginPage.verifyInputValue('username', 'testuser');
            loginPage.blurUsernameInput();
            loginPage.verifyUsernameInputNotFocused();

            loginPage.verifyPasswordInputType();
            loginPage.fillPassword('password123');
            loginPage.verifyInputValue('password', 'password123');

            loginPage.verifySubmitButtonEnabled();

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
            loginPage.verifySubmitButtonDisabled();
            cy.wait('@slowLogin');

            loginPage.visit();
            loginPage.focusUsernameInput();
            loginPage.verifyUsernameInputFocused();
            cy.realPress('Tab');
            loginPage.verifyPasswordInputFocused();

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

            loginPage.visit();
            loginPage.clickRegisterLink();
            loginPage.verifyOnRegisterPage();

            loginPage.visit();
            loginPage.setMobileViewport();
            loginPage.verifyContainerVisible();
            loginPage.verifyUsernameInputVisible();

            loginPage.setTabletViewport();
            loginPage.verifyContainerVisible();

            loginPage.setDesktopViewport();
            loginPage.verifyContainerVisible();
        });
    });
});
