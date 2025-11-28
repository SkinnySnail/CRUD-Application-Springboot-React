import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = 'http://localhost:8080';

export const options = {
    vus: 1,
    iterations: 1,
    thresholds: {
        checks: ['rate>=0.7'],
    },
};

export default function() {
    console.log('=== CORS Configuration Test ===\n');
    
    let totalTests = 0;
    let passedTests = 0;
    let findings = [];

    // ==================== TEST 1: Preflight OPTIONS Request ====================
    console.log('--- Test 1: CORS Preflight Request ---');
    
    const preflightRes = http.options(BASE_URL + '/products', {
        headers: {
            'Origin': 'http://localhost:3000',
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type, Authorization'
        }
    });

    console.log(`Preflight response status: ${preflightRes.status}`);
    
    // ==================== TEST 2: Access-Control-Allow-Origin ====================
    console.log('\n--- Test 2: Access-Control-Allow-Origin Header ---');
    
    totalTests++;
    const allowOrigin = preflightRes.headers['Access-Control-Allow-Origin'] || 
                        preflightRes.headers['access-control-allow-origin'];
    
    if (allowOrigin === '*') {
        findings.push('[VULNERABLE] CORS allows ALL origins (*) - Very dangerous!');
        console.log('[VULNERABLE] Access-Control-Allow-Origin: * (wildcard)');
        console.log('[RISK] Any website can make requests to your API');
        check(preflightRes, { 'CORS not wildcard': () => false });
    } else if (allowOrigin) {
        passedTests++;
        findings.push(`[PROTECTED] CORS restricted to: ${allowOrigin}`);
        console.log(`[PROTECTED] Allowed Origin: ${allowOrigin}`);
        check(preflightRes, { 'CORS not wildcard': () => true });
    } else {
        passedTests++;
        findings.push('[PROTECTED] No CORS header - Same-origin policy enforced');
        console.log('[PROTECTED] No Access-Control-Allow-Origin (same-origin only)');
        check(preflightRes, { 'CORS not wildcard': () => true });
    }

    // ==================== TEST 3: Malicious Origin Test ====================
    console.log('\n--- Test 3: Malicious Origin Rejection ---');
    
    const maliciousOrigins = [
        'http://evil-hacker.com',
        'http://malicious-site.com',
        'https://fake-bank.com',
        'null'
    ];

    maliciousOrigins.forEach((origin, index) => {
        totalTests++;
        
        const maliciousRes = http.get(BASE_URL + '/products', {
            headers: {
                'Origin': origin,
                'Content-Type': 'application/json'
            }
        });
        
        const reflectedOrigin = maliciousRes.headers['Access-Control-Allow-Origin'] || 
                                maliciousRes.headers['access-control-allow-origin'];
        
        if (reflectedOrigin === origin) {
            findings.push(`[VULNERABLE] Origin reflected: ${origin}`);
            console.log(`[VULNERABLE] Server reflects: ${origin}`);
            check(maliciousRes, { [`Malicious origin ${index + 1} rejected`]: () => false });
        } else if (reflectedOrigin === '*') {
            findings.push(`[VULNERABLE] Wildcard allows: ${origin}`);
            console.log(`[VULNERABLE] Wildcard accepts: ${origin}`);
            check(maliciousRes, { [`Malicious origin ${index + 1} rejected`]: () => false });
        } else {
            passedTests++;
            console.log(`[PROTECTED] Origin rejected: ${origin}`);
            check(maliciousRes, { [`Malicious origin ${index + 1} rejected`]: () => true });
        }
    });

    // ==================== TEST 4: Access-Control-Allow-Credentials ====================
    console.log('\n--- Test 4: Credentials Configuration ---');
    
    totalTests++;
    const allowCredentials = preflightRes.headers['Access-Control-Allow-Credentials'] || 
                             preflightRes.headers['access-control-allow-credentials'];
    
    if (allowCredentials === 'true' && allowOrigin === '*') {
        findings.push('[CRITICAL] Credentials with wildcard origin - Security vulnerability!');
        console.log('[CRITICAL] credentials: true with origin: * is FORBIDDEN by browsers');
        check(preflightRes, { 'No credentials with wildcard': () => false });
    } else if (allowCredentials === 'true') {
        passedTests++;
        findings.push(`[OK] Credentials allowed with specific origin: ${allowOrigin}`);
        console.log('[OK] Credentials enabled with restricted origin');
        check(preflightRes, { 'No credentials with wildcard': () => true });
    } else {
        passedTests++;
        findings.push('[PROTECTED] Credentials not allowed (safer)');
        console.log('[PROTECTED] Access-Control-Allow-Credentials not set or false');
        check(preflightRes, { 'No credentials with wildcard': () => true });
    }

    // ==================== TEST 5: Allowed Methods ====================
    console.log('\n--- Test 5: Allowed HTTP Methods ---');
    
    totalTests++;
    const allowMethods = preflightRes.headers['Access-Control-Allow-Methods'] || 
                         preflightRes.headers['access-control-allow-methods'];
    
    if (allowMethods) {
        console.log(`[INFO] Allowed Methods: ${allowMethods}`);
        
        const dangerousMethods = ['TRACE', 'TRACK'];
        const hasDangerous = dangerousMethods.some(m => 
            allowMethods.toUpperCase().includes(m)
        );
        
        if (hasDangerous) {
            findings.push(`[WARNING] Dangerous methods allowed: ${allowMethods}`);
            console.log('[WARNING] TRACE/TRACK methods should be disabled');
            check(preflightRes, { 'No dangerous methods': () => false });
        } else {
            passedTests++;
            findings.push(`[PROTECTED] Safe methods only: ${allowMethods}`);
            check(preflightRes, { 'No dangerous methods': () => true });
        }
    } else {
        passedTests++;
        findings.push('[PROTECTED] Methods not explicitly exposed');
        console.log('[PROTECTED] No Access-Control-Allow-Methods header');
        check(preflightRes, { 'No dangerous methods': () => true });
    }

    // ==================== TEST 6: Allowed Headers ====================
    console.log('\n--- Test 6: Allowed Headers ---');
    
    totalTests++;
    const allowHeaders = preflightRes.headers['Access-Control-Allow-Headers'] || 
                         preflightRes.headers['access-control-allow-headers'];
    
    if (allowHeaders) {
        console.log(`[INFO] Allowed Headers: ${allowHeaders}`);
        
        // Check if it allows all headers (bad)
        if (allowHeaders === '*') {
            findings.push('[WARNING] All headers allowed (*)');
            console.log('[WARNING] Consider restricting allowed headers');
            check(preflightRes, { 'Headers restricted': () => false });
        } else {
            passedTests++;
            findings.push(`[PROTECTED] Specific headers allowed`);
            check(preflightRes, { 'Headers restricted': () => true });
        }
    } else {
        passedTests++;
        findings.push('[PROTECTED] Headers not explicitly exposed');
        console.log('[PROTECTED] No Access-Control-Allow-Headers');
        check(preflightRes, { 'Headers restricted': () => true });
    }

    // ==================== TEST 7: Expose Headers ====================
    console.log('\n--- Test 7: Exposed Headers Check ---');
    
    totalTests++;
    const exposeHeaders = preflightRes.headers['Access-Control-Expose-Headers'] || 
                          preflightRes.headers['access-control-expose-headers'];
    
    if (exposeHeaders) {
        console.log(`[INFO] Exposed Headers: ${exposeHeaders}`);
        
        // Check for sensitive headers
        const sensitiveHeaders = ['Set-Cookie', 'Authorization', 'X-Auth-Token'];
        const exposesSensitive = sensitiveHeaders.some(h => 
            exposeHeaders.toLowerCase().includes(h.toLowerCase())
        );
        
        if (exposesSensitive) {
            findings.push('[WARNING] Sensitive headers exposed to JavaScript');
            console.log('[WARNING] Sensitive headers accessible to client');
            check(preflightRes, { 'No sensitive headers exposed': () => false });
        } else {
            passedTests++;
            findings.push('[PROTECTED] No sensitive headers exposed');
            check(preflightRes, { 'No sensitive headers exposed': () => true });
        }
    } else {
        passedTests++;
        findings.push('[PROTECTED] No headers explicitly exposed');
        console.log('[PROTECTED] No Access-Control-Expose-Headers');
        check(preflightRes, { 'No sensitive headers exposed': () => true });
    }

    // ==================== SUMMARY ====================
    console.log('\n' + '═'.repeat(50));
    console.log('=== CORS Configuration Summary ===');
    console.log('═'.repeat(50));
    
    console.log(`\nTotal tests: ${totalTests}`);
    console.log(`Passed: ${passedTests} (${((passedTests/totalTests)*100).toFixed(1)}%)`);
    console.log(`Failed: ${totalTests - passedTests}`);
    
    console.log('\nFindings:');
    findings.forEach((f, i) => console.log(`  ${i+1}. ${f}`));
    
    console.log('\n📋 CORS BEST PRACTICES:');
    console.log('─'.repeat(50));
    console.log('1. Never use Access-Control-Allow-Origin: *');
    console.log('2. Whitelist specific trusted origins');
    console.log('3. Avoid credentials with wildcard origin');
    console.log('4. Limit allowed methods to required ones');
    console.log('5. Restrict allowed headers');
    console.log('6. Be careful with exposed headers');
    
    const passRate = (passedTests / totalTests) * 100;
    const status = passRate >= 80 ? 'PASSED' : passRate >= 50 ? 'ACCEPTABLE' : 'FAILED';
    console.log(`\nOverall Status: ${status} (${passRate.toFixed(1)}%)`);
}
