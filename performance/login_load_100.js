import http from "k6/http";
import { check, sleep } from "k6";

/**
 * Login API Load Test - 100 Concurrent Users
 * Tests Login API performance with 100 concurrent users
 */

export let options = {
  stages: [
    { duration: "30s", target: 100 }, // Ramp-up to 100 users
    { duration: "1m", target: 100 }, // Stay at 100 users
    { duration: "30s", target: 0 }, // Ramp-down
  ],
  thresholds: {
    http_req_duration: ["p(95)<800"], // 95% requests < 800ms
    http_req_failed: ["rate<0.01"], // Less than 1% failures
    checks: ["rate>0.95"], // 95% checks pass
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
    "response time < 500ms": (r) => r.timings.duration < 500,
    "response time < 800ms": (r) => r.timings.duration < 800,
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
  console.log("=== Login API Load Test (100 Users) Summary ===");
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
  console.log("  • Load: 100 concurrent users");
  console.log("  • Duration: ~2 minutes");
  console.log("  • Expected: All requests should complete successfully");

  return {};
}
