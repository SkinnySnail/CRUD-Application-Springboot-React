// validation.js (Cập nhật đầy đủ)

export function validateUsername(username) {
  // Rỗng
  if (!username || username.trim() === '') {
    return 'Username is required!';
  }

  // Khoảng trắng đầu/cuối
  if (username !== username.trim()) {
    return 'Username cannot have leading/trailing spaces';
  }

  // Quá ngắn
  if (username.length < 3) {
    return 'Username too short';
  }

  // Quá dài
  if (username.length > 50) {
    return 'Username too long';
  }

  // Ký tự đặc biệt không hợp lệ (chỉ cho phép a-z, A-Z, 0-9, -, ., _)
  const validPattern = /^[a-zA-Z0-9\-._]+$/;
  if (!validPattern.test(username)) {
    return 'Username contains invalid characters';
  }

  return true;
}

export function validatePassword(password) {
  // Rỗng
  if (!password || password.trim() === '') {
    return 'Password is required!';
  }

  // Khoảng trắng
  if (password.includes(' ')) {
    return 'Password cannot contain spaces';
  }

  // Quá ngắn
  if (password.length < 6) {
    return 'Password too short';
  }

  // Quá dài
  if (password.length > 100) {
    return 'Password too long';
  }

  // Phải có cả chữ VÀ số
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!hasLetter || !hasNumber) {
    return 'Password must contain both letters and numbers';
  }

  return true;
}