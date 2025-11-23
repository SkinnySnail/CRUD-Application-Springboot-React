describe('Login Flow Automated Tests', () => {
  beforeEach(() => {
    // Visit the application before each test
    cy.visit('http://localhost:3000')
    // Clear any existing authentication
    cy.clearLocalStorage()
    cy.clearCookies()
  })

  describe('a) Complete Login Flow Tests (1 điểm)', () => {
    it('TC_LOGIN_01: Should complete successful login flow', () => {
      // Navigate to login page using actual navbar button
      cy.get('.btn-outline-light').contains('Login').should('be.visible').click()
      cy.url().should('include', '/login')
      
      // Verify login page elements
      cy.get('h2').should('contain', 'Login')
      cy.get('input[name="username"]').should('be.visible')
      cy.get('input[name="password"]').should('be.visible')
      cy.get('button[type="submit"]').should('be.visible')
      
      // Mock successful login API response
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
      
      // Enter valid credentials
      cy.get('input[name="username"]').type('testuser123')
      cy.get('input[name="password"]').type('password123')
      
      // Submit login form
      cy.get('button[type="submit"]').click()
      
      // Stub the alert function
      cy.window().then((win) => {
        cy.stub(win, 'alert').as('windowAlert')
      })
      
      // Wait for API call
      cy.wait('@loginSuccess')
      
       // Stub the alert function
            cy.window().then((win) => {
              cy.stub(win, 'alert').as('windowAlert')
            })
      // Verify redirect to home page
      cy.url().should('eq', 'http://localhost:3000/')
      
      // Verify navbar shows logged in state
      cy.get('.text-white').should('contain', 'Welcome, testuser123')
      cy.get('.btn-outline-light').contains('Logout').should('be.visible')
      
      // Verify token and user data is stored
      cy.window().then((win) => {
        expect(win.localStorage.getItem('token')).to.equal('mock-jwt-token-123456789')
        const userData = JSON.parse(win.localStorage.getItem('user'))
        expect(userData.username).to.equal('testuser123')
      })
    })

    it('TC_LOGIN_02: Should complete logout flow', () => {
      // Setup logged in state
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'mock-token')
        win.localStorage.setItem('user', JSON.stringify({ username: 'testuser123' }))
        win.dispatchEvent(new Event('storage'))
      })

      // Visit home page
      cy.visit('http://localhost:3000')

      // Verify logged in state in navbar
      cy.get('.text-white').should('contain', 'Welcome, testuser123')
      cy.get('.btn-outline-light').contains('Logout').should('be.visible')

      // Stub the alert function
      cy.window().then((win) => {
        cy.stub(win, 'alert').as('windowAlert')
      })

      // Perform logout
      cy.get('.btn-outline-light').contains('Logout').click()

      // Verify logout alert
      cy.get('@windowAlert').should('have.been.calledWith', 'You have been logged out successfully')

      // Verify redirect to login
      cy.url().should('include', '/login')

      // Verify navbar shows logged out state
      cy.visit('http://localhost:3000')
      cy.get('.btn-outline-light').contains('Login').should('be.visible')
      cy.get('.btn-outline-light').contains('Register').should('be.visible')

      // Verify token is removed
      cy.window().then((win) => {
        expect(win.localStorage.getItem('token')).to.be.null
        expect(win.localStorage.getItem('user')).to.be.null
      })
    })

    it('TC_LOGIN_03: Should access protected routes when authenticated', () => {
      // Setup logged in state
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'mock-token')
        win.localStorage.setItem('user', JSON.stringify({ username: 'testuser123' }))
      })

      // Access add product route
      cy.visit('http://localhost:3000/addproduct')

      // Should be able to access (no redirect to login)
      cy.url().should('include', '/addproduct')
    })
  })

  describe('b) Validation Messages Tests (0.5 điểm)', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/login')
    })

    it('TC_VALIDATION_01: Should show required field validation messages', () => {
      // Try to submit empty form
      cy.get('button[type="submit"]').click()

      // Check error message appears
      cy.get('.alert-danger')
        .should('be.visible')
        .and('contain', 'Username is required!')
    })

    it('TC_VALIDATION_02: Should show username format validation', () => {
      // Test invalid username formats based on actual validation
      const invalidUsernames = [
        { username: 'ab', error: 'Username too short' },
        { username: 'a', error: 'Username too short' },
        { username: 'user@#$%', error: 'Username contains invalid characters' }
      ]

      invalidUsernames.forEach(({ username, error }) => {
        cy.get('input[name="username"]').clear().type(username)
        cy.get('input[name="password"]').type('password123')
        cy.get('button[type="submit"]').click()

        cy.get('.alert-danger')
          .should('be.visible')
          .and('contain', error)

        // Clear error for next test
        cy.get('input[name="username"]').clear()
      })
    })

    it('TC_VALIDATION_03: Should show password format validation', () => {
      cy.get('input[name="username"]').type('testuser123')

      // Test invalid password formats based on actual validation
      const invalidPasswords = [
        { password: 'short', error: 'Password too short' },
        { password: 'onlyletters', error: 'Password must contain both letters and numbers' },
        { password: '123456789', error: 'Password must contain both letters and numbers' },
        { password: 'password with space', error: 'Password cannot contain spaces' }
      ]

      invalidPasswords.forEach(({ password, error }) => {
        cy.get('input[name="password"]').clear().type(password)
        cy.get('button[type="submit"]').click()

        cy.get('.alert-danger')
          .should('be.visible')
          .and('contain', error)

        // Clear error for next test
        cy.get('input[name="password"]').clear()
      })
    })

    it('TC_VALIDATION_04: Should clear validation messages when input is corrected', () => {
      // Trigger validation error
      cy.get('button[type="submit"]').click()
      cy.get('.alert-danger').should('be.visible')

      // Start typing to clear error (based on onInputChange clearing error)
      cy.get('input[name="username"]').type('t')

      // Error should disappear when typing
      cy.get('.alert-danger').should('not.exist')
    })
  })

  describe('c) Success/Error Flow Tests (0.5 điểm)', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/login')
    })

    it('TC_SUCCESS_01: Should handle successful login response', () => {
      // Intercept successful login API call
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

      // Perform login
      cy.get('input[name="username"]').type('testuser123')
      cy.get('input[name="password"]').type('password123')
      cy.get('button[type="submit"]').click()

      // Stub the alert function
      cy.window().then((win) => {
        cy.stub(win, 'alert').as('windowAlert')
      })

      // Wait for API call
      cy.wait('@loginSuccess')

      // Verify success alert
      cy.get('@windowAlert').should('have.been.calledWith', 'Login successful!')

      // Verify redirect to home page
      cy.url().should('eq', 'http://localhost:3000/')
    })

    it('TC_ERROR_01: Should handle invalid credentials error', () => {
      // Intercept failed login API call
      cy.intercept('POST', 'http://localhost:8080/auth/login', {
        statusCode: 401,
        body: {
          success: false,
          message: 'Invalid username or password'
        }
      }).as('loginError')

      // Perform login with wrong credentials
      cy.get('input[name="username"]').type('wronguser')
      cy.get('input[name="password"]').type('wrongpass')
      cy.get('button[type="submit"]').click()

      // Wait for API call
      cy.wait('@loginError')

      // Verify error handling
      cy.url().should('include', '/login')
      cy.get('.alert-danger')
        .should('be.visible')
        .and('contain', 'Invalid username or password')
    })

    it('TC_ERROR_02: Should handle server error', () => {
      // Intercept server error
      cy.intercept('POST', 'http://localhost:8080/auth/login', {
        statusCode: 500,
        body: { message: 'Internal server error' }
      }).as('serverError')

      // Perform login
      cy.get('input[name="username"]').type('testuser123')
      cy.get('input[name="password"]').type('password123')
      cy.get('button[type="submit"]').click()

      // Wait for API call
      cy.wait('@serverError')

      // Verify error handling
      cy.get('.alert-danger')
        .should('be.visible')
        .and('contain', 'Internal server error')
    })

    it('TC_ERROR_03: Should handle network error', () => {
      // Intercept network failure
      cy.intercept('POST', 'http://localhost:8080/auth/login', { forceNetworkError: true }).as('networkError')

      // Perform login
      cy.get('input[name="username"]').type('testuser123')
      cy.get('input[name="password"]').type('password123')
      cy.get('button[type="submit"]').click()

      // Wait for API call
      cy.wait('@networkError')

      // Verify network error handling
      cy.get('.alert-danger')
        .should('be.visible')
        .and('contain', 'Network error. Please try again.')
    })
  })

  describe('d) UI Elements Interaction Tests (0.5 điểm)', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/login')
    })

    it('TC_UI_01: Should handle form input interactions', () => {
      // Test input focus and blur
      cy.get('input[name="username"]')
        .should('be.visible')
        .focus()
        .should('have.focus')
        .type('testuser')
        .should('have.value', 'testuser')
        .blur()
        .should('not.have.focus')

      // Test password input
      cy.get('input[name="password"]')
        .should('have.attr', 'type', 'password')
        .type('password123')
        .should('have.value', 'password123')
    })

    it('TC_UI_02: Should handle form submission states', () => {
      // Test normal state
      cy.get('button[type="submit"]')
        .should('be.visible')
        .and('contain', 'Login')
        .and('not.be.disabled')
    })

    it('TC_UI_03: Should handle loading states', () => {
      // Intercept with delay to test loading state
      cy.intercept('POST', 'http://localhost:8080/auth/login', (req) => {
        req.reply((res) => {
          res.delay(2000)
          res.send({
            statusCode: 200,
            body: {
              success: true,
              token: 'mock-token',
              user: { username: 'testuser123' },
              expiresIn: 3600000
            }
          })
        })
      }).as('slowLogin')

      // Submit form
      cy.get('input[name="username"]').type('testuser123')
      cy.get('input[name="password"]').type('password123')
      cy.get('button[type="submit"]').click()

      // Check loading state
      cy.get('button[type="submit"]')
        .should('be.disabled')
        .and('contain', 'Logging in...')

      // Wait for completion
      cy.wait('@slowLogin')
    })

    it('TC_UI_04: Should handle keyboard navigation', () => {
      // Test Tab navigation
      cy.get('input[name="username"]').focus().tab()
      cy.get('input[name="password"]').should('have.focus')

      // Test Enter key submission with valid data
      cy.intercept('POST', 'http://localhost:8080/auth/login', {
        statusCode: 200,
        body: {
          success: true,
          token: 'mock-token',
          user: { username: 'testuser123' },
          expiresIn: 3600000
        }
      }).as('loginSubmit')

      cy.get('input[name="username"]').clear().type('testuser123')
      cy.get('input[name="password"]').clear().type('password123{enter}')

      // Should trigger form submission
      cy.wait('@loginSubmit')
    })

    it('TC_UI_05: Should handle navigation links', () => {
      // Test register link
      cy.get('a[href="/register"]')
        .should('be.visible')
        .and('contain', 'Register here')
        .click()

      cy.url().should('include', '/register')
    })

    it('TC_UI_06: Should handle responsive design elements', () => {
      // Test mobile viewport
      cy.viewport(375, 667) // iPhone SE
      cy.get('.container').should('be.visible')
      cy.get('input[name="username"]').should('be.visible')

      // Test tablet viewport
      cy.viewport(768, 1024) // iPad
      cy.get('.container').should('be.visible')

      // Test desktop viewport
      cy.viewport(1920, 1080)
      cy.get('.container').should('be.visible')
    })
  })

  // Session Management Tests
  describe('Session Management Tests', () => {
    it('TC_SESSION_01: Should handle token storage correctly', () => {
      // Mock successful login
      cy.intercept('POST', 'http://localhost:8080/auth/login', {
        statusCode: 200,
        body: {
          success: true,
          token: 'mock-jwt-token-123',
          user: { id: 1, username: 'testuser123' },
          expiresIn: 3600000
        }
      }).as('loginSuccess')

      cy.visit('http://localhost:3000/login')
      cy.get('input[name="username"]').type('testuser123')
      cy.get('input[name="password"]').type('password123')
      cy.get('button[type="submit"]').click()

      cy.wait('@loginSuccess')

      // Verify token storage
      cy.window().then((win) => {
        expect(win.localStorage.getItem('token')).to.equal('mock-jwt-token-123')
        expect(win.localStorage.getItem('tokenExpiration')).to.exist
        const userData = JSON.parse(win.localStorage.getItem('user'))
        expect(userData.username).to.equal('testuser123')
      })
    })

    it('TC_SESSION_02: Should maintain session across page refresh', () => {
      // Setup logged in state
      cy.window().then((win) => {
        win.localStorage.setItem('token', 'mock-token')
        win.localStorage.setItem('user', JSON.stringify({ username: 'testuser123' }))
        const futureTime = new Date().getTime() + 3600000
        win.localStorage.setItem('tokenExpiration', futureTime.toString())
      })

      // Visit home page
      cy.visit('http://localhost:3000')

      // Refresh page
      cy.reload()

      // Should remain logged in
      cy.get('.text-white').should('contain', 'Welcome, testuser123')
      cy.get('.btn-outline-light').contains('Logout').should('be.visible')
    })
  })
})