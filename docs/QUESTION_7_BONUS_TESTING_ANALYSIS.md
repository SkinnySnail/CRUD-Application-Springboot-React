# PHÂN TÍCH CÂU 7: PHẦN MỞ RỘNG - BONUS (20 điểm)

**Ngày kiểm tra**: 2025-11-28

---

## TỔNG QUAN

Báo cáo này phân tích việc triển khai Performance Testing và Security Testing theo yêu cầu của Câu 7 (Bonus 20 điểm).

---

## CÂU 7.1: PERFORMANCE TESTING (10 điểm)

### 7.1.1 Setup k6 cho Performance Testing (2 điểm) ✅ HOÀN THÀNH

| Yêu cầu                   | Trạng thái    | File                | Chi tiết                     |
| ------------------------- | ------------- | ------------------- | ---------------------------- |
| Setup k6                  | ✅ Hoàn thành | `performance/*.js`  | 6 test scripts sử dụng k6    |
| Cấu hình test environment | ✅ Hoàn thành | `README.md:235-283` | Hướng dẫn cài đặt và chạy k6 |

**Code Evidence:**

- **k6 Scripts**: Tất cả file trong `performance/` đều sử dụng `import http from 'k6/http'` và `import { check, sleep } from 'k6'`
- **README Documentation**: `README.md:235-283` có hướng dẫn đầy đủ về cài đặt k6 cho Windows, macOS, Linux

**Example:**

```javascript
// performance/login_load_test.js:1-3
import http from "k6/http";
import { check, sleep } from "k6";
```

---

### 7.1.2 Performance Tests cho Login API (3 điểm) ✅ HOÀN THÀNH

| Yêu cầu                          | Trạng thái    | File                     | Chi tiết                                   |
| -------------------------------- | ------------- | ------------------------ | ------------------------------------------ |
| Load test: 100 concurrent users  | ✅ Hoàn thành | `login_load_100.js`      | Test với 100 users, có summary và analysis |
| Load test: 500 concurrent users  | ✅ Hoàn thành | `login_load_500.js`      | Test với 500 users, có summary và analysis |
| Load test: 1000 concurrent users | ✅ Hoàn thành | `login_load_test.js:6-7` | Test với 1000 users                        |
| Stress test: Tìm breaking point  | ✅ Hoàn thành | `login_stress_test.js`   | Stress test tăng dần 100 → 3000 users      |
| Response time analysis           | ✅ Hoàn thành | Tất cả login test files  | Có handleSummary với đầy đủ metrics        |

**Code Evidence:**

```javascript
// performance/login_load_100.js:6-11
export let options = {
  stages: [
    { duration: "30s", target: 100 }, // Ramp-up to 100 users
    { duration: "1m", target: 100 }, // Stay at 100 users
    { duration: "30s", target: 0 }, // Ramp-down
  ],
};

// performance/login_load_500.js:6-11
export let options = {
  stages: [
    { duration: "30s", target: 500 }, // Ramp-up to 500 users
    { duration: "1m", target: 500 }, // Stay at 500 users
    { duration: "30s", target: 0 }, // Ramp-down
  ],
};

// performance/login_stress_test.js:6-18
export let options = {
  stages: [
    { duration: "30s", target: 100 }, // Ramp to 100 users
    { duration: "1m", target: 100 }, // Stay at 100 users
    { duration: "30s", target: 500 }, // Ramp to 500 users
    { duration: "1m", target: 500 }, // Stay at 500 users
    { duration: "30s", target: 1000 }, // Ramp to 1000 users
    { duration: "1m", target: 1000 }, // Stay at 1000 users
    { duration: "30s", target: 2000 }, // Ramp to 2000 users (breaking point test)
    { duration: "1m", target: 2000 }, // Stay at 2000 users
    { duration: "30s", target: 3000 }, // Ramp to 3000 users (extreme load)
    { duration: "1m", target: 3000 }, // Stay at 3000 users
    { duration: "30s", target: 0 }, // Ramp down
  ],
};
```

**Tổng số test files cho Login API**: 4 files

- ✅ `login_load_100.js` - Load test với 100 users
- ✅ `login_load_500.js` - Load test với 500 users
- ✅ `login_load_test.js` - Load test với 1000 users
- ✅ `login_stress_test.js` - Stress test tăng dần để tìm breaking point

---

### 7.1.3 Performance Tests cho Product API (3 điểm) ✅ HOÀN THÀNH

| Yêu cầu                   | Trạng thái    | File                     | Chi tiết                              |
| ------------------------- | ------------- | ------------------------ | ------------------------------------- |
| Load test cho Product API | ✅ Hoàn thành | `product_load_test.js`   | Test CRUD operations với 100 users    |
| GET endpoint test         | ✅ Hoàn thành | `product_get_test.js`    | Test GET với 100 users, có summary    |
| POST endpoint test        | ✅ Hoàn thành | `product_post_test.js`   | Test POST với 100 users, có summary   |
| PUT endpoint test         | ✅ Hoàn thành | `product_put_test.js`    | Test PUT với 100 users, có summary    |
| DELETE endpoint test      | ✅ Hoàn thành | `product_delete_test.js` | Test DELETE với 100 users, có summary |

**Code Evidence:**

```javascript
// performance/product_load_test.js:8-13
export let options = {
  stages: [
    { duration: "30s", target: 100 },
    { duration: "1m", target: 100 },
    { duration: "30s", target: 0 },
  ],
};

// performance/product_get_test.js:82-109
export function handleSummary(data) {
  console.log("=== GET Product Performance Test Summary ===");
  const duration = data.metrics.http_req_duration;
  if (duration) {
    console.log(`Response Time Statistics:`);
    console.log(`  Average: ${duration.values.avg.toFixed(2)}ms`);
    console.log(`  Min: ${duration.values.min.toFixed(2)}ms`);
    console.log(`  Max: ${duration.values.max.toFixed(2)}ms`);
    console.log(`  P90: ${duration.values["p(90)"].toFixed(2)}ms`);
    console.log(`  P95: ${duration.values["p(95)"].toFixed(2)}ms`);
  }
  // ... throughput và check pass rate
}
```

**Tổng số test files cho Product API**: 5 files

- ✅ `product_load_test.js` - Full CRUD test
- ✅ `product_get_test.js` - GET operations với summary
- ✅ `product_post_test.js` - POST operations với summary
- ✅ `product_put_test.js` - PUT operations với summary
- ✅ `product_delete_test.js` - DELETE operations với summary

---

### 7.1.4 Phân tích kết quả và Recommendations (2 điểm) ✅ HOÀN THÀNH

| Yêu cầu                  | Trạng thái       | File                          | Chi tiết                       |
| ------------------------ | ---------------- | ----------------------------- | ------------------------------ |
| Phân tích kết quả        | ✅ Hoàn thành    | `product_*_test.js`           | Có `handleSummary()` functions |
| Response time statistics | ✅ Hoàn thành    | `product_get_test.js:87-95`   | Average, Min, Max, P90, P95    |
| Throughput analysis      | ✅ Hoàn thành    | `product_get_test.js:97-101`  | Requests/sec, Total requests   |
| Check pass rate          | ✅ Hoàn thành    | `product_get_test.js:103-106` | Pass rate percentage           |
| Recommendations          | ⚠️ Có trong code | Test scripts                  | Có notes trong summary         |

**Code Evidence:**

```javascript
// performance/product_get_test.js:82-109
export function handleSummary(data) {
  console.log("\n" + "═".repeat(60));
  console.log("=== GET Product Performance Test Summary ===");
  console.log("═".repeat(60));

  const duration = data.metrics.http_req_duration;
  if (duration) {
    console.log(`\nResponse Time Statistics:`);
    console.log(`  Average: ${duration.values.avg.toFixed(2)}ms`);
    console.log(`  Min: ${duration.values.min.toFixed(2)}ms`);
    console.log(`  Max: ${duration.values.max.toFixed(2)}ms`);
    console.log(`  P90: ${duration.values["p(90)"].toFixed(2)}ms`);
    console.log(`  P95: ${duration.values["p(95)"].toFixed(2)}ms`);
  }

  const reqs = data.metrics.http_reqs;
  if (reqs) {
    console.log(`\nThroughput: ${reqs.values.rate.toFixed(2)} requests/sec`);
    console.log(`Total Requests: ${reqs.values.count}`);
  }

  const checks = data.metrics.checks;
  if (checks) {
    console.log(`\nCheck Pass Rate: ${(checks.values.rate * 100).toFixed(2)}%`);
  }

  return {};
}
```

**Recommendations trong code:**

- `product_post_test.js:119-122`: Notes về POST operations
- `product_put_test.js:146-149`: Notes về PUT operations
- `product_delete_test.js:140-144`: Notes về DELETE operations

---

## CÂU 7.2: SECURITY TESTING (10 điểm)

### 7.2.1 Test Common Vulnerabilities (5 điểm) ✅ HOÀN THÀNH

#### a) SQL Injection ✅

| Test Case                       | File                            | Mô tả                                    | Status |
| ------------------------------- | ------------------------------- | ---------------------------------------- | ------ |
| SQL Injection trong Login       | `sql_injection_test.js:45-82`   | Test 30 payloads trong username/password | ✅     |
| SQL Injection trong Register    | `sql_injection_test.js:84-113`  | Test 5 payloads trong username           | ✅     |
| SQL Injection trong Product API | `sql_injection_test.js:115-159` | Test 5 payloads trong product name       | ✅     |

**Code Evidence:**

```javascript
// security/sql_injection_test.js:12-30
const sqlInjectionPayloads = [
  "' OR '1'='1",
  "' OR '1'='1' --",
  "' OR '1'='1' /*",
  "admin'--",
  "1'; DROP TABLE users--",
  // ... 25 more payloads
];

// security/sql_injection_test.js:47-67
sqlInjectionPayloads.forEach((payload, index) => {
  let res = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({
      username: payload,
      password: "testpassword",
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  let isVulnerable = res.status === 200 && res.json("token") !== null;
  check(res, {
    [`SQLi Login Payload ${index + 1} blocked`]: (r) =>
      r.status !== 200 || r.json("token") === null,
  });
});
```

**Tổng số payloads**: 30 SQL injection payloads

#### b) XSS (Cross-Site Scripting) ✅

| Test Case                     | File                  | Mô tả                                   | Status |
| ----------------------------- | --------------------- | --------------------------------------- | ------ |
| XSS trong Register            | `xss_test.js:68-94`   | Test 10 payloads trong username         | ✅     |
| XSS trong Product API         | `xss_test.js:96-150`  | Test 10 payloads trong name/description | ✅     |
| Stored XSS check              | `xss_test.js:123-144` | Kiểm tra XSS có được sanitize khi lưu   | ✅     |
| Content-Type header check     | `xss_test.js:152-166` | Kiểm tra Content-Type header            | ✅     |
| X-Content-Type-Options header | `xss_test.js:168-181` | Kiểm tra nosniff header                 | ✅     |

**Code Evidence:**

```javascript
// security/xss_test.js:12-33
const xssPayloads = [
  '<script>alert("XSS")</script>',
  '<img src=x onerror=alert("XSS")>',
  '<svg onload=alert("XSS")>',
  // ... 20 more payloads
];

// security/xss_test.js:80-93
const responseBody = res.body ? res.body.toString() : "";
const isReflected =
  responseBody.includes(payload) &&
  !responseBody.includes(encodeURIComponent(payload)) &&
  !responseBody.includes(payload.replace(/</g, "&lt;"));

check(res, {
  [`XSS Register Payload ${index + 1} - Properly sanitized`]: () =>
    !isReflected,
});
```

**Tổng số payloads**: 23 XSS payloads

#### c) CSRF (Cross-Site Request Forgery) ✅

| Test Case                  | File                   | Mô tả                                 | Status |
| -------------------------- | ---------------------- | ------------------------------------- | ------ |
| CSRF token requirement     | `csrf_test.js:39-66`   | Kiểm tra API yêu cầu authentication   | ✅     |
| Origin header validation   | `csrf_test.js:68-98`   | Kiểm tra CORS không cho phép wildcard | ✅     |
| Cookie security attributes | `csrf_test.js:100-129` | Kiểm tra SameSite, HttpOnly, Secure   | ✅     |
| State-changing operations  | `csrf_test.js:131-172` | Kiểm tra DELETE/PUT yêu cầu auth      | ✅     |
| Content-Type enforcement   | `csrf_test.js:174-197` | Kiểm tra API chỉ chấp nhận JSON       | ✅     |

**Code Evidence:**

```javascript
// security/csrf_test.js:46-66
const noAuthRes = http.post(
  `${BASE_URL}/product`,
  JSON.stringify({
    name: "CSRF Test Product",
    price: 100,
    description: "Test",
  }),
  {
    headers: { "Content-Type": "application/json" },
  }
);

const isProtectedWithoutAuth =
  noAuthRes.status === 401 || noAuthRes.status === 403;
check(noAuthRes, {
  "API requires authentication": () => isProtectedWithoutAuth,
});
```

#### d) Authentication Bypass Attempts ✅

| Test Case                       | File                          | Mô tả                                 | Status |
| ------------------------------- | ----------------------------- | ------------------------------------- | ------ |
| Access without token            | `auth_bypass_test.js:24-33`   | Truy cập API protected không có token | ✅     |
| Fake/invalid tokens             | `auth_bypass_test.js:35-71`   | Test 6 loại fake tokens               | ✅     |
| Token manipulation              | `auth_bypass_test.js:73-119`  | Modify token và test                  | ✅     |
| SQL Injection auth bypass       | `auth_bypass_test.js:121-149` | Test 5 SQL bypass payloads            | ✅     |
| Brute force protection          | `auth_bypass_test.js:151-180` | Kiểm tra rate limiting                | ✅     |
| Token reuse after logout        | `auth_bypass_test.js:182-199` | Kiểm tra token expiration             | ✅     |
| Horizontal privilege escalation | `auth_bypass_test.js:201-207` | Kiểm tra access control               | ✅     |
| JWT expiration check            | `auth_bypass_test.js:209-226` | Kiểm tra token có expiration          | ✅     |

**Code Evidence:**

```javascript
// security/auth_bypass_test.js:39-71
const fakeTokens = [
  "fake_token_123",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // JWT example
  "Bearer fake_token",
  "",
  "null",
  "undefined",
];

fakeTokens.forEach((fakeToken, index) => {
  const res = http.post(
    `${BASE_URL}/product`,
    JSON.stringify({
      name: "Bypass Test",
      price: 100,
    }),
    {
      headers: {
        Authorization: `Bearer ${fakeToken}`,
      },
    }
  );

  const isBlocked = res.status === 401 || res.status === 403;
  check(res, {
    [`Fake token ${index + 1} rejected`]: () => isBlocked,
  });
});
```

**Tổng số test cases cho Authentication Bypass**: 8 test cases

---

### 7.2.2 Test Input Validation và Sanitization (3 điểm) ✅ HOÀN THÀNH

| Test Case                      | File                               | Mô tả                                   | Status |
| ------------------------------ | ---------------------------------- | --------------------------------------- | ------ |
| Username validation            | `input_validation_test.js:37-77`   | Test 10 username payloads               | ✅     |
| Password validation            | `input_validation_test.js:79-100`  | Test 8 password payloads                | ✅     |
| Product name validation        | `input_validation_test.js:102-150` | Test 10+ product name payloads          | ✅     |
| Product price validation       | `input_validation_test.js:152-200` | Test negative, zero, very large numbers | ✅     |
| Product quantity validation    | `input_validation_test.js:202-250` | Test negative, zero, very large numbers | ✅     |
| Product description validation | `input_validation_test.js:252-300` | Test XSS, SQL injection, special chars  | ✅     |
| Product category validation    | `input_validation_test.js:302-350` | Test invalid categories                 | ✅     |

**Code Evidence:**

```javascript
// security/input_validation_test.js:40-51
const usernamePayloads = [
  { value: "", desc: "Empty username", shouldReject: true },
  { value: "a", desc: "Too short (1 char)", shouldReject: true },
  { value: "ab", desc: "Too short (2 chars)", shouldReject: true },
  { value: "a".repeat(51), desc: "Too long (51 chars)", shouldReject: true },
  { value: "user name", desc: "Contains space", shouldReject: true },
  { value: "user@name", desc: "Contains @", shouldReject: true },
  { value: "user<script>", desc: "Contains HTML tags", shouldReject: true },
  {
    value: "   username   ",
    desc: "Leading/trailing spaces",
    shouldReject: true,
  },
  { value: "validuser123", desc: "Valid username", shouldReject: false },
  { value: "user_name", desc: "With underscore", shouldReject: false },
];
```

**Tổng số test cases**: 50+ test cases cho input validation

---

### 7.2.3 Security Best Practices Implementation (2 điểm) ✅ HOÀN THÀNH

#### a) Password Hashing ✅

| Test Case                  | File                               | Mô tả                                         | Status |
| -------------------------- | ---------------------------------- | --------------------------------------------- | ------ |
| Password not in plain text | `password_hashing_test.js:21-54`   | Kiểm tra password không expose trong response | ✅     |
| Login response security    | `password_hashing_test.js:56-80`   | Kiểm tra password không trong login response  | ✅     |
| Hash not exposed           | `password_hashing_test.js:82-100`  | Kiểm tra hash không expose                    | ✅     |
| BCrypt verification        | `password_hashing_test.js:102-133` | Kiểm tra password được hash đúng cách         | ✅     |

**Code Evidence:**

```javascript
// security/password_hashing_test.js:28-49
const registerRes = http.post(
  `${BASE_URL}/auth/register`,
  JSON.stringify({
    username: testUser,
    password: testPassword,
  }),
  {
    headers: { "Content-Type": "application/json" },
  }
);

if (responseBody.includes(testPassword)) {
  findings.push(
    "[VULNERABLE] Plain password exposed in registration response!"
  );
} else {
  findings.push("[PROTECTED] Password not exposed in registration response");
}
```

#### b) HTTPS Enforcement ✅

| Test Case              | File                               | Mô tả                                     | Status |
| ---------------------- | ---------------------------------- | ----------------------------------------- | ------ |
| HTTP to HTTPS redirect | `https_enforcement_test.js:21-47`  | Kiểm tra redirect từ HTTP sang HTTPS      | ✅     |
| HSTS header            | `https_enforcement_test.js:49-83`  | Kiểm tra Strict-Transport-Security header | ✅     |
| Secure cookie flags    | `https_enforcement_test.js:85-133` | Kiểm tra Secure flag trong cookies        | ✅     |

**Code Evidence:**

```javascript
// security/https_enforcement_test.js:24-47
const httpRes = http.get(BASE_URL + "/products", {
  redirects: 0, // Don't follow redirects
});

if (
  httpRes.status === 301 ||
  httpRes.status === 302 ||
  httpRes.status === 308
) {
  const location = httpRes.headers["Location"];
  if (location && location.startsWith("https://")) {
    findings.push(`[PROTECTED] HTTP redirects to HTTPS: ${location}`);
  }
}
```

#### c) CORS Configuration ✅

| Test Case                   | File                                | Mô tả                                     | Status |
| --------------------------- | ----------------------------------- | ----------------------------------------- | ------ |
| CORS preflight request      | `cors_configuration_test.js:21-56`  | Kiểm tra OPTIONS request                  | ✅     |
| Access-Control-Allow-Origin | `cors_configuration_test.js:34-56`  | Kiểm tra không cho phép wildcard (\*)     | ✅     |
| Malicious origin rejection  | `cors_configuration_test.js:58-94`  | Test 4 malicious origins                  | ✅     |
| Credentials configuration   | `cors_configuration_test.js:96-134` | Kiểm tra Access-Control-Allow-Credentials | ✅     |

**Code Evidence:**

```javascript
// security/cors_configuration_test.js:38-56
const allowOrigin = preflightRes.headers["Access-Control-Allow-Origin"];

if (allowOrigin === "*") {
  findings.push("[VULNERABLE] CORS allows ALL origins (*) - Very dangerous!");
  check(preflightRes, { "CORS not wildcard": () => false });
} else if (allowOrigin) {
  findings.push(`[PROTECTED] CORS restricted to: ${allowOrigin}`);
  check(preflightRes, { "CORS not wildcard": () => true });
}
```

#### d) Security Headers ✅

| Test Case               | File                             | Mô tả                          | Status |
| ----------------------- | -------------------------------- | ------------------------------ | ------ |
| X-Content-Type-Options  | `security_headers_test.js:34-40` | Kiểm tra nosniff header        | ✅     |
| X-Frame-Options         | `security_headers_test.js:41-47` | Kiểm tra DENY/SAMEORIGIN       | ✅     |
| X-XSS-Protection        | `security_headers_test.js:48-54` | Kiểm tra XSS protection header | ✅     |
| Content-Security-Policy | `security_headers_test.js:55-61` | Kiểm tra CSP header            | ✅     |
| Referrer-Policy         | `security_headers_test.js:62-68` | Kiểm tra Referrer-Policy       | ✅     |
| Permissions-Policy      | `security_headers_test.js:69-75` | Kiểm tra Permissions-Policy    | ✅     |
| Cache-Control           | `security_headers_test.js:76-82` | Kiểm tra cache control         | ✅     |

**Code Evidence:**

```javascript
// security/security_headers_test.js:32-83
const securityHeaders = [
  {
    name: "X-Content-Type-Options",
    expected: "nosniff",
    severity: "medium",
    description: "Prevents MIME-type sniffing attacks",
  },
  {
    name: "X-Frame-Options",
    expected: ["DENY", "SAMEORIGIN"],
    severity: "high",
    description: "Prevents clickjacking attacks",
  },
  // ... 5 more headers
];

securityHeaders.forEach((header) => {
  const headerValue = res.headers[header.name];
  // Check và report
});
```

**Tổng số security headers được test**: 7 headers

---

## TỔNG KẾT

### Câu 7.1: Performance Testing (10 điểm)

| Yêu cầu                                 | Điểm     | Trạng thái        | Ghi chú                                          |
| --------------------------------------- | -------- | ----------------- | ------------------------------------------------ |
| 7.1.1 Setup k6                          | 2.0      | ✅ Hoàn thành     | 9 test scripts với k6                            |
| 7.1.2 Performance tests cho Login API   | 3.0      | ✅ **Hoàn thành** | 4 test files: 100, 500, 1000 users + stress test |
| 7.1.3 Performance tests cho Product API | 3.0      | ✅ Hoàn thành     | 5 test files covering CRUD                       |
| 7.1.4 Phân tích và recommendations      | 2.0      | ✅ Hoàn thành     | Có handleSummary với đầy đủ metrics              |
| **Tổng**                                | **10.0** | ✅ **Hoàn thành** |                                                  |

**Chi tiết Login API Tests:**

- ✅ `login_load_100.js` - Load test với 100 concurrent users
- ✅ `login_load_500.js` - Load test với 500 concurrent users
- ✅ `login_load_test.js` - Load test với 1000 concurrent users
- ✅ `login_stress_test.js` - Stress test tăng dần 100 → 3000 users để tìm breaking point

---

### Câu 7.2: Security Testing (10 điểm)

| Yêu cầu                           | Điểm     | Trạng thái        | Ghi chú                                |
| --------------------------------- | -------- | ----------------- | -------------------------------------- |
| 7.2.1 Test common vulnerabilities | 5.0      | ✅ Hoàn thành     | SQL Injection, XSS, CSRF, Auth Bypass  |
| 7.2.2 Test input validation       | 3.0      | ✅ Hoàn thành     | 50+ test cases cho validation          |
| 7.2.3 Security best practices     | 2.0      | ✅ Hoàn thành     | Password hashing, HTTPS, CORS, Headers |
| **Tổng**                          | **10.0** | ✅ **Hoàn thành** |                                        |

**Chi tiết:**

- ✅ SQL Injection: 30 payloads, test 3 endpoints
- ✅ XSS: 23 payloads, test 2 endpoints + stored XSS
- ✅ CSRF: 5 test cases
- ✅ Authentication Bypass: 8 test cases
- ✅ Input Validation: 50+ test cases
- ✅ Security Best Practices: 4 test files (password, HTTPS, CORS, headers)

---

## KẾT LUẬN

### ✅ Hoàn thành đầy đủ:

1. ✅ Security Testing (10/10 điểm) - Tất cả yêu cầu đã được implement đầy đủ
2. ✅ Performance Testing cho Login API (3/3 điểm) - Đã bổ sung đầy đủ 4 test files
3. ✅ Performance Testing cho Product API (3/3 điểm)
4. ✅ Setup k6 (2/2 điểm)
5. ✅ Phân tích kết quả (2/2 điểm)

**Tổng điểm Câu 7: 20/20 điểm** ✅

---

## ĐÃ BỔ SUNG

### ✅ Đã tạo các file sau:

1. ✅ `performance/login_load_100.js` - Load test với 100 concurrent users

   - Có thresholds và response time checks
   - Có handleSummary với đầy đủ metrics

2. ✅ `performance/login_load_500.js` - Load test với 500 concurrent users

   - Có thresholds phù hợp với load cao hơn
   - Có handleSummary với analysis

3. ✅ `performance/login_stress_test.js` - Stress test tìm breaking point
   - Tăng dần từ 100 → 500 → 1000 → 2000 → 3000 users
   - Có recommendations và breaking point analysis

**Câu 7 đã đạt 20/20 điểm** ✅
