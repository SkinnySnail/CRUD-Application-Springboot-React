# CRUD Application - Spring Boot & React

CRUD Application using React and Spring Boot với đầy đủ testing suite (Unit, Integration, E2E, Performance, Security).

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Test Coverage](#test-coverage)
- [CI/CD Pipeline](#cicd-pipeline)
- [Performance Testing](#performance-testing)
- [Security Testing](#security-testing)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)

---

## Getting Started

### Prerequisites

- **Node.js** (v18+) and npm
- **Java** (v17+) and Maven
- **MySQL** or **PostgreSQL** database
- **Git**

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/your-username/CRUD-Application-Springboot-React.git
cd CRUD-Application-Springboot-React
```

2. **Install frontend dependencies:**

```bash
cd frontend/crudfront
npm install
```

3. **Configure the backend:**
   - Create `application.properties` file in `backend/crud-application/src/main/resources/`
   - Configure database connection:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/your_database
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

4. **Build the Spring Boot project:**

```bash
cd backend/crud-application
mvn clean install
```

---

## Running the Application

### Start Backend Server

```bash
cd backend/crud-application
mvn spring-boot:run
```

Backend server will run on `http://localhost:8080`

### Start Frontend Server

```bash
cd frontend/crudfront
npm start
```

Frontend will run on `http://localhost:3000`

---

## Testing

### Frontend Tests

#### Unit Tests

```bash
cd frontend/crudfront
npm run test:unit
```

#### Integration Tests

```bash
cd frontend/crudfront
npm run test:integration
```

#### All Tests with Coverage

```bash
cd frontend/crudfront
npm run test:ci
```

#### Watch Mode

```bash
cd frontend/crudfront
npm test
```

### Backend Tests

#### Run All Tests

```bash
cd backend/crud-application
mvn clean test
```

#### Generate Coverage Report

```bash
cd backend/crud-application
mvn jacoco:report
```

Coverage report will be available at: `target/site/jacoco/index.html`

### E2E Tests (Cypress)

#### Interactive Mode

```bash
cd cypress
npx cypress open
```

#### Headless Mode

```bash
cd cypress
npx cypress run
```

**Note:** Make sure both backend and frontend servers are running before executing E2E tests.

---

## Test Coverage

### Frontend Coverage

- **Overall Coverage**: 98.23%
- **Statements**: 98.23%
- **Branches**: 94.82%
- **Functions**: 96.22%
- **Lines**: 98.23%

**Coverage Report Location**: `frontend/crudfront/coverage/lcov-report/index.html`

### Backend Coverage

- **Overall Coverage**: >= 85%
- **Target**: >= 85% for services, >= 80% overall

**Coverage Report Location**: `backend/crud-application/target/site/jacoco/index.html`

### Test Statistics

- **Frontend Tests**: 131 tests (100% pass rate)

  - Unit Tests: 33 tests
  - Integration Tests: 88 tests
  - Mock Tests: 10 tests

- **Backend Tests**: 40+ tests

  - Unit Tests: ~25 tests
  - Integration Tests: ~8 tests
  - Mock Tests: ~10 tests

- **E2E Tests**: 30+ tests
  - Login Flow: 15+ tests
  - Product CRUD: 20+ tests

---

## CI/CD Pipeline

### GitHub Actions Workflow

The project includes a comprehensive CI/CD pipeline (`.github/workflows/ci.yml`) that runs:

1. **Backend Tests**

   - Unit tests
   - Integration tests
   - Coverage report generation
   - Upload to Codecov

2. **Frontend Tests**

   - Unit tests
   - Integration tests
   - Coverage report generation
   - Upload to Codecov

3. **E2E Tests**
   - Cypress E2E tests
   - Database service (PostgreSQL)
   - Backend and Frontend servers
   - Test artifacts upload

### Pipeline Triggers

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

### View Pipeline Status

Check the **Actions** tab in GitHub repository to view pipeline runs and results.

---

## Performance Testing

### k6 Performance Tests

Performance tests are located in the `performance/` directory.

#### Available Tests

**Login API Tests:**

- `login_load_100.js` - Login API load test with 100 concurrent users
- `login_load_500.js` - Login API load test with 500 concurrent users
- `login_load_test.js` - Login API load test with 1000 concurrent users
- `login_stress_test.js` - Login API stress test to find breaking point

**Product API Tests:**

- `product_load_test.js` - Product API load testing
- `product_get_test.js` - GET product endpoint testing
- `product_post_test.js` - POST product endpoint testing
- `product_put_test.js` - PUT product endpoint testing
- `product_delete_test.js` - DELETE product endpoint testing

#### Run Performance Tests

**Prerequisites:** Install k6

```bash
# Windows (using Chocolatey)
choco install k6

# macOS
brew install k6

# Linux
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

**Run Tests:**

```bash
# Login load tests
k6 run performance/login_load_100.js      # 100 concurrent users
k6 run performance/login_load_500.js      # 500 concurrent users
k6 run performance/login_load_test.js      # 1000 concurrent users
k6 run performance/login_stress_test.js    # Stress test (100 → 3000 users)

# Product load test
k6 run performance/product_load_test.js
```

#### Test Scenarios

- **Load Test**: 100, 500, 1000 concurrent users
- **Stress Test**: Find breaking point
- **Response Time Analysis**: Measure API response times

---

## Security Testing

### Security Test Suite

Security tests are located in the `security/` directory.

#### Available Tests

- `sql_injection_test.js` - SQL Injection vulnerability testing
- `xss_test.js` - Cross-Site Scripting (XSS) testing
- `csrf_test.js` - Cross-Site Request Forgery (CSRF) testing
- `auth_bypass_test.js` - Authentication bypass testing
- `input_validation_test.js` - Input validation and sanitization
- `password_hashing_test.js` - Password hashing verification
- `cors_configuration_test.js` - CORS configuration testing
- `security_headers_test.js` - Security headers verification
- `https_enforcement_test.js` - HTTPS enforcement testing

#### Run Security Tests

```bash
# Run all security tests
node security/sql_injection_test.js
node security/xss_test.js
node security/csrf_test.js
# ... etc
```

### Security Best Practices Implemented

- ✅ Password hashing (BCrypt)
- ✅ JWT token authentication
- ✅ CORS configuration
- ✅ Input validation and sanitization
- ✅ SQL injection prevention (JPA/Prepared Statements)
- ✅ XSS prevention
- ✅ Security headers

---

## Project Structure

```
CRUD-Application-Springboot-React/
├── backend/
│   └── crud-application/
│       ├── src/
│       │   ├── main/java/com/crud/crud/application/
│       │   │   ├── controller/     # REST Controllers
│       │   │   ├── service/        # Business Logic
│       │   │   ├── repository/     # Data Access
│       │   │   ├── entity/         # Database Entities
│       │   │   ├── dto/            # Data Transfer Objects
│       │   │   └── util/           # Utilities
│       │   └── test/               # Test files
│       └── pom.xml
├── frontend/
│   └── crudfront/
│       ├── src/
│       │   ├── components/          # React Components
│       │   ├── pages/              # Page Components
│       │   ├── product/            # Product Components
│       │   ├── util/               # Utilities
│       │   └── __tests__/          # Test files
│       └── package.json
├── cypress/
│   ├── e2e/                        # E2E test files
│   └── support/                    # Cypress support files
├── performance/                     # k6 performance tests
├── security/                       # Security test files
├── docs/
│   └── test-cases/                 # Test case documentation
├── .github/
│   └── workflows/
│       └── ci.yml                  # CI/CD pipeline
└── README.md
```

---

## Technologies Used

### Frontend

- **React** 18.2.0
- **Bootstrap** 5.3.2
- **Axios** 1.5.1
- **React Router** 6.16.0
- **Jest** 27.5.1 (Testing)
- **React Testing Library** 13.4.0 (Testing)
- **Cypress** 15.7.0 (E2E Testing)

### Backend

- **Spring Boot** 3.1.4
- **Java** 17
- **Spring Data JPA**
- **MySQL/PostgreSQL**
- **JUnit 5** (Testing)
- **Mockito** (Mocking)
- **Jacoco** (Coverage)

### DevOps

- **GitHub Actions** (CI/CD)
- **k6** (Performance Testing)

---

## Test Cases Documentation

Detailed test cases documentation is available in:

- [Login Test Cases](docs/test-cases/TC_LOGIN.md) - 18 test cases
- [Product Test Cases](docs/test-cases/TC_PRODUCT.md) - 20 test cases
- [Test Cases Summary](docs/TESTCASES_SUMMARY.md) - Complete overview

See [TESTCASES.md](TESTCASES.md) for a quick reference of all test cases.

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Write tests for new features
- Maintain test coverage >= 80%
- Follow code style guidelines
- Update documentation as needed

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Contact & Support

For questions or issues, please open an issue in the GitHub repository.
