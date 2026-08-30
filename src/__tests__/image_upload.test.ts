import AsyncStorage from '@react-native-async-storage/async-storage';
jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

import { 
  validateImageFile, 
  generateCollisionSafeName, 
  saveLocalItemOverride, 
  loadLocalItemOverrides, 
  uploadAndSaveMenuImage,
  saveLocalImageRecord,
  saveLocalImageVersion,
  getImageVersionHistory,
  STORAGE_KEYS,
  MAX_FILE_SIZE_BYTES
} from '../services/imageUploadService';
import { INITIAL_MENU_ITEMS } from '../config/restaurantData';

describe('Menu Image Upload, Replace & Persistence Pipeline', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  describe('1. Image File Validation', () => {
    test('accepts valid JPEG, PNG, WebP, and AVIF files under 10MB', () => {
      expect(validateImageFile({ name: 'biryani.jpg', type: 'image/jpeg', size: 2 * 1024 * 1024 }).valid).toBe(true);
      expect(validateImageFile({ name: 'chicken_65.png', type: 'image/png', size: 4 * 1024 * 1024 }).valid).toBe(true);
      expect(validateImageFile({ name: 'salad.webp', type: 'image/webp', size: 500 * 1024 }).valid).toBe(true);
      expect(validateImageFile({ name: 'mocktail.avif', type: 'image/avif', size: 1 * 1024 * 1024 }).valid).toBe(true);
    });

    test('rejects files larger than 10MB with friendly error', () => {
      const oversizedFile = { name: 'huge_dish.jpg', type: 'image/jpeg', size: 12 * 1024 * 1024 };
      const result = validateImageFile(oversizedFile);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('under 10 MB');
    });

    test('rejects unsupported file types (executables, pdfs, scripts)', () => {
      expect(validateImageFile({ name: 'malware.exe', type: 'application/x-msdownload', size: 1000 }).valid).toBe(false);
      expect(validateImageFile({ name: 'document.pdf', type: 'application/pdf', size: 1000 }).valid).toBe(false);
      expect(validateImageFile({ name: 'script.js', type: 'text/javascript', size: 1000 }).valid).toBe(false);
    });
  });

  describe('2. Collision-Safe Path & File Naming', () => {
    test('generates unique collision-safe filenames with timestamp and random salt', () => {
      const name1 = generateCollisionSafeName('display', 'webp');
      const name2 = generateCollisionSafeName('display', 'webp');
      expect(name1).not.toBe(name2);
      expect(name1).toMatch(/^display-\d+-[a-z0-9]+\.webp$/);
    });
  });

  describe('3. Local Storage Persistence & Survival Across Restarts', () => {
    test('persists item overrides and retrieves them accurately', async () => {
      const itemId = 'm-biryani-1';
      const fakeUrl = 'https://supabase-storage.local/menu-images/restaurant-1/m-biryani-1/display-test.webp';

      await saveLocalItemOverride(itemId, {
        image_url: fakeUrl,
        image_type: 'real_restaurant',
        image_source: 'owner_upload',
        image_verified: true,
        image_replacement_required: false,
      });

      const loadedOverrides = await loadLocalItemOverrides();
      expect(loadedOverrides[itemId]).toBeDefined();
      expect(loadedOverrides[itemId].image_url).toBe(fakeUrl);
      expect(loadedOverrides[itemId].image_type).toBe('real_restaurant');
      expect(loadedOverrides[itemId].image_verified).toBe(true);
      expect(loadedOverrides[itemId].image_replacement_required).toBe(false);
    });

    test('retains version history for dish rollbacks', async () => {
      const itemId = 'm-chicken-65';
      const version1 = {
        id: 'v1',
        menu_item_id: itemId,
        image_url: 'https://images.unsplash.com/photo-v1.webp',
        image_type: 'real_restaurant' as const,
        is_current: false,
        replaced_by: 'Photographer John',
        replaced_at: new Date('2026-08-01').toISOString(),
      };
      const version2 = {
        id: 'v2',
        menu_item_id: itemId,
        image_url: 'https://images.unsplash.com/photo-v2.webp',
        image_type: 'real_restaurant' as const,
        is_current: true,
        replaced_by: 'Owner Admin',
        replaced_at: new Date('2026-08-15').toISOString(),
      };

      await saveLocalImageVersion(version1);
      await saveLocalImageVersion(version2);

      const history = await getImageVersionHistory(itemId);
      expect(history.length).toBe(2);
      expect(history[0].id).toBe('v2');
      expect(history[0].is_current).toBe(true);
      expect(history[1].id).toBe('v1');
      expect(history[1].is_current).toBe(false);
    });
  });

  describe('4. Multi-Item Independent Photo Replacement Test', () => {
    const testDishes = [
      { id: 'm-biryani-1', name: 'Chicken Biryani' },
      { id: 'm-biryani-2', name: 'Mutton Biryani' },
      { id: 'm-starter-nonveg-1', name: 'Chicken 65' },
      { id: 'm-salad-1', name: 'Cucumber Salad' },
      { id: 'm-mocktail-1', name: 'Blue Lemonade' },
    ];

    test('replaces and independently persists distinct photos for each test dish', async () => {
      for (let i = 0; i < testDishes.length; i++) {
        const dish = testDishes[i];
        const dummyFile = {
          name: `${dish.name.toLowerCase().replace(/\s+/g, '_')}_authentic.jpg`,
          type: 'image/jpeg',
          size: 1.5 * 1024 * 1024,
        };

        const result = await uploadAndSaveMenuImage({
          file: dummyFile as any,
          menuItemId: dish.id,
          dishName: dish.name,
          authorName: 'Restaurant Head Chef',
        });

        expect(result.success).toBe(true);
        expect(result.imageUrl).toBeDefined();
        expect(result.imageRecord.image_type).toBe('real_restaurant');
        expect(result.imageRecord.image_verified).toBe(true);
        expect(result.imageRecord.replacement_required).toBe(false);
      }

      // Verify all overrides are persisted in AsyncStorage and isolated
      const overrides = await loadLocalItemOverrides();
      expect(Object.keys(overrides).length).toBe(testDishes.length);

      const savedUrls = new Set();
      for (const dish of testDishes) {
        const override = overrides[dish.id];
        expect(override).toBeDefined();
        expect(override.image_type).toBe('real_restaurant');
        expect(override.image_verified).toBe(true);
        expect(override.image_replacement_required).toBe(false);
        expect(savedUrls.has(override.image_url)).toBe(false);
        savedUrls.add(override.image_url);
      }
    });
  });
});
