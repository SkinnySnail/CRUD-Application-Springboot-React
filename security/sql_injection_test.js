import http from 'k6/http';
import { check } from 'k6';

/**
 * SQL Injection Test
 * Kiểm tra xem ứng dụng có bảo vệ chống SQL Injection hay không
 */

const BASE_URL = 'http://localhost:8080';

// Các payload SQL Injection phổ biến
const sqlInjectionPayloads = [
  "' OR '1'='1",
  "' OR '1'='1' --",
  "' OR '1'='1' /*",
  "admin'--",
  "1'; DROP TABLE users--",
  "1' OR '1'='1' UNION SELECT * FROM users--",
  "' UNION SELECT username, password FROM users--",
  "1; SELECT * FROM users",
  "' AND 1=1--",
  "' AND 1=2--",
  "1' ORDER BY 1--",
  "1' ORDER BY 100--",
  "'; EXEC xp_cmdshell('dir')--",
  "' OR 'x'='x",
  "' OR ''='",
  "1' AND SLEEP(5)--",
  "1' WAITFOR DELAY '0:0:5'--",
];

export let options = {
  iterations: 1, // Chạy 1 lần cho mỗi test
  thresholds: {
    checks: ['rate==1.0'], // Tất cả các check phải pass
  },
};

export default function () {
  console.log('=== SQL Injection Test ===');
  
  let vulnerableCount = 0;
  let testedCount = 0;

  // Test 1: SQL Injection trong Login
  console.log('\n--- Test 1: SQL Injection in Login ---');
  sqlInjectionPayloads.forEach((payload, index) => {
    testedCount++;
    
    // Test với username bị injection
    let res = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
      username: payload,
      password: 'testpassword',
    }), {
      headers: { 'Content-Type': 'application/json' },
    });

    // Nếu login thành công với payload SQL Injection, đó là lỗ hổng
    let isVulnerable = res.status === 200 && res.json('token') !== null;
    if (isVulnerable) {
      vulnerableCount++;
      console.log(`[VULNERABLE] Payload ${index + 1}: ${payload} - Login succeeded!`);
    }

    check(res, {
      [`SQLi Login Payload ${index + 1} blocked`]: (r) => r.status !== 200 || r.json('token') === null,
    });

    // Test với password bị injection
    res = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
      username: 'testuser',
      password: payload,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });

    isVulnerable = res.status === 200 && res.json('token') !== null;
    if (isVulnerable) {
      vulnerableCount++;
      console.log(`[VULNERABLE] Password Payload ${index + 1}: ${payload} - Login succeeded!`);
    }
  });

  // Test 2: SQL Injection trong Register
  console.log('\n--- Test 2: SQL Injection in Register ---');
  sqlInjectionPayloads.slice(0, 5).forEach((payload, index) => {
    testedCount++;
    
    const res = http.post(`${BASE_URL}/auth/register`, JSON.stringify({
      username: payload,
      password: 'Test1234',
    }), {
      headers: { 'Content-Type': 'application/json' },
    });

    // Kiểm tra xem có lỗi SQL trong response không
    const responseBody = res.body ? res.body.toString().toLowerCase() : '';
    const hasSqlError = responseBody.includes('sql') || 
                        responseBody.includes('syntax') || 
                        responseBody.includes('mysql') ||
                        responseBody.includes('postgresql') ||
                        responseBody.includes('oracle') ||
                        responseBody.includes('database');
    
    if (hasSqlError) {
      vulnerableCount++;
      console.log(`[VULNERABLE] SQL error exposed in Register response!`);
    }

    check(res, {
      [`SQLi Register Payload ${index + 1} - No SQL error exposed`]: () => !hasSqlError,
    });
  });

  // Test 3: SQL Injection trong Product API (nếu có token)
  console.log('\n--- Test 3: SQL Injection in Product Search ---');
  
  // Đăng nhập để lấy token
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    username: 'testuser1',
    password: 'test1234',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  if (loginRes.status === 200) {
    const token = loginRes.json('token');
    const authHeaders = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    };

    // Test SQL Injection trong product name khi tạo mới
    sqlInjectionPayloads.slice(0, 5).forEach((payload, index) => {
      testedCount++;
      
      const res = http.post(`${BASE_URL}/product`, JSON.stringify({
        name: payload,
        price: 100,
        description: 'Test product',
      }), authHeaders);

      const responseBody = res.body ? res.body.toString().toLowerCase() : '';
      const hasSqlError = responseBody.includes('sql') || 
                          responseBody.includes('syntax') || 
                          responseBody.includes('database');
      
      if (hasSqlError) {
        vulnerableCount++;
        console.log(`[VULNERABLE] SQL error exposed in Product API!`);
      }

      check(res, {
        [`SQLi Product Payload ${index + 1} - No SQL error exposed`]: () => !hasSqlError,
      });
    });
  }

  // Summary
  console.log('\n=== SQL Injection Test Summary ===');
  console.log(`Total tests: ${testedCount}`);
  console.log(`Vulnerabilities found: ${vulnerableCount}`);
  console.log(`Status: ${vulnerableCount === 0 ? 'PASSED - No SQL Injection vulnerabilities detected' : 'FAILED - SQL Injection vulnerabilities found!'}`);
}
