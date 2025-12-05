# BẢNG PHÂN CÔNG CHI TIẾT 5 THÀNH VIÊN (PHÂN BỔ ĐỀU)

---

## 1️⃣ Dư Nguyễn Đăng Khoa (3122410183) - 20%

### **Mục 6.1:** E2E Automation Testing - Login

- File: `cypress.config.js`
- File: `cypress/support/pages/LoginPage.js`
- File: `cypress/e2e/login.e2e.cy.js`
- File: `cypress/e2e/mainLogin.e2e.cy.js`

### **Mục 7.1:** Performance Testing - Product

- File: `performance/product_load_test.js`

### **Mục 4.2.1:** Frontend Integration Test - ViewProduct

- File: `frontend/crudfront/src/__tests__/integration/ViewProduct.integration.test.js` (191 dòng)

**Tổng số file: 6 files**

---

## 2️⃣ Nguyễn Tuấn Tài (3123410318) - 20%

### **Mục 3.1.2:** Backend Unit Test - Login Service

- File: `backend/crud-application/src/test/java/.../service/AuthServiceTest.java`

### **Mục 4.1.2:** Backend Integration Test - Login API

- File: `backend/crud-application/src/test/java/.../controller/AuthControllerIntegrationTest.java`

### **Mục 5.1.2:** Backend Mock Test - Login

- File: `backend/crud-application/src/test/java/.../controller/AuthControllerMockTest.java`

### **Mục 6.3:** CI/CD Pipeline

- File: `.github/workflows/ci.yml`

### **Mục 7.1:** Performance Testing - Login

- File: `performance/login_load_test.js`

### **Mục 7.2:** Security Testing - Login

- File: `security/sql_injection_test.js`
- File: `security/https_enforcement_test.js`

**Tổng số file: 6 files**

---

## 3️⃣ Nguyễn Huy Hoàng (3122410127) - 20%

### **Mục 3.2.2:** Backend Unit Test - Product Service

- File: `backend/crud-application/src/test/java/.../service/ProductServiceUnitTest.java`

### **Mục 4.2.2:** Backend Integration Test - Product API

- File: `backend/crud-application/src/test/java/.../controller/ProductControllerIntegrationTest.java`

### **Mục 5.2.2:** Backend Mock Test - Product

- File: `backend/crud-application/src/test/java/.../service/ProductServiceMockTest.java`

### **Mục 7.2:** Security Testing - Product

- File: `security/password_hashing_test.js`
- File: `security/security_headers_test.js`

### **Mục 4.1.1:** Frontend Integration Test - Register

- File: `frontend/crudfront/src/__tests__/integration/Register.integration.test.js` (227 dòng)

### **Mục 5.1.1:** Frontend Mock Test - Axios Config

- File: `frontend/crudfront/src/__tests__/mock/axiosConfig.mock.test.js` (286 dòng)

**Tổng số file: 7 files**

---

## 4️⃣ Nguyễn Minh Thái (3123410329) - 20%

### **Mục 3.1.1:** Frontend Unit Test - Login Validation

- File: `frontend/crudfront/src/__tests__/unit/validation.unit.test.js`

### **Mục 4.1.1:** Frontend Integration Test - Login Component

- File: `frontend/crudfront/src/__tests__/integration/Login.integration.test.js`

### **Mục 5.1.1:** Frontend Mock Test - Login

- File: `frontend/crudfront/src/__tests__/mock/Login.mock.test.js`

### **Mục 7.1:** Performance Testing - Login

- File: `performance/login_stress_test.js`

### **Mục 7.2:** Security Testing - Login

- File: `security/xss_test.js`
- File: `security/csrf_test.js`
- File: `security/auth_bypass_test.js`
- File: `security/cors_configuration_test.js`
- File: `security/input_validation_test.js`

**Tổng số file: 7 files**

---

## 5️⃣ Bùi Nguyễn Thịnh (3123410357) - 20%

### **Mục 3.2.1:** Frontend Unit Test - Product Validation

- File: `frontend/crudfront/src/__tests__/unit/productValidation.unit.test.js`

### **Mục 4.2.1:** Frontend Integration Test - Product Components

- File: `frontend/crudfront/src/__tests__/integration/AddProduct.integration.test.js`
- File: `frontend/crudfront/src/__tests__/integration/EditProduct.integration.test.js`

### **Mục 5.2.1:** Frontend Mock Test - Product

- File: `frontend/crudfront/src/__tests__/mock/Product.mock.test.js`

### **Mục 6.2:** E2E Automation Testing - Product

- File: `cypress/support/pages/ProductPage.js`
- File: `cypress/e2e/product.e2e.cy.js`
- File: `cypress/e2e/mainProduct.e2e.cy.js`

### **Mục 4.2.1:** Frontend Integration Test - Home

- File: `frontend/crudfront/src/__tests__/integration/Home.integration.test.js` (389 dòng)

**Tổng số file: 8 files**

---

## 📊 TỔNG KẾT PHÂN CÔNG (ĐÃ CÂN BẰNG ĐỀU)

| Thành viên | Số file | Phân bổ công việc                                                    |
| ---------- | ------- | -------------------------------------------------------------------- |
| **Khoa**   | 6 files | E2E Login + Performance Product + ViewProduct                        |
| **Tài**    | 6 files | BE Unit/Integration/Mock Login + CI/CD + Performance/Security        |
| **Hoàng**  | 7 files | BE Unit/Integration/Mock Product + Security + Register + axiosConfig |
| **Thái**   | 7 files | FE Unit/Integration/Mock Login + Performance Login + Security Login  |
| **Thịnh**  | 8 files | FE Unit/Integration/Mock Product + E2E Product + Home                |

**Tổng: 34 files test (không tính file .md báo cáo)**

---

## 📝 CÁCH ĐỐI CHIẾU VỚI CODE THỰC TẾ

### **1. Tìm file test theo tên:**

- Tất cả file test backend trong: `backend/crud-application/src/test/java/`
- Tất cả file test frontend trong: `frontend/crudfront/src/__tests__/`
- E2E tests trong: `cypress/e2e/`

### **2. Kiểm tra commit history:**

```bash
git log --author="Tên thành viên" --oneline
```

### **3. Kiểm tra coverage report:**

- Backend: `backend/crud-application/target/site/jacoco/index.html`
- Frontend: `frontend/crudfront/coverage/lcov-report/index.html`

---

## ✅ KẾT LUẬN

Tất cả 5 thành viên đều đã hoàn thành đầy đủ phần công việc được giao theo đề bài. Mỗi thành viên đóng góp **20%** công việc tổng thể của nhóm, đảm bảo coverage >= 80-90% cho tất cả các module.
