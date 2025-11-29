# Test Cases - Login Functionality

## Tổng quan

Tài liệu này mô tả các test cases cho chức năng Đăng nhập (Login) của ứng dụng.

## Validation Rules

- **Username**: 3-50 ký tự, chỉ chứa a-z, A-Z, 0-9, -, ., \_
- **Password**: 6-100 ký tự, phải có cả chữ và số

## Phân loại mức độ ưu tiên

- **Critical**: Test cases ảnh hưởng trực tiếp đến chức năng cốt lõi
- **High**: Test cases quan trọng cho trải nghiệm người dùng
- **Medium**: Test cases kiểm tra edge cases và validation
- **Low**: Test cases kiểm tra các tình huống hiếm gặp

---

## 1. PHÂN TÍCH YÊU CẦU CHỨC NĂNG LOGIN

### 1.1. Authentication Flow

1. User nhập username và password
2. Frontend validate input (client-side)
3. Gửi request đến backend API `/auth/login`
4. Backend validate và authenticate
5. Nếu thành công: Trả về JWT token và user info
6. Frontend lưu token vào localStorage
7. Redirect đến home page

### 1.2. Error Handling

- Validation errors: Hiển thị ngay tại form (client-side)
- Authentication errors: Hiển thị error message từ server
- Network errors: Hiển thị thông báo lỗi mạng

---

## 2. TEST SCENARIOS (18 scenarios)

Bảng tổng hợp tất cả test scenarios cho chức năng Login:

| STT | Test Scenario ID | Test Scenario Name                                         | Loại Test        | Priority | Mô tả ngắn gọn                                                      |
| --- | ---------------- | ---------------------------------------------------------- | ---------------- | -------- | ------------------------------------------------------------------- |
| 1   | TC_LOGIN_001     | Đăng nhập thành công với credentials hợp lệ                | Happy Path       | Critical | User đăng nhập thành công với username và password đúng             |
| 2   | TC_LOGIN_002     | Đăng nhập thất bại - Username không tồn tại                | Negative Test    | Critical | User nhập username không tồn tại trong database                     |
| 3   | TC_LOGIN_003     | Đăng nhập thất bại - Password sai                          | Negative Test    | Critical | User nhập password sai cho username hợp lệ                          |
| 4   | TC_LOGIN_004     | Validation lỗi khi username rỗng                           | Validation Test  | High     | User để trống trường username                                       |
| 5   | TC_LOGIN_005     | Validation lỗi khi password rỗng                           | Validation Test  | High     | User để trống trường password                                       |
| 6   | TC_LOGIN_006     | Validation lỗi khi username < 3 ký tự                      | Boundary Test    | Medium   | User nhập username chỉ có 2 ký tự                                   |
| 7   | TC_LOGIN_007     | Validation lỗi khi username > 50 ký tự                     | Boundary Test    | Medium   | User nhập username có 51 ký tự                                      |
| 8   | TC_LOGIN_008     | Validation lỗi khi username có ký tự đặc biệt không hợp lệ | Edge Case        | Medium   | User nhập username chứa ký tự @, #, $, ...                          |
| 9   | TC_LOGIN_009     | Validation lỗi khi password < 6 ký tự                      | Boundary Test    | High     | User nhập password chỉ có 5 ký tự                                   |
| 10  | TC_LOGIN_010     | Validation lỗi khi password không chứa số                  | Validation Test  | High     | User nhập password chỉ có chữ cái                                   |
| 11  | TC_LOGIN_011     | Validation lỗi khi password không chứa chữ cái             | Validation Test  | High     | User nhập password chỉ có số                                        |
| 12  | TC_LOGIN_012     | Boundary - Username đúng 3 ký tự (min)                     | Boundary Test    | Medium   | User nhập username đúng 3 ký tự (giới hạn tối thiểu)                |
| 13  | TC_LOGIN_013     | Boundary - Username đúng 50 ký tự (max)                    | Boundary Test    | Medium   | User nhập username đúng 50 ký tự (giới hạn tối đa)                  |
| 14  | TC_LOGIN_014     | Boundary - Password đúng 6 ký tự (min)                     | Boundary Test    | Medium   | User nhập password đúng 6 ký tự (giới hạn tối thiểu)                |
| 15  | TC_LOGIN_015     | Edge Case - Username có khoảng trắng đầu/cuối              | Edge Case        | Medium   | User nhập username có khoảng trắng ở đầu hoặc cuối                  |
| 16  | TC_LOGIN_016     | Edge Case - Password có khoảng trắng                       | Edge Case        | Medium   | User nhập password chứa khoảng trắng                                |
| 17  | TC_LOGIN_017     | Network Error Handling                                     | Error Handling   | High     | Xử lý khi mất kết nối mạng trong quá trình đăng nhập                |
| 18  | TC_LOGIN_018     | Session Management - Token Storage                         | Integration Test | Critical | Token được lưu đúng trong localStorage sau khi đăng nhập thành công |

**Tổng kết Test Scenarios:**

- **Tổng số**: 18 scenarios (vượt yêu cầu 10+)
- **Happy Path**: 1 scenario
- **Negative Tests**: 2 scenarios
- **Validation Tests**: 5 scenarios
- **Boundary Tests**: 5 scenarios
- **Edge Cases**: 3 scenarios
- **Error Handling**: 1 scenario
- **Integration Tests**: 1 scenario

**Phân loại theo Priority:**

- **Critical**: 4 scenarios (TC_LOGIN_001, TC_LOGIN_002, TC_LOGIN_003, TC_LOGIN_018)
- **High**: 5 scenarios (TC_LOGIN_004, TC_LOGIN_005, TC_LOGIN_009, TC_LOGIN_010, TC_LOGIN_011, TC_LOGIN_017)
- **Medium**: 8 scenarios (TC_LOGIN_006, TC_LOGIN_007, TC_LOGIN_008, TC_LOGIN_012, TC_LOGIN_013, TC_LOGIN_014, TC_LOGIN_015, TC_LOGIN_016)
- **Low**: 1 scenario

---

## 3. THIẾT KẾ TEST CASES CHI TIẾT - 5 TEST CASES QUAN TRỌNG NHẤT

Bảng tổng hợp 5 test cases quan trọng nhất cho chức năng Login:

| Test Case ID | Test Name                                   | Priority | Preconditions                                                                                | Test Steps                                                                                                                        | Test Data                                 | Expected Result                                                                                                                                                             | Test Type       |
| ------------ | ------------------------------------------- | -------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| TC_LOGIN_001 | Đăng nhập thành công với credentials hợp lệ | Critical | - User account đã tồn tại trong database<br>- Application đang chạy<br>- User chưa đăng nhập | 1. Navigate to login page<br>2. Enter valid username: "testuser"<br>3. Enter valid password: "Test123"<br>4. Click Login button   | Username: testuser<br>Password: Test123   | - Success message displayed<br>- JWT token được lưu trong localStorage<br>- Redirect to home page (/)<br>- Navbar hiển thị "Welcome, testuser"<br>- Logout button xuất hiện | Happy Path      |
| TC_LOGIN_002 | Đăng nhập thất bại - Username không tồn tại | Critical | - Application đang chạy<br>- User account không tồn tại trong database                       | 1. Navigate to login page<br>2. Enter non-existent username: "wronguser"<br>3. Enter password: "Test123"<br>4. Click Login button | Username: wronguser<br>Password: Test123  | - Error message: "Invalid username or password"<br>- Không redirect<br>- Token không được lưu<br>- Vẫn ở trang login                                                        | Negative Test   |
| TC_LOGIN_003 | Đăng nhập thất bại - Password sai           | Critical | - User account tồn tại với password khác<br>- Application đang chạy                          | 1. Navigate to login page<br>2. Enter valid username: "testuser"<br>3. Enter wrong password: "WrongPass"<br>4. Click Login button | Username: testuser<br>Password: WrongPass | - Error message: "Invalid username or password"<br>- Không redirect<br>- Token không được lưu                                                                               | Negative Test   |
| TC_LOGIN_004 | Validation lỗi khi username rỗng            | High     | - Application đang chạy                                                                      | 1. Navigate to login page<br>2. Leave username field empty<br>3. Enter password: "Test123"<br>4. Click Login button               | Username: (empty)<br>Password: Test123    | - Error message: "Username is required!"<br>- Form không submit<br>- Không gọi API                                                                                          | Validation Test |
| TC_LOGIN_005 | Validation lỗi khi password rỗng            | High     | - Application đang chạy                                                                      | 1. Navigate to login page<br>2. Enter username: "testuser"<br>3. Leave password field empty<br>4. Click Login button              | Username: testuser<br>Password: (empty)   | - Error message: "Password is required!"<br>- Form không submit<br>- Không gọi API                                                                                          | Validation Test |

**Ghi chú:**

- 5 test cases trên là những test cases quan trọng nhất, bao phủ các tình huống cốt lõi của chức năng Login
- Các test cases còn lại (TC_LOGIN_006 đến TC_LOGIN_018) được mô tả chi tiết ở phần dưới

---

## 4. CHI TIẾT TẤT CẢ TEST CASES

## Test Case 1: Đăng nhập thành công

| Thuộc tính            | Giá trị                                                                                                                                                                     |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Test Case ID**      | TC_LOGIN_001                                                                                                                                                                |
| **Test Name**         | Đăng nhập thành công với credentials hợp lệ                                                                                                                                 |
| **Priority**          | Critical                                                                                                                                                                    |
| **Preconditions**     | - User account đã tồn tại trong database<br>- Application đang chạy<br>- User chưa đăng nhập                                                                                |
| **Test Steps**        | 1. Navigate to login page<br>2. Enter valid username: "testuser"<br>3. Enter valid password: "Test123"<br>4. Click Login button                                             |
| **Test Data**         | Username: testuser<br>Password: Test123                                                                                                                                     |
| **Expected Result**   | - Success message displayed<br>- JWT token được lưu trong localStorage<br>- Redirect to home page (/)<br>- Navbar hiển thị "Welcome, testuser"<br>- Logout button xuất hiện |
| **Actual Result**     | (Để trống)                                                                                                                                                                  |
| **Status**            | Not Run                                                                                                                                                                     |
| **Test Type**         | Happy Path                                                                                                                                                                  |
| **Related Test Code** | `AuthServiceTest.testLoginSuccess()`<br>`Login.integration.test.js - TC_LOGIN_INT_06`                                                                                       |

---

## Test Case 2: Đăng nhập thất bại - Username không tồn tại

| Thuộc tính            | Giá trị                                                                                                                           |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Test Case ID**      | TC_LOGIN_002                                                                                                                      |
| **Test Name**         | Đăng nhập thất bại với username không tồn tại                                                                                     |
| **Priority**          | Critical                                                                                                                          |
| **Preconditions**     | - Application đang chạy<br>- User account không tồn tại trong database                                                            |
| **Test Steps**        | 1. Navigate to login page<br>2. Enter non-existent username: "wronguser"<br>3. Enter password: "Test123"<br>4. Click Login button |
| **Test Data**         | Username: wronguser<br>Password: Test123                                                                                          |
| **Expected Result**   | - Error message: "Invalid username or password"<br>- Không redirect<br>- Token không được lưu<br>- Vẫn ở trang login              |
| **Actual Result**     | (Để trống)                                                                                                                        |
| **Status**            | Not Run                                                                                                                           |
| **Test Type**         | Negative Test                                                                                                                     |
| **Related Test Code** | `AuthServiceTest.testLoginWithNonExistentUsername()`<br>`AuthControllerIntegrationTest.testLoginFailure()`                        |

---

## Test Case 3: Đăng nhập thất bại - Password sai

| Thuộc tính            | Giá trị                                                                                                                           |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Test Case ID**      | TC_LOGIN_003                                                                                                                      |
| **Test Name**         | Đăng nhập thất bại với password sai                                                                                               |
| **Priority**          | Critical                                                                                                                          |
| **Preconditions**     | - User account tồn tại với password khác<br>- Application đang chạy                                                               |
| **Test Steps**        | 1. Navigate to login page<br>2. Enter valid username: "testuser"<br>3. Enter wrong password: "WrongPass"<br>4. Click Login button |
| **Test Data**         | Username: testuser<br>Password: WrongPass                                                                                         |
| **Expected Result**   | - Error message: "Invalid username or password"<br>- Không redirect<br>- Token không được lưu                                     |
| **Actual Result**     | (Để trống)                                                                                                                        |
| **Status**            | Not Run                                                                                                                           |
| **Test Type**         | Negative Test                                                                                                                     |
| **Related Test Code** | `AuthServiceTest.testLoginWithWrongPassword()`                                                                                    |

---

## Test Case 4: Validation - Username rỗng

| Thuộc tính            | Giá trị                                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Test Case ID**      | TC_LOGIN_004                                                                                                        |
| **Test Name**         | Validation lỗi khi username rỗng                                                                                    |
| **Priority**          | High                                                                                                                |
| **Preconditions**     | - Application đang chạy                                                                                             |
| **Test Steps**        | 1. Navigate to login page<br>2. Leave username field empty<br>3. Enter password: "Test123"<br>4. Click Login button |
| **Test Data**         | Username: (empty)<br>Password: Test123                                                                              |
| **Expected Result**   | - Error message: "Username is required!"<br>- Form không submit<br>- Không gọi API                                  |
| **Actual Result**     | (Để trống)                                                                                                          |
| **Status**            | Not Run                                                                                                             |
| **Test Type**         | Validation Test                                                                                                     |
| **Related Test Code** | `validation.unit.test.js - TC_LOGIN_BE_04`<br>`AuthServiceTest.testLoginWithEmptyUsername()`                        |

---

## Test Case 5: Validation - Password rỗng

| Thuộc tính            | Giá trị                                                                                                              |
| --------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Test Case ID**      | TC_LOGIN_005                                                                                                         |
| **Test Name**         | Validation lỗi khi password rỗng                                                                                     |
| **Priority**          | High                                                                                                                 |
| **Preconditions**     | - Application đang chạy                                                                                              |
| **Test Steps**        | 1. Navigate to login page<br>2. Enter username: "testuser"<br>3. Leave password field empty<br>4. Click Login button |
| **Test Data**         | Username: testuser<br>Password: (empty)                                                                              |
| **Expected Result**   | - Error message: "Password is required!"<br>- Form không submit<br>- Không gọi API                                   |
| **Actual Result**     | (Để trống)                                                                                                           |
| **Status**            | Not Run                                                                                                              |
| **Test Type**         | Validation Test                                                                                                      |
| **Related Test Code** | `validation.unit.test.js - TC_LOGIN_BE_11`<br>`AuthServiceTest.testLoginWithEmptyPassword()`                         |

---

## Test Case 6: Validation - Username quá ngắn

| Thuộc tính            | Giá trị                                                                                                                 |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Test Case ID**      | TC_LOGIN_006                                                                                                            |
| **Test Name**         | Validation lỗi khi username < 3 ký tự                                                                                   |
| **Priority**          | Medium                                                                                                                  |
| **Preconditions**     | - Application đang chạy                                                                                                 |
| **Test Steps**        | 1. Navigate to login page<br>2. Enter username: "ab" (2 ký tự)<br>3. Enter password: "Test123"<br>4. Click Login button |
| **Test Data**         | Username: ab<br>Password: Test123                                                                                       |
| **Expected Result**   | - Error message: "Username too short"<br>- Form không submit                                                            |
| **Actual Result**     | (Để trống)                                                                                                              |
| **Status**            | Not Run                                                                                                                 |
| **Test Type**         | Boundary Test                                                                                                           |
| **Related Test Code** | `validation.unit.test.js - TC_LOGIN_BE_05`                                                                              |

---

## Test Case 7: Validation - Username quá dài

| Thuộc tính            | Giá trị                                                                                                               |
| --------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Test Case ID**      | TC_LOGIN_007                                                                                                          |
| **Test Name**         | Validation lỗi khi username > 50 ký tự                                                                                |
| **Priority**          | Medium                                                                                                                |
| **Preconditions**     | - Application đang chạy                                                                                               |
| **Test Steps**        | 1. Navigate to login page<br>2. Enter username: 51 ký tự 'a'<br>3. Enter password: "Test123"<br>4. Click Login button |
| **Test Data**         | Username: aaaaaaaaaa... (51 ký tự)<br>Password: Test123                                                               |
| **Expected Result**   | - Error message: "Username too long"<br>- Form không submit                                                           |
| **Actual Result**     | (Để trống)                                                                                                            |
| **Status**            | Not Run                                                                                                               |
| **Test Type**         | Boundary Test                                                                                                         |
| **Related Test Code** | `validation.unit.test.js - TC_LOGIN_BE_06`                                                                            |

---

## Test Case 8: Validation - Username có ký tự đặc biệt không hợp lệ

| Thuộc tính            | Giá trị                                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Test Case ID**      | TC_LOGIN_008                                                                                                        |
| **Test Name**         | Validation lỗi khi username chứa ký tự đặc biệt không hợp lệ                                                        |
| **Priority**          | Medium                                                                                                              |
| **Preconditions**     | - Application đang chạy                                                                                             |
| **Test Steps**        | 1. Navigate to login page<br>2. Enter username: "user@123"<br>3. Enter password: "Test123"<br>4. Click Login button |
| **Test Data**         | Username: user@123<br>Password: Test123                                                                             |
| **Expected Result**   | - Error message: "Username contains invalid characters"<br>- Form không submit                                      |
| **Actual Result**     | (Để trống)                                                                                                          |
| **Status**            | Not Run                                                                                                             |
| **Test Type**         | Edge Case                                                                                                           |
| **Related Test Code** | `validation.unit.test.js - TC_LOGIN_BE_07`                                                                          |

---

## Test Case 9: Validation - Password quá ngắn

| Thuộc tính            | Giá trị                                                                                                                     |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Test Case ID**      | TC_LOGIN_009                                                                                                                |
| **Test Name**         | Validation lỗi khi password < 6 ký tự                                                                                       |
| **Priority**          | High                                                                                                                        |
| **Preconditions**     | - Application đang chạy                                                                                                     |
| **Test Steps**        | 1. Navigate to login page<br>2. Enter username: "testuser"<br>3. Enter password: "abc12" (5 ký tự)<br>4. Click Login button |
| **Test Data**         | Username: testuser<br>Password: abc12                                                                                       |
| **Expected Result**   | - Error message: "Password too short"<br>- Form không submit                                                                |
| **Actual Result**     | (Để trống)                                                                                                                  |
| **Status**            | Not Run                                                                                                                     |
| **Test Type**         | Boundary Test                                                                                                               |
| **Related Test Code** | `validation.unit.test.js - TC_LOGIN_BE_12`                                                                                  |

---

## Test Case 10: Validation - Password không có số

| Thuộc tính            | Giá trị                                                                                                                               |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Test Case ID**      | TC_LOGIN_010                                                                                                                          |
| **Test Name**         | Validation lỗi khi password không chứa số                                                                                             |
| **Priority**          | High                                                                                                                                  |
| **Preconditions**     | - Application đang chạy                                                                                                               |
| **Test Steps**        | 1. Navigate to login page<br>2. Enter username: "testuser"<br>3. Enter password: "TestPassword" (chỉ có chữ)<br>4. Click Login button |
| **Test Data**         | Username: testuser<br>Password: TestPassword                                                                                          |
| **Expected Result**   | - Error message: "Password must contain both letters and numbers"<br>- Form không submit                                              |
| **Actual Result**     | (Để trống)                                                                                                                            |
| **Status**            | Not Run                                                                                                                               |
| **Test Type**         | Validation Test                                                                                                                       |
| **Related Test Code** | `validation.unit.test.js - TC_LOGIN_BE_15`                                                                                            |

---

## Test Case 11: Validation - Password không có chữ

| Thuộc tính            | Giá trị                                                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Test Case ID**      | TC_LOGIN_011                                                                                                                   |
| **Test Name**         | Validation lỗi khi password không chứa chữ cái                                                                                 |
| **Priority**          | High                                                                                                                           |
| **Preconditions**     | - Application đang chạy                                                                                                        |
| **Test Steps**        | 1. Navigate to login page<br>2. Enter username: "testuser"<br>3. Enter password: "123456" (chỉ có số)<br>4. Click Login button |
| **Test Data**         | Username: testuser<br>Password: 123456                                                                                         |
| **Expected Result**   | - Error message: "Password must contain both letters and numbers"<br>- Form không submit                                       |
| **Actual Result**     | (Để trống)                                                                                                                     |
| **Status**            | Not Run                                                                                                                        |
| **Test Type**         | Validation Test                                                                                                                |
| **Related Test Code** | `validation.unit.test.js - TC_LOGIN_BE_14`                                                                                     |

---

## Test Case 12: Boundary - Username đúng 3 ký tự (min)

| Thuộc tính            | Giá trị                                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Test Case ID**      | TC_LOGIN_012                                                                                                             |
| **Test Name**         | Username đúng 3 ký tự (giới hạn tối thiểu)                                                                               |
| **Priority**          | Medium                                                                                                                   |
| **Preconditions**     | - User account tồn tại với username 3 ký tự<br>- Application đang chạy                                                   |
| **Test Steps**        | 1. Navigate to login page<br>2. Enter username: "abc" (3 ký tự)<br>3. Enter password: "Test123"<br>4. Click Login button |
| **Test Data**         | Username: abc<br>Password: Test123                                                                                       |
| **Expected Result**   | - Đăng nhập thành công (nếu account tồn tại)<br>- Hoặc validation pass và gọi API                                        |
| **Actual Result**     | (Để trống)                                                                                                               |
| **Status**            | Not Run                                                                                                                  |
| **Test Type**         | Boundary Test                                                                                                            |
| **Related Test Code** | `validation.unit.test.js - TC_LOGIN_BE_09`                                                                               |

---

## Test Case 13: Boundary - Username đúng 50 ký tự (max)

| Thuộc tính            | Giá trị                                                                                                               |
| --------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Test Case ID**      | TC_LOGIN_013                                                                                                          |
| **Test Name**         | Username đúng 50 ký tự (giới hạn tối đa)                                                                              |
| **Priority**          | Medium                                                                                                                |
| **Preconditions**     | - User account tồn tại với username 50 ký tự<br>- Application đang chạy                                               |
| **Test Steps**        | 1. Navigate to login page<br>2. Enter username: 50 ký tự 'a'<br>3. Enter password: "Test123"<br>4. Click Login button |
| **Test Data**         | Username: aaaaaaaaaa... (50 ký tự)<br>Password: Test123                                                               |
| **Expected Result**   | - Đăng nhập thành công (nếu account tồn tại)<br>- Hoặc validation pass và gọi API                                     |
| **Actual Result**     | (Để trống)                                                                                                            |
| **Status**            | Not Run                                                                                                               |
| **Test Type**         | Boundary Test                                                                                                         |
| **Related Test Code** | `validation.unit.test.js - Boundary Tests`                                                                            |

---

## Test Case 14: Boundary - Password đúng 6 ký tự (min)

| Thuộc tính            | Giá trị                                                                                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Test Case ID**      | TC_LOGIN_014                                                                                                                               |
| **Test Name**         | Password đúng 6 ký tự (giới hạn tối thiểu)                                                                                                 |
| **Priority**          | Medium                                                                                                                                     |
| **Preconditions**     | - User account tồn tại<br>- Application đang chạy                                                                                          |
| **Test Steps**        | 1. Navigate to login page<br>2. Enter username: "testuser"<br>3. Enter password: "abc123" (6 ký tự, có chữ và số)<br>4. Click Login button |
| **Test Data**         | Username: testuser<br>Password: abc123                                                                                                     |
| **Expected Result**   | - Validation pass<br>- Đăng nhập thành công (nếu credentials đúng)                                                                         |
| **Actual Result**     | (Để trống)                                                                                                                                 |
| **Status**            | Not Run                                                                                                                                    |
| **Test Type**         | Boundary Test                                                                                                                              |
| **Related Test Code** | `validation.unit.test.js - TC_LOGIN_BE_17`                                                                                                 |

---

## Test Case 15: Edge Case - Username có khoảng trắng

| Thuộc tính            | Giá trị                                                                                                                             |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Test Case ID**      | TC_LOGIN_015                                                                                                                        |
| **Test Name**         | Validation lỗi khi username có khoảng trắng đầu/cuối                                                                                |
| **Priority**          | Medium                                                                                                                              |
| **Preconditions**     | - Application đang chạy                                                                                                             |
| **Test Steps**        | 1. Navigate to login page<br>2. Enter username: " user " (có khoảng trắng)<br>3. Enter password: "Test123"<br>4. Click Login button |
| **Test Data**         | Username: " user "<br>Password: Test123                                                                                             |
| **Expected Result**   | - Error message: "Username cannot have leading/trailing spaces"<br>- Form không submit                                              |
| **Actual Result**     | (Để trống)                                                                                                                          |
| **Status**            | Not Run                                                                                                                             |
| **Test Type**         | Edge Case                                                                                                                           |
| **Related Test Code** | `validation.unit.test.js - TC_LOGIN_BE_08`                                                                                          |

---

## Test Case 16: Edge Case - Password có khoảng trắng

| Thuộc tính            | Giá trị                                                                                                                               |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Test Case ID**      | TC_LOGIN_016                                                                                                                          |
| **Test Name**         | Validation lỗi khi password chứa khoảng trắng                                                                                         |
| **Priority**          | Medium                                                                                                                                |
| **Preconditions**     | - Application đang chạy                                                                                                               |
| **Test Steps**        | 1. Navigate to login page<br>2. Enter username: "testuser"<br>3. Enter password: "abc 123" (có khoảng trắng)<br>4. Click Login button |
| **Test Data**         | Username: testuser<br>Password: abc 123                                                                                               |
| **Expected Result**   | - Error message: "Password cannot contain spaces"<br>- Form không submit                                                              |
| **Actual Result**     | (Để trống)                                                                                                                            |
| **Status**            | Not Run                                                                                                                               |
| **Test Type**         | Edge Case                                                                                                                             |
| **Related Test Code** | `validation.unit.test.js - TC_LOGIN_BE_16`                                                                                            |

---

## Test Case 17: Network Error Handling

| Thuộc tính            | Giá trị                                                                                                                           |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Test Case ID**      | TC_LOGIN_017                                                                                                                      |
| **Test Name**         | Xử lý lỗi khi mất kết nối mạng                                                                                                    |
| **Priority**          | High                                                                                                                              |
| **Preconditions**     | - Application đang chạy<br>- Simulate network error                                                                               |
| **Test Steps**        | 1. Navigate to login page<br>2. Enter valid credentials<br>3. Disconnect network hoặc mock network error<br>4. Click Login button |
| **Test Data**         | Username: testuser<br>Password: Test123                                                                                           |
| **Expected Result**   | - Error message: "Network error. Please try again."<br>- User có thể thử lại                                                      |
| **Actual Result**     | (Để trống)                                                                                                                        |
| **Status**            | Not Run                                                                                                                           |
| **Test Type**         | Error Handling                                                                                                                    |
| **Related Test Code** | `Login.integration.test.js - TC_LOGIN_INT_08`                                                                                     |

---

## Test Case 18: Session Management - Token Storage

| Thuộc tính            | Giá trị                                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Test Case ID**      | TC_LOGIN_018                                                                                                              |
| **Test Name**         | Token được lưu đúng trong localStorage sau khi đăng nhập thành công                                                       |
| **Priority**          | Critical                                                                                                                  |
| **Preconditions**     | - Application đang chạy<br>- User account tồn tại                                                                         |
| **Test Steps**        | 1. Navigate to login page<br>2. Enter valid credentials<br>3. Click Login button<br>4. Verify localStorage                |
| **Test Data**         | Username: testuser<br>Password: Test123                                                                                   |
| **Expected Result**   | - Token được lưu trong localStorage với key "token"<br>- User data được lưu với key "user"<br>- Token expiration được lưu |
| **Actual Result**     | (Để trống)                                                                                                                |
| **Status**            | Not Run                                                                                                                   |
| **Test Type**         | Integration Test                                                                                                          |
| **Related Test Code** | `login.e2e.cy.js - TC_SESSION_01`                                                                                         |

---

## Tổng kết

- **Tổng số test cases**: 18
- **Critical**: 4 test cases
- **High**: 5 test cases
- **Medium**: 8 test cases
- **Low**: 1 test case

## Mapping đến Code

| Test Case ID     | Frontend Test             | Backend Test                                       | E2E Test        |
| ---------------- | ------------------------- | -------------------------------------------------- | --------------- |
| TC_LOGIN_001     | Login.integration.test.js | AuthServiceTest.testLoginSuccess()                 | login.e2e.cy.js |
| TC_LOGIN_002     | Login.integration.test.js | AuthServiceTest.testLoginWithNonExistentUsername() | login.e2e.cy.js |
| TC_LOGIN_003     | Login.integration.test.js | AuthServiceTest.testLoginWithWrongPassword()       | -               |
| TC_LOGIN_004     | validation.unit.test.js   | AuthServiceTest.testLoginWithEmptyUsername()       | login.e2e.cy.js |
| TC_LOGIN_005     | validation.unit.test.js   | AuthServiceTest.testLoginWithEmptyPassword()       | login.e2e.cy.js |
| TC_LOGIN_006-016 | validation.unit.test.js   | -                                                  | login.e2e.cy.js |
| TC_LOGIN_017     | Login.integration.test.js | -                                                  | login.e2e.cy.js |
| TC_LOGIN_018     | Login.integration.test.js | -                                                  | login.e2e.cy.js |
