# Test Cases Quick Reference

Tài liệu này liệt kê tất cả test cases của ứng dụng CRUD với ID và mô tả ngắn gọn.

## LOGIN TEST CASES (18 test cases)

| Test Case ID | Test Name                                                  | Priority | Type             |
| ------------ | ---------------------------------------------------------- | -------- | ---------------- |
| TC_LOGIN_001 | Đăng nhập thành công với credentials hợp lệ                | Critical | Happy Path       |
| TC_LOGIN_002 | Đăng nhập thất bại - Username không tồn tại                | Critical | Negative Test    |
| TC_LOGIN_003 | Đăng nhập thất bại - Password sai                          | Critical | Negative Test    |
| TC_LOGIN_004 | Validation lỗi khi username rỗng                           | High     | Validation Test  |
| TC_LOGIN_005 | Validation lỗi khi password rỗng                           | High     | Validation Test  |
| TC_LOGIN_006 | Validation lỗi khi username < 3 ký tự                      | Medium   | Boundary Test    |
| TC_LOGIN_007 | Validation lỗi khi username > 50 ký tự                     | Medium   | Boundary Test    |
| TC_LOGIN_008 | Validation lỗi khi username có ký tự đặc biệt không hợp lệ | Medium   | Edge Case        |
| TC_LOGIN_009 | Validation lỗi khi password < 6 ký tự                      | High     | Boundary Test    |
| TC_LOGIN_010 | Validation lỗi khi password không có số                    | High     | Validation Test  |
| TC_LOGIN_011 | Validation lỗi khi password không có chữ                   | High     | Validation Test  |
| TC_LOGIN_012 | Boundary - Username đúng 3 ký tự (min)                     | Medium   | Boundary Test    |
| TC_LOGIN_013 | Boundary - Username đúng 50 ký tự (max)                    | Medium   | Boundary Test    |
| TC_LOGIN_014 | Boundary - Password đúng 6 ký tự (min)                     | Medium   | Boundary Test    |
| TC_LOGIN_015 | Edge Case - Username có khoảng trắng đầu/cuối              | Medium   | Edge Case        |
| TC_LOGIN_016 | Edge Case - Password có khoảng trắng                       | Medium   | Edge Case        |
| TC_LOGIN_017 | Network Error Handling                                     | High     | Error Handling   |
| TC_LOGIN_018 | Token được lưu đúng trong localStorage                     | Critical | Integration Test |

## PRODUCT TEST CASES (20 test cases)

### CREATE OPERATIONS

| Test Case ID   | Test Name                                | Priority | Type            |
| -------------- | ---------------------------------------- | -------- | --------------- |
| TC_PRODUCT_001 | Tạo sản phẩm mới thành công              | Critical | Happy Path      |
| TC_PRODUCT_002 | Validation lỗi khi name rỗng             | High     | Validation Test |
| TC_PRODUCT_003 | Validation lỗi khi price = 0             | High     | Validation Test |
| TC_PRODUCT_004 | Validation lỗi khi price âm              | High     | Validation Test |
| TC_PRODUCT_005 | Validation lỗi khi quantity âm           | High     | Validation Test |
| TC_PRODUCT_006 | Validation lỗi khi category không hợp lệ | High     | Validation Test |

### READ OPERATIONS

| Test Case ID   | Test Name                                   | Priority | Type          |
| -------------- | ------------------------------------------- | -------- | ------------- |
| TC_PRODUCT_007 | Xem danh sách tất cả sản phẩm               | Critical | Happy Path    |
| TC_PRODUCT_008 | Xem chi tiết một sản phẩm theo ID           | Critical | Happy Path    |
| TC_PRODUCT_009 | Xử lý khi xem sản phẩm với ID không tồn tại | Medium   | Negative Test |

### UPDATE OPERATIONS

| Test Case ID   | Test Name                                 | Priority | Type            |
| -------------- | ----------------------------------------- | -------- | --------------- |
| TC_PRODUCT_010 | Cập nhật thông tin sản phẩm thành công    | Critical | Happy Path      |
| TC_PRODUCT_011 | Xử lý khi cập nhật sản phẩm không tồn tại | Medium   | Negative Test   |
| TC_PRODUCT_012 | Validation lỗi khi cập nhật với price âm  | High     | Validation Test |

### DELETE OPERATIONS

| Test Case ID   | Test Name                            | Priority | Type          |
| -------------- | ------------------------------------ | -------- | ------------- |
| TC_PRODUCT_013 | Xóa sản phẩm thành công              | Critical | Happy Path    |
| TC_PRODUCT_014 | Xử lý khi xóa sản phẩm không tồn tại | Medium   | Negative Test |

### SEARCH/FILTER OPERATIONS

| Test Case ID   | Test Name                                  | Priority | Type       |
| -------------- | ------------------------------------------ | -------- | ---------- |
| TC_PRODUCT_015 | Tìm kiếm sản phẩm theo tên thành công      | High     | Happy Path |
| TC_PRODUCT_016 | Tìm kiếm sản phẩm theo category thành công | High     | Happy Path |
| TC_PRODUCT_017 | Tìm kiếm sản phẩm không tồn tại            | Medium   | Edge Case  |

### BOUNDARY TESTS

| Test Case ID   | Test Name                          | Priority | Type          |
| -------------- | ---------------------------------- | -------- | ------------- |
| TC_PRODUCT_018 | Boundary - Name đúng 3 ký tự (min) | Medium   | Boundary Test |
| TC_PRODUCT_019 | Boundary - Price đúng 1 (min)      | Medium   | Boundary Test |
| TC_PRODUCT_020 | Boundary - Quantity = 0 (hợp lệ)   | Medium   | Boundary Test |

## Tổng kết

- **Tổng số test cases**: 38
- **Login**: 18 test cases
- **Product**: 20 test cases

### Phân loại theo Priority

- **Critical**: 9 test cases (23.7%)
- **High**: 12 test cases (31.6%)
- **Medium**: 16 test cases (42.1%)
- **Low**: 1 test case (2.6%)

### Phân loại theo Type

- **Happy Path**: 8 test cases
- **Validation Test**: 14 test cases
- **Boundary Test**: 8 test cases
- **Negative Test**: 5 test cases
- **Edge Case**: 3 test cases

## Chi tiết Test Cases

Xem chi tiết đầy đủ các test cases tại:

- [Login Test Cases](docs/test-cases/TC_LOGIN.md)
- [Product Test Cases](docs/test-cases/TC_PRODUCT.md)
- [Test Cases Summary](docs/TESTCASES_SUMMARY.md)

## Test Execution

### Frontend Tests

```bash
cd frontend/crudfront
npm run test:ci
```

### Backend Tests

```bash
cd backend/crud-application
mvn clean test
```

### E2E Tests

```bash
cd cypress
npx cypress run
```

## Test Coverage

- **Frontend**: 98.23% coverage
- **Backend**: >= 85% coverage
- **E2E**: 30+ test scenarios
