import LoginPage from '../support/pages/LoginPage'

describe('Login Flow Automated Tests', () => {
  const loginPage = new LoginPage()

  beforeEach(() => {
    loginPage.visitHome()
    cy.clearLocalStorage()
    cy.clearCookies()
  })

  describe('a) Complete Login Flow Tests ', () => {
    it('TC_LOGIN_01: Should complete successful login flow', () => {
      loginPage.clickLoginFromNavbar()
      loginPage.verifyOnLoginPage()

      loginPage.verifyLoginPageElements()

      cy.intercept('POST', 'http://localhost:8080/auth/login', {
        statusCode: 200,
        body: {
          success: true,
          message: 'Login successful',
          token: 'mock-jwt-token-123456789',
          user: { id: 1, username: 'testuser123' },
          expiresIn: 3600000
        }
      }).as('loginSuccess')

      loginPage.stubAlert()

      loginPage.login('testuser123', 'password123')

      cy.wait('@loginSuccess')

      loginPage.verifySuccessAlert()

      loginPage.verifyOnHomePage()

      loginPage.verifyLoggedInNavbar('testuser123')

      loginPage.verifyAuthDataInLocalStorage('testuser123', 'mock-jwt-token-123456789')
    })

    it('TC_LOGIN_02: Should complete logout flow', () => {
      cy.loginUser('testuser123', 'password123')
      loginPage.visitHome()

      loginPage.verifyLoggedInNavbar('testuser123')

      loginPage.stubAlert()

      loginPage.clickLogout()

      loginPage.verifyLogoutAlert()

      loginPage.verifyOnLoginPage()

      loginPage.visitHome()
      loginPage.verifyLoggedOutNavbar()

      loginPage.verifyAuthDataCleared()
    })

    it('TC_LOGIN_03: Should access protected routes when authenticated', () => {
      cy.loginUser('testuser123', 'password123')

      cy.visit('http://localhost:3000/addproduct')

      cy.url().should('include', '/addproduct')
      cy.get('h2').should('contain', 'Register Product')
    })
  })

  describe('b) Validation Messages Tests', () => {
    beforeEach(() => {
      loginPage.visit()
    })

    it('TC_VALIDATION_01: Should show required field validation messages', () => {
      loginPage.submitForm()

      loginPage.verifyRequiredFieldError()

      it('TC_VALIDATION_02: Should show username format validation', () => {
        const invalidUsernames = [
          { username: 'ab', error: 'Username too short' },
          { username: 'a', error: 'Username too short' },
          { username: 'user@#$%', error: 'Username contains invalid characters' }
        ]

        invalidUsernames.forEach(({ username, error }) => {
          loginPage.clearAndFillUsername(username)
          loginPage.fillPassword('password123')
          loginPage.submitForm()

          loginPage.verifyErrorMessageVisible(error)

          loginPage.getUsernameInput().clear()
        })
      })

      it('TC_VALIDATION_03: Should show password format validation', () => {
        loginPage.fillUsername('testuser123')

        const invalidPasswords = [
          { password: 'short', error: 'Password too short' },
          { password: 'onlyletters', error: 'Password must contain both letters and numbers' },
          { password: '123456789', error: 'Password must contain both letters and numbers' },
          { password: 'password with space', error: 'Password cannot contain spaces' }
        ]

        invalidPasswords.forEach(({ password, error }) => {
          loginPage.clearAndFillPassword(password)
          loginPage.submitForm()

          loginPage.verifyErrorMessageVisible(error)

          loginPage.getPasswordInput().clear()
        })
      })

      it('TC_VALIDATION_04: Should clear validation messages when input is corrected', () => {
        loginPage.submitForm()
        loginPage.getErrorMessage().should('be.visible')

        loginPage.getUsernameInput().type('t')

        loginPage.verifyErrorMessageNotExist()
      })
    })

    describe('c) Success/Error Flow Tests', () => {
      beforeEach(() => {
        loginPage.visit()
      })

      it('TC_SUCCESS_01: Should handle successful login response', () => {
        cy.intercept('POST', 'http://localhost:8080/auth/login', {
          statusCode: 200,
          body: {
            success: true,
            message: 'Login successful',
            token: 'mock-jwt-token',
            user: { id: 1, username: 'testuser123' },
            expiresIn: 3600000
          }
        }).as('loginSuccess')

        loginPage.stubAlert()

        loginPage.login('testuser123', 'password123')

        cy.wait('@loginSuccess')

        loginPage.verifySuccessAlert()

        loginPage.verifyOnHomePage()
      })

      it('TC_ERROR_01: Should handle invalid credentials error', () => {
        cy.intercept('POST', 'http://localhost:8080/auth/login', {
          statusCode: 401,
          body: {
            "success": false,
            "message": "Invalid username or password",
            "token": null,
            "user": null,
            "expiresIn": 0
          }
        }).as('loginError')

        loginPage.login('wronguser', 'wrongpass123')

        cy.wait('@loginError')

        loginPage.verifyOnLoginPage()
        loginPage.verifyInvalidCredentialsError()
      })

      it('TC_ERROR_02: Should handle server error', () => {
        cy.intercept('POST', 'http://localhost:8080/auth/login', {
          statusCode: 500,
          body: { message: 'Internal server error' }
        }).as('serverError')

        loginPage.login('testuser123', 'password123')

        cy.wait('@serverError')

        loginPage.verifyServerError()
      })

      it('TC_ERROR_03: Should handle network error', () => {
        cy.intercept('POST', 'http://localhost:8080/auth/login', { forceNetworkError: true }).as('networkError')

        loginPage.login('testuser123', 'password123')

        cy.wait('@networkError')

        loginPage.verifyNetworkError()
      })
    })

    describe('d) UI Elements Interaction Tests', () => {
      beforeEach(() => {
        loginPage.visit()
      })

      it('TC_UI_01: Should handle form input interactions', () => {
        loginPage.getUsernameInput()
          .should('be.visible')
        loginPage.focusUsernameInput()
        loginPage.verifyUsernameInputFocused()
        loginPage.getUsernameInput().type('testuser')
        loginPage.verifyInputValue('username', 'testuser')
        loginPage.blurUsernameInput()
        loginPage.verifyUsernameInputNotFocused()

        loginPage.verifyPasswordInputType()
        loginPage.fillPassword('password123')
        loginPage.verifyInputValue('password', 'password123')
      })

      it('TC_UI_02: Should handle form submission states', () => {
        loginPage.verifySubmitButtonEnabled()
      })

      it('TC_UI_03: Should handle loading states', () => {
        cy.intercept('POST', 'http://localhost:8080/auth/login', {
          delay: 2000,
          statusCode: 200,
          body: {
            success: true,
            token: 'mock-token',
            user: { username: 'testuser123' },
            expiresIn: 3600000
          }
        }).as('slowLogin')

        loginPage.login('testuser123', 'password123')

        loginPage.verifySubmitButtonDisabled()

        cy.wait('@slowLogin')
      })

      it('TC_UI_04: Should handle keyboard navigation', () => {
        loginPage.focusUsernameInput()
        loginPage.verifyUsernameInputFocused()
        cy.realPress('Tab')
        loginPage.verifyPasswordInputFocused()

        cy.intercept('POST', 'http://localhost:8080/auth/login', {
          statusCode: 200,
          body: {
            success: true,
            token: 'mock-token',
            user: { username: 'testuser123' },
            expiresIn: 3600000
          }
        }).as('loginSubmit')

        loginPage.clearAndFillUsername('testuser123')
        loginPage.clearAndFillPassword('password123')

        loginPage.submitWithEnter()

        cy.wait('@loginSubmit')
      })

      it('TC_UI_05: Should handle navigation links', () => {
        loginPage.clickRegisterLink()

        loginPage.verifyOnRegisterPage()
      })

      it('TC_UI_06: Should handle responsive design elements', () => {
        loginPage.setMobileViewport()
        loginPage.verifyContainerVisible()
        loginPage.verifyUsernameInputVisible()

        loginPage.setTabletViewport()
        loginPage.verifyContainerVisible()

        loginPage.setDesktopViewport()
        loginPage.verifyContainerVisible()
      })
    })

    describe('Session Management Tests', () => {
      it('TC_SESSION_01: Should handle token storage correctly', () => {
        cy.intercept('POST', 'http://localhost:8080/auth/login', {
          statusCode: 200,
          body: {
            success: true,
            token: 'mock-jwt-token-123',
            user: { id: 1, username: 'testuser123' },
            expiresIn: 3600000
          }
        }).as('loginSuccess')

        loginPage.visit()
        loginPage.login('testuser123', 'password123')

        cy.wait('@loginSuccess')

        loginPage.verifyAuthDataInLocalStorage('testuser123', 'mock-jwt-token-123')
      })

      it('TC_SESSION_02: Should maintain session across page refresh', () => {
        cy.loginUser('testuser123', 'password123')

        loginPage.visitHome()

        cy.reload()

        loginPage.verifyLoggedInNavbar('testuser123')
      })
    })
  })
})