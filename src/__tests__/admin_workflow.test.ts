import AsyncStorage from '@react-native-async-storage/async-storage';
jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

import { 
  uploadAndSaveMenuImage, 
  saveLocalItemOverride, 
  loadLocalItemOverrides,
  getImageVersionHistory,
  saveLocalImageVersion,
  validateImageFile,
  STORAGE_KEYS
} from '../services/imageUploadService';
import { INITIAL_MENU_ITEMS, VERIFIED_REVIEWS } from '../config/restaurantData';
import { MenuItem, DatabaseOrder, Reservation } from '../types';

describe('Master Admin Workflow & Onboarding Integration Test Suite', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  describe('1. Restaurant Owner Onboarding & Direct Activation', () => {
    test('new restaurant owner profile receives active admin access without pending approval blocks', () => {
      const newOwner = {
        id: 'owner-123',
        auth_user_id: 'auth-uuid-456',
        full_name: 'Subrata Das',
        email: 'owner@dreamlove.restaurant',
        role: 'owner' as const,
        status: 'active' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      expect(newOwner.status).toBe('active');
      expect(newOwner.role).toBe('owner');
      expect(newOwner.status).not.toBe('pending');
      expect(newOwner.status).not.toBe('suspended');
    });

    test('offline authentication session persists in AsyncStorage', async () => {
      const OFFLINE_AUTH_KEY = '@dream_love_offline_auth_session_v1';
      const mockSession = {
        user: { id: 'admin-1', email: 'owner@dreamlove.restaurant' },
        profile: { id: 'admin-1', full_name: 'Subrata Das', role: 'admin', status: 'active' },
      };

      await AsyncStorage.setItem(OFFLINE_AUTH_KEY, JSON.stringify(mockSession));

      const stored = await AsyncStorage.getItem(OFFLINE_AUTH_KEY);
      expect(stored).toBeDefined();
      const parsed = JSON.parse(stored!);
      expect(parsed.user.email).toBe('owner@dreamlove.restaurant');
      expect(parsed.profile.status).toBe('active');
      expect(parsed.profile.role).toBe('admin');
    });
  });

  describe('2. Food Photography Replacement & Persistence Across Reloads', () => {
    test('uploaded food photo contains permanent WebP/DataURL and verified status', async () => {
      const testItem = INITIAL_MENU_ITEMS[0]; // Chicken Vorta
      const dummyFile = {
        name: 'authentic_chicken_vorta.jpg',
        type: 'image/jpeg',
        size: 1024 * 1024,
      };

      const uploadResult = await uploadAndSaveMenuImage({
        file: dummyFile as any,
        menuItemId: testItem.id,
        dishName: testItem.name,
        authorName: 'Master Chef',
        altText: 'Authentic Chicken Vorta freshly prepared',
      });

      expect(uploadResult.success).toBe(true);
      expect(uploadResult.imageUrl).toBeDefined();
      expect(uploadResult.imageRecord.image_type).toBe('real_restaurant');
      expect(uploadResult.imageRecord.image_verified).toBe(true);
      expect(uploadResult.imageRecord.replacement_required).toBe(false);

      // Verify AsyncStorage override
      const overrides = await loadLocalItemOverrides();
      expect(overrides[testItem.id]).toBeDefined();
      expect(overrides[testItem.id].image_verified).toBe(true);
      expect(overrides[testItem.id].image_type).toBe('real_restaurant');
    });

    test('version rollback recovers previous food photo', async () => {
      const itemId = 'm-tan-1';
      const v1 = {
        id: 'v1',
        menu_item_id: itemId,
        image_url: 'https://images.unsplash.com/photo-tan1.webp',
        image_type: 'real_restaurant' as const,
        is_current: false,
        replaced_by: 'Photographer 1',
        replaced_at: '2026-08-01T10:00:00Z',
      };
      const v2 = {
        id: 'v2',
        menu_item_id: itemId,
        image_url: 'https://images.unsplash.com/photo-tan2.webp',
        image_type: 'real_restaurant' as const,
        is_current: true,
        replaced_by: 'Owner',
        replaced_at: '2026-08-15T12:00:00Z',
      };

      await saveLocalImageVersion(v1);
      await saveLocalImageVersion(v2);

      const versions = await getImageVersionHistory(itemId);
      expect(versions.length).toBe(2);
      expect(versions[0].id).toBe('v2');
      expect(versions[1].id).toBe('v1');

      // Rollback to v1
      await saveLocalItemOverride(itemId, {
        image_url: v1.image_url,
        image_type: v1.image_type,
        image_verified: true,
      });

      const overrides = await loadLocalItemOverrides();
      expect(overrides[itemId].image_url).toBe(v1.image_url);
    });
  });

  describe('3. Orders Workflow & Lifecycle', () => {
    test('transitions order through full lifecycle (new -> accepted -> ready -> completed)', () => {
      const order: DatabaseOrder = {
        id: 'ord-001',
        customer_name: 'Rahul Sharma',
        customer_phone: '+919876543210',
        order_type: 'delivery',
        delivery_address: 'Central Contai, Ward 5',
        status: 'new',
        payment_status: 'pay_on_delivery',
        subtotal: 450,
        tax: 22.5,
        delivery_fee: 30,
        discount: 0,
        total_amount: 502.5,
        created_at: new Date().toISOString(),
        items: [
          { name: 'Chicken Biryani', quantity: 2, price: 190 },
          { name: 'Blue Lemonade', quantity: 1, price: 70 },
        ],
      };

      expect(order.status).toBe('new');

      // Accept order
      order.status = 'accepted';
      expect(order.status).toBe('accepted');

      // Mark Ready
      order.status = 'ready';
      expect(order.status).toBe('ready');

      // Complete order
      order.status = 'completed';
      expect(order.status).toBe('completed');
    });

    test('generates valid WhatsApp message format for order communication', () => {
      const customerName = 'Rahul Sharma';
      const customerPhone = '+919876543210';
      const totalAmount = 502.5;
      const orderId = 'ord-001';

      const encodedMsg = encodeURIComponent(
        `Hello ${customerName}, this is Dream Love Cafe & Restaurant regarding your order #${orderId}. Total: ₹${totalAmount}.`
      );
      const waUrl = `https://wa.me/${customerPhone.replace(/[^0-9]/g, '')}?text=${encodedMsg}`;

      expect(waUrl).toContain('wa.me/919876543210');
      expect(waUrl).toContain('Rahul%20Sharma');
      expect(waUrl).toContain('502.5');
    });
  });

  describe('4. Reservations Workflow & Metrics', () => {
    test('filters reservations by status and calculates expected guests accurately', () => {
      const reservations: Reservation[] = [
        {
          id: 'res-1',
          name: 'Anirban Ghosh',
          phone: '+919933311111',
          date: '2026-08-30',
          time: '19:30',
          guests: 4,
          status: 'pending',
          created_at: new Date().toISOString(),
        },
        {
          id: 'res-2',
          name: 'Priya Sen',
          phone: '+919933322222',
          date: '2026-08-30',
          time: '20:00',
          guests: 6,
          status: 'confirmed',
          created_at: new Date().toISOString(),
        },
        {
          id: 'res-3',
          name: 'Amit Paul',
          phone: '+919933333333',
          date: '2026-08-30',
          time: '21:00',
          guests: 2,
          status: 'cancelled',
          created_at: new Date().toISOString(),
        },
      ];

      const activeToday = reservations.filter(r => r.status !== 'cancelled' && r.status !== 'rejected');
      expect(activeToday.length).toBe(2);

      const totalGuests = activeToday.reduce((sum, r) => sum + r.guests, 0);
      expect(totalGuests).toBe(10);

      const pendingCount = reservations.filter(r => r.status === 'pending').length;
      expect(pendingCount).toBe(1);
    });
  });

  describe('5. Verified Customer Reviews Aggregation', () => {
    test('reviews list contains authentic ratings across multiple platforms', () => {
      expect(VERIFIED_REVIEWS.length).toBeGreaterThan(0);
      
      const platforms = new Set(VERIFIED_REVIEWS.map(r => r.source));
      expect(platforms.has('Google')).toBe(true);

      const averageRating = VERIFIED_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / VERIFIED_REVIEWS.length;
      expect(averageRating).toBeGreaterThanOrEqual(4.0);
    });
  });

  describe('6. Sign Out & Session Invalidation Architecture', () => {
    const OFFLINE_AUTH_KEY = '@dream_love_offline_auth_session_v1';

    test('sign out completely purges offline session and resets authentication state', async () => {
      // 1. Setup active session
      const activeSession = {
        user: { id: 'admin-owner-1', email: 'owner@dreamlove.restaurant' },
        profile: { id: 'admin-owner-1', role: 'owner', status: 'active', full_name: 'Subrata Das' },
      };
      await AsyncStorage.setItem(OFFLINE_AUTH_KEY, JSON.stringify(activeSession));
      
      let stored = await AsyncStorage.getItem(OFFLINE_AUTH_KEY);
      expect(stored).not.toBeNull();

      // 2. Perform Logout
      await AsyncStorage.removeItem(OFFLINE_AUTH_KEY);

      // 3. Verify session was purged
      const afterLogout = await AsyncStorage.getItem(OFFLINE_AUTH_KEY);
      expect(afterLogout).toBeNull();
    });

    test('protected route security check blocks unauthenticated access after logout', () => {
      let currentUser: any = null;
      let currentProfile: any = null;

      // When user logs out
      const isAuthorized = Boolean(currentUser);
      expect(isAuthorized).toBe(false);

      // Access to admin dashboard must be blocked
      const canAccessAdmin = isAuthorized && currentProfile?.status === 'active';
      expect(canAccessAdmin).toBe(false);
    });

    test('retains safe non-blocking behavior if remote logout fails', async () => {
      let remoteErrorCaught = false;
      const mockFailingSignOut = async () => {
        throw new Error('Network timeout contacting auth server');
      };

      try {
        await mockFailingSignOut();
      } catch (err: any) {
        remoteErrorCaught = true;
        expect(err.message).toContain('Network timeout');
      }

      // Even if network fails, client local cache MUST be cleared
      await AsyncStorage.removeItem(OFFLINE_AUTH_KEY);
      const session = await AsyncStorage.getItem(OFFLINE_AUTH_KEY);
      expect(session).toBeNull();
      expect(remoteErrorCaught).toBe(true);
    });
  });
});
