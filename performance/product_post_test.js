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
        http_req_duration: ['p(95)<1500'],  // 95% requests < 1.5s (POST slower)
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

    // ==================== POST CREATE PRODUCT ====================
    const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const newProduct = {
        name: `PerfTest_Product_${uniqueId}`,
        price: Math.floor(Math.random() * 1000) + 1,
        quantity: Math.floor(Math.random() * 100) + 1,
        category: 'Performance Test',
        description: `Product created during performance test at ${new Date().toISOString()}`,
    };

    let res = http.post(`${BASE_URL}/product`, JSON.stringify(newProduct), authHeaders);
    
    const postSuccess = check(res, {
        'POST /product status 200 or 201': (r) => r.status === 200 || r.status === 201,
        'POST /product response time < 500ms': (r) => r.timings.duration < 500,
        'POST /product response time < 800ms': (r) => r.timings.duration < 800,
        'POST /product response time < 1000ms': (r) => r.timings.duration < 1000,
        'POST /product has response body': (r) => r.body && r.body.length > 0,
    });

    // Verify product was created by checking response
    if (res.status === 200 || res.status === 201) {
        try {
            const createdProduct = JSON.parse(res.body);
            check(createdProduct, {
                'POST /product returns id': (p) => p.id !== undefined && p.id !== null,
                'POST /product returns correct name': (p) => p.name === newProduct.name || p.productName === newProduct.name,
            });
            
            // Clean up: Delete the product we just created
            if (createdProduct.id) {
                const deleteRes = http.del(`${BASE_URL}/product/${createdProduct.id}`, null, authHeaders);
                check(deleteRes, {
                    'Cleanup DELETE successful': (r) => r.status === 200 || r.status === 204,
                });
            }
        } catch (e) {
            // Response parsing failed
        }
    }

    sleep(1);
}

export function handleSummary(data) {
    console.log('\n' + '═'.repeat(60));
    console.log('=== POST Product Performance Test Summary ===');
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

    console.log('\n📋 POST Test Notes:');
    console.log('  • Each iteration creates a new product');
    console.log('  • Products are cleaned up after creation');
    console.log('  • POST operations are typically slower than GET');
    
    return {};
}
