# BÁO CÁO CHI TIẾT - PHẦN CÔNG VIỆC CỦA TÀI (3123410318)

## 📋 TỔNG QUAN PHÂN CÔNG

**Nguyễn Tuấn Tài - MSSV: 3123410318**

**Công việc được giao:**

- ✅ **Backend Test**: Viết Unit Test Service
- ✅ **Backend Test**: Integration Test API
- ✅ **Cấu hình CI/CD Pipeline**
- ✅ **Mock Test** (Backend)

**Đóng góp: 20%**

---

## 1️⃣ UNIT TEST SERVICE (Backend) - GIẢI THÍCH TỪNG DÒNG

### 📁 File: `AuthServiceTest.java`

### 🔍 GIẢI THÍCH TỪNG DÒNG CODE

#### **PHẦN 1: Import và Khai báo Class**

```java
package com.crud.crud.application.service;
```

**Giải thích:** Đây là package (thư mục) chứa file test. Giống như địa chỉ để Java biết file này nằm ở đâu.

```java
import java.util.Optional;
```

**Giải thích:** Import class `Optional` từ Java. `Optional` là một "hộp" có thể chứa giá trị hoặc rỗng. Dùng khi method có thể trả về null.

```java
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
```

**Giải thích:**

- `import static` = import để dùng trực tiếp không cần gõ tên class
- `assertEquals` = so sánh 2 giá trị có bằng nhau không
- `assertNotNull` = kiểm tra giá trị KHÔNG phải null
- `assertNull` = kiểm tra giá trị LÀ null

**Giải thích bổ sung:**

- Đây là phần cấu hình trigger cho workflow CI/CD trên GitHub Actions.
- Workflow sẽ tự động chạy khi có sự kiện:
  - **Push** lên các branch `main` hoặc `develop`.
  - **Pull Request** được tạo hoặc cập nhật vào các branch `main` hoặc `develop`.
- Trigger này KHÔNG phải là bước CI hay CD, mà chỉ là điều kiện để workflow bắt đầu chạy.
- Sau khi trigger, các bước CI (build, test, coverage) sẽ được thực hiện tự động theo cấu hình jobs/steps bên dưới.
- Nếu muốn có CD (Continuous Deployment), cần bổ sung thêm các bước deploy vào workflow.

**Ví dụ thực tế:**

> Khi bạn push code lên branch `main`, workflow sẽ tự động chạy các bước kiểm tra (CI).
> Khi bạn tạo Pull Request vào branch `main`, workflow cũng sẽ tự động kiểm tra code.
> Nếu chỉ push lên branch khác (ví dụ: `feature/login`), workflow sẽ không chạy.

**Kết luận:**

> Phần này chỉ định rõ "Khi nào workflow được kích hoạt" chứ không phải là bước kiểm tra hay deploy.

**Ví dụ:**

```java
assertEquals(5, 5);  // ✅ PASS - 5 bằng 5
assertEquals(5, 6);  // ❌ FAIL - 5 không bằng 6
assertNotNull("hello");  // ✅ PASS - "hello" không null
assertNull(null);  // ✅ PASS - null là null
```

```java
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
```

**Giải thích:**

- `@Test` = đánh dấu method này là một test case (JUnit sẽ chạy method này)
- `@BeforeEach` = method này sẽ chạy TRƯỚC MỖI test case
- `@DisplayName` = tên hiển thị khi chạy test (dễ đọc hơn)

```java
import org.mockito.Mock;
import org.mockito.InjectMocks;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;
```

**Giải thích:**

- `@Mock` = tạo một object GIẢ (mock) thay vì object thật
- `@InjectMocks` = tự động đưa mock objects vào service cần test
- `when(...).thenReturn(...)` = KHI gọi method X, THÌ trả về giá trị Y
- `verify(...)` = kiểm tra xem method có được gọi không
- `times(1)` = được gọi đúng 1 lần

**Ví dụ Mock:**

```java
// Thay vì gọi database thật (chậm, cần setup)
// Ta tạo một "database giả" trả về dữ liệu giả
when(userRepository.findByUsername("testuser"))
    .thenReturn(Optional.of(user));  // Trả về user giả
```

```java
@DisplayName("AuthService Login Unit Tests")
class AuthServiceTest {
```

**Giải thích:**

- `@DisplayName` = tên hiển thị cho cả class test
- `class AuthServiceTest` = class test cho AuthService

---

#### **PHẦN 2: Khai báo Biến (Fields)**

```java
@Mock
private UserRepository userRepository;
```

**Giải thích từng từ:**

- `@Mock` = Đây là một object GIẢ, không phải thật
- `private` = chỉ dùng trong class này
- `UserRepository` = interface để truy cập database (thường gọi database)
- `userRepository` = tên biến

**Tại sao cần Mock?**

- Database thật: Chậm, cần setup, có thể thay đổi dữ liệu
- Mock: Nhanh, kiểm soát được, không ảnh hưởng database thật

```java
private PasswordUtil passwordUtil;
```

**Giải thích:** Biến để dùng PasswordUtil (class hash password). Không có `@Mock` nên đây là object THẬT.

```java
@InjectMocks
private AuthService authService;
```

**Giải thích:**

- `@InjectMocks` = Tự động tạo AuthService và đưa mock objects vào
- `authService` = Service cần test (đây là object THẬT, nhưng dùng mock repository)

**Cách hoạt động:**

```
AuthService cần UserRepository
    ↓
Mockito tự động đưa userRepository (mock) vào AuthService
    ↓
Khi test, AuthService dùng mock repository thay vì database thật
```

---

#### **PHẦN 3: Setup Method (Chạy trước mỗi test)**

```java
@BeforeEach
void setUp() {
```

**Giải thích:**

- `@BeforeEach` = Method này chạy TRƯỚC MỖI test case
- `setUp()` = tên method (có thể đặt tên khác)
- Mục đích: Chuẩn bị dữ liệu, khởi tạo objects

**Ví dụ flow:**

```
Test 1: testLoginSuccess()
    ↓
Chạy setUp() trước
    ↓
Chạy testLoginSuccess()
    ↓
Test 2: testLoginFailure()
    ↓
Chạy setUp() lại (reset)
    ↓
Chạy testLoginFailure()
```

```java
MockitoAnnotations.openMocks(this);
```

**Giải thích từng từ:**

- `MockitoAnnotations` = class của Mockito
- `openMocks(this)` = Khởi tạo tất cả `@Mock` và `@InjectMocks` trong class này
- `this` = class hiện tại (AuthServiceTest)

**Làm gì:**

1. Tạo mock object cho `userRepository`
2. Tạo AuthService và inject mock repository vào
3. Sẵn sàng để test

```java
passwordUtil = new PasswordUtil();
```

**Giải thích:** Tạo object PasswordUtil thật (không mock) để hash password trong test.

```java
try {
    java.lang.reflect.Field field = AuthService.class.getDeclaredField("passwordUtil");
    field.setAccessible(true);
    field.set(authService, passwordUtil);
} catch (Exception e) {
    throw new RuntimeException(e);
}
```

**Giải thích từng dòng:**

1. `try { ... } catch { ... }` = Bắt lỗi nếu có
2. `AuthService.class` = Lấy thông tin class AuthService
3. `getDeclaredField("passwordUtil")` = Tìm field tên "passwordUtil" trong AuthService
4. `field.setAccessible(true)` = Cho phép truy cập field private (mặc định không được)
5. `field.set(authService, passwordUtil)` = Đặt passwordUtil vào authService

**Tại sao cần?**

- AuthService có field `passwordUtil` là private
- Cần đưa object thật vào để test hash password đúng
- Reflection = cách "xâm nhập" vào private fields

---

#### **PHẦN 4: Test Case - Login Thành Công**

```java
@Test
@DisplayName("TC1: Login thành công với credentials hợp lệ")
void testLoginSuccess() {
```

**Giải thích:**

- `@Test` = Đây là một test case (JUnit sẽ chạy)
- `@DisplayName` = Tên hiển thị: "TC1: Login thành công..."
- `void` = Không trả về gì
- `testLoginSuccess()` = Tên method (quy ước: bắt đầu bằng "test")

**Pattern AAA (Arrange-Act-Assert):**

```java
// ========== ARRANGE: Chuẩn bị dữ liệu ==========
String username = "testuser";
String password = "Test123";
```

**Giải thích:** Tạo dữ liệu test - username và password giả.

```java
String hashed = passwordUtil.hashPassword(password);
```

**Giải thích:**

- `passwordUtil.hashPassword(password)` = Hash password "Test123" thành chuỗi mã hóa
- Ví dụ: "Test123" → "$2a$10$abc123xyz..." (bcrypt hash)
- Lưu vào biến `hashed`

**Tại sao cần hash?**

- Database lưu password đã hash, không lưu plain text
- Khi test, cần hash password để so sánh đúng

```java
User user = new User();
user.setUsername(username);
user.setPassword(hashed);
```

**Giải thích từng dòng:**

1. `new User()` = Tạo object User mới (rỗng)
2. `user.setUsername("testuser")` = Đặt username = "testuser"
3. `user.setPassword(hashed)` = Đặt password = chuỗi đã hash

**Kết quả:** Có một User object giả với username và password đã hash.

```java
when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
```

**Giải thích từng phần:**

1. `when(...)` = KHI nào
2. `userRepository.findByUsername(username)` = Gọi method findByUsername với "testuser"
3. `.thenReturn(...)` = THÌ trả về
4. `Optional.of(user)` = Trả về Optional chứa user

**Dịch sang tiếng Việt:**

> "Khi gọi `userRepository.findByUsername("testuser")`,
> thì trả về Optional chứa user object đã tạo ở trên"

**Tại sao cần?**

- Thay vì query database thật (chậm, cần setup)
- Ta "giả vờ" database trả về user này
- Test chạy nhanh, không cần database

```java
// ========== ACT: Thực thi method cần test ==========
User result = authService.login(new UserDto(username, password));
```

**Giải thích từng phần:**

1. `new UserDto(username, password)` = Tạo UserDto với "testuser" và "Test123"
2. `authService.login(...)` = Gọi method login của AuthService (ĐÂY LÀ METHOD CẦN TEST)
3. `User result` = Lưu kết quả trả về

**Điều gì xảy ra bên trong?**

```
authService.login() được gọi
    ↓
AuthService gọi userRepository.findByUsername("testuser")
    ↓
Mock trả về user (đã setup ở trên)
    ↓
AuthService kiểm tra password "Test123" với password đã hash
    ↓
Password đúng → Trả về user
```

```java
// ========== ASSERT: Kiểm tra kết quả ==========
assertNotNull(result);
```

**Giải thích:**

- `assertNotNull(result)` = Kiểm tra result KHÔNG phải null
- Nếu result = null → Test FAIL
- Nếu result ≠ null → Test PASS

**Ý nghĩa:** Login thành công thì phải trả về user, không được null.

```java
assertEquals(username, result.getUsername());
```

**Giải thích:**

- `assertEquals(a, b)` = So sánh a và b có bằng nhau không
- `username` = "testuser" (giá trị mong đợi)
- `result.getUsername()` = Username của user trả về (giá trị thực tế)

**Kết quả:**

- Nếu bằng nhau → PASS
- Nếu khác nhau → FAIL

```java
// ========== VERIFY: Xác nhận interactions ==========
verify(userRepository, times(1)).findByUsername(username);
```

**Giải thích từng phần:**

1. `verify(...)` = Xác nhận method đã được gọi
2. `userRepository` = Object cần verify
3. `times(1)` = Được gọi ĐÚNG 1 lần
4. `findByUsername(username)` = Method được gọi

**Dịch sang tiếng Việt:**

> "Xác nhận rằng userRepository.findByUsername() đã được gọi ĐÚNG 1 LẦN"

**Tại sao cần verify?**

- Đảm bảo service gọi repository đúng cách
- Tránh gọi nhiều lần không cần thiết (performance)
- Tránh quên gọi (logic lỗi)

**Ví dụ:**

```java
verify(userRepository, times(1)).findByUsername(username);  // ✅ Đúng 1 lần
verify(userRepository, times(2)).findByUsername(username);  // ❌ Sai - chỉ gọi 1 lần
verify(userRepository, never()).deleteById(1L);  // ✅ Xác nhận KHÔNG được gọi
```

---

#### **PHẦN 5: Test Case - Login Thất Bại (Username Không Tồn Tại)**

```java
@Test
@DisplayName("TC2: Login thất bại với username không tồn tại")
void testLoginWithNonExistentUsername() {
```

**Giải thích:** Test case kiểm tra khi username không tồn tại trong database.

```java
String username = "wronguser";
String password = "Test123";
```

**Giải thích:** Tạo username KHÔNG TỒN TẠI ("wronguser").

```java
when(userRepository.findByUsername(username)).thenReturn(Optional.empty());
```

**Giải thích:**

- `Optional.empty()` = Trả về Optional RỖNG (không có user)
- Nghĩa là: Database không tìm thấy user với username "wronguser"

**So sánh:**

```java
// Test thành công:
Optional.of(user)  // Có user

// Test thất bại:
Optional.empty()    // Không có user
```

```java
User result = authService.login(new UserDto(username, password));
```

**Giải thích:** Gọi login với username không tồn tại.

**Điều gì xảy ra:**

```
authService.login() được gọi
    ↓
AuthService gọi userRepository.findByUsername("wronguser")
    ↓
Mock trả về Optional.empty() (không có user)
    ↓
AuthService kiểm tra: Không có user → Trả về null
```

```java
assertNull(result);
```

**Giải thích:**

- `assertNull(result)` = Kiểm tra result LÀ null
- Nếu result = null → PASS (đúng như mong đợi)
- Nếu result ≠ null → FAIL (sai logic)

**Ý nghĩa:** Username không tồn tại thì phải trả về null.

```java
verify(userRepository, times(1)).findByUsername(username);
```

**Giải thích:** Xác nhận repository vẫn được gọi 1 lần (đúng).

---

#### **PHẦN 6: Test Case - Login Thất Bại (Password Sai)**

```java
@Test
@DisplayName("TC3: Login thất bại với password sai")
void testLoginWithWrongPassword() {
    String username = "testuser";
    String password = "WrongPass";  // Password SAI
```

**Giải thích:** Test với password SAI.

```java
String hashed = passwordUtil.hashPassword("CorrectPass123");
```

**Giải thích:**

- Hash password KHÁC ("CorrectPass123") thay vì password nhập vào ("WrongPass")
- Mục đích: Database lưu password "CorrectPass123", nhưng user nhập "WrongPass"

```java
User user = new User();
user.setUsername(username);
user.setPassword(hashed);  // Password trong DB = "CorrectPass123" (đã hash)
```

**Giải thích:** User trong database có password = "CorrectPass123" (đã hash).

```java
when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
```

**Giải thích:** Mock trả về user (có password = "CorrectPass123").

```java
User result = authService.login(new UserDto(username, password));
// password = "WrongPass" (user nhập)
// user.getPassword() = hash của "CorrectPass123" (trong DB)
```

**Giải thích:** Gọi login với password SAI.

**Điều gì xảy ra:**

```
authService.login() được gọi
    ↓
AuthService tìm thấy user (username đúng)
    ↓
AuthService so sánh password:
    - User nhập: "WrongPass"
    - DB lưu: hash của "CorrectPass123"
    ↓
Password không khớp → Trả về null
```

```java
assertNull(result);
```

**Giải thích:** Password sai thì phải trả về null.

---

### 📁 File: `ProductServiceUnitTest.java` - GIẢI THÍCH TƯƠNG TỰ

#### **Test Case: Tạo Sản Phẩm Thành Công**

```java
@Test
@DisplayName("TC_UNIT_1: Tao san pham moi thanh cong")
void testCreateProduct() {
```

**Giải thích:** Test tạo sản phẩm mới.

```java
// Arrange: Chuẩn bị dữ liệu
ProductDto productDto = new ProductDto(
    "Laptop", 15000000.0, 10, "Electronics");
```

**Giải thích từng tham số:**

- `"Laptop"` = Tên sản phẩm
- `15000000.0` = Giá (15 triệu)
- `10` = Số lượng
- `"Electronics"` = Category

```java
Product product = new Product(1L, "Laptop", 15000000.0, 10, "Electronics");
```

**Giải thích:** Tạo Product object giả (sẽ được lưu vào database giả).

```java
when(productRepository.save(any(Product.class))).thenReturn(product);
```

**Giải thích từng phần:**

1. `when(...)` = KHI nào
2. `productRepository.save(...)` = Gọi method save
3. `any(Product.class)` = Với BẤT KỲ Product nào (không quan tâm Product cụ thể)
4. `.thenReturn(product)` = THÌ trả về product đã tạo

**Dịch:**

> "Khi gọi save với bất kỳ Product nào, thì trả về product này"

**Tại sao dùng `any()`?**

- Không quan tâm Product cụ thể nào được save
- Chỉ cần biết save được gọi và trả về product

```java
// Act: Thực thi
ProductDto result = productService.createProduct(productDto);
```

**Giải thích:** Gọi method createProduct (ĐÂY LÀ METHOD CẦN TEST).

**Điều gì xảy ra:**

```
productService.createProduct() được gọi
    ↓
ProductService tạo Product từ ProductDto
    ↓
ProductService gọi productRepository.save(product)
    ↓
Mock trả về product (đã setup)
    ↓
ProductService convert Product → ProductDto và trả về
```

```java
// Assert: Kiểm tra kết quả
assertNotNull(result);
```

**Giải thích:** Kết quả không được null.

```java
assertEquals("Laptop", result.getName());
assertEquals(15000000.0, result.getPrice());
assertEquals(10, result.getQuantity());
assertEquals("Electronics", result.getCategory());
```

**Giải thích:** Kiểm tra từng field có đúng không.

```java
verify(productRepository, times(1)).save(any(Product.class));
```

**Giải thích:** Xác nhận save được gọi đúng 1 lần.

---

## 2️⃣ INTEGRATION TEST API (Backend) - GIẢI THÍCH TỪNG DÒNG

### 📁 File: `AuthControllerIntegrationTest.java`

### 🔍 GIẢI THÍCH TỪNG DÒNG CODE

#### **PHẦN 1: Import và Annotations**

```java
@WebMvcTest(AuthController.class)
@DisplayName("Login API Integration Tests")
class AuthControllerIntegrationTest {
```

**Giải thích từng annotation:**

1. `@WebMvcTest(AuthController.class)`:

   - Chỉ load Controller layer (không load Service, Repository, Database)
   - Nhanh hơn so với load toàn bộ ứng dụng
   - `AuthController.class` = Chỉ load AuthController

2. `@DisplayName` = Tên hiển thị khi chạy test

**So sánh:**

```java
@WebMvcTest  // Chỉ load Controller
@SpringBootTest  // Load toàn bộ ứng dụng (chậm hơn)
```

```java
@Autowired
private MockMvc mockMvc;
```

**Giải thích:**

- `@Autowired` = Spring tự động tạo và đưa vào (dependency injection)
- `MockMvc` = Tool để simulate (mô phỏng) HTTP requests
- Không cần chạy server thật, chỉ test Controller

**Ví dụ MockMvc:**

```java
// Thay vì:
// - Khởi động server
// - Gửi HTTP request thật
// - Chờ response

// Ta dùng MockMvc:
mockMvc.perform(post("/auth/login"))  // Mô phỏng POST request
```

```java
@Autowired
private ObjectMapper objectMapper;
```

**Giải thích:**Tool chuyển đổi Java objec

- `ObjectMapper` = t ↔ JSON
- Dùng để convert UserDto → JSON string (gửi trong HTTP request)

**Ví dụ:**

```java
UserDto dto = new UserDto("testuser", "Test123");
String json = objectMapper.writeValueAsString(dto);
// Kết quả: {"username":"testuser","password":"Test123"}
```

```java
@MockBean
private AuthService authService;

@MockBean
private JwtUtil jwtUtil;
```

**Giải thích:**

- `@MockBean` = Tạo mock bean trong Spring context
- Khác với `@Mock`: `@MockBean` được Spring quản lý
- `authService` và `jwtUtil` = Mock objects (không phải thật)

**Tại sao mock Service?**

- Chỉ test Controller layer
- Service logic đã test ở Unit Test
- Tập trung test HTTP request/response

---

#### **PHẦN 2: Test Case - Login Thành Công**

```java
@Test
@DisplayName("POST /auth/login - Thành công")
void testLoginSuccess() throws Exception {
```

**Giải thích:**

- `throws Exception` = Method có thể throw exception (MockMvc có thể throw)

```java
UserDto request = new UserDto("testuser", "Test123");
```

**Giải thích:** Tạo request body (dữ liệu gửi lên server).

```java
User user = new User();
user.setId(1L);
user.setUsername("testuser");
user.setPassword("Test123");
```

**Giải thích:** Tạo User object (sẽ được Service trả về).

```java
when(authService.login(any(UserDto.class))).thenReturn(user);
```

**Giải thích:**

- Khi Controller gọi `authService.login()` với bất kỳ UserDto nào
- Mock Service trả về user này

**Flow:**

```
HTTP Request → Controller → Service (mock) → Trả về user
```

```java
when(jwtUtil.generateToken("testuser")).thenReturn("mocked-jwt-token");
```

**Giải thích:** Mock JWT token generation.

```java
when(jwtUtil.getTokenValidityMilliseconds()).thenReturn(3600000L);
```

**Giải thích:** Mock token expiration time (3600000ms = 1 giờ).

```java
mockMvc.perform(post("/auth/login")
```

**Giải thích từng phần:**

1. `mockMvc.perform(...)` = Thực hiện HTTP request
2. `post("/auth/login")` = Gửi POST request đến endpoint "/auth/login"

**Tương đương với:**

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Test123"}'
```

```java
.contentType(MediaType.APPLICATION_JSON)
```

**Giải thích:**

- Set header `Content-Type: application/json`
- Báo cho server biết gửi dữ liệu dạng JSON

```java
.content(objectMapper.writeValueAsString(request))
```

**Giải thích:**

- `objectMapper.writeValueAsString(request)` = Convert UserDto → JSON string
- `.content(...)` = Đặt JSON string vào request body

**Kết quả:**

```json
{
  "username": "testuser",
  "password": "Test123"
}
```

```java
.andExpect(status().isOk())
```

**Giải thích:**

- `status().isOk()` = Kiểm tra HTTP status code = 200
- Nếu status ≠ 200 → Test FAIL

**Các status codes:**

- `200 OK` = Thành công
- `400 Bad Request` = Dữ liệu sai
- `401 Unauthorized` = Chưa đăng nhập
- `404 Not Found` = Không tìm thấy
- `500 Internal Server Error` = Lỗi server

```java
.andExpect(jsonPath("$.success").value(true))
```

**Giải thích từng phần:**

1. `jsonPath("$.success")` = Lấy giá trị field "success" từ JSON response
2. `$.success` = JSONPath syntax (giống XPath cho XML)
   - `$` = root object
   - `.success` = field "success"
3. `.value(true)` = Kiểm tra giá trị = true

**Ví dụ JSON response:**

```json
{
  "success": true,
  "token": "mocked-jwt-token"
}
```

**jsonPath hoạt động:**

```java
jsonPath("$.success")     → true
jsonPath("$.token")       → "mocked-jwt-token"
jsonPath("$.user.id")     → 1 (nếu có nested object)
```

```java
.andExpect(jsonPath("$.token").value("mocked-jwt-token"));
```

**Giải thích:** Kiểm tra token trong response = "mocked-jwt-token".

---

#### **PHẦN 3: Test Case - Login Thất Bại**

```java
@Test
@DisplayName("POST /auth/login - Sai thông tin đăng nhập")
void testLoginFailure() throws Exception {
    UserDto request = new UserDto("wronguser", "wrongpass");
```

**Giải thích:** Tạo request với username/password SAI.

```java
when(authService.login(any(UserDto.class))).thenReturn(null);
```

**Giải thích:** Mock Service trả về null (login thất bại).

```java
mockMvc.perform(post("/auth/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isUnauthorized())
```

**Giải thích:**

- `status().isUnauthorized()` = Kiểm tra status = 401
- Login thất bại phải trả về 401, không phải 200

```java
.andExpect(jsonPath("$.success").value(false))
```

**Giải thích:** Kiểm tra success = false.

```java
.andExpect(jsonPath("$.token").doesNotExist());
```

**Giải thích:**

- `doesNotExist()` = Kiểm tra field "token" KHÔNG tồn tại
- Login thất bại không được có token

---

#### **PHẦN 4: Test Case - CORS Headers**

```java
@Test
@DisplayName("POST /auth/login - CORS headers được set đúng")
void testCorsHeaders() throws Exception {
```

**Giải thích:** Test CORS (Cross-Origin Resource Sharing) headers.

**CORS là gì?**

- Cho phép frontend (localhost:3000) gọi API backend (localhost:8080)
- Browser chặn requests từ domain khác (security)
- CORS headers cho phép cross-origin requests

```java
mockMvc.perform(post("/auth/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request))
        .header("Origin", "http://localhost:3000"))
```

**Giải thích:**

- `.header("Origin", "http://localhost:3000")` = Thêm header Origin
- Origin = Domain gửi request (frontend)

```java
.andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:3000"));
```

**Giải thích:**

- `header().string(...)` = Kiểm tra HTTP header
- `Access-Control-Allow-Origin` = Header cho phép origin nào
- Phải = "http://localhost:3000" (frontend domain)

**Ví dụ response headers:**

```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:3000
Content-Type: application/json
```

---

## 3️⃣ MOCK TEST (Backend) - GIẢI THÍCH TỪNG DÒNG

### 📁 File: `AuthControllerMockTest.java`

### 🔍 GIẢI THÍCH TỪNG DÒNG CODE

```java
@Test
@DisplayName("Mock: Controller với mocked service success")
void testLoginWithMockedService() throws Exception {
```

**Giải thích:** Test Controller với Service đã mock.

```java
UserDto request = new UserDto("test", "Pass123");
User user = new User();
user.setId(1L);
user.setUsername("test");
```

**Giải thích:** Chuẩn bị dữ liệu test.

```java
when(authService.login(any(UserDto.class))).thenReturn(user);
when(jwtUtil.generateToken("test")).thenReturn("mocked-jwt-token");
when(jwtUtil.getTokenValidityMilliseconds()).thenReturn(3600000L);
```

**Giải thích:** Setup mock behavior (giống Integration Test).

```java
mockMvc.perform(post("/auth/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isOk());
```

**Giải thích:** Gửi HTTP request và kiểm tra status = 200.

```java
// c) Verify mock interactions
verify(authService, times(1)).login(any(UserDto.class));
```

**Giải thích từng phần:**

1. `verify(...)` = Xác nhận method đã được gọi
2. `authService` = Object cần verify
3. `times(1)` = Được gọi ĐÚNG 1 lần
4. `login(any(UserDto.class))` = Method login với bất kỳ UserDto nào

**Dịch:**

> "Xác nhận authService.login() đã được gọi ĐÚNG 1 LẦN"

**Tại sao cần?**

- Đảm bảo Controller gọi Service đúng cách
- Tránh gọi nhiều lần (performance issue)
- Tránh quên gọi (logic bug)

```java
verify(jwtUtil, times(1)).generateToken("test");
verify(jwtUtil, times(1)).getTokenValidityMilliseconds();
```

**Giải thích:** Xác nhận JWT methods được gọi đúng.

**So sánh Integration Test vs Mock Test:**

| Integration Test             | Mock Test                  |
| ---------------------------- | -------------------------- |
| Kiểm tra HTTP response       | Kiểm tra HTTP response     |
| Kiểm tra JSON structure      | Kiểm tra JSON structure    |
| ❌ Không verify interactions | ✅ **Verify interactions** |

---

## 4️⃣ CI/CD PIPELINE - GIẢI THÍCH TỪNG DÒNG

### 📁 File: `.github/workflows/ci.yml`

### 🔍 GIẢI THÍCH TỪNG DÒNG YAML

```yaml
name: CI Pipeline
```

**Giải thích:** Tên của workflow (hiển thị trên GitHub Actions).

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
```

**Giải thích từng phần:**

1. `on:` = Khi nào chạy workflow
2. `push:` = Khi push code
3. `branches: [main, develop]` = Chỉ chạy khi push lên branch main hoặc develop
4. `pull_request:` = Khi tạo Pull Request
5. `branches: [main, develop]` = Chỉ chạy khi PR vào main hoặc develop

**Ví dụ:**

```
Push code lên main → Chạy workflow ✅
Push code lên feature → Không chạy ❌
Tạo PR vào main → Chạy workflow ✅
```

```yaml
jobs:
  backend-test:
```

**Giải thích:**

- `jobs:` = Danh sách các jobs (công việc) cần chạy
- `backend-test:` = Tên job (có thể đặt tên khác)

```yaml
runs-on: ubuntu-latest
```

**Giải thích:**

- `runs-on:` = Chạy trên máy nào
- `ubuntu-latest` = Máy Ubuntu mới nhất (GitHub cung cấp)

**Các options:**

- `ubuntu-latest` = Ubuntu (Linux)
- `windows-latest` = Windows
- `macos-latest` = macOS

```yaml
defaults:
  run:
    working-directory: backend/crud-application
```

**Giải thích:**

- `defaults:` = Cấu hình mặc định
- `working-directory:` = Thư mục làm việc mặc định
- Tất cả lệnh `run:` sẽ chạy trong thư mục này

**Ví dụ:**

```yaml
run: mvn clean test
# Tương đương với:
# cd backend/crud-application
# mvn clean test
```

```yaml
steps:
  - uses: actions/checkout@v3
```

**Giải thích:**

- `steps:` = Danh sách các bước cần thực hiện
- `- uses: actions/checkout@v3` = Checkout code từ GitHub repository

  **Giải thích:**

  - "Checkout" trong GitHub Actions nghĩa là tải toàn bộ mã nguồn (source code) của repository từ GitHub về máy ảo (runner) để các bước tiếp theo (build, test, v.v.) có thể sử dụng.
  - Nếu không checkout, các lệnh phía sau sẽ không có mã nguồn để thực thi.
  - Tương đương với việc bạn clone/pull code về máy tính cá nhân trước khi chạy lệnh build/test.

  **Tóm lại:**

  > Checkout = Bước đầu tiên để lấy code về môi trường CI/CD tự động.

- `@v3` = Version 3 của action

**Làm gì:**

1. Download code từ GitHub
2. Đặt vào thư mục làm việc
3. Sẵn sàng để build/test

```yaml
- name: Set up JDK 17
  uses: actions/setup-java@v3
  with:
    java-version: "17"
    distribution: "temurin"
```

**Giải thích từng phần:**

1. `name:` = Tên bước (hiển thị trên GitHub)
2. `uses: actions/setup-java@v3` = Dùng action setup Java
3. `with:` = Tham số truyền vào
4. `java-version: "17"` = Cài Java 17
5. `distribution: "temurin"` = Dùng Temurin JDK (Eclipse Adoptium)

**Kết quả:** Máy có Java 17, sẵn sàng compile và chạy Java code.

```yaml
- name: Build and test backend
  run: mvn clean test
```

**Giải thích:**

- `run:` = Chạy lệnh shell
- `mvn clean test` = Maven command:
  - `clean` = Xóa thư mục target (dọn dẹp)
  - `test` = Chạy tất cả tests

**Làm gì:**

1. Compile Java code
2. Chạy tất cả Unit Tests
3. Chạy tất cả Integration Tests
4. Generate test report

**Nếu test FAIL:**

- Workflow dừng lại
- Báo lỗi trên GitHub
- Không chạy các bước tiếp theo

```yaml
- name: Generate backend coverage
  run: mvn jacoco:report
```

**Giải thích:**

- `mvn jacoco:report` = Generate code coverage report với JaCoCo
- Coverage report = Báo cáo % code được test

**Kết quả:**

- File: `target/site/jacoco/index.html`
- Hiển thị: % lines covered, % branches covered, etc.

```yaml
- name: Upload backend coverage to Codecov
  uses: codecov/codecov-action@v3
  with:
    files: backend/crud-application/target/site/jacoco/jacoco.xml
```

**Giải thích từng phần:**

1. `uses: codecov/codecov-action@v3` = Dùng action upload coverage
2. `files:` = File coverage cần upload
3. `jacoco.xml` = File XML chứa coverage data

**Làm gì:**

1. Đọc file jacoco.xml
2. Upload lên Codecov (service theo dõi coverage)
3. Hiển thị coverage trên GitHub

**Lợi ích:**

- Theo dõi coverage theo thời gian
- Xem coverage của từng file
- So sánh coverage giữa các commits

---

## 📊 TỔNG KẾT - TÓM TẮT DỄ HIỂU

### **1. Unit Test là gì?**

- Test từng method riêng lẻ
- Mock tất cả dependencies
- Nhanh, không cần database
- **Ví dụ:** Test `authService.login()` với mock repository

### **2. Integration Test là gì?**

- Test HTTP request → response
- Test Controller layer
- Mock Service, nhưng test HTTP flow
- **Ví dụ:** Test `POST /auth/login` endpoint

### **3. Mock Test là gì?**

- Giống Integration Test
- **Thêm:** Verify interactions (số lần gọi)
- **Ví dụ:** Verify `authService.login()` được gọi 1 lần

### **4. CI/CD Pipeline là gì?**

- Tự động chạy tests khi push code
- 3 jobs: Backend test, Frontend test, E2E test
- Nếu test FAIL → Báo lỗi, chặn merge

---

## 🎯 CÁCH TRẢ LỜI KHI THẦY HỎI (ĐƠN GIẢN HÓA)

### **Câu hỏi: "Em đã làm gì?"**

**Trả lời:**

> "Em viết 3 loại test:
>
> 1. **Unit Test:** Test từng method trong Service (29 tests)
> 2. **Integration Test:** Test API endpoints (11 tests)
> 3. **Mock Test:** Verify service được gọi đúng (11 tests)
>
> Tổng 51 tests, coverage 98-100%."

### **Câu hỏi: "Unit Test và Integration Test khác gì?"**

**Trả lời:**

> "**Unit Test:**
>
> - Test method `authService.login()` riêng lẻ
> - Mock repository (không cần database)
> - Kiểm tra: Kết quả có đúng không?
>
> **Integration Test:**
>
> - Test HTTP request `POST /auth/login`
> - Mock service, nhưng test HTTP flow
> - Kiểm tra: Status code, JSON response có đúng không?"

### **Câu hỏi: "Mock là gì?"**

**Trả lời:**

> "Mock = Object giả thay vì object thật.
>
> **Ví dụ:**
>
> - Database thật: Chậm, cần setup
> - Mock database: Nhanh, trả về dữ liệu giả
>
> **Cách dùng:**
>
> ````java
> when(userRepository.findByUsername("testuser"))
>     .thenReturn(Optional.of(user));  // Trả về user giả
> ```"
> ````

### **Câu hỏi: "CI/CD Pipeline làm gì?"**

**Trả lời:**

> "Pipeline tự động chạy khi push code:
>
> 1. Checkout code từ GitHub
> 2. Setup Java 17
> 3. Chạy `mvn clean test` (tất cả tests)
> 4. Generate coverage report
> 5. Upload coverage lên Codecov
>
> Nếu test FAIL → Báo lỗi, không cho merge code."

---

**Chúc em báo cáo thành công! 🎉**
