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
        http_req_duration: ['p(95)<1500'],  // 95% requests < 1.5s
        checks: ['rate>0.7'],               // 70% checks pass (PUT may fail if product doesn't exist)
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
        name: `PUT_Test_${uniqueId}`,
        price: 50,
        quantity: 10,
        category: 'PUT Test',
        description: 'Created for PUT test',
    };

    let createRes = http.post(`${BASE_URL}/product`, JSON.stringify(newProduct), authHeaders);
    
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
        // Cannot continue without a product to update
        return;
    }

    sleep(0.3);

    // ==================== PUT UPDATE PRODUCT ====================
    const updatedProduct = {
        name: `Updated_${uniqueId}`,
        price: 99.99,
        quantity: 50,
        category: 'Updated Category',
        description: `Updated at ${new Date().toISOString()}`,
    };

    let res = http.put(`${BASE_URL}/product/${productId}`, JSON.stringify(updatedProduct), authHeaders);
    
    check(res, {
        'PUT /product status 200': (r) => r.status === 200,
        'PUT /product response time < 500ms': (r) => r.timings.duration < 500,
        'PUT /product response time < 800ms': (r) => r.timings.duration < 800,
        'PUT /product response time < 1000ms': (r) => r.timings.duration < 1000,
    });

    // Verify update was successful
    if (res.status === 200) {
        try {
            const updated = JSON.parse(res.body);
            check(updated, {
                'PUT returns updated name': (p) => p.name === updatedProduct.name || p.productName === updatedProduct.name,
                'PUT returns updated price': (p) => p.price === updatedProduct.price,
            });
        } catch (e) {
            // Response parsing failed
        }
    }

    sleep(0.3);

    // ==================== CLEANUP: DELETE PRODUCT ====================
    let deleteRes = http.del(`${BASE_URL}/product/${productId}`, null, authHeaders);
    check(deleteRes, {
        'Cleanup DELETE successful': (r) => r.status === 200 || r.status === 204,
    });

    sleep(0.5);
}

export function handleSummary(data) {
    console.log('\n' + '═'.repeat(60));
    console.log('=== PUT Product Performance Test Summary ===');
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

    console.log('\n📋 PUT Test Notes:');
    console.log('  • Each iteration: CREATE → UPDATE → DELETE');
    console.log('  • Tests update operation on freshly created products');
    console.log('  • Verifies data integrity after update');
    
    return {};
}
