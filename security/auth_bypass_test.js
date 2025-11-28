import http from 'k6/http';
import { check } from 'k6';

/**
 * Authentication Bypass Test
 * Kiểm tra các lỗ hổng cho phép vượt qua xác thực
 */

const BASE_URL = 'http://localhost:8080';

export let options = {
  iterations: 1,
  thresholds: {
    checks: ['rate>=0.8'],
  },
};

export default function () {
  console.log('=== Authentication Bypass Test ===');
  
  let vulnerableCount = 0;
  let testedCount = 0;

  // Test 1: Truy cập API protected mà không có token
  console.log('\n--- Test 1: Access Protected API Without Token ---');
  testedCount++;
  
  const noTokenRes = http.get(`${BASE_URL}/product`, {
    headers: { 'Content-Type': 'application/json' },
  });
  
  // API product có thể cho phép GET không cần auth, nhưng các thao tác khác thì cần
  console.log(`[INFO] GET /product without token - Status: ${noTokenRes.status}`);

  // Test 2: Truy cập với token giả
  console.log('\n--- Test 2: Access With Fake/Invalid Token ---');
  testedCount++;
  
  const fakeTokens = [
    'fake_token_123',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    'Bearer fake_token',
    '',
    'null',
    'undefined',
  ];

  fakeTokens.forEach((fakeToken, index) => {
    const res = http.post(`${BASE_URL}/product`, JSON.stringify({
      name: 'Bypass Test',
      price: 100,
      description: 'Test',
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${fakeToken}`,
      },
    });

    const isBlocked = res.status === 401 || res.status === 403;
    if (!isBlocked && res.status === 200) {
      vulnerableCount++;
      console.log(`[VULNERABLE] Fake token accepted! Token: ${fakeToken.substring(0, 20)}...`);
    } else {
      console.log(`[PROTECTED] Fake token ${index + 1} rejected - Status: ${res.status}`);
    }

    check(res, {
      [`Fake token ${index + 1} rejected`]: () => isBlocked,
    });
  });

  // Test 3: Token manipulation
  console.log('\n--- Test 3: Token Manipulation ---');
  testedCount++;
  
  // Đăng nhập để lấy token thật
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    username: 'testuser1',
    password: 'test1234',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  if (loginRes.status === 200) {
    const realToken = loginRes.json('token');
    
    // Thử modify token
    const modifiedTokens = [
      realToken ? realToken.slice(0, -5) + 'XXXXX' : 'invalid', // Thay đổi cuối token
      realToken ? 'A' + realToken.slice(1) : 'invalid', // Thay đổi đầu token
      realToken ? realToken.split('.').reverse().join('.') : 'invalid', // Đảo ngược các phần
    ];

    modifiedTokens.forEach((modToken, index) => {
      const res = http.post(`${BASE_URL}/product`, JSON.stringify({
        name: 'Modified Token Test',
        price: 100,
        description: 'Test',
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${modToken}`,
        },
      });

      const isBlocked = res.status === 401 || res.status === 403;
      if (!isBlocked && res.status === 200) {
        vulnerableCount++;
        console.log(`[VULNERABLE] Modified token accepted!`);
      } else {
        console.log(`[PROTECTED] Modified token ${index + 1} rejected - Status: ${res.status}`);
      }

      check(res, {
        [`Modified token ${index + 1} rejected`]: () => isBlocked,
      });
    });
  }

  // Test 4: SQL Injection trong login để bypass authentication
  console.log('\n--- Test 4: SQL Injection Auth Bypass ---');
  testedCount++;
  
  const sqlBypassPayloads = [
    { username: "admin' OR '1'='1", password: "anything" },
    { username: "admin'--", password: "anything" },
    { username: "' OR 1=1--", password: "anything" },
    { username: "admin", password: "' OR '1'='1" },
    { username: "admin", password: "' OR 1=1--" },
  ];

  sqlBypassPayloads.forEach((payload, index) => {
    const res = http.post(`${BASE_URL}/auth/login`, JSON.stringify(payload), {
      headers: { 'Content-Type': 'application/json' },
    });

    const bypassSuccessful = res.status === 200 && res.json('token') !== null;
    if (bypassSuccessful) {
      vulnerableCount++;
      console.log(`[VULNERABLE] SQL Injection bypass successful! Payload: ${JSON.stringify(payload)}`);
    } else {
      console.log(`[PROTECTED] SQL bypass ${index + 1} blocked - Status: ${res.status}`);
    }

    check(res, {
      [`SQL bypass ${index + 1} blocked`]: () => !bypassSuccessful,
    });
  });

  // Test 5: Brute force protection check
  console.log('\n--- Test 5: Brute Force Protection Check ---');
  testedCount++;
  
  let failedAttempts = 0;
  let blockedByRateLimit = false;
  
  for (let i = 0; i < 10; i++) {
    const res = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
      username: 'testuser1',
      password: 'wrongpassword' + i,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.status === 429) { // Too Many Requests
      blockedByRateLimit = true;
      console.log(`[PROTECTED] Rate limiting activated after ${i + 1} failed attempts`);
      break;
    }
    failedAttempts++;
  }

  if (!blockedByRateLimit) {
    console.log(`[WARNING] No rate limiting detected after ${failedAttempts} failed login attempts`);
  }

  check({}, {
    'Rate limiting or account lockout in place': () => blockedByRateLimit,
  });

  // Test 6: Session fixation check
  console.log('\n--- Test 6: Token Reuse After Logout ---');
  testedCount++;
  
  if (loginRes.status === 200) {
    const token = loginRes.json('token');
    
    // Thử sử dụng token cũ sau một thời gian
    // (Trong thực tế, nên test sau khi logout nếu có endpoint logout)
    const reuseRes = http.get(`${BASE_URL}/product`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log(`[INFO] Token reuse test - Status: ${reuseRes.status}`);
  }

  // Test 7: Horizontal privilege escalation
  console.log('\n--- Test 7: Horizontal Privilege Escalation ---');
  testedCount++;
  
  // Thử truy cập/thao tác trên resource của user khác
  // (Cần có 2 user để test đầy đủ)
  console.log(`[INFO] For complete horizontal escalation test, create two users and try accessing each other's resources`);

  // Test 8: Kiểm tra JWT không có expiration
  console.log('\n--- Test 8: JWT Expiration Check ---');
  testedCount++;
  
  if (loginRes.status === 200) {
    const token = loginRes.json('token');
    const expiresIn = loginRes.json('expiresIn');
    
    if (expiresIn && expiresIn > 0) {
      console.log(`[PROTECTED] Token has expiration: ${expiresIn}ms`);
    } else {
      console.log(`[WARNING] Token expiration not found in response`);
    }
    
    check(loginRes, {
      'Token has expiration time': () => expiresIn && expiresIn > 0,
    });
  }

  // Summary
  console.log('\n=== Authentication Bypass Test Summary ===');
  console.log(`Total tests: ${testedCount}`);
  console.log(`Vulnerabilities found: ${vulnerableCount}`);
  console.log(`Status: ${vulnerableCount === 0 ? 'PASSED - No authentication bypass vulnerabilities detected' : 'FAILED - Authentication bypass vulnerabilities found!'}`);
}
