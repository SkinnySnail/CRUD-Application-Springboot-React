import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 1000 }, // Ramp-up to 100 users
    { duration: '1m', target: 1000 },  // Stay at 100 users
    { duration: '30s', target: 0 },   // Ramp-down
  ],
};

export default function () {
  const url = 'http://localhost:8080/auth/login';
  const payload = JSON.stringify({
    username: 'testuser1',
    password: 'test1234',
  });
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const res = http.post(url, payload, params);
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 800ms': (r) => r.timings.duration < 800,
  });
  sleep(1);
}
