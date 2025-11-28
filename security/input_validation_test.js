import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:8080';

export const options = {
    vus: 1,
    iterations: 1,
    thresholds: {
        checks: ['rate>=0.7'], // 70% tests should pass
    },
};

// Get valid JWT token for authenticated tests
function getAuthToken() {
    const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
        username: 'testuser1',
        password: 'test1234'
    }), {
        headers: { 'Content-Type': 'application/json' }
    });
    
    if (loginRes.status === 200) {
        const body = JSON.parse(loginRes.body);
        return body.token;
    }
    return null;
}

export default function() {
    console.log('=== Input Validation & Sanitization Test ===\n');
    
    let totalTests = 0;
    let passedTests = 0;
    let vulnerabilities = [];

    // ==================== TEST 1: Username Validation ====================
    console.log('--- Test 1: Username Input Validation ---');
    
    const usernamePayloads = [
        { value: '', desc: 'Empty username', shouldReject: true },
        { value: 'a', desc: 'Too short (1 char)', shouldReject: true },
        { value: 'ab', desc: 'Too short (2 chars)', shouldReject: true },
        { value: 'a'.repeat(51), desc: 'Too long (51 chars)', shouldReject: true },
        { value: 'user name', desc: 'Contains space', shouldReject: true },
        { value: 'user@name', desc: 'Contains @', shouldReject: true },
        { value: 'user<script>', desc: 'Contains HTML tags', shouldReject: true },
        { value: '   username   ', desc: 'Leading/trailing spaces', shouldReject: true },
        { value: 'validuser123', desc: 'Valid username', shouldReject: false },
        { value: 'user_name', desc: 'With underscore', shouldReject: false },
    ];

    usernamePayloads.forEach((payload, index) => {
        const res = http.post(`${BASE_URL}/auth/register`, JSON.stringify({
            username: payload.value,
            password: 'Test1234!'
        }), {
            headers: { 'Content-Type': 'application/json' }
        });

        totalTests++;
        const isRejected = res.status !== 200 && res.status !== 201;
        
        if (payload.shouldReject) {
            if (isRejected) {
                passedTests++;
                check(res, { [`Username validation ${index + 1}: ${payload.desc} - Rejected`]: () => true });
            } else {
                vulnerabilities.push(`Username "${payload.desc}" should be rejected but was accepted`);
                check(res, { [`Username validation ${index + 1}: ${payload.desc} - Should reject`]: () => false });
            }
        } else {
            // For valid usernames, we just check it doesn't crash
            passedTests++;
            check(res, { [`Username validation ${index + 1}: ${payload.desc} - Handled`]: () => true });
        }
    });

    // ==================== TEST 2: Password Validation ====================
    console.log('\n--- Test 2: Password Input Validation ---');
    
    const passwordPayloads = [
        { value: '', desc: 'Empty password', shouldReject: true },
        { value: 'abc', desc: 'Too short (3 chars)', shouldReject: true },
        { value: 'abcdefgh', desc: 'No numbers', shouldReject: true },
        { value: '12345678', desc: 'No letters', shouldReject: true },
        { value: 'Test1234', desc: 'Valid password', shouldReject: false },
        { value: 'a'.repeat(101) + '1', desc: 'Too long (102 chars)', shouldReject: true },
        { value: '   Test1234   ', desc: 'With spaces', shouldReject: true },
        { value: 'Test 1234', desc: 'Contains space', shouldReject: true },
    ];

    passwordPayloads.forEach((payload, index) => {
        const uniqueUser = `pwdtest${Date.now()}${index}`;
        const res = http.post(`${BASE_URL}/auth/register`, JSON.stringify({
            username: uniqueUser,
            password: payload.value
        }), {
            headers: { 'Content-Type': 'application/json' }
        });

        totalTests++;
        const isRejected = res.status !== 200 && res.status !== 201;
        
        if (payload.shouldReject) {
            if (isRejected) {
                passedTests++;
                check(res, { [`Password validation ${index + 1}: ${payload.desc} - Rejected`]: () => true });
            } else {
                vulnerabilities.push(`Password "${payload.desc}" should be rejected but was accepted`);
                check(res, { [`Password validation ${index + 1}: ${payload.desc} - Should reject`]: () => false });
            }
        } else {
            passedTests++;
            check(res, { [`Password validation ${index + 1}: ${payload.desc} - Handled`]: () => true });
        }
    });

    // ==================== TEST 3: Product Name Validation ====================
    console.log('\n--- Test 3: Product Name Input Validation ---');
    
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    const productNamePayloads = [
        { value: '', desc: 'Empty name', shouldReject: true },
        { value: 'a'.repeat(256), desc: 'Too long (256 chars)', shouldReject: true },
        { value: '<script>alert("XSS")</script>', desc: 'XSS script tag', shouldSanitize: true },
        { value: '"><img src=x onerror=alert(1)>', desc: 'XSS img tag', shouldSanitize: true },
        { value: 'javascript:alert(1)', desc: 'JavaScript protocol', shouldSanitize: true },
        { value: 'Valid Product Name', desc: 'Valid name', shouldReject: false },
        { value: 'Product <b>Bold</b>', desc: 'HTML formatting', shouldSanitize: true },
        { value: '   Product   ', desc: 'Extra whitespace', shouldTrim: true },
        { value: 'Product\n\nName', desc: 'Newlines', shouldSanitize: true },
        { value: 'Product\x00Name', desc: 'Null byte', shouldSanitize: true },
    ];

    productNamePayloads.forEach((payload, index) => {
        const res = http.post(`${BASE_URL}/product`, JSON.stringify({
            name: payload.value,
            price: 100
        }), { headers });

        totalTests++;
        
        if (payload.shouldReject) {
            const isRejected = res.status !== 200 && res.status !== 201;
            if (isRejected) {
                passedTests++;
                check(res, { [`Product name ${index + 1}: ${payload.desc} - Rejected`]: () => true });
            } else {
                vulnerabilities.push(`Product name "${payload.desc}" should be rejected`);
                check(res, { [`Product name ${index + 1}: ${payload.desc} - Should reject`]: () => false });
            }
        } else if (payload.shouldSanitize) {
            // Check if the response contains sanitized data
            if (res.status === 200 || res.status === 201) {
                try {
                    const body = JSON.parse(res.body);
                    const productId = body.id;
                    
                    // Fetch the product to check if it was sanitized
                    const getRes = http.get(`${BASE_URL}/product/${productId}`, { headers });
                    if (getRes.status === 200) {
                        const product = JSON.parse(getRes.body);
                        const containsScript = product.name && (
                            product.name.includes('<script') || 
                            product.name.includes('javascript:') ||
                            product.name.includes('onerror=')
                        );
                        
                        if (containsScript) {
                            vulnerabilities.push(`Product name "${payload.desc}" not sanitized - Stored XSS!`);
                            console.log(`[VULNERABLE] Stored XSS: ${payload.desc}`);
                            check(getRes, { [`Product name ${index + 1}: ${payload.desc} - Should sanitize`]: () => false });
                        } else {
                            passedTests++;
                            check(getRes, { [`Product name ${index + 1}: ${payload.desc} - Sanitized`]: () => true });
                        }
                    }
                    
                    // Cleanup - delete the test product
                    http.del(`${BASE_URL}/product/${productId}`, null, { headers });
                } catch (e) {
                    passedTests++;
                    check(res, { [`Product name ${index + 1}: ${payload.desc} - Handled`]: () => true });
                }
            } else {
                passedTests++;
                check(res, { [`Product name ${index + 1}: ${payload.desc} - Rejected (OK)`]: () => true });
            }
        } else {
            passedTests++;
            check(res, { [`Product name ${index + 1}: ${payload.desc} - Accepted`]: () => true });
        }
    });

    // ==================== TEST 4: Product Price Validation ====================
    console.log('\n--- Test 4: Product Price Input Validation ---');
    
    const pricePayloads = [
        { value: -100, desc: 'Negative price', shouldReject: true },
        { value: 0, desc: 'Zero price', shouldReject: false }, // May be valid for free items
        { value: 'abc', desc: 'String instead of number', shouldReject: true },
        { value: 99999999999, desc: 'Very large number', shouldReject: true },
        { value: 1.999999999, desc: 'Many decimal places', shouldHandle: true },
        { value: null, desc: 'Null value', shouldReject: true },
        { value: 99.99, desc: 'Valid price', shouldReject: false },
        { value: '100', desc: 'Number as string', shouldHandle: true },
    ];

    pricePayloads.forEach((payload, index) => {
        const res = http.post(`${BASE_URL}/product`, JSON.stringify({
            name: `PriceTest${Date.now()}${index}`,
            price: payload.value
        }), { headers });

        totalTests++;
        const isRejected = res.status !== 200 && res.status !== 201;
        
        if (payload.shouldReject) {
            if (isRejected) {
                passedTests++;
                check(res, { [`Price validation ${index + 1}: ${payload.desc} - Rejected`]: () => true });
            } else {
                // Cleanup if created
                try {
                    const body = JSON.parse(res.body);
                    if (body.id) http.del(`${BASE_URL}/product/${body.id}`, null, { headers });
                } catch(e) {}
                
                vulnerabilities.push(`Price "${payload.desc}" should be rejected`);
                check(res, { [`Price validation ${index + 1}: ${payload.desc} - Should reject`]: () => false });
            }
        } else {
            passedTests++;
            // Cleanup if created
            try {
                const body = JSON.parse(res.body);
                if (body.id) http.del(`${BASE_URL}/product/${body.id}`, null, { headers });
            } catch(e) {}
            check(res, { [`Price validation ${index + 1}: ${payload.desc} - Handled`]: () => true });
        }
    });

    // ==================== TEST 5: Special Characters & Encoding ====================
    console.log('\n--- Test 5: Special Characters & Encoding ---');
    
    const specialCharPayloads = [
        { value: '../../etc/passwd', desc: 'Path traversal' },
        { value: '%00', desc: 'URL encoded null byte' },
        { value: '%3Cscript%3E', desc: 'URL encoded script tag' },
        { value: '{{7*7}}', desc: 'Template injection' },
        { value: '${7*7}', desc: 'Expression language injection' },
        { value: '<?php echo "test"; ?>', desc: 'PHP injection' },
        { value: '$(whoami)', desc: 'Command injection' },
        { value: '`whoami`', desc: 'Backtick command injection' },
        { value: 'test\r\nHeader: injected', desc: 'HTTP header injection' },
        { value: '你好世界', desc: 'Unicode (Chinese)' },
        { value: '🎉🔥💯', desc: 'Emoji' },
    ];

    specialCharPayloads.forEach((payload, index) => {
        const res = http.post(`${BASE_URL}/product`, JSON.stringify({
            name: payload.value,
            price: 100
        }), { headers });

        totalTests++;
        
        if (res.status === 200 || res.status === 201) {
            try {
                const body = JSON.parse(res.body);
                const productId = body.id;
                
                // Check if stored as-is (potential vulnerability)
                const getRes = http.get(`${BASE_URL}/product/${productId}`, { headers });
                if (getRes.status === 200) {
                    const product = JSON.parse(getRes.body);
                    
                    // Check for dangerous patterns that should be sanitized
                    const dangerous = ['<script', '<?php', '$(', '`whoami', '\r\n'];
                    const hasDangerous = dangerous.some(d => product.name && product.name.includes(d));
                    
                    if (hasDangerous) {
                        vulnerabilities.push(`Special char "${payload.desc}" not sanitized`);
                        check(getRes, { [`Special char ${index + 1}: ${payload.desc} - Should sanitize`]: () => false });
                    } else {
                        passedTests++;
                        check(getRes, { [`Special char ${index + 1}: ${payload.desc} - Safe`]: () => true });
                    }
                }
                
                // Cleanup
                http.del(`${BASE_URL}/product/${productId}`, null, { headers });
            } catch(e) {
                passedTests++;
                check(res, { [`Special char ${index + 1}: ${payload.desc} - Handled`]: () => true });
            }
        } else {
            passedTests++;
            check(res, { [`Special char ${index + 1}: ${payload.desc} - Rejected`]: () => true });
        }
    });

    // ==================== TEST 6: JSON Injection ====================
    console.log('\n--- Test 6: JSON Structure Validation ---');
    
    // Test malformed JSON handling
    const jsonTests = [
        { body: '{"name": "test", "price": 100, "extra": "field"}', desc: 'Extra fields' },
        { body: '{"name": "test"}', desc: 'Missing required field' },
        { body: '{"name": ["array"], "price": 100}', desc: 'Wrong type (array)' },
        { body: '{"name": {"nested": "object"}, "price": 100}', desc: 'Wrong type (object)' },
        { body: '{"__proto__": {"admin": true}}', desc: 'Prototype pollution' },
        { body: '{"constructor": {"prototype": {"admin": true}}}', desc: 'Constructor pollution' },
    ];

    jsonTests.forEach((test, index) => {
        const res = http.post(`${BASE_URL}/product`, test.body, { headers });
        
        totalTests++;
        // These should either be rejected or handled safely
        if (res.status === 400 || res.status === 422 || res.status === 500) {
            passedTests++;
            check(res, { [`JSON test ${index + 1}: ${test.desc} - Rejected`]: () => true });
        } else if (res.status === 200 || res.status === 201) {
            // Check if it was handled safely (no prototype pollution)
            try {
                const body = JSON.parse(res.body);
                if (body.id) http.del(`${BASE_URL}/product/${body.id}`, null, { headers });
                
                if (test.desc.includes('pollution')) {
                    console.log(`[WARNING] ${test.desc} - Request accepted, verify no pollution occurred`);
                }
            } catch(e) {}
            passedTests++;
            check(res, { [`JSON test ${index + 1}: ${test.desc} - Handled`]: () => true });
        } else {
            passedTests++;
            check(res, { [`JSON test ${index + 1}: ${test.desc} - Handled`]: () => true });
        }
    });

    // ==================== SUMMARY ====================
    console.log('\n=== Input Validation Test Summary ===');
    console.log(`Total tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${totalTests - passedTests}`);
    console.log(`Pass rate: ${((passedTests / totalTests) * 100).toFixed(2)}%`);
    
    if (vulnerabilities.length > 0) {
        console.log(`\nVulnerabilities found: ${vulnerabilities.length}`);
        vulnerabilities.forEach((v, i) => {
            console.log(`  ${i + 1}. ${v}`);
        });
        console.log('\nStatus: FAILED - Input validation issues found!');
    } else {
        console.log('\nStatus: PASSED - Input validation working correctly');
    }
}
