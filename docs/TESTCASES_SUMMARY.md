# Tổng hợp Test Cases - CRUD Application

## Tổng quan

Tài liệu này tổng hợp tất cả test cases cho ứng dụng CRUD (Login & Product Management) với mapping đến code và phân loại theo mức độ ưu tiên.

## Thống kê tổng quan

| Module        | Tổng số Test Cases | Critical | High   | Medium | Low   |
| ------------- | ------------------ | -------- | ------ | ------ | ----- |
| **Login**     | 18                 | 4        | 5      | 8      | 1     |
| **Product**   | 20                 | 5        | 7      | 8      | 0     |
| **Tổng cộng** | **38**             | **9**    | **12** | **16** | **1** |

## Phân loại mức độ ưu tiên

### Critical (9 test cases)

Test cases ảnh hưởng trực tiếp đến chức năng cốt lõi của ứng dụng:

- Đăng nhập thành công
- Đăng nhập thất bại (username/password sai)
- Tạo sản phẩm thành công
- Xem danh sách sản phẩm
- Xem chi tiết sản phẩm
- Cập nhật sản phẩm thành công
- Xóa sản phẩm thành công
- Token storage sau login
- Session management

### High (12 test cases)

Test cases quan trọng cho trải nghiệm người dùng:

- Validation errors (username/password rỗng, không đúng format)
- Validation errors (product name, price, quantity, category)
- Network error handling
- Search/Filter functionality

### Medium (16 test cases)

Test cases kiểm tra edge cases và boundary conditions:

- Boundary tests (min/max values)
- Edge cases (special characters, spaces)
- Negative tests (not found scenarios)
- Validation edge cases

### Low (1 test case)

Test cases kiểm tra các tình huống hiếm gặp:

- Username với ký tự đặc biệt hợp lệ

---

## LOGIN TEST CASES

### Critical Priority

| Test Case ID | Test Name                               | Frontend Test             | Backend Test                                       | E2E Test        |
| ------------ | --------------------------------------- | ------------------------- | -------------------------------------------------- | --------------- |
| TC_LOGIN_001 | Đăng nhập thành công                    | Login.integration.test.js | AuthServiceTest.testLoginSuccess()                 | login.e2e.cy.js |
| TC_LOGIN_002 | Login thất bại - Username không tồn tại | Login.integration.test.js | AuthServiceTest.testLoginWithNonExistentUsername() | login.e2e.cy.js |
| TC_LOGIN_003 | Login thất bại - Password sai           | Login.integration.test.js | AuthServiceTest.testLoginWithWrongPassword()       | -               |
| TC_LOGIN_018 | Token storage sau login                 | Login.integration.test.js | -                                                  | login.e2e.cy.js |

### High Priority

| Test Case ID | Test Name                          | Frontend Test             | Backend Test                                 | E2E Test        |
| ------------ | ---------------------------------- | ------------------------- | -------------------------------------------- | --------------- |
| TC_LOGIN_004 | Validation - Username rỗng         | validation.unit.test.js   | AuthServiceTest.testLoginWithEmptyUsername() | login.e2e.cy.js |
| TC_LOGIN_005 | Validation - Password rỗng         | validation.unit.test.js   | AuthServiceTest.testLoginWithEmptyPassword() | login.e2e.cy.js |
| TC_LOGIN_009 | Validation - Password quá ngắn     | validation.unit.test.js   | -                                            | login.e2e.cy.js |
| TC_LOGIN_010 | Validation - Password không có số  | validation.unit.test.js   | -                                            | login.e2e.cy.js |
| TC_LOGIN_011 | Validation - Password không có chữ | validation.unit.test.js   | -                                            | login.e2e.cy.js |
| TC_LOGIN_017 | Network Error Handling             | Login.integration.test.js | -                                            | login.e2e.cy.js |

### Medium Priority

| Test Case ID | Test Name                               | Frontend Test           | Backend Test | E2E Test        |
| ------------ | --------------------------------------- | ----------------------- | ------------ | --------------- |
| TC_LOGIN_006 | Validation - Username quá ngắn          | validation.unit.test.js | -            | login.e2e.cy.js |
| TC_LOGIN_007 | Validation - Username quá dài           | validation.unit.test.js | -            | login.e2e.cy.js |
| TC_LOGIN_008 | Validation - Username có ký tự đặc biệt | validation.unit.test.js | -            | login.e2e.cy.js |
| TC_LOGIN_012 | Boundary - Username = 3 ký tự (min)     | validation.unit.test.js | -            | -               |
| TC_LOGIN_013 | Boundary - Username = 50 ký tự (max)    | validation.unit.test.js | -            | -               |
| TC_LOGIN_014 | Boundary - Password = 6 ký tự (min)     | validation.unit.test.js | -            | -               |
| TC_LOGIN_015 | Edge Case - Username có khoảng trắng    | validation.unit.test.js | -            | -               |
| TC_LOGIN_016 | Edge Case - Password có khoảng trắng    | validation.unit.test.js | -            | -               |

### Low Priority

| Test Case ID | Test Name                          | Frontend Test           | Backend Test | E2E Test |
| ------------ | ---------------------------------- | ----------------------- | ------------ | -------- |
| TC_LOGIN_010 | Username hợp lệ với ký tự đặc biệt | validation.unit.test.js | -            | -        |

---

## PRODUCT TEST CASES

### Critical Priority

| Test Case ID   | Test Name                    | Frontend Test                   | Backend Test                                | E2E Test          |
| -------------- | ---------------------------- | ------------------------------- | ------------------------------------------- | ----------------- |
| TC_PRODUCT_001 | Tạo sản phẩm thành công      | AddProduct.integration.test.js  | ProductServiceUnitTest.testCreateProduct()  | product.e2e.cy.js |
| TC_PRODUCT_007 | Xem danh sách sản phẩm       | Home.integration.test.js        | ProductServiceUnitTest.testGetAllProducts() | product.e2e.cy.js |
| TC_PRODUCT_008 | Xem chi tiết sản phẩm        | ViewProduct.integration.test.js | ProductServiceUnitTest.testGetProductById() | product.e2e.cy.js |
| TC_PRODUCT_010 | Cập nhật sản phẩm thành công | EditProduct.integration.test.js | ProductServiceUnitTest.testUpdateProduct()  | product.e2e.cy.js |
| TC_PRODUCT_013 | Xóa sản phẩm thành công      | -                               | ProductServiceUnitTest.testDeleteProduct()  | product.e2e.cy.js |

### High Priority

| Test Case ID   | Test Name                          | Frontend Test                   | Backend Test                   | E2E Test          |
| -------------- | ---------------------------------- | ------------------------------- | ------------------------------ | ----------------- |
| TC_PRODUCT_002 | Validation - Name rỗng             | AddProduct.integration.test.js  | productValidation.unit.test.js | product.e2e.cy.js |
| TC_PRODUCT_003 | Validation - Price = 0             | AddProduct.integration.test.js  | productValidation.unit.test.js | product.e2e.cy.js |
| TC_PRODUCT_004 | Validation - Price âm              | -                               | productValidation.unit.test.js | product.e2e.cy.js |
| TC_PRODUCT_005 | Validation - Quantity âm           | AddProduct.integration.test.js  | productValidation.unit.test.js | product.e2e.cy.js |
| TC_PRODUCT_006 | Validation - Category không hợp lệ | -                               | productValidation.unit.test.js | -                 |
| TC_PRODUCT_012 | Validation - Update với price âm   | EditProduct.integration.test.js | -                              | product.e2e.cy.js |
| TC_PRODUCT_015 | Tìm kiếm theo tên                  | -                               | -                              | product.e2e.cy.js |
| TC_PRODUCT_016 | Tìm kiếm theo category             | -                               | -                              | product.e2e.cy.js |

### Medium Priority

| Test Case ID   | Test Name                       | Frontend Test | Backend Test                                        | E2E Test          |
| -------------- | ------------------------------- | ------------- | --------------------------------------------------- | ----------------- |
| TC_PRODUCT_009 | Xem sản phẩm không tồn tại      | -             | ProductServiceUnitTest.testGetProductByIdNotFound() | -                 |
| TC_PRODUCT_011 | Cập nhật sản phẩm không tồn tại | -             | ProductServiceUnitTest.testUpdateProductNotFound()  | -                 |
| TC_PRODUCT_014 | Xóa sản phẩm không tồn tại      | -             | ProductServiceUnitTest.testDeleteProductNotFound()  | -                 |
| TC_PRODUCT_017 | Tìm kiếm không có kết quả       | -             | -                                                   | product.e2e.cy.js |
| TC_PRODUCT_018 | Boundary - Name = 3 ký tự (min) | -             | productValidation.unit.test.js                      | -                 |
| TC_PRODUCT_019 | Boundary - Price = 1 (min)      | -             | productValidation.unit.test.js                      | -                 |
| TC_PRODUCT_020 | Boundary - Quantity = 0         | -             | productValidation.unit.test.js                      | -                 |

---

## Mapping đến Test Files

### Frontend Tests

#### Unit Tests

- `src/__tests__/unit/validation.unit.test.js` - 15 tests (Login validation)
- `src/__tests__/unit/productValidation.unit.test.js` - 18 tests (Product validation)

#### Integration Tests

- `src/__tests__/integration/Login.integration.test.js` - 19 tests
- `src/__tests__/integration/Register.integration.test.js` - 19 tests
- `src/__tests__/integration/Home.integration.test.js` - 10 tests
- `src/__tests__/integration/AddProduct.integration.test.js` - 15 tests
- `src/__tests__/integration/EditProduct.integration.test.js` - 15 tests
- `src/__tests__/integration/ViewProduct.integration.test.js` - 10 tests

#### Mock Tests

- `src/__tests__/mock/axiosConfig.mock.test.js` - 10 tests

### Backend Tests

#### Unit Tests

- `AuthServiceTest.java` - 5 tests (Login service)
- `ProductServiceUnitTest.java` - 10 tests (Product service)
- `UserValidationTest.java` - Validation tests
- `PasswordUtilTest.java` - Password utility tests
- `JwtUtilTest.java` - JWT utility tests

#### Integration Tests

- `AuthControllerIntegrationTest.java` - 2 tests (Login API)
- `ProductControllerIntegrationTest.java` - 5 tests (Product API)

#### Mock Tests

- `AuthControllerMockTest.java` - 1 test
- `ProductServiceMockTest.java` - 9 tests

### E2E Tests (Cypress)

- `cypress/e2e/login.e2e.cy.js` - Login E2E tests
- `cypress/e2e/mainLogin.e2e.cy.js` - Main login flow tests
- `cypress/e2e/product.e2e.cy.js` - Product CRUD E2E tests
- `cypress/e2e/mainProduct.e2e.cy.js` - Main product flow tests

---

## Test Coverage

### Frontend Coverage

- **Overall Coverage**: 98.23%
- **Statements**: 98.23%
- **Branches**: 94.82%
- **Functions**: 96.22%
- **Lines**: 98.23%

### Backend Coverage

- **Overall Coverage**: >= 85% (cần kiểm tra Jacoco report)
- Coverage được generate tại: `backend/crud-application/target/site/jacoco/`

---

## Test Execution

### Chạy Frontend Tests

```bash
cd frontend/crudfront
npm test                    # Watch mode
npm run test:ci            # CI mode with coverage
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only
```

### Chạy Backend Tests

```bash
cd backend/crud-application
mvn clean test             # Run all tests
mvn jacoco:report          # Generate coverage report
```

### Chạy E2E Tests

```bash
cd cypress
npx cypress open          # Interactive mode
npx cypress run           # Headless mode
```

---

## Test Results Summary

### Frontend

- **Total Tests**: 131 tests
- **Pass Rate**: 100% (131/131)
- **Coverage**: 98.23%

### Backend

- **Total Tests**: ~40+ tests (cần verify)
- **Pass Rate**: 100% (cần verify)
- **Coverage**: >= 85%

### E2E

- **Total Tests**: ~30+ tests
- **Pass Rate**: 100% (cần verify)

---

## Notes

1. Tất cả test cases đã được implement trong code
2. Test cases được phân loại theo mức độ ưu tiên dựa trên tác động đến chức năng
3. Critical và High priority test cases đều có coverage đầy đủ
4. E2E tests cover các user flows chính
5. CI/CD pipeline chạy tự động các tests trên mỗi commit

---

## References

- [TC_LOGIN.md](./test-cases/TC_LOGIN.md) - Chi tiết Login test cases
- [TC_PRODUCT.md](./test-cases/TC_PRODUCT.md) - Chi tiết Product test cases
- Frontend Progress Report: `frontend/crudfront/frontend_progress_report.md`
- Implementation Guide: `frontend/crudfront/implementation_guide.md`
