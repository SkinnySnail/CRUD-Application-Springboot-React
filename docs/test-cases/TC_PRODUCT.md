# Test Cases - Product Management (CRUD)

## Tổng quan

Tài liệu này mô tả các test cases cho chức năng Quản lý Sản phẩm (Product Management) bao gồm các thao tác CRUD: Create, Read, Update, Delete.

## Validation Rules

- **Product Name**: 3-100 ký tự, không được rỗng
- **Price**: > 0, <= 999,999,999
- **Quantity**: >= 0, <= 99,999
- **Description**: <= 500 ký tự (optional)
- **Category**: Phải thuộc danh sách categories có sẵn (Electronics, Clothing, Books, Food, Sports)

## Phân loại mức độ ưu tiên

- **Critical**: Test cases ảnh hưởng trực tiếp đến chức năng cốt lõi
- **High**: Test cases quan trọng cho trải nghiệm người dùng
- **Medium**: Test cases kiểm tra edge cases và validation
- **Low**: Test cases kiểm tra các tình huống hiếm gặp

---

## 1. PHÂN TÍCH YÊU CẦU CHỨC NĂNG PRODUCT CRUD

### 1.1. Create Operation

1. User đăng nhập và navigate đến Product page
2. Click "Add New Product" button
3. Nhập thông tin sản phẩm (Name, Price, Quantity, Category, Description)
4. Frontend validate input
5. Gửi request POST `/api/products` đến backend
6. Backend validate và lưu vào database
7. Trả về product mới được tạo
8. Frontend hiển thị success message và redirect

### 1.2. Read Operations

- **Get All Products**: GET `/api/products` - Lấy danh sách tất cả sản phẩm
- **Get Product By ID**: GET `/api/products/{id}` - Lấy chi tiết một sản phẩm

### 1.3. Update Operation

1. User click "Edit" button trên sản phẩm
2. Form được populate với dữ liệu hiện tại
3. User chỉnh sửa thông tin
4. Frontend validate
5. Gửi request PUT `/api/products/{id}`
6. Backend update và trả về product đã cập nhật

### 1.4. Delete Operation

1. User click "Delete" button
2. Confirm dialog xuất hiện
3. User confirm deletion
4. Gửi request DELETE `/api/products/{id}`
5. Backend xóa và trả về success
6. Product được remove khỏi danh sách

### 1.5. Search/Filter Operation

- User nhập keyword và chọn search type (name, category)
- Gửi request GET `/api/products?searchType={type}&searchValue={value}`
- Backend filter và trả về kết quả

---

## 2. TEST SCENARIOS (20 scenarios)

Bảng tổng hợp tất cả test scenarios cho chức năng Product Management:

| STT | Test Scenario ID | Test Scenario Name                          | Loại Test       | Priority | Mô tả ngắn gọn                              |
| --- | ---------------- | ------------------------------------------- | --------------- | -------- | ------------------------------------------- |
| 1   | TC_PRODUCT_001   | Tạo sản phẩm mới thành công                 | Happy Path      | Critical | User tạo sản phẩm mới với dữ liệu hợp lệ    |
| 2   | TC_PRODUCT_002   | Validation lỗi khi name rỗng                | Validation Test | High     | User để trống trường name khi tạo sản phẩm  |
| 3   | TC_PRODUCT_003   | Validation lỗi khi price = 0                | Validation Test | High     | User nhập price = 0                         |
| 4   | TC_PRODUCT_004   | Validation lỗi khi price âm                 | Validation Test | High     | User nhập price < 0                         |
| 5   | TC_PRODUCT_005   | Validation lỗi khi quantity âm              | Validation Test | High     | User nhập quantity < 0                      |
| 6   | TC_PRODUCT_006   | Validation lỗi khi category không hợp lệ    | Validation Test | High     | User chọn category không có trong danh sách |
| 7   | TC_PRODUCT_007   | Xem danh sách tất cả sản phẩm               | Happy Path      | Critical | User xem danh sách tất cả sản phẩm          |
| 8   | TC_PRODUCT_008   | Xem chi tiết một sản phẩm theo ID           | Happy Path      | Critical | User xem chi tiết sản phẩm với ID hợp lệ    |
| 9   | TC_PRODUCT_009   | Xử lý khi xem sản phẩm với ID không tồn tại | Negative Test   | Medium   | User xem sản phẩm với ID không tồn tại      |
| 10  | TC_PRODUCT_010   | Cập nhật thông tin sản phẩm thành công      | Happy Path      | Critical | User cập nhật sản phẩm với dữ liệu hợp lệ   |
| 11  | TC_PRODUCT_011   | Xử lý khi cập nhật sản phẩm không tồn tại   | Negative Test   | Medium   | User cập nhật sản phẩm với ID không tồn tại |
| 12  | TC_PRODUCT_012   | Validation lỗi khi cập nhật với price âm    | Validation Test | High     | User cập nhật sản phẩm với price < 0        |
| 13  | TC_PRODUCT_013   | Xóa sản phẩm thành công                     | Happy Path      | Critical | User xóa sản phẩm với ID hợp lệ             |
| 14  | TC_PRODUCT_014   | Xử lý khi xóa sản phẩm không tồn tại        | Negative Test   | Medium   | User xóa sản phẩm với ID không tồn tại      |
| 15  | TC_PRODUCT_015   | Tìm kiếm sản phẩm theo tên thành công       | Happy Path      | High     | User tìm kiếm sản phẩm theo tên             |
| 16  | TC_PRODUCT_016   | Tìm kiếm sản phẩm theo category thành công  | Happy Path      | High     | User tìm kiếm sản phẩm theo category        |
| 17  | TC_PRODUCT_017   | Tìm kiếm sản phẩm không tồn tại             | Edge Case       | Medium   | User tìm kiếm với keyword không có kết quả  |
| 18  | TC_PRODUCT_018   | Boundary - Name đúng 3 ký tự (min)          | Boundary Test   | Medium   | User tạo sản phẩm với name đúng 3 ký tự     |
| 19  | TC_PRODUCT_019   | Boundary - Price đúng 1 (min)               | Boundary Test   | Medium   | User tạo sản phẩm với price = 1             |
| 20  | TC_PRODUCT_020   | Boundary - Quantity = 0 (hợp lệ)            | Boundary Test   | Medium   | User tạo sản phẩm với quantity = 0          |

**Tổng kết Test Scenarios:**

- **Tổng số**: 20 scenarios (vượt yêu cầu 10+)
- **Happy Path**: 6 scenarios (Create, Read All, Read One, Update, Delete, Search)
- **Negative Tests**: 3 scenarios (Not Found scenarios)
- **Validation Tests**: 6 scenarios (Name, Price, Quantity, Category validation)
- **Boundary Tests**: 3 scenarios (Min/Max values)
- **Edge Cases**: 2 scenarios (Search no results, Invalid category)

**Phân loại theo Priority:**

- **Critical**: 5 scenarios (TC_PRODUCT_001, TC_PRODUCT_007, TC_PRODUCT_008, TC_PRODUCT_010, TC_PRODUCT_013)
- **High**: 7 scenarios (TC_PRODUCT_002, TC_PRODUCT_003, TC_PRODUCT_004, TC_PRODUCT_005, TC_PRODUCT_006, TC_PRODUCT_012, TC_PRODUCT_015, TC_PRODUCT_016)
- **Medium**: 8 scenarios (TC_PRODUCT_009, TC_PRODUCT_011, TC_PRODUCT_014, TC_PRODUCT_017, TC_PRODUCT_018, TC_PRODUCT_019, TC_PRODUCT_020)

---

## 3. THIẾT KẾ TEST CASES CHI TIẾT - 5 TEST CASES QUAN TRỌNG NHẤT

Bảng tổng hợp 5 test cases quan trọng nhất cho chức năng Product Management (bao gồm Create, Read, Update, Delete):

| Test Case ID   | Test Name                              | Priority | Preconditions                                                                            | Test Steps                                                                                                                                                                                                                                                              | Test Data                                                                                                             | Expected Result                                                                                                                                                                     | Test Type  |
| -------------- | -------------------------------------- | -------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| TC_PRODUCT_001 | Tạo sản phẩm mới thành công            | Critical | - User đã đăng nhập<br>- User có quyền tạo sản phẩm<br>- Application đang chạy           | 1. Navigate to Product page<br>2. Click "Add New Product" button<br>3. Enter product information:<br> - Name: "Laptop Dell"<br> - Price: 15000000<br> - Quantity: 10<br> - Category: "Electronics"<br> - Description: "High performance laptop"<br>4. Click Save button | Name: Laptop Dell<br>Price: 15000000<br>Quantity: 10<br>Category: Electronics<br>Description: High performance laptop | - Product created successfully<br> - Success message displayed<br> - Product appears in product list<br> - Redirect to home page<br> - Product ID được tạo tự động                  | Happy Path |
| TC_PRODUCT_007 | Xem danh sách tất cả sản phẩm          | Critical | - User đã đăng nhập<br>- Có ít nhất 1 sản phẩm trong database<br>- Application đang chạy | 1. Navigate to home page<br>2. Verify product list table is displayed                                                                                                                                                                                                   | N/A                                                                                                                   | - Product table hiển thị với các cột: ID, Name, Price, Quantity, Description, Category, Actions<br> - Tất cả sản phẩm được hiển thị<br> - Table có pagination nếu có nhiều sản phẩm | Happy Path |
| TC_PRODUCT_008 | Xem chi tiết một sản phẩm theo ID      | Critical | - User đã đăng nhập<br>- Sản phẩm với ID = 1 tồn tại<br>- Application đang chạy          | 1. Navigate to product list<br>2. Click "View" button on first product<br>3. Verify product details page                                                                                                                                                                | Product ID: 1                                                                                                         | - Redirect to /viewproduct/1<br> - Hiển thị đầy đủ thông tin: Name, Price, Quantity, Description, Category<br> - Có button "Back to Home"<br> - Có button "Edit"                    | Happy Path |
| TC_PRODUCT_010 | Cập nhật thông tin sản phẩm thành công | Critical | - User đã đăng nhập<br>- Sản phẩm với ID = 1 tồn tại<br>- Application đang chạy          | 1. Navigate to product list<br>2. Click "Edit" button on product ID = 1<br>3. Update product information:<br> - Name: "Laptop Updated"<br> - Price: 14000000<br> - Quantity: 15<br>4. Click Save button                                                                 | Product ID: 1<br>Name: Laptop Updated<br>Price: 14000000<br>Quantity: 15                                              | - Product updated successfully<br> - Success message displayed<br> - Product appears in list with updated information<br> - Redirect to home page                                   | Happy Path |
| TC_PRODUCT_013 | Xóa sản phẩm thành công                | Critical | - User đã đăng nhập<br>- Sản phẩm với ID = 1 tồn tại<br>- Application đang chạy          | 1. Navigate to product list<br>2. Click "Delete" button on product ID = 1<br>3. Confirm deletion                                                                                                                                                                        | Product ID: 1                                                                                                         | - Product deleted successfully<br> - Success message displayed<br> - Product removed from list<br> - Product count decreased                                                        | Happy Path |

**Ghi chú:**

- 5 test cases trên là những test cases quan trọng nhất, bao phủ đầy đủ các thao tác CRUD cốt lõi
- Các test cases còn lại (TC_PRODUCT_002-006, TC_PRODUCT_009, TC_PRODUCT_011-012, TC_PRODUCT_014-020) được mô tả chi tiết ở phần dưới

---

## 4. CHI TIẾT TẤT CẢ TEST CASES

## CREATE OPERATIONS

### Test Case 1: Tạo sản phẩm mới thành công

| Thuộc tính            | Giá trị                                                                                                                                                                                                                                                                 |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Test Case ID**      | TC_PRODUCT_001                                                                                                                                                                                                                                                          |
| **Test Name**         | Tạo sản phẩm mới thành công với dữ liệu hợp lệ                                                                                                                                                                                                                          |
| **Priority**          | Critical                                                                                                                                                                                                                                                                |
| **Preconditions**     | - User đã đăng nhập<br>- User có quyền tạo sản phẩm<br>- Application đang chạy                                                                                                                                                                                          |
| **Test Steps**        | 1. Navigate to Product page<br>2. Click "Add New Product" button<br>3. Enter product information:<br> - Name: "Laptop Dell"<br> - Price: 15000000<br> - Quantity: 10<br> - Category: "Electronics"<br> - Description: "High performance laptop"<br>4. Click Save button |
| **Test Data**         | Name: Laptop Dell<br>Price: 15000000<br>Quantity: 10<br>Category: Electronics<br>Description: High performance laptop                                                                                                                                                   |
| **Expected Result**   | - Product created successfully<br> - Success message displayed<br> - Product appears in product list<br> - Redirect to home page<br> - Product ID được tạo tự động                                                                                                      |
| **Actual Result**     | (Để trống)                                                                                                                                                                                                                                                              |
| **Status**            | Not Run                                                                                                                                                                                                                                                                 |
| **Test Type**         | Happy Path                                                                                                                                                                                                                                                              |
| **Related Test Code** | `ProductServiceUnitTest.testCreateProduct()`<br>`AddProduct.integration.test.js - TC_PRODUCT_INT_06`<br>`product.e2e.cy.js - TC_CREATE_01`                                                                                                                              |

---

### Test Case 2: Tạo sản phẩm thất bại - Name rỗng

| Thuộc tính            | Giá trị                                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Test Case ID**      | TC_PRODUCT_002                                                                                                      |
| **Test Name**         | Validation lỗi khi tạo sản phẩm với name rỗng                                                                       |
| **Priority**          | High                                                                                                                |
| **Preconditions**     | - User đã đăng nhập<br>- Application đang chạy                                                                      |
| **Test Steps**        | 1. Navigate to Add Product page<br>2. Leave name field empty<br>3. Enter other valid fields<br>4. Click Save button |
| **Test Data**         | Name: (empty)<br>Price: 15000000<br>Quantity: 10<br>Category: Electronics                                           |
| **Expected Result**   | - Error message: "Product name is required"<br> - Form không submit<br> - Vẫn ở trang Add Product                   |
| **Actual Result**     | (Để trống)                                                                                                          |
| **Status**            | Not Run                                                                                                             |
| **Test Type**         | Validation Test                                                                                                     |
| **Related Test Code** | `productValidation.unit.test.js - TC_PRODUCT_BE_05`<br>`AddProduct.integration.test.js - TC_PRODUCT_INT_01`         |

---

### Test Case 3: Tạo sản phẩm thất bại - Price = 0

| Thuộc tính            | Giá trị                                                                                                                                |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Test Case ID**      | TC_PRODUCT_003                                                                                                                         |
| **Test Name**         | Validation lỗi khi price = 0                                                                                                           |
| **Priority**          | High                                                                                                                                   |
| **Preconditions**     | - User đã đăng nhập<br>- Application đang chạy                                                                                         |
| **Test Steps**        | 1. Navigate to Add Product page<br>2. Enter name: "Laptop"<br>3. Enter price: 0<br>4. Enter other valid fields<br>5. Click Save button |
| **Test Data**         | Name: Laptop<br>Price: 0<br>Quantity: 10<br>Category: Electronics                                                                      |
| **Expected Result**   | - Error message: "Price must be greater than 0"<br> - Form không submit                                                                |
| **Actual Result**     | (Để trống)                                                                                                                             |
| **Status**            | Not Run                                                                                                                                |
| **Test Type**         | Validation Test                                                                                                                        |
| **Related Test Code** | `productValidation.unit.test.js - TC_PRODUCT_BE_09`<br>`AddProduct.integration.test.js - TC_PRODUCT_INT_02`                            |

---

### Test Case 4: Tạo sản phẩm thất bại - Price âm

| Thuộc tính            | Giá trị                                                                                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Test Case ID**      | TC_PRODUCT_004                                                                                                                             |
| **Test Name**         | Validation lỗi khi price âm                                                                                                                |
| **Priority**          | High                                                                                                                                       |
| **Preconditions**     | - User đã đăng nhập<br>- Application đang chạy                                                                                             |
| **Test Steps**        | 1. Navigate to Add Product page<br>2. Enter name: "Laptop"<br>3. Enter price: -1000<br>4. Enter other valid fields<br>5. Click Save button |
| **Test Data**         | Name: Laptop<br>Price: -1000<br>Quantity: 10<br>Category: Electronics                                                                      |
| **Expected Result**   | - Error message: "Price must be greater than 0"<br> - Form không submit                                                                    |
| **Actual Result**     | (Để trống)                                                                                                                                 |
| **Status**            | Not Run                                                                                                                                    |
| **Test Type**         | Validation Test                                                                                                                            |
| **Related Test Code** | `productValidation.unit.test.js - TC_PRODUCT_BE_10`                                                                                        |

---

### Test Case 5: Tạo sản phẩm thất bại - Quantity âm

| Thuộc tính            | Giá trị                                                                                                                                |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Test Case ID**      | TC_PRODUCT_005                                                                                                                         |
| **Test Name**         | Validation lỗi khi quantity âm                                                                                                         |
| **Priority**          | High                                                                                                                                   |
| **Preconditions**     | - User đã đăng nhập<br>- Application đang chạy                                                                                         |
| **Test Steps**        | 1. Navigate to Add Product page<br>2. Enter valid name and price<br>3. Enter quantity: -1<br>4. Enter category<br>5. Click Save button |
| **Test Data**         | Name: Laptop<br>Price: 15000000<br>Quantity: -1<br>Category: Electronics                                                               |
| **Expected Result**   | - Error message: "Quantity cannot be negative"<br> - Form không submit                                                                 |
| **Actual Result**     | (Để trống)                                                                                                                             |
| **Status**            | Not Run                                                                                                                                |
| **Test Type**         | Validation Test                                                                                                                        |
| **Related Test Code** | `productValidation.unit.test.js - TC_PRODUCT_BE_15`<br>`AddProduct.integration.test.js - TC_PRODUCT_INT_03`                            |

---

### Test Case 6: Tạo sản phẩm thất bại - Category không hợp lệ

| Thuộc tính            | Giá trị                                                                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Test Case ID**      | TC_PRODUCT_006                                                                                                                                   |
| **Test Name**         | Validation lỗi khi category không hợp lệ                                                                                                         |
| **Priority**          | High                                                                                                                                             |
| **Preconditions**     | - User đã đăng nhập<br>- Application đang chạy                                                                                                   |
| **Test Steps**        | 1. Navigate to Add Product page<br>2. Enter valid name, price, quantity<br>3. Select invalid category: "InvalidCategory"<br>4. Click Save button |
| **Test Data**         | Name: Laptop<br>Price: 15000000<br>Quantity: 10<br>Category: InvalidCategory                                                                     |
| **Expected Result**   | - Error message: "Invalid category"<br> - Form không submit                                                                                      |
| **Actual Result**     | (Để trống)                                                                                                                                       |
| **Status**            | Not Run                                                                                                                                          |
| **Test Type**         | Validation Test                                                                                                                                  |
| **Related Test Code** | `productValidation.unit.test.js - Category Validation`<br>`ProductServiceUnitTest.testCreateProductInvalidCategory()`                            |

---

## READ OPERATIONS

### Test Case 7: Xem danh sách sản phẩm

| Thuộc tính            | Giá trị                                                                                                                                                                             |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Test Case ID**      | TC_PRODUCT_007                                                                                                                                                                      |
| **Test Name**         | Hiển thị danh sách tất cả sản phẩm                                                                                                                                                  |
| **Priority**          | Critical                                                                                                                                                                            |
| **Preconditions**     | - User đã đăng nhập<br>- Có ít nhất 1 sản phẩm trong database<br>- Application đang chạy                                                                                            |
| **Test Steps**        | 1. Navigate to home page<br>2. Verify product list table is displayed                                                                                                               |
| **Test Data**         | N/A                                                                                                                                                                                 |
| **Expected Result**   | - Product table hiển thị với các cột: ID, Name, Price, Quantity, Description, Category, Actions<br> - Tất cả sản phẩm được hiển thị<br> - Table có pagination nếu có nhiều sản phẩm |
| **Actual Result**     | (Để trống)                                                                                                                                                                          |
| **Status**            | Not Run                                                                                                                                                                             |
| **Test Type**         | Happy Path                                                                                                                                                                          |
| **Related Test Code** | `ProductServiceUnitTest.testGetAllProducts()`<br>`ProductControllerIntegrationTest.testGetAllProducts()`<br>`product.e2e.cy.js - TC_READ_01`                                        |

---

### Test Case 8: Xem chi tiết sản phẩm

| Thuộc tính            | Giá trị                                                                                                                                                          |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Test Case ID**      | TC_PRODUCT_008                                                                                                                                                   |
| **Test Name**         | Xem chi tiết một sản phẩm theo ID                                                                                                                                |
| **Priority**          | Critical                                                                                                                                                         |
| **Preconditions**     | - User đã đăng nhập<br>- Sản phẩm với ID = 1 tồn tại<br>- Application đang chạy                                                                                  |
| **Test Steps**        | 1. Navigate to product list<br>2. Click "View" button on first product<br>3. Verify product details page                                                         |
| **Test Data**         | Product ID: 1                                                                                                                                                    |
| **Expected Result**   | - Redirect to /viewproduct/1<br> - Hiển thị đầy đủ thông tin: Name, Price, Quantity, Description, Category<br> - Có button "Back to Home"<br> - Có button "Edit" |
| **Actual Result**     | (Để trống)                                                                                                                                                       |
| **Status**            | Not Run                                                                                                                                                          |
| **Test Type**         | Happy Path                                                                                                                                                       |
| **Related Test Code** | `ProductServiceUnitTest.testGetProductById()`<br>`ProductControllerIntegrationTest.testGetProductById()`<br>`product.e2e.cy.js - TC_READ_02`                     |

---

### Test Case 9: Xem sản phẩm không tồn tại

| Thuộc tính            | Giá trị                                                                                   |
| --------------------- | ----------------------------------------------------------------------------------------- |
| **Test Case ID**      | TC_PRODUCT_009                                                                            |
| **Test Name**         | Xử lý khi xem sản phẩm với ID không tồn tại                                               |
| **Priority**          | Medium                                                                                    |
| **Preconditions**     | - User đã đăng nhập<br>- Sản phẩm với ID = 999 không tồn tại<br>- Application đang chạy   |
| **Test Steps**        | 1. Navigate to /viewproduct/999<br>2. Verify error handling                               |
| **Test Data**         | Product ID: 999                                                                           |
| **Expected Result**   | - Error message: "Product not found"<br> - Hoặc redirect về home page<br> - Hoặc 404 page |
| **Actual Result**     | (Để trống)                                                                                |
| **Status**            | Not Run                                                                                   |
| **Test Type**         | Negative Test                                                                             |
| **Related Test Code** | `ProductServiceUnitTest.testGetProductByIdNotFound()`                                     |

---

## UPDATE OPERATIONS

### Test Case 10: Cập nhật sản phẩm thành công

| Thuộc tính            | Giá trị                                                                                                                                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Test Case ID**      | TC_PRODUCT_010                                                                                                                                                                                          |
| **Test Name**         | Cập nhật thông tin sản phẩm thành công                                                                                                                                                                  |
| **Priority**          | Critical                                                                                                                                                                                                |
| **Preconditions**     | - User đã đăng nhập<br>- Sản phẩm với ID = 1 tồn tại<br>- Application đang chạy                                                                                                                         |
| **Test Steps**        | 1. Navigate to product list<br>2. Click "Edit" button on product ID = 1<br>3. Update product information:<br> - Name: "Laptop Updated"<br> - Price: 14000000<br> - Quantity: 15<br>4. Click Save button |
| **Test Data**         | Product ID: 1<br>Name: Laptop Updated<br>Price: 14000000<br>Quantity: 15                                                                                                                                |
| **Expected Result**   | - Product updated successfully<br> - Success message displayed<br> - Product appears in list with updated information<br> - Redirect to home page                                                       |
| **Actual Result**     | (Để trống)                                                                                                                                                                                              |
| **Status**            | Not Run                                                                                                                                                                                                 |
| **Test Type**         | Happy Path                                                                                                                                                                                              |
| **Related Test Code** | `ProductServiceUnitTest.testUpdateProduct()`<br>`ProductControllerIntegrationTest.testUpdateProduct()`<br>`product.e2e.cy.js - TC_UPDATE_01`                                                            |

---

### Test Case 11: Cập nhật sản phẩm không tồn tại

| Thuộc tính            | Giá trị                                                                                            |
| --------------------- | -------------------------------------------------------------------------------------------------- |
| **Test Case ID**      | TC_PRODUCT_011                                                                                     |
| **Test Name**         | Xử lý khi cập nhật sản phẩm không tồn tại                                                          |
| **Priority**          | Medium                                                                                             |
| **Preconditions**     | - User đã đăng nhập<br>- Sản phẩm với ID = 999 không tồn tại<br>- Application đang chạy            |
| **Test Steps**        | 1. Navigate to /editproduct/999<br>2. Enter update data<br>3. Click Save button                    |
| **Test Data**         | Product ID: 999<br>Name: Updated Product<br>Price: 10000                                           |
| **Expected Result**   | - Error message: "Product not found"<br> - Không cập nhật<br> - Redirect về home hoặc hiển thị lỗi |
| **Actual Result**     | (Để trống)                                                                                         |
| **Status**            | Not Run                                                                                            |
| **Test Type**         | Negative Test                                                                                      |
| **Related Test Code** | `ProductServiceUnitTest.testUpdateProductNotFound()`                                               |

---

### Test Case 12: Cập nhật với dữ liệu không hợp lệ

| Thuộc tính            | Giá trị                                                                                        |
| --------------------- | ---------------------------------------------------------------------------------------------- |
| **Test Case ID**      | TC_PRODUCT_012                                                                                 |
| **Test Name**         | Validation lỗi khi cập nhật với price âm                                                       |
| **Priority**          | High                                                                                           |
| **Preconditions**     | - User đã đăng nhập<br>- Sản phẩm với ID = 1 tồn tại<br>- Application đang chạy                |
| **Test Steps**        | 1. Navigate to edit product page<br>2. Update price to -5000<br>3. Click Save button           |
| **Test Data**         | Product ID: 1<br>Price: -5000                                                                  |
| **Expected Result**   | - Error message: "Price must be greater than 0"<br> - Form không submit<br> - Vẫn ở trang edit |
| **Actual Result**     | (Để trống)                                                                                     |
| **Status**            | Not Run                                                                                        |
| **Test Type**         | Validation Test                                                                                |
| **Related Test Code** | `product.e2e.cy.js - TC_UPDATE_03`                                                             |

---

## DELETE OPERATIONS

### Test Case 13: Xóa sản phẩm thành công

| Thuộc tính            | Giá trị                                                                                                                                      |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Test Case ID**      | TC_PRODUCT_013                                                                                                                               |
| **Test Name**         | Xóa sản phẩm thành công                                                                                                                      |
| **Priority**          | Critical                                                                                                                                     |
| **Preconditions**     | - User đã đăng nhập<br>- Sản phẩm với ID = 1 tồn tại<br>- Application đang chạy                                                              |
| **Test Steps**        | 1. Navigate to product list<br>2. Click "Delete" button on product ID = 1<br>3. Confirm deletion                                             |
| **Test Data**         | Product ID: 1                                                                                                                                |
| **Expected Result**   | - Product deleted successfully<br> - Success message displayed<br> - Product removed from list<br> - Product count decreased                 |
| **Actual Result**     | (Để trống)                                                                                                                                   |
| **Status**            | Not Run                                                                                                                                      |
| **Test Type**         | Happy Path                                                                                                                                   |
| **Related Test Code** | `ProductServiceUnitTest.testDeleteProduct()`<br>`ProductControllerIntegrationTest.testDeleteProduct()`<br>`product.e2e.cy.js - TC_DELETE_01` |

---

### Test Case 14: Xóa sản phẩm không tồn tại

| Thuộc tính            | Giá trị                                                                                 |
| --------------------- | --------------------------------------------------------------------------------------- |
| **Test Case ID**      | TC_PRODUCT_014                                                                          |
| **Test Name**         | Xử lý khi xóa sản phẩm không tồn tại                                                    |
| **Priority**          | Medium                                                                                  |
| **Preconditions**     | - User đã đăng nhập<br>- Sản phẩm với ID = 999 không tồn tại<br>- Application đang chạy |
| **Test Steps**        | 1. Try to delete product with ID = 999<br>2. Verify error handling                      |
| **Test Data**         | Product ID: 999                                                                         |
| **Expected Result**   | - Error message: "Product not found"<br> - Không xóa<br> - Hoặc return false            |
| **Actual Result**     | (Để trống)                                                                              |
| **Status**            | Not Run                                                                                 |
| **Test Type**         | Negative Test                                                                           |
| **Related Test Code** | `ProductServiceUnitTest.testDeleteProductNotFound()`                                    |

---

## SEARCH/FILTER OPERATIONS

### Test Case 15: Tìm kiếm sản phẩm theo tên

| Thuộc tính            | Giá trị                                                                                                                     |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Test Case ID**      | TC_PRODUCT_015                                                                                                              |
| **Test Name**         | Tìm kiếm sản phẩm theo tên thành công                                                                                       |
| **Priority**          | High                                                                                                                        |
| **Preconditions**     | - User đã đăng nhập<br>- Có sản phẩm với tên chứa "Laptop"<br>- Application đang chạy                                       |
| **Test Steps**        | 1. Navigate to product list<br>2. Enter search keyword: "Laptop"<br>3. Select search type: "name"<br>4. Click Search button |
| **Test Data**         | Search Type: name<br>Search Value: Laptop                                                                                   |
| **Expected Result**   | - Hiển thị danh sách sản phẩm có tên chứa "Laptop"<br> - Kết quả được filter đúng<br> - Có button "Clear" để reset search   |
| **Actual Result**     | (Để trống)                                                                                                                  |
| **Status**            | Not Run                                                                                                                     |
| **Test Type**         | Happy Path                                                                                                                  |
| **Related Test Code** | `product.e2e.cy.js - TC_SEARCH_02`                                                                                          |

---

### Test Case 16: Tìm kiếm sản phẩm theo category

| Thuộc tính            | Giá trị                                                                                                                            |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Test Case ID**      | TC_PRODUCT_016                                                                                                                     |
| **Test Name**         | Tìm kiếm sản phẩm theo category thành công                                                                                         |
| **Priority**          | High                                                                                                                               |
| **Preconditions**     | - User đã đăng nhập<br>- Có sản phẩm với category "Electronics"<br>- Application đang chạy                                         |
| **Test Steps**        | 1. Navigate to product list<br>2. Enter search value: "Electronics"<br>3. Select search type: "category"<br>4. Click Search button |
| **Test Data**         | Search Type: category<br>Search Value: Electronics                                                                                 |
| **Expected Result**   | - Hiển thị danh sách sản phẩm có category = "Electronics"<br> - Tất cả kết quả đều có category "Electronics"                       |
| **Actual Result**     | (Để trống)                                                                                                                         |
| **Status**            | Not Run                                                                                                                            |
| **Test Type**         | Happy Path                                                                                                                         |
| **Related Test Code** | `product.e2e.cy.js - TC_SEARCH_03`                                                                                                 |

---

### Test Case 17: Tìm kiếm không có kết quả

| Thuộc tính            | Giá trị                                                                                                    |
| --------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Test Case ID**      | TC_PRODUCT_017                                                                                             |
| **Test Name**         | Tìm kiếm sản phẩm không tồn tại                                                                            |
| **Priority**          | Medium                                                                                                     |
| **Preconditions**     | - User đã đăng nhập<br>- Không có sản phẩm với tên "NONEXISTENT"<br>- Application đang chạy                |
| **Test Steps**        | 1. Navigate to product list<br>2. Enter search keyword: "NONEXISTENTPRODUCT_XYZ"<br>3. Click Search button |
| **Test Data**         | Search Value: NONEXISTENTPRODUCT_XYZ                                                                       |
| **Expected Result**   | - Hiển thị "No products found" hoặc empty list<br> - Table rỗng<br> - Không có lỗi                         |
| **Actual Result**     | (Để trống)                                                                                                 |
| **Status**            | Not Run                                                                                                    |
| **Test Type**         | Edge Case                                                                                                  |
| **Related Test Code** | `product.e2e.cy.js - TC_SEARCH_05`                                                                         |

---

## BOUNDARY TESTS

### Test Case 18: Boundary - Name đúng 3 ký tự (min)

| Thuộc tính            | Giá trị                                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Test Case ID**      | TC_PRODUCT_018                                                                                                           |
| **Test Name**         | Tạo sản phẩm với name đúng 3 ký tự (giới hạn tối thiểu)                                                                  |
| **Priority**          | Medium                                                                                                                   |
| **Preconditions**     | - User đã đăng nhập<br>- Application đang chạy                                                                           |
| **Test Steps**        | 1. Navigate to Add Product page<br>2. Enter name: "abc" (3 ký tự)<br>3. Enter other valid fields<br>4. Click Save button |
| **Test Data**         | Name: abc<br>Price: 15000000<br>Quantity: 10<br>Category: Electronics                                                    |
| **Expected Result**   | - Validation pass<br> - Product created successfully                                                                     |
| **Actual Result**     | (Để trống)                                                                                                               |
| **Status**            | Not Run                                                                                                                  |
| **Test Type**         | Boundary Test                                                                                                            |
| **Related Test Code** | `productValidation.unit.test.js - TC_PRODUCT_BE_08`                                                                      |

---

### Test Case 19: Boundary - Price đúng 1 (min)

| Thuộc tính            | Giá trị                                                                                                                            |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Test Case ID**      | TC_PRODUCT_019                                                                                                                     |
| **Test Name**         | Tạo sản phẩm với price = 1 (giới hạn tối thiểu)                                                                                    |
| **Priority**          | Medium                                                                                                                             |
| **Preconditions**     | - User đã đăng nhập<br>- Application đang chạy                                                                                     |
| **Test Steps**        | 1. Navigate to Add Product page<br>2. Enter valid name<br>3. Enter price: 1<br>4. Enter other valid fields<br>5. Click Save button |
| **Test Data**         | Name: Laptop<br>Price: 1<br>Quantity: 10<br>Category: Electronics                                                                  |
| **Expected Result**   | - Validation pass<br> - Product created successfully                                                                               |
| **Actual Result**     | (Để trống)                                                                                                                         |
| **Status**            | Not Run                                                                                                                            |
| **Test Type**         | Boundary Test                                                                                                                      |
| **Related Test Code** | `productValidation.unit.test.js - TC_PRODUCT_BE_12`                                                                                |

---

### Test Case 20: Boundary - Quantity = 0

| Thuộc tính            | Giá trị                                                                                                                               |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Test Case ID**      | TC_PRODUCT_020                                                                                                                        |
| **Test Name**         | Tạo sản phẩm với quantity = 0 (hợp lệ)                                                                                                |
| **Priority**          | Medium                                                                                                                                |
| **Preconditions**     | - User đã đăng nhập<br>- Application đang chạy                                                                                        |
| **Test Steps**        | 1. Navigate to Add Product page<br>2. Enter valid name and price<br>3. Enter quantity: 0<br>4. Enter category<br>5. Click Save button |
| **Test Data**         | Name: Laptop<br>Price: 15000000<br>Quantity: 0<br>Category: Electronics                                                               |
| **Expected Result**   | - Validation pass (quantity = 0 là hợp lệ)<br> - Product created successfully                                                         |
| **Actual Result**     | (Để trống)                                                                                                                            |
| **Status**            | Not Run                                                                                                                               |
| **Test Type**         | Boundary Test                                                                                                                         |
| **Related Test Code** | `productValidation.unit.test.js - TC_PRODUCT_BE_17`                                                                                   |

---

## Tổng kết

- **Tổng số test cases**: 20
- **Critical**: 5 test cases
- **High**: 7 test cases
- **Medium**: 8 test cases
- **Low**: 0 test cases

## Mapping đến Code

| Test Case ID       | Frontend Test                   | Backend Test                                        | E2E Test          |
| ------------------ | ------------------------------- | --------------------------------------------------- | ----------------- |
| TC_PRODUCT_001     | AddProduct.integration.test.js  | ProductServiceUnitTest.testCreateProduct()          | product.e2e.cy.js |
| TC_PRODUCT_002-006 | AddProduct.integration.test.js  | productValidation.unit.test.js                      | product.e2e.cy.js |
| TC_PRODUCT_007     | Home.integration.test.js        | ProductServiceUnitTest.testGetAllProducts()         | product.e2e.cy.js |
| TC_PRODUCT_008     | ViewProduct.integration.test.js | ProductServiceUnitTest.testGetProductById()         | product.e2e.cy.js |
| TC_PRODUCT_009     | -                               | ProductServiceUnitTest.testGetProductByIdNotFound() | -                 |
| TC_PRODUCT_010     | EditProduct.integration.test.js | ProductServiceUnitTest.testUpdateProduct()          | product.e2e.cy.js |
| TC_PRODUCT_011     | -                               | ProductServiceUnitTest.testUpdateProductNotFound()  | -                 |
| TC_PRODUCT_012     | EditProduct.integration.test.js | -                                                   | product.e2e.cy.js |
| TC_PRODUCT_013     | -                               | ProductServiceUnitTest.testDeleteProduct()          | product.e2e.cy.js |
| TC_PRODUCT_014     | -                               | ProductServiceUnitTest.testDeleteProductNotFound()  | -                 |
| TC_PRODUCT_015-017 | -                               | -                                                   | product.e2e.cy.js |
| TC_PRODUCT_018-020 | -                               | productValidation.unit.test.js                      | -                 |
