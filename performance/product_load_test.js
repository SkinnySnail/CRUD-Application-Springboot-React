import http from 'k6/http';
import { check, sleep } from 'k6';

// Thông tin tài khoản test
const username = 'testuser1';
const password = 'test1234';

export let options = {
  stages: [
    { duration: '30s', target: 100 },
    { duration: '1m', target: 100 },
    { duration: '30s', target: 0 },
  ],
};

// Hàm lấy token đăng nhập
function getToken() {
  const loginRes = http.post('http://localhost:8080/auth/login', JSON.stringify({
    username,
    password,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  const token = loginRes.json('token');
  return token;
}

export default function () {
  const token = getToken();
  const authHeaders = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  // 1. GET danh sách sản phẩm
  let res = http.get('http://localhost:8080/product', authHeaders);
  check(res, {
    'GET /product status 200': (r) => r.status === 200,
    'GET /product < 800ms': (r) => r.timings.duration < 800,
  });
  sleep(1);

  // 2. POST thêm sản phẩm
  const newProduct = {
    name: `Product_${Math.random().toString(36).substring(7)}`,
    price: Math.floor(Math.random() * 100) + 1,
    description: 'Performance test',
  };
  res = http.post('http://localhost:8080/product', JSON.stringify(newProduct), authHeaders);
  check(res, {
    'POST /product status 200': (r) => r.status === 200,
    'POST /product < 800ms': (r) => r.timings.duration < 800,
  });
  sleep(1);

  // Lấy id sản phẩm vừa tạo từ response (giả sử backend trả về object có trường id)
  let productId;
  try {
    productId = res.json('id');
  } catch (e) {
    productId = null;
  }
  if (!productId) {
    // Nếu không lấy được id, bỏ qua các bước tiếp theo
    return;
  }

  // 3. PUT cập nhật sản phẩm vừa tạo
  const updateProduct = {
    name: 'Updated Product',
    price: 99,
    description: 'Updated by k6',
  };
  res = http.put(`http://localhost:8080/product/${productId}`, JSON.stringify(updateProduct), authHeaders);
  check(res, {
    [`PUT /product/${productId} status 200`]: (r) => r.status === 200,
    [`PUT /product/${productId} < 800ms`]: (r) => r.timings.duration < 800,
  });
  sleep(1);

  // 4. DELETE sản phẩm vừa tạo
  res = http.del(`http://localhost:8080/product/${productId}`, null, authHeaders);
  check(res, {
    [`DELETE /product/${productId} status 200`]: (r) => r.status === 200,
    [`DELETE /product/${productId} < 800ms`]: (r) => r.timings.duration < 800,
  });
  sleep(1);
}
