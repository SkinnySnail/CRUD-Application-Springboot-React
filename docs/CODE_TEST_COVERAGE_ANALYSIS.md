# PHÂN TÍCH CODE TEST COVERAGE - AUTH/LOGIN

## Tổng quan

Báo cáo này so sánh các test cases trong tài liệu với code đã implement để xác định phần còn thiếu.

**Ngày kiểm tra**: 2025-11-28

---

## SO SÁNH TEST CASES VỚI CODE

### TC_LOGIN_001: Đăng nhập thành công ✅

| Test Case    | Frontend                                         | Backend                                 | E2E                                | Status    |
| ------------ | ------------------------------------------------ | --------------------------------------- | ---------------------------------- | --------- |
| TC_LOGIN_001 | ✅ `Login.integration.test.js` - TC_LOGIN_INT_06 | ✅ `AuthServiceTest.testLoginSuccess()` | ✅ `login.e2e.cy.js` - TC_LOGIN_01 | ✅ Đầy đủ |

**Code Evidence:**

- Frontend: `frontend/crudfront/src/__tests__/integration/Login.integration.test.js:105-135`
- Backend: `backend/crud-application/src/test/java/com/crud/crud/application/service/AuthServiceTest.java:49-65`
- E2E: `cypress/e2e/login.e2e.cy.js:11-65`

---

### TC_LOGIN_002: Username không tồn tại ✅

| Test Case    | Frontend                                         | Backend                                                 | E2E                  | Status    |
| ------------ | ------------------------------------------------ | ------------------------------------------------------- | -------------------- | --------- |
| TC_LOGIN_002 | ✅ `Login.integration.test.js` - TC_LOGIN_INT_07 | ✅ `AuthServiceTest.testLoginWithNonExistentUsername()` | ✅ `login.e2e.cy.js` | ✅ Đầy đủ |

**Code Evidence:**

- Frontend: `Login.integration.test.js:137-161`
- Backend: `AuthServiceTest.java:68-78`
- Integration: `AuthControllerIntegrationTest.testLoginFailure()`

---

### TC_LOGIN_003: Password sai ✅

| Test Case    | Frontend                                               | Backend                                           | E2E                  | Status                       |
| ------------ | ------------------------------------------------------ | ------------------------------------------------- | -------------------- | ---------------------------- |
| TC_LOGIN_003 | ⚠️ Có trong integration test nhưng không có test riêng | ✅ `AuthServiceTest.testLoginWithWrongPassword()` | ✅ `login.e2e.cy.js` | ⚠️ Thiếu frontend test riêng |

**Code Evidence:**

- Backend: `AuthServiceTest.java:81-96`
- **Thiếu**: Frontend integration test riêng cho password sai

---

### TC_LOGIN_004: Username rỗng ✅

| Test Case    | Frontend                                      | Backend                                           | E2E                  | Status    |
| ------------ | --------------------------------------------- | ------------------------------------------------- | -------------------- | --------- |
| TC_LOGIN_004 | ✅ `validation.unit.test.js` - TC_LOGIN_BE_04 | ✅ `AuthServiceTest.testLoginWithEmptyUsername()` | ✅ `login.e2e.cy.js` | ✅ Đầy đủ |

**Code Evidence:**

- Frontend Unit: `validation.unit.test.js:5-9`
- Backend: `AuthServiceTest.java:99-109`

---

### TC_LOGIN_005: Password rỗng ✅

| Test Case    | Frontend                                      | Backend                                           | E2E                  | Status    |
| ------------ | --------------------------------------------- | ------------------------------------------------- | -------------------- | --------- |
| TC_LOGIN_005 | ✅ `validation.unit.test.js` - TC_LOGIN_BE_11 | ✅ `AuthServiceTest.testLoginWithEmptyPassword()` | ✅ `login.e2e.cy.js` | ✅ Đầy đủ |

**Code Evidence:**

- Frontend Unit: `validation.unit.test.js:44-48`
- Backend: `AuthServiceTest.java:111-121`

---

### TC_LOGIN_006-016: Validation Tests ✅

| Test Case    | Frontend Unit     | Backend | E2E | Status |
| ------------ | ----------------- | ------- | --- | ------ |
| TC_LOGIN_006 | ✅ TC_LOGIN_BE_05 | -       | ✅  | ✅     |
| TC_LOGIN_007 | ✅ TC_LOGIN_BE_06 | -       | ✅  | ✅     |
| TC_LOGIN_008 | ✅ TC_LOGIN_BE_07 | -       | ✅  | ✅     |
| TC_LOGIN_009 | ✅ TC_LOGIN_BE_12 | -       | ✅  | ✅     |
| TC_LOGIN_010 | ✅ TC_LOGIN_BE_15 | -       | ✅  | ✅     |
| TC_LOGIN_011 | ✅ TC_LOGIN_BE_14 | -       | ✅  | ✅     |
| TC_LOGIN_012 | ✅ Boundary test  | -       | -   | ✅     |
| TC_LOGIN_013 | ✅ Boundary test  | -       | -   | ✅     |
| TC_LOGIN_014 | ✅ TC_LOGIN_BE_17 | -       | -   | ✅     |
| TC_LOGIN_015 | ✅ TC_LOGIN_BE_08 | -       | -   | ✅     |
| TC_LOGIN_016 | ✅ TC_LOGIN_BE_16 | -       | -   | ✅     |

**Code Evidence:**

- Tất cả đều có trong `validation.unit.test.js`

---

### TC_LOGIN_017: Network Error Handling ✅

| Test Case    | Frontend                                         | Backend | E2E | Status    |
| ------------ | ------------------------------------------------ | ------- | --- | --------- |
| TC_LOGIN_017 | ✅ `Login.integration.test.js` - TC_LOGIN_INT_08 | -       | ✅  | ✅ Đầy đủ |

**Code Evidence:**

- Frontend: `Login.integration.test.js:163-179`

---

### TC_LOGIN_018: Token Storage ⚠️

| Test Case    | Frontend                                              | Backend | E2E                                  | Status                                   |
| ------------ | ----------------------------------------------------- | ------- | ------------------------------------ | ---------------------------------------- |
| TC_LOGIN_018 | ⚠️ Có trong TC_LOGIN_INT_06 nhưng không có test riêng | -       | ✅ `login.e2e.cy.js` - TC_SESSION_01 | ⚠️ Thiếu frontend integration test riêng |

**Code Evidence:**

- E2E: `login.e2e.cy.js:408-434` - TC_SESSION_01
- Frontend Integration: Có kiểm tra token trong TC_LOGIN_INT_06 nhưng không có test riêng cho token storage

---

## PHẦN THIẾU CẦN BỔ SUNG

### 1. Frontend Integration Test - Password Sai (TC_LOGIN_003) ⚠️

**Thiếu:** Test riêng cho trường hợp password sai trong integration test

**Cần thêm vào:** `frontend/crudfront/src/__tests__/integration/Login.integration.test.js`

```javascript
test("TC_LOGIN_INT_11: Login thất bại - password sai", async () => {
  const mockError = {
    response: {
      status: 401,
      data: {
        success: false,
        message: "Invalid username or password",
      },
    },
  };

  axios.post.mockRejectedValueOnce(mockError);

  renderWithRouter(<Login />);

  const usernameInput = screen.getByPlaceholderText(/enter username/i);
  const passwordInput = screen.getByPlaceholderText(/enter password/i);
  const submitButton = screen.getByRole("button", { name: /login/i });

  fireEvent.change(usernameInput, { target: { value: "testuser" } });
  fireEvent.change(passwordInput, { target: { value: "WrongPass" } });
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(
      screen.getByText(/invalid username or password/i)
    ).toBeInTheDocument();
  });
  expect(localStorage.getItem("token")).toBeNull();
});
```

---

### 2. Frontend Integration Test - Token Storage (TC_LOGIN_018) ⚠️

**Thiếu:** Test riêng cho token storage trong integration test

**Cần thêm vào:** `frontend/crudfront/src/__tests__/integration/Login.integration.test.js`

```javascript
test("TC_LOGIN_INT_12: Token được lưu đúng trong localStorage sau login thành công", async () => {
  const mockResponse = {
    data: {
      success: true,
      username: "testuser",
      token: "mock-jwt-token-123",
      user: { id: 1, username: "testuser" },
      expiresIn: 3600000,
    },
  };

  axios.post.mockResolvedValueOnce(mockResponse);

  renderWithRouter(<Login />);

  const usernameInput = screen.getByPlaceholderText(/enter username/i);
  const passwordInput = screen.getByPlaceholderText(/enter password/i);
  const submitButton = screen.getByRole("button", { name: /login/i });

  fireEvent.change(usernameInput, { target: { value: "testuser" } });
  fireEvent.change(passwordInput, { target: { value: "Test123" } });
  fireEvent.click(submitButton);

  await waitFor(() => {
    // Verify token is stored
    expect(localStorage.getItem("token")).toBe("mock-jwt-token-123");

    // Verify user data is stored
    const userData = JSON.parse(localStorage.getItem("user"));
    expect(userData.username).toBe("testuser");

    // Verify token expiration is stored
    expect(localStorage.getItem("tokenExpiration")).toBeTruthy();
    const expiration = parseInt(localStorage.getItem("tokenExpiration"));
    expect(expiration).toBeGreaterThan(Date.now());
  });
});
```

---

### 3. Backend Integration Test - Validation Errors ⚠️

**Thiếu:** Test validation errors trong AuthControllerIntegrationTest

**Cần thêm vào:** `backend/crud-application/src/test/java/com/crud/crud/application/controller/AuthControllerIntegrationTest.java`

```java
@Test
@DisplayName("POST /auth/login - Validation error: username rỗng")
void testLoginWithEmptyUsername() throws Exception {
    UserDto request = new UserDto("", "Test123");

    mockMvc.perform(post("/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.success").value(false));
}

@Test
@DisplayName("POST /auth/login - Validation error: password rỗng")
void testLoginWithEmptyPassword() throws Exception {
    UserDto request = new UserDto("testuser", "");

    mockMvc.perform(post("/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.success").value(false));
}
```

---

## TỔNG KẾT

### Test Coverage hiện tại:

| Loại Test                  | Số lượng  | Coverage               |
| -------------------------- | --------- | ---------------------- |
| Frontend Unit Tests        | 15 tests  | ✅ 100%                |
| Frontend Integration Tests | 10 tests  | ⚠️ 90% (thiếu 2 tests) |
| Backend Unit Tests         | 5 tests   | ✅ 100%                |
| Backend Integration Tests  | 4 tests   | ⚠️ 80% (thiếu 2 tests) |
| E2E Tests                  | 15+ tests | ✅ 100%                |

### Phần còn thiếu:

1. ⚠️ **Frontend Integration Test** - Password sai (TC_LOGIN_003)
2. ⚠️ **Frontend Integration Test** - Token Storage (TC_LOGIN_018)
3. ⚠️ **Backend Integration Test** - Validation errors (username/password rỗng)

### Đề xuất:

Bổ sung 4 test cases trên để đạt 100% coverage cho tất cả test cases trong tài liệu.
