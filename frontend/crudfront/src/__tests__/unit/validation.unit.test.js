import { validateUsername, validatePassword } from '../../util/validation';

describe('validateUsername - Unit Tests', () => {
  describe('TC_LOGIN_BE_04-10: Username Validation', () => {
    test('TC_LOGIN_BE_04: Username rỗng - trả về lỗi', () => {
      expect(validateUsername('')).toBe('Username is required!');
      expect(validateUsername(null)).toBe('Username is required!');
      expect(validateUsername('   ')).toBe('Username is required!');
    });

    test('TC_LOGIN_BE_05: Username quá ngắn (< 3 ký tự)', () => {
      expect(validateUsername('ab')).toBe('Username too short');
      expect(validateUsername('a')).toBe('Username too short');
    });

    test('TC_LOGIN_BE_06: Username quá dài (> 50 ký tự)', () => {
      const longUsername = 'a'.repeat(51);
      expect(validateUsername(longUsername)).toBe('Username too long');
    });

    test('TC_LOGIN_BE_07: Username có ký tự đặc biệt không hợp lệ', () => {
      expect(validateUsername('user@123')).toBe('Username contains invalid characters');
      expect(validateUsername('user#name')).toBe('Username contains invalid characters');
      expect(validateUsername('user name')).toBe('Username contains invalid characters');
    });

    test('TC_LOGIN_BE_08: Username có khoảng trắng đầu/cuối', () => {
      expect(validateUsername(' user ')).toBe('Username cannot have leading/trailing spaces');
      expect(validateUsername('user ')).toBe('Username cannot have leading/trailing spaces');
    });

    test('TC_LOGIN_BE_09: Username hợp lệ (3 ký tự)', () => {
      expect(validateUsername('abc')).toBe(true);
    });

    test('TC_LOGIN_BE_10: Username hợp lệ với ký tự đặc biệt hợp lệ', () => {
      expect(validateUsername('user_123')).toBe(true);
      expect(validateUsername('user-name')).toBe(true);
      expect(validateUsername('user.name')).toBe(true);
    });
  });

  describe('TC_LOGIN_BE_11-18: Password Validation', () => {
    test('TC_LOGIN_BE_11: Password rỗng - trả về lỗi', () => {
      expect(validatePassword('')).toBe('Password is required!');
      expect(validatePassword(null)).toBe('Password is required!');
      expect(validatePassword('   ')).toBe('Password is required!');
    });

    test('TC_LOGIN_BE_12: Password quá ngắn (< 6 ký tự)', () => {
      expect(validatePassword('abc12')).toBe('Password too short');
      expect(validatePassword('12345')).toBe('Password too short');
    });

    test('TC_LOGIN_BE_13: Password quá dài (> 100 ký tự)', () => {
      const longPassword = 'a'.repeat(50) + '1'.repeat(51);
      expect(validatePassword(longPassword)).toBe('Password too long');
    });

    test('TC_LOGIN_BE_14: Password không chứa chữ cái', () => {
      expect(validatePassword('123456')).toBe('Password must contain both letters and numbers');
    });

    test('TC_LOGIN_BE_15: Password không chứa số', () => {
      expect(validatePassword('abcdef')).toBe('Password must contain both letters and numbers');
    });

    test('TC_LOGIN_BE_16: Password có khoảng trắng', () => {
      expect(validatePassword('abc 123')).toBe('Password cannot contain spaces');
    });

    test('TC_LOGIN_BE_17: Password hợp lệ (6 ký tự)', () => {
      expect(validatePassword('abc123')).toBe(true);
    });

    test('TC_LOGIN_BE_18: Password hợp lệ (chữ hoa, thường, số)', () => {
      expect(validatePassword('TestPass123')).toBe(true);
      expect(validatePassword('MyPassword1')).toBe(true);
    });
  });

  describe('Edge Cases & Boundary Tests', () => {
    test('Username boundary: đúng 3 ký tự (min)', () => {
      expect(validateUsername('abc')).toBe(true);
    });

    test('Username boundary: đúng 50 ký tự (max)', () => {
      const maxUsername = 'a'.repeat(50);
      expect(validateUsername(maxUsername)).toBe(true);
    });

    test('Password boundary: đúng 6 ký tự (min)', () => {
      expect(validatePassword('abc123')).toBe(true);
    });

    test('Password boundary: đúng 100 ký tự (max)', () => {
      const maxPassword = 'a'.repeat(50) + '1'.repeat(50);
      expect(validatePassword(maxPassword)).toBe(true);
    });

    test('Username với các ký tự hợp lệ kết hợp', () => {
      expect(validateUsername('user_name-123.test')).toBe(true);
    });
  });
});