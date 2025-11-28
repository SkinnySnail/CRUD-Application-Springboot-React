import http from 'k6/http';
import { check } from 'k6';

/**
 * CSRF (Cross-Site Request Forgery) Test
 * Kiểm tra xem ứng dụng có bảo vệ chống CSRF hay không
 */

const BASE_URL = 'http://localhost:8080';

export let options = {
  iterations: 1,
  thresholds: {
    checks: ['rate>=0.5'],
  },
};

export default function () {
  console.log('=== CSRF (Cross-Site Request Forgery) Test ===');
  
  let vulnerableCount = 0;
  let testedCount = 0;

  // Đăng nhập để lấy token
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    username: 'testuser1',
    password: 'test1234',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  if (loginRes.status !== 200) {
    console.log('Login failed, cannot proceed with CSRF tests');
    return;
  }

  const token = loginRes.json('token');

  // Test 1: Kiểm tra CSRF token requirement
  console.log('\n--- Test 1: CSRF Token Requirement ---');
  testedCount++;
  
  // Thử gửi request không có CSRF token (nếu ứng dụng yêu cầu)
  // Với REST API sử dụng JWT, CSRF thường được bảo vệ bằng cách yêu cầu token trong header
  
  // Request không có Authorization header
  const noAuthRes = http.post(`${BASE_URL}/product`, JSON.stringify({
    name: 'CSRF Test Product',
    price: 100,
    description: 'Test',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  const isProtectedWithoutAuth = noAuthRes.status === 401 || noAuthRes.status === 403;
  
  if (!isProtectedWithoutAuth) {
    vulnerableCount++;
    console.log(`[VULNERABLE] API accepts requests without authentication!`);
  } else {
    console.log(`[PROTECTED] API requires authentication - Status: ${noAuthRes.status}`);
  }

  check(noAuthRes, {
    'API requires authentication': () => isProtectedWithoutAuth,
  });

  // Test 2: Kiểm tra Origin header validation
  console.log('\n--- Test 2: Origin Header Validation ---');
  testedCount++;
  
  const crossOriginRes = http.post(`${BASE_URL}/product`, JSON.stringify({
    name: 'CSRF Origin Test',
    price: 100,
    description: 'Test',
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Origin': 'http://evil-site.com',
      'Referer': 'http://evil-site.com/attack-page',
    },
  });

  // Kiểm tra CORS headers trong response
  const corsHeader = crossOriginRes.headers['Access-Control-Allow-Origin'] || '';
  const allowsAllOrigins = corsHeader === '*';
  
  if (allowsAllOrigins) {
    vulnerableCount++;
    console.log(`[VULNERABLE] CORS allows all origins (*)`);
  } else {
    console.log(`[INFO] Access-Control-Allow-Origin: ${corsHeader || 'Not set'}`);
  }

  check(crossOriginRes, {
    'CORS does not allow all origins': () => !allowsAllOrigins,
  });

  // Test 3: Kiểm tra SameSite cookie attribute
  console.log('\n--- Test 3: Cookie Security Attributes ---');
  testedCount++;
  
  const setCookieHeader = loginRes.headers['Set-Cookie'] || '';
  const hasSameSite = setCookieHeader.toLowerCase().includes('samesite');
  const hasHttpOnly = setCookieHeader.toLowerCase().includes('httponly');
  const hasSecure = setCookieHeader.toLowerCase().includes('secure');
  
  console.log(`[INFO] Set-Cookie header: ${setCookieHeader || 'Not present (using JWT in body)'}`);
  
  if (setCookieHeader && !hasSameSite) {
    console.log(`[WARNING] SameSite attribute missing in cookies`);
  }
  if (setCookieHeader && !hasHttpOnly) {
    console.log(`[WARNING] HttpOnly attribute missing in cookies`);
  }
  if (setCookieHeader && !hasSecure) {
    console.log(`[WARNING] Secure attribute missing in cookies (required for HTTPS)`);
  }

  // Nếu sử dụng JWT trong body thay vì cookie, đây là một cách bảo vệ CSRF tốt
  const usesJWTInBody = !setCookieHeader && token;
  if (usesJWTInBody) {
    console.log(`[PROTECTED] Using JWT in response body instead of cookies - Good CSRF protection`);
  }

  check(loginRes, {
    'Proper cookie security or JWT-based auth': () => usesJWTInBody || (hasSameSite && hasHttpOnly),
  });

  // Test 4: Kiểm tra state-changing operations require proper authentication
  console.log('\n--- Test 4: State-Changing Operations Protection ---');
  
  // Test DELETE without auth
  testedCount++;
  const deleteNoAuthRes = http.del(`${BASE_URL}/product/1`, null, {
    headers: { 'Content-Type': 'application/json' },
  });
  
  const deleteProtected = deleteNoAuthRes.status === 401 || deleteNoAuthRes.status === 403;
  if (!deleteProtected) {
    vulnerableCount++;
    console.log(`[VULNERABLE] DELETE operation does not require authentication!`);
  } else {
    console.log(`[PROTECTED] DELETE requires authentication - Status: ${deleteNoAuthRes.status}`);
  }

  check(deleteNoAuthRes, {
    'DELETE requires authentication': () => deleteProtected,
  });

  // Test PUT without auth
  testedCount++;
  const putNoAuthRes = http.put(`${BASE_URL}/product/1`, JSON.stringify({
    name: 'CSRF Update Test',
    price: 999,
    description: 'Malicious update',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  const putProtected = putNoAuthRes.status === 401 || putNoAuthRes.status === 403;
  if (!putProtected) {
    vulnerableCount++;
    console.log(`[VULNERABLE] PUT operation does not require authentication!`);
  } else {
    console.log(`[PROTECTED] PUT requires authentication - Status: ${putNoAuthRes.status}`);
  }

  check(putNoAuthRes, {
    'PUT requires authentication': () => putProtected,
  });

  // Test 5: Kiểm tra Content-Type enforcement
  console.log('\n--- Test 5: Content-Type Enforcement ---');
  testedCount++;
  
  // Thử gửi request với Content-Type khác (form-urlencoded - thường được sử dụng trong CSRF attacks)
  const formRes = http.post(`${BASE_URL}/auth/login`, 
    'username=testuser1&password=test1234', {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  // Nếu API chỉ chấp nhận JSON, đây là một lớp bảo vệ CSRF
  const rejectsFormData = formRes.status === 400 || formRes.status === 415;
  
  if (!rejectsFormData && formRes.status === 200) {
    console.log(`[WARNING] API accepts form-urlencoded data - potential CSRF vector`);
  } else {
    console.log(`[PROTECTED] API enforces JSON Content-Type - Status: ${formRes.status}`);
  }

  check(formRes, {
    'API enforces JSON Content-Type': () => rejectsFormData,
  });

  // Summary
  console.log('\n=== CSRF Test Summary ===');
  console.log(`Total tests: ${testedCount}`);
  console.log(`Vulnerabilities found: ${vulnerableCount}`);
  console.log(`Status: ${vulnerableCount === 0 ? 'PASSED - CSRF protections in place' : 'WARNING - Some CSRF concerns found'}`);
}
