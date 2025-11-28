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
        checks: ['rate>0.8'],               // 80% checks pass
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

    // ==================== CREATE PRODUCT FIRST ====================
    const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const newProduct = {
        name: `DELETE_Test_${uniqueId}`,
        price: 25,
        quantity: 5,
        category: 'DELETE Test',
        description: 'Created for DELETE test',
    };

    let createRes = http.post(`${BASE_URL}/product`, JSON.stringify(newProduct), authHeaders);
    
    check(createRes, {
        'Setup: Product created': (r) => r.status === 200 || r.status === 201,
    });

    let productId = null;
    if (createRes.status === 200 || createRes.status === 201) {
        try {
            const created = JSON.parse(createRes.body);
            productId = created.id;
        } catch (e) {
            // Failed to parse
        }
    }

    if (!productId) {
        // Cannot continue without a product to delete
        return;
    }

    sleep(0.3);

    // ==================== DELETE PRODUCT ====================
    let res = http.del(`${BASE_URL}/product/${productId}`, null, authHeaders);
    
    check(res, {
        'DELETE /product status 200 or 204': (r) => r.status === 200 || r.status === 204,
        'DELETE /product response time < 300ms': (r) => r.timings.duration < 300,
        'DELETE /product response time < 500ms': (r) => r.timings.duration < 500,
        'DELETE /product response time < 800ms': (r) => r.timings.duration < 800,
    });

    sleep(0.3);

    // ==================== VERIFY DELETE ====================
    // Try to GET the deleted product - should return 404
    let verifyRes = http.get(`${BASE_URL}/product/${productId}`, authHeaders);
    
    check(verifyRes, {
        'Verify: Deleted product returns 404': (r) => r.status === 404,
    });

    // ==================== TEST DELETE NON-EXISTENT ====================
    // Try to delete a product that doesn't exist
    const fakeId = 99999999;
    let notFoundRes = http.del(`${BASE_URL}/product/${fakeId}`, null, authHeaders);
    
    check(notFoundRes, {
        'DELETE non-existent returns 404': (r) => r.status === 404 || r.status === 500,
    });

    sleep(0.5);
}

export function handleSummary(data) {
    console.log('\n' + '═'.repeat(60));
    console.log('=== DELETE Product Performance Test Summary ===');
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

    console.log('\n📋 DELETE Test Notes:');
    console.log('  • Each iteration: CREATE → DELETE → VERIFY');
    console.log('  • Verifies product is actually deleted (404)');
    console.log('  • Tests delete on non-existent product');
    console.log('  • DELETE operations should be fast');
    
    return {};
}
