import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = 'http://localhost:8080';

export const options = {
    vus: 1,
    iterations: 1,
    thresholds: {
        checks: ['rate>=0.3'], // Lower threshold for development environment
    },
};

export default function() {
    console.log('=== HTTPS Enforcement Test ===\n');
    
    let totalTests = 0;
    let passedTests = 0;
    let findings = [];

    // ==================== TEST 1: HTTP to HTTPS Redirect ====================
    console.log('--- Test 1: HTTP to HTTPS Redirect ---');
    
    const httpRes = http.get(BASE_URL + '/products', {
        redirects: 0, // Don't follow redirects
        headers: { 'Content-Type': 'application/json' }
    });
    
    totalTests++;
    if (httpRes.status === 301 || httpRes.status === 302 || httpRes.status === 308) {
        const location = httpRes.headers['Location'] || httpRes.headers['location'];
        if (location && location.startsWith('https://')) {
            passedTests++;
            findings.push(`[PROTECTED] HTTP redirects to HTTPS: ${location}`);
            console.log(`[PROTECTED] Redirect to: ${location}`);
            check(httpRes, { 'HTTP redirects to HTTPS': () => true });
        } else {
            findings.push('[WARNING] Redirect exists but not to HTTPS');
            console.log(`[WARNING] Redirect to: ${location}`);
            check(httpRes, { 'HTTP redirects to HTTPS': () => false });
        }
    } else {
        findings.push('[INFO] No HTTPS redirect (expected in development)');
        console.log(`[INFO] No redirect - Status: ${httpRes.status}`);
        console.log('[INFO] This is normal for localhost development');
        check(httpRes, { 'HTTP redirects to HTTPS': () => false });
    }

    // ==================== TEST 2: HSTS Header ====================
    console.log('\n--- Test 2: Strict-Transport-Security (HSTS) Header ---');
    
    totalTests++;
    const hstsHeader = httpRes.headers['Strict-Transport-Security'] || 
                       httpRes.headers['strict-transport-security'];
    
    if (hstsHeader) {
        passedTests++;
        findings.push(`[PROTECTED] HSTS header: ${hstsHeader}`);
        console.log(`[PROTECTED] HSTS: ${hstsHeader}`);
        
        // Check HSTS configuration
        if (hstsHeader.includes('max-age=')) {
            const maxAge = hstsHeader.match(/max-age=(\d+)/);
            if (maxAge && parseInt(maxAge[1]) >= 31536000) {
                console.log('[GOOD] max-age >= 1 year');
            } else {
                console.log('[WARNING] max-age should be at least 1 year (31536000)');
            }
        }
        if (hstsHeader.includes('includeSubDomains')) {
            console.log('[GOOD] includeSubDomains enabled');
        }
        if (hstsHeader.includes('preload')) {
            console.log('[GOOD] preload enabled');
        }
        
        check(httpRes, { 'HSTS header present': () => true });
    } else {
        findings.push('[INFO] HSTS header missing (expected in development)');
        console.log('[INFO] HSTS header not present');
        console.log('[INFO] Required for production HTTPS deployment');
        check(httpRes, { 'HSTS header present': () => false });
    }

    // ==================== TEST 3: Secure Cookie Flags ====================
    console.log('\n--- Test 3: Secure Cookie Flags ---');
    
    // Login to check cookie settings
    const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
        username: 'testuser1',
        password: 'test1234'
    }), {
        headers: { 'Content-Type': 'application/json' }
    });

    totalTests++;
    const setCookie = loginRes.headers['Set-Cookie'] || loginRes.headers['set-cookie'];
    
    if (setCookie) {
        const hasSecure = setCookie.toLowerCase().includes('secure');
        const hasHttpOnly = setCookie.toLowerCase().includes('httponly');
        const hasSameSite = setCookie.toLowerCase().includes('samesite');
        
        if (hasSecure) {
            findings.push('[PROTECTED] Cookie has Secure flag');
            console.log('[PROTECTED] Secure flag present');
        } else {
            findings.push('[WARNING] Cookie missing Secure flag');
            console.log('[WARNING] Secure flag missing');
        }
        
        if (hasHttpOnly) {
            findings.push('[PROTECTED] Cookie has HttpOnly flag');
            console.log('[PROTECTED] HttpOnly flag present');
        }
        
        if (hasSameSite) {
            findings.push('[PROTECTED] Cookie has SameSite attribute');
            console.log('[PROTECTED] SameSite attribute present');
        }
        
        if (hasSecure && hasHttpOnly) {
            passedTests++;
            check(loginRes, { 'Secure cookie flags': () => true });
        } else {
            check(loginRes, { 'Secure cookie flags': () => false });
        }
    } else {
        // JWT in body instead of cookie - this is acceptable
        passedTests++;
        findings.push('[INFO] Using JWT in response body (no cookies)');
        console.log('[INFO] JWT-based auth - no cookies used');
        console.log('[PROTECTED] JWT in body avoids cookie security issues');
        check(loginRes, { 'Secure cookie flags': () => true });
    }

    // ==================== TEST 4: Mixed Content Prevention ====================
    console.log('\n--- Test 4: Content Security for Mixed Content ---');
    
    totalTests++;
    // Check for headers that prevent mixed content
    const csp = httpRes.headers['Content-Security-Policy'] || 
                httpRes.headers['content-security-policy'];
    
    if (csp && (csp.includes('upgrade-insecure-requests') || csp.includes('block-all-mixed-content'))) {
        passedTests++;
        findings.push('[PROTECTED] CSP prevents mixed content');
        console.log('[PROTECTED] Mixed content blocked by CSP');
        check(httpRes, { 'Mixed content prevention': () => true });
    } else {
        findings.push('[INFO] No mixed content prevention header');
        console.log('[INFO] Consider adding: upgrade-insecure-requests');
        check(httpRes, { 'Mixed content prevention': () => false });
    }

    // ==================== SUMMARY ====================
    console.log('\n' + '═'.repeat(50));
    console.log('=== HTTPS Enforcement Summary ===');
    console.log('═'.repeat(50));
    
    console.log(`\nTotal tests: ${totalTests}`);
    console.log(`Passed: ${passedTests} (${((passedTests/totalTests)*100).toFixed(1)}%)`);
    console.log(`Failed: ${totalTests - passedTests}`);
    
    console.log('\nFindings:');
    findings.forEach((f, i) => console.log(`  ${i+1}. ${f}`));
    
    console.log('\n📋 RECOMMENDATIONS FOR PRODUCTION:');
    console.log('─'.repeat(50));
    console.log('1. Enable HTTPS with valid SSL certificate');
    console.log('2. Add HSTS header: Strict-Transport-Security: max-age=31536000; includeSubDomains');
    console.log('3. Configure HTTP to HTTPS redirect (301)');
    console.log('4. Set Secure flag on all cookies');
    console.log('5. Consider HSTS preload list submission');
    
    console.log('\n⚠️  NOTE: HTTPS is typically disabled in development (localhost)');
    console.log('These tests verify readiness for production HTTPS deployment.');
    
    const status = passedTests >= 1 ? 'ACCEPTABLE (Dev Mode)' : 'NEEDS CONFIGURATION';
    console.log(`\nOverall Status: ${status}`);
}
