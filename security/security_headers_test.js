import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = 'http://localhost:8080';

export const options = {
    vus: 1,
    iterations: 1,
    thresholds: {
        checks: ['rate>=0.3'],
    },
};

export default function() {
    console.log('=== Security Headers Test ===\n');
    
    let totalTests = 0;
    let passedTests = 0;
    let findings = {
        passed: [],
        warnings: [],
        failed: []
    };

    // Make a request to get all headers
    const res = http.get(BASE_URL + '/products', {
        headers: { 'Content-Type': 'application/json' }
    });

    console.log(`Response status: ${res.status}\n`);

    // Define security headers to check
    const securityHeaders = [
        {
            name: 'X-Content-Type-Options',
            expected: 'nosniff',
            severity: 'medium',
            description: 'Prevents MIME-type sniffing attacks',
            recommendation: 'X-Content-Type-Options: nosniff'
        },
        {
            name: 'X-Frame-Options',
            expected: ['DENY', 'SAMEORIGIN'],
            severity: 'high',
            description: 'Prevents clickjacking attacks',
            recommendation: 'X-Frame-Options: DENY'
        },
        {
            name: 'X-XSS-Protection',
            expected: '1; mode=block',
            severity: 'low',
            description: 'Legacy browser XSS filter',
            recommendation: 'X-XSS-Protection: 1; mode=block'
        },
        {
            name: 'Content-Security-Policy',
            expected: null, // Any value is good
            severity: 'high',
            description: 'Prevents XSS and injection attacks',
            recommendation: "Content-Security-Policy: default-src 'self'"
        },
        {
            name: 'Referrer-Policy',
            expected: ['no-referrer', 'strict-origin-when-cross-origin', 'same-origin', 'no-referrer-when-downgrade'],
            severity: 'medium',
            description: 'Controls referrer information sent',
            recommendation: 'Referrer-Policy: strict-origin-when-cross-origin'
        },
        {
            name: 'Permissions-Policy',
            expected: null,
            severity: 'low',
            description: 'Controls browser features/APIs',
            recommendation: 'Permissions-Policy: geolocation=(), camera=(), microphone=()'
        },
        {
            name: 'Cache-Control',
            expected: ['no-store', 'no-cache', 'private'],
            severity: 'medium',
            description: 'Prevents caching of sensitive data',
            recommendation: 'Cache-Control: no-store, no-cache, must-revalidate'
        }
    ];

    console.log('--- Security Headers Analysis ---\n');
    console.log('┌─────────────────────────────┬──────────┬─────────────────────────┐');
    console.log('│ Header                      │ Status   │ Value                   │');
    console.log('├─────────────────────────────┼──────────┼─────────────────────────┤');

    securityHeaders.forEach(header => {
        totalTests++;
        const headerValue = res.headers[header.name] || 
                           res.headers[header.name.toLowerCase()];
        
        let status = '';
        let displayValue = '';
        
        if (headerValue) {
            let isValid = true;
            if (header.expected) {
                if (Array.isArray(header.expected)) {
                    isValid = header.expected.some(exp => 
                        headerValue.toUpperCase().includes(exp.toUpperCase())
                    );
                } else if (header.expected !== null) {
                    isValid = headerValue.toLowerCase().includes(header.expected.toLowerCase());
                }
            }
            
            if (isValid) {
                passedTests++;
                status = '✅ PASS';
                displayValue = headerValue.substring(0, 20) + (headerValue.length > 20 ? '...' : '');
                findings.passed.push(`${header.name}: ${headerValue}`);
            } else {
                status = '⚠️ CHECK';
                displayValue = headerValue.substring(0, 20) + (headerValue.length > 20 ? '...' : '');
                findings.warnings.push(`${header.name}: ${headerValue} (unexpected value)`);
                passedTests++; // Still count as present
            }
            
            check(res, { [`${header.name} present`]: () => true });
        } else {
            if (header.severity === 'high') {
                status = '❌ FAIL';
                findings.failed.push(`${header.name} MISSING - ${header.description}`);
            } else {
                status = '⚠️ WARN';
                findings.warnings.push(`${header.name} missing - ${header.description}`);
            }
            displayValue = 'NOT SET';
            check(res, { [`${header.name} present`]: () => false });
        }
        
        const paddedName = header.name.padEnd(27);
        const paddedStatus = status.padEnd(8);
        const paddedValue = displayValue.padEnd(23);
        console.log(`│ ${paddedName} │ ${paddedStatus} │ ${paddedValue} │`);
    });

    console.log('└─────────────────────────────┴──────────┴─────────────────────────┘');

    // ==================== Additional Header Checks ====================
    console.log('\n--- Information Disclosure Headers ---');
    
    // Server header
    totalTests++;
    const serverHeader = res.headers['Server'] || res.headers['server'];
    if (serverHeader) {
        findings.warnings.push(`Server header exposes: ${serverHeader}`);
        console.log(`⚠️  Server: ${serverHeader} (consider hiding)`);
        check(res, { 'Server header hidden': () => false });
    } else {
        passedTests++;
        findings.passed.push('Server header not exposed');
        console.log('✅ Server header: Hidden');
        check(res, { 'Server header hidden': () => true });
    }

    // X-Powered-By header
    totalTests++;
    const poweredBy = res.headers['X-Powered-By'] || res.headers['x-powered-by'];
    if (poweredBy) {
        findings.warnings.push(`X-Powered-By exposes: ${poweredBy}`);
        console.log(`⚠️  X-Powered-By: ${poweredBy} (should be hidden)`);
        check(res, { 'X-Powered-By hidden': () => false });
    } else {
        passedTests++;
        findings.passed.push('X-Powered-By header not exposed');
        console.log('✅ X-Powered-By: Hidden');
        check(res, { 'X-Powered-By hidden': () => true });
    }

    // ==================== SUMMARY ====================
    console.log('\n' + '═'.repeat(55));
    console.log('=== Security Headers Summary ===');
    console.log('═'.repeat(55));
    
    console.log(`\nTotal headers checked: ${totalTests}`);
    console.log(`Passed: ${passedTests} (${((passedTests/totalTests)*100).toFixed(1)}%)`);
    console.log(`Missing/Failed: ${totalTests - passedTests}`);

    if (findings.passed.length > 0) {
        console.log('\n✅ PASSED (' + findings.passed.length + '):');
        findings.passed.forEach(item => console.log(`   • ${item}`));
    }

    if (findings.warnings.length > 0) {
        console.log('\n⚠️  WARNINGS (' + findings.warnings.length + '):');
        findings.warnings.forEach(item => console.log(`   • ${item}`));
    }

    if (findings.failed.length > 0) {
        console.log('\n❌ FAILED (' + findings.failed.length + '):');
        findings.failed.forEach(item => console.log(`   • ${item}`));
    }

    // Recommendations
    console.log('\n📋 RECOMMENDATIONS:');
    console.log('─'.repeat(55));
    
    securityHeaders.forEach(header => {
        const headerValue = res.headers[header.name] || res.headers[header.name.toLowerCase()];
        if (!headerValue) {
            console.log(`• Add: ${header.recommendation}`);
        }
    });

    console.log('\n💡 Spring Boot Implementation:');
    console.log('─'.repeat(55));
    console.log(`
@Component
public class SecurityHeadersFilter implements Filter {
    @Override
    public void doFilter(ServletRequest req, ServletResponse res, 
                         FilterChain chain) throws IOException, ServletException {
        HttpServletResponse response = (HttpServletResponse) res;
        
        response.setHeader("X-Content-Type-Options", "nosniff");
        response.setHeader("X-Frame-Options", "DENY");
        response.setHeader("X-XSS-Protection", "1; mode=block");
        response.setHeader("Content-Security-Policy", "default-src 'self'");
        response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
        
        chain.doFilter(req, res);
    }
}
    `);

    const passRate = (passedTests / totalTests) * 100;
    const status = passRate >= 70 ? 'GOOD' : passRate >= 40 ? 'NEEDS IMPROVEMENT' : 'CRITICAL';
    console.log(`\nOverall Status: ${status} (${passRate.toFixed(1)}%)`);
}
