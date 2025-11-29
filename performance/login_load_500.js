import http from "k6/http";
import { check, sleep } from "k6";

/**
 * Login API Load Test - 500 Concurrent Users
 * Tests Login API performance with 500 concurrent users
 */

export let options = {
  stages: [
    { duration: "30s", target: 500 }, // Ramp-up to 500 users
    { duration: "1m", target: 500 }, // Stay at 500 users
    { duration: "30s", target: 0 }, // Ramp-down
  ],
  thresholds: {
    http_req_duration: ["p(95)<1000"], // 95% requests < 1s (higher threshold for more load)
    http_req_failed: ["rate<0.05"], // Less than 5% failures
    checks: ["rate>0.90"], // 90% checks pass
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
    "response time < 800ms": (r) => r.timings.duration < 800,
    "response time < 1000ms": (r) => r.timings.duration < 1000,
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
  console.log("=== Login API Load Test (500 Users) Summary ===");
  console.log("═".repeat(60));

  const duration = data.metrics.http_req_duration;
  if (duration) {
    console.log(`\nResponse Time Statistics:`);
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
  }

  console.log("\n📋 Test Notes:");
  console.log("  • Load: 500 concurrent users");
  console.log("  • Duration: ~2 minutes");
  console.log("  • Higher load may cause slower response times");
  console.log("  • Monitor for performance degradation");

  return {};
}
