class LoginPage {
    // Navigation
    visit() {
        cy.visit('http://localhost:3000/login');
    }

    visitHome() {
        cy.visit('http://localhost:3000');
    }

    clickLoginFromNavbar() {
        cy.get('.btn-outline-light').contains('Login').click();
    }

    clickRegisterLink() {
        cy.get('a[href="/register"]').contains('Register here').click();
    }

    // Form element getters
    getUsernameInput() {
        return cy.get('input[name="username"]');
    }

    getPasswordInput() {
        return cy.get('input[name="password"]');
    }

    getSubmitButton() {
        return cy.get('button[type="submit"]');
    }

    getErrorMessage() {
        return cy.get('.alert-danger');
    }

    // Form actions
    fillUsername(username) {
        this.getUsernameInput().type(username);
    }

    fillPassword(password) {
        this.getPasswordInput().type(password);
    }

    clearAndFillUsername(username) {
        this.getUsernameInput().clear().type(username);
    }

    clearAndFillPassword(password) {
        this.getPasswordInput().clear().type(password);
    }

    fillLoginForm(username, password) {
        if (username) this.fillUsername(username);
        if (password) this.fillPassword(password);
    }

    submitForm() {
        this.getSubmitButton().click();
    }

    submitWithEnter() {
        this.getPasswordInput().type('{enter}');
    }

    login(username, password) {
        this.fillLoginForm(username, password);
        this.submitForm();
    }

    // Navbar actions
    clickLogout() {
        cy.get('.btn-outline-light').contains('Logout').click();
    }

    // Verification methods - Page elements
    verifyLoginPageTitle() {
        cy.get('h2').should('contain', 'Login');
    }

    verifyUsernameInputVisible() {
        this.getUsernameInput().should('be.visible');
    }

    verifyPasswordInputVisible() {
        this.getPasswordInput().should('be.visible');
    }

    verifySubmitButtonVisible() {
        this.getSubmitButton().should('be.visible');
    }

    verifyLoginPageElements() {
        this.verifyLoginPageTitle();
        this.verifyUsernameInputVisible();
        this.verifyPasswordInputVisible();
        this.verifySubmitButtonVisible();
    }

    verifyPasswordInputType() {
        this.getPasswordInput().should('have.attr', 'type', 'password');
    }

    // Verification methods - URL
    verifyOnLoginPage() {
        cy.url().should('include', '/login');
    }

    verifyOnHomePage() {
        cy.url().should('eq', 'http://localhost:3000/');
    }

    verifyOnRegisterPage() {
        cy.url().should('include', '/register');
    }

    // Verification methods - Navbar state
    verifyLoggedInNavbar(username) {
        cy.get('.text-white').should('contain', `Welcome, ${username}`);
        cy.get('.btn-outline-light').contains('Logout').should('be.visible');
    }

    verifyLoggedOutNavbar() {
        cy.get('.btn-outline-light').contains('Login').should('be.visible');
        cy.get('.btn-outline-light').contains('Register').should('be.visible');
    }

    // Verification methods - Error messages
    verifyErrorMessageVisible(message) {
        this.getErrorMessage()
            .should('be.visible')
            .and('contain', message);
    }

    verifyErrorMessageNotExist() {
        this.getErrorMessage().should('not.exist');
    }

    verifyRequiredFieldError() {
        this.verifyErrorMessageVisible('Username is required!');
    }

    verifyInvalidCredentialsError() {
        this.verifyErrorMessageVisible('Invalid username or password');
    }

    verifyServerError() {
        this.verifyErrorMessageVisible('Internal server error');
    }

    verifyNetworkError() {
        this.verifyErrorMessageVisible('Network error. Please try again.');
    }

    // Verification methods - Form state
    verifySubmitButtonDisabled() {
        this.getSubmitButton()
            .should('be.disabled')
            .and('contain', 'Logging in...');
    }

    verifySubmitButtonEnabled() {
        this.getSubmitButton()
            .should('not.be.disabled')
            .and('contain', 'Login');
    }

    verifyInputValue(inputName, expectedValue) {
        cy.get(`input[name="${inputName}"]`).should('have.value', expectedValue);
    }

    // localStorage verification methods
    verifyTokenInLocalStorage(expectedToken) {
        cy.window().then((win) => {
            if (expectedToken) {
                expect(win.localStorage.getItem('token')).to.equal(expectedToken);
            } else {
                expect(win.localStorage.getItem('token')).to.exist;
            }
        });
    }

    verifyUserInLocalStorage(expectedUsername) {
        cy.window().then((win) => {
            expect(win.localStorage.getItem('user')).to.exist;
            const userData = JSON.parse(win.localStorage.getItem('user'));
            expect(userData.username).to.equal(expectedUsername);
        });
    }

    verifyTokenExpirationExists() {
        cy.window().then((win) => {
            expect(win.localStorage.getItem('tokenExpiration')).to.exist;
        });
    }

    verifyAuthDataInLocalStorage(username, token = null) {
        if (token) {
            this.verifyTokenInLocalStorage(token);
        } else {
            this.verifyTokenInLocalStorage();
        }
        this.verifyUserInLocalStorage(username);
        this.verifyTokenExpirationExists();
    }

    verifyTokenRemoved() {
        cy.window().then((win) => {
            expect(win.localStorage.getItem('token')).to.be.null;
        });
    }

    verifyUserRemoved() {
        cy.window().then((win) => {
            expect(win.localStorage.getItem('user')).to.be.null;
        });
    }

    verifyAuthDataCleared() {
        this.verifyTokenRemoved();
        this.verifyUserRemoved();
    }

    // Alert stub methods
    stubAlert() {
        cy.window().then((win) => {
            cy.stub(win, 'alert').as('windowAlert');
        });
    }

    verifyAlertCalled(message) {
        cy.get('@windowAlert').should('have.been.calledWith', message);
    }

    verifySuccessAlert() {
        this.verifyAlertCalled('Login successful!');
    }

    verifyLogoutAlert() {
        this.verifyAlertCalled('You have been logged out successfully');
    }

    // Focus and interaction methods
    focusUsernameInput() {
        this.getUsernameInput().focus();
        return this;
    }

    verifyUsernameInputFocused() {
        this.getUsernameInput().should('have.focus');
    }

    verifyPasswordInputFocused() {
        this.getPasswordInput().should('have.focus');
    }

    blurUsernameInput() {
        this.getUsernameInput().blur();
    }

    verifyUsernameInputNotFocused() {
        this.getUsernameInput().should('not.have.focus');
    }

    // Viewport methods
    setMobileViewport() {
        cy.viewport(375, 667); // iPhone SE
    }

    setTabletViewport() {
        cy.viewport(768, 1024); // iPad
    }

    setDesktopViewport() {
        cy.viewport(1920, 1080);
    }

    verifyContainerVisible() {
        cy.get('.container').should('be.visible');
    }
}

export default LoginPage;
