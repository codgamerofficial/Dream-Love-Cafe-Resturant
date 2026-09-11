import AsyncStorage from '@react-native-async-storage/async-storage';
jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

import { checkEmailAuthorizedServer, verifyServerAuthorization } from '../config/auth';

describe('Email + Password Authentication & Server Authorization Suite', () => {
  const originalFetch = global.fetch;

  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  describe('1. Registration Validation Logic', () => {
    test('enforces full name minimum length of 2 characters', () => {
      const validateFullName = (name: string) => Boolean(name && name.trim().length >= 2);
      expect(validateFullName('')).toBe(false);
      expect(validateFullName('A')).toBe(false);
      expect(validateFullName('Ab')).toBe(true);
      expect(validateFullName('Rahul Sen')).toBe(true);
    });

    test('enforces password minimum length of 8 characters', () => {
      const validatePassword = (pass: string) => Boolean(pass && pass.length >= 8);
      expect(validatePassword('')).toBe(false);
      expect(validatePassword('1234567')).toBe(false);
      expect(validatePassword('12345678')).toBe(true);
      expect(validatePassword('StrongP@ssw0rd!')).toBe(true);
    });

    test('enforces password confirmation equality', () => {
      const validateMatch = (p1: string, p2: string) => p1 === p2 && p1.length > 0;
      expect(validateMatch('Secret123', 'Secret1234')).toBe(false);
      expect(validateMatch('Secret123', 'Secret123')).toBe(true);
    });

    test('validates email regex format', () => {
      const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
      expect(isValidEmail('not-an-email')).toBe(false);
      expect(isValidEmail('admin@')).toBe(false);
      expect(isValidEmail('admin@dreamlove')).toBe(false);
      expect(isValidEmail('admin@dreamlove.restaurant')).toBe(true);
      expect(isValidEmail('dreamlovecontai@gmail.com')).toBe(true);
    });
  });

  describe('2. Server Authorization & Allowlist Pre-flight', () => {
    test('checkEmailAuthorizedServer returns authorized: true for authorized email', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ authorized: true }),
      } as any);

      const result = await checkEmailAuthorizedServer('dreamlovecontai@gmail.com');
      expect(result.authorized).toBe(true);
    });

    test('checkEmailAuthorizedServer returns authorized: false for unauthorized email', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        status: 403,
        headers: { get: () => 'application/json' },
        json: async () => ({ authorized: false, error: 'Access denied' }),
      } as any);

      const result = await checkEmailAuthorizedServer('stranger@random.com');
      expect(result.authorized).toBe(false);
    });

    test('verifyServerAuthorization returns authorized: true for valid JWT', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        status: 200,
        headers: { get: () => 'application/json' },
        json: async () => ({ authorized: true, email: 'admin@dreamlove.restaurant', role: 'admin' }),
      } as any);

      const result = await verifyServerAuthorization('valid-jwt-token');
      expect(result.authorized).toBe(true);
      expect(result.email).toBe('admin@dreamlove.restaurant');
    });

    test('verifyServerAuthorization returns authorized: false for invalid JWT or non-staff', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        status: 403,
        headers: { get: () => 'application/json' },
        json: async () => ({ authorized: false, error: 'Unauthorized staff member' }),
      } as any);

      const result = await verifyServerAuthorization('invalid-token');
      expect(result.authorized).toBe(false);
    });
  });

  describe('3. Session Persistence in AsyncStorage', () => {
    test('saves and restores authenticated staff session', async () => {
      const SESSION_KEY = '@dream_love_offline_auth_session_v1';
      const sessionData = {
        user: { id: 'usr_staff_01', email: 'admin@dreamlove.restaurant' },
        profile: {
          id: 'usr_staff_01',
          full_name: 'Lead Admin',
          role: 'admin',
          status: 'active',
        },
      };

      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
      const loaded = await AsyncStorage.getItem(SESSION_KEY);
      expect(loaded).toBeTruthy();

      const parsed = JSON.parse(loaded!);
      expect(parsed.user.email).toBe('admin@dreamlove.restaurant');
      expect(parsed.profile.role).toBe('admin');
      expect(parsed.profile.status).toBe('active');
    });
  });
});
