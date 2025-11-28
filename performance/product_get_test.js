import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:8080';
const username = 'testuser1';
const password = 'test1234';

export let options = {
    stages: [
        { duration: '30s', target: 100 },   // Ramp up to 100 users
        { duration: '1m', target: 100 },    // Stay at 100 users
        { duration: '30s', target: 0 },     // Ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<1000'],  // 95% requests < 1s
        checks: ['rate>0.9'],               // 90% checks pass
    },
};

// Get authentication token
function getToken() {
    const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
        username,
        password,
    }), {
        headers: { 'Content-Type': 'application/json' },
    });
    
    if (loginRes.status === 200) {
        return loginRes.json('token');
    }
    return null;
}

export default function() {
    const token = getToken();
    if (!token) {
        console.log('Failed to get token');
        return;
    }

    const authHeaders = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    };

    // ==================== GET ALL PRODUCTS ====================
    let res = http.get(`${BASE_URL}/products`, authHeaders);
    check(res, {
        'GET /products status 200': (r) => r.status === 200,
        'GET /products response time < 500ms': (r) => r.timings.duration < 500,
        'GET /products response time < 800ms': (r) => r.timings.duration < 800,
        'GET /products has body': (r) => r.body && r.body.length > 0,
    });

    sleep(0.5);

    // ==================== GET SINGLE PRODUCT ====================
    // Try to get product with ID 1
    res = http.get(`${BASE_URL}/product/1`, authHeaders);
    check(res, {
        'GET /product/1 status 200 or 404': (r) => r.status === 200 || r.status === 404,
        'GET /product/1 response time < 500ms': (r) => r.timings.duration < 500,
        'GET /product/1 response time < 800ms': (r) => r.timings.duration < 800,
    });

    sleep(0.5);

    // ==================== SEARCH PRODUCTS ====================
    res = http.get(`${BASE_URL}/products/search?keyword=test`, authHeaders);
    check(res, {
        'SEARCH /products/search status 200': (r) => r.status === 200 || r.status === 404,
        'SEARCH response time < 500ms': (r) => r.timings.duration < 500,
        'SEARCH response time < 800ms': (r) => r.timings.duration < 800,
    });

    sleep(1);
}

export function handleSummary(data) {
    console.log('\n' + '═'.repeat(60));
    console.log('=== GET Product Performance Test Summary ===');
    console.log('═'.repeat(60));
    
    const duration = data.metrics.http_req_duration;
    if (duration) {
        console.log(`\nResponse Time Statistics:`);
        console.log(`  Average: ${duration.values.avg.toFixed(2)}ms`);
        console.log(`  Min: ${duration.values.min.toFixed(2)}ms`);
        console.log(`  Max: ${duration.values.max.toFixed(2)}ms`);
        console.log(`  P90: ${duration.values['p(90)'].toFixed(2)}ms`);
        console.log(`  P95: ${duration.values['p(95)'].toFixed(2)}ms`);
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
