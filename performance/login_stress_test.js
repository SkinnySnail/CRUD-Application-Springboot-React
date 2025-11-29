import http from "k6/http";
import { check, sleep } from "k6";

/**
 * Login API Stress Test
 * Gradually increases load to find the breaking point
 * Tests: 100 → 500 → 1000 → 2000 → 3000 users
 */

export let options = {
  stages: [
    { duration: "30s", target: 100 }, // Ramp to 100 users
    { duration: "1m", target: 100 }, // Stay at 100 users
    { duration: "30s", target: 500 }, // Ramp to 500 users
    { duration: "1m", target: 500 }, // Stay at 500 users
    { duration: "30s", target: 1000 }, // Ramp to 1000 users
    { duration: "1m", target: 1000 }, // Stay at 1000 users
    { duration: "30s", target: 2000 }, // Ramp to 2000 users (breaking point test)
    { duration: "1m", target: 2000 }, // Stay at 2000 users
    { duration: "30s", target: 3000 }, // Ramp to 3000 users (extreme load)
    { duration: "1m", target: 3000 }, // Stay at 3000 users
    { duration: "30s", target: 0 }, // Ramp down
  ],
  thresholds: {
    // More lenient thresholds for stress test
    http_req_duration: ["p(95)<2000"], // 95% requests < 2s
    http_req_failed: ["rate<0.10"], // Less than 10% failures
    checks: ["rate>0.80"], // 80% checks pass
  },
};

export default function () {
  const url = "http://localhost:8080/auth/login";
  const payload = JSON.stringify({
    username: "testuser1",
    password: "test1234",
  });
  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    "status is 200": (r) => r.status === 200,
    "response time < 2000ms": (r) => r.timings.duration < 2000,
    "has token in response": (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.token !== null && body.token !== undefined;
      } catch (e) {
        return false;
      }
    },
  });

  sleep(1);
}

export function handleSummary(data) {
  console.log("\n" + "═".repeat(60));
  console.log("=== Login API Stress Test Summary ===");
  console.log("═".repeat(60));
  console.log("This test gradually increases load to find breaking point");
  console.log("Stages: 100 → 500 → 1000 → 2000 → 3000 users\n");

  const duration = data.metrics.http_req_duration;
  if (duration) {
    console.log(`Response Time Statistics:`);
    console.log(`  Average: ${duration.values.avg.toFixed(2)}ms`);
    console.log(`  Min: ${duration.values.min.toFixed(2)}ms`);
    console.log(`  Max: ${duration.values.max.toFixed(2)}ms`);
    console.log(`  P90: ${duration.values["p(90)"].toFixed(2)}ms`);
    console.log(`  P95: ${duration.values["p(95)"].toFixed(2)}ms`);
    console.log(`  P99: ${duration.values["p(99)"].toFixed(2)}ms`);
  }

  const reqs = data.metrics.http_reqs;
  if (reqs) {
    console.log(`\nThroughput:`);
    console.log(`  Rate: ${reqs.values.rate.toFixed(2)} requests/sec`);
    console.log(`  Total Requests: ${reqs.values.count}`);
  }

  const checks = data.metrics.checks;
  if (checks) {
    console.log(`\nCheck Pass Rate: ${(checks.values.rate * 100).toFixed(2)}%`);
  }

  const failures = data.metrics.http_req_failed;
  if (failures) {
    console.log(`\nFailure Rate: ${(failures.values.rate * 100).toFixed(2)}%`);

    if (failures.values.rate > 0.05) {
      console.log("\n⚠️  WARNING: High failure rate detected!");
      console.log("   This may indicate the breaking point has been reached.");
    }
  }

  console.log("\n📋 Stress Test Analysis:");
  console.log("  • Breaking Point: Look for stage where failure rate spikes");
  console.log("  • Response Time Degradation: Check when P95 exceeds 1s");
  console.log("  • Throughput: Monitor requests/sec at each stage");
  console.log("  • Recommendations:");
  console.log("    - If breaking point < 1000 users: Consider scaling");
  console.log("    - If breaking point > 2000 users: Good performance");
  console.log("    - Optimize database queries if response time degrades");
  console.log("    - Consider caching for frequently accessed data");

  return {};
}
