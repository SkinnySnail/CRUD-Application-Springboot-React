# Backend - CRUD Application (Spring Boot)

Backend API cho ứng dụng CRUD sử dụng Spring Boot 3.1.4, Java 17, MySQL/PostgreSQL.

---

## 📋 Mục lục

- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt](#cài-đặt)
- [Cấu hình Database](#cấu-hình-database)
- [Chạy ứng dụng](#chạy-ứng-dụng)
- [Chạy Tests](#chạy-tests)
- [Coverage Report](#coverage-report)
- [API Endpoints](#api-endpoints)
- [Cấu trúc Project](#cấu-trúc-project)

---

## 🔧 Yêu cầu hệ thống

- **Java**: JDK 17 hoặc cao hơn
- **Maven**: 3.6+ (hoặc sử dụng Maven Wrapper `mvnw`)
- **Database**: MySQL 8.0+ hoặc PostgreSQL 12+
- **IDE**: IntelliJ IDEA, Eclipse, hoặc VS Code (tùy chọn)

### Kiểm tra phiên bản

```bash
java -version    # Phải >= 17
mvn -version     # Phải >= 3.6
```

---

## 📦 Cài đặt

### 1. Clone repository (nếu chưa có)

```bash
git clone <repository-url>
cd CRUD-Application-Springboot-React/backend/crud-application
```

### 2. Cài đặt dependencies

```bash
mvn clean install
```

Hoặc sử dụng Maven Wrapper:

```bash
# Windows
.\mvnw.cmd clean install

# Linux/Mac
./mvnw clean install
```

---

## 🗄️ Cấu hình Database

### Option 1: MySQL (Mặc định)

1. **Tạo database:**

```sql
CREATE DATABASE crud;
```

2. **Cấu hình trong `src/main/resources/application.properties`:**

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/crud
spring.datasource.username=root
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

**Lưu ý**: Port mặc định của MySQL là **3306**, không phải 3360.

### Option 2: PostgreSQL

1. **Tạo database:**

```sql
CREATE DATABASE crud;
```

2. **Cấu hình trong `src/main/resources/application.properties`:**

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/crud
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

## 🚀 Chạy ứng dụng

### Cách 1: Sử dụng Maven

```bash
mvn spring-boot:run
```

### Cách 2: Sử dụng Maven Wrapper

```bash
# Windows
.\mvnw.cmd spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

### Cách 3: Chạy từ IDE

1. Mở project trong IntelliJ IDEA hoặc Eclipse
2. Tìm class `CrudApplication.java`
3. Click chuột phải → Run `CrudApplication`

### Cách 4: Chạy JAR file

```bash
# Build JAR
mvn clean package

# Chạy JAR
java -jar target/crud-application-0.0.1-SNAPSHOT.jar
```

### Kiểm tra ứng dụng đã chạy

Mở trình duyệt hoặc dùng curl:

```bash
# Kiểm tra health
curl http://localhost:8080/api/products

# Hoặc mở trong trình duyệt
http://localhost:8080/api/products
```

**Backend server sẽ chạy tại**: `http://localhost:8080`

---

## 🧪 Chạy Tests

### Chạy tất cả tests

```bash
mvn clean test
```

### Chạy test cụ thể

```bash
# Chạy test cho AuthService
mvn test -Dtest=AuthServiceTest

# Chạy test cho ProductService
mvn test -Dtest=ProductServiceUnitTest

# Chạy test cho Controller
mvn test -Dtest=AuthControllerIntegrationTest
```

### Chạy test với Maven Wrapper

```bash
# Windows
.\mvnw.cmd clean test

# Linux/Mac
./mvnw clean test
```

### Kết quả test

Sau khi chạy, kết quả sẽ hiển thị trong terminal:

```
[INFO] Tests run: 68, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

---

## 📊 Coverage Report

### Generate Coverage Report

```bash
mvn clean test jacoco:report
```

### Xem Coverage Report

1. **Mở file HTML:**

```
target/site/jacoco/index.html
```

2. **Click đúp vào file** hoặc mở bằng trình duyệt

3. **Xem coverage chi tiết:**
   - Click vào package `com.crud.crud.application.service`
   - Xem coverage cho `AuthService` và `ProductService`

### Coverage Requirements

- **Backend Services**: Coverage >= 85%
- **AuthService**: ✅ 100% coverage
- **ProductService**: ✅ 98% coverage

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint         | Mô tả            |
| ------ | ---------------- | ---------------- |
| POST   | `/auth/login`    | Đăng nhập        |
| POST   | `/auth/register` | Đăng ký (nếu có) |

**Ví dụ Login:**

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Test123"}'
```

### Products

| Method | Endpoint                        | Mô tả                  |
| ------ | ------------------------------- | ---------------------- |
| GET    | `/products`                     | Lấy danh sách sản phẩm |
| GET    | `/products/{id}`                | Lấy chi tiết sản phẩm  |
| POST   | `/products`                     | Tạo sản phẩm mới       |
| PUT    | `/products/{id}`                | Cập nhật sản phẩm      |
| DELETE | `/products/{id}`                | Xóa sản phẩm           |
| GET    | `/products/search?keyword=...`  | Tìm kiếm sản phẩm      |
| GET    | `/products/search?name=...`     | Tìm kiếm theo tên      |
| GET    | `/products/search?category=...` | Tìm kiếm theo danh mục |

**Ví dụ:**

```bash
# Lấy danh sách sản phẩm
curl http://localhost:8080/products

# Tạo sản phẩm mới
curl -X POST http://localhost:8080/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop","price":15000000,"quantity":10,"category":"Electronics"}'

# Tìm kiếm sản phẩm
curl http://localhost:8080/products/search?keyword=Laptop
```

---

## 📁 Cấu trúc Project

```
backend/crud-application/
├── src/
│   ├── main/
│   │   ├── java/com/crud/crud/application/
│   │   │   ├── controller/          # REST Controllers
│   │   │   │   ├── AuthController.java
│   │   │   │   └── ProductController.java
│   │   │   ├── service/             # Business Logic
│   │   │   │   ├── AuthService.java
│   │   │   │   └── ProductService.java
│   │   │   ├── repository/          # Data Access Layer
│   │   │   │   ├── UserRepository.java
│   │   │   │   └── ProductRepository.java
│   │   │   ├── entity/              # Database Entities
│   │   │   │   ├── User.java
│   │   │   │   └── Product.java
│   │   │   ├── dto/                 # Data Transfer Objects
│   │   │   │   ├── UserDto.java
│   │   │   │   └── ProductDto.java
│   │   │   ├── util/                # Utilities
│   │   │   │   ├── PasswordUtil.java
│   │   │   │   ├── JwtUtil.java
│   │   │   │   └── UserValidation.java
│   │   │   ├── filter/              # Filters
│   │   │   │   └── JwtRequestFilter.java
│   │   │   └── CrudApplication.java # Main class
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       ├── java/com/crud/crud/application/
│       │   ├── controller/          # Integration & Mock Tests
│       │   │   ├── AuthControllerIntegrationTest.java
│       │   │   ├── AuthControllerMockTest.java
│       │   │   └── ProductControllerIntegrationTest.java
│       │   ├── service/             # Unit Tests
│       │   │   ├── AuthServiceTest.java
│       │   │   ├── ProductServiceUnitTest.java
│       │   │   └── ProductServiceMockTest.java
│       │   └── util/                # Utility Tests
│       │       ├── PasswordUtilTest.java
│       │       ├── JwtUtilTest.java
│       │       └── UserValidationTest.java
│       └── resources/
│           └── application-test.properties
├── target/                          # Build output (tự động tạo)
│   ├── classes/                     # Compiled classes
│   ├── site/jacoco/                 # Coverage reports
│   └── surefire-reports/            # Test reports
├── pom.xml                          # Maven configuration
├── mvnw                             # Maven Wrapper (Linux/Mac)
├── mvnw.cmd                         # Maven Wrapper (Windows)
└── README.md                        # File này
```

---

## 🛠️ Troubleshooting

### Lỗi: "Port 8080 already in use"

**Giải pháp:**

1. Tìm process đang dùng port 8080:

```bash
# Windows
netstat -ano | findstr :8080

# Linux/Mac
lsof -i :8080
```

2. Kill process hoặc đổi port trong `application.properties`:

```properties
server.port=8081
```

### Lỗi: "Cannot connect to database"

**Kiểm tra:**

1. Database đã được tạo chưa?
2. Username/password đúng chưa?
3. Port database đúng chưa? (MySQL: 3306, PostgreSQL: 5432)
4. Database service đã chạy chưa?

**Giải pháp:**

```bash
# Kiểm tra MySQL đang chạy
# Windows
net start MySQL80

# Linux
sudo systemctl status mysql

# Mac
brew services list | grep mysql
```

### Lỗi: "ClassNotFoundException"

**Giải pháp:**

```bash
mvn clean install
```

### Lỗi: "Tests fail"

**Kiểm tra:**

1. Database test (H2) đã được cấu hình trong `application-test.properties`
2. Tất cả dependencies đã được download

**Giải pháp:**

```bash
mvn clean test
```

---

## 📝 Test Statistics

### Test Count

- **Total Tests**: 68 tests
- **Unit Tests**: 27 tests
  - AuthServiceTest: 11 tests
  - ProductServiceUnitTest: 20 tests
- **Integration Tests**: 11 tests
  - AuthControllerIntegrationTest: 6 tests
  - ProductControllerIntegrationTest: 5 tests
- **Mock Tests**: 12 tests
  - AuthControllerMockTest: 2 tests
  - ProductServiceMockTest: 10 tests
- **Utility Tests**: 14 tests
  - PasswordUtilTest: 2 tests
  - JwtUtilTest: 2 tests
  - UserValidationTest: 10 tests

### Coverage Results

- **AuthService**: 100% coverage ✅
- **ProductService**: 98% coverage ✅
- **Package Service**: 98% coverage ✅

---

## 🔐 Security Features

- ✅ Password hashing (BCrypt)
- ✅ JWT token authentication
- ✅ CORS configuration
- ✅ Input validation
- ✅ SQL injection prevention (JPA)

---

## 📚 Tài liệu tham khảo

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [JUnit 5](https://junit.org/junit5/)
- [Mockito](https://site.mockito.org/)
- [JaCoCo](https://www.jacoco.org/jacoco/)

---

## 📞 Hỗ trợ

Nếu gặp vấn đề:

1. Kiểm tra logs trong terminal
2. Xem file `target/surefire-reports/` để xem chi tiết lỗi test
3. Kiểm tra `application.properties` đã cấu hình đúng chưa

---

## ✅ Checklist Setup

- [ ] Java 17+ đã cài đặt
- [ ] Maven đã cài đặt hoặc sử dụng Maven Wrapper
- [ ] Database (MySQL/PostgreSQL) đã cài đặt và chạy
- [ ] Database `crud` đã được tạo
- [ ] File `application.properties` đã cấu hình đúng
- [ ] Dependencies đã được download (`mvn clean install`)
- [ ] Ứng dụng chạy thành công (`mvn spring-boot:run`)
- [ ] Tests chạy thành công (`mvn clean test`)
- [ ] Coverage report đã được generate (`mvn jacoco:report`)

---
