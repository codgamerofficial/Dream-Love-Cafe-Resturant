import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  RestaurantSettings, 
  MenuItem, 
  MenuCategory, 
  GalleryItem, 
  VerifiedReview, 
  DataConflictItem,
  MenuImageVersion,
  MenuImageRecord
} from '../types';
import { 
  INITIAL_RESTAURANT_SETTINGS, 
  INITIAL_MENU_ITEMS, 
  MENU_CATEGORIES, 
  REAL_GALLERY_PHOTOS, 
  VERIFIED_REVIEWS, 
  INITIAL_DATA_CONFLICTS 
} from '../config/restaurantData';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { 
  loadLocalItemOverrides, 
  saveLocalItemOverride, 
  uploadAndSaveMenuImage,
  getImageVersionHistory,
  saveLocalImageVersion,
  saveLocalImageRecord,
  UploadProgressCallback
} from '../services/imageUploadService';
import { generateImageHash, generatePerceptualHash } from '../config/dishImageMap';

interface SettingsContextType {
  settings: RestaurantSettings;
  updateSettings: (newSettings: Partial<RestaurantSettings>) => Promise<void>;
  categories: MenuCategory[];
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<void>;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  toggleAvailability: (id: string) => Promise<void>;
  toggleFeatured: (id: string) => Promise<void>;
  uploadMenuItemPhoto: (
    menuItemId: string, 
    file: File | Blob, 
    options?: { authorName?: string; altText?: string; onProgress?: UploadProgressCallback }
  ) => Promise<{ success: boolean; imageUrl: string; imageRecord: MenuImageRecord }>;
  restoreMenuItemPhotoVersion: (menuItemId: string, version: MenuImageVersion) => Promise<void>;
  getMenuItemPhotoHistory: (menuItemId: string) => Promise<MenuImageVersion[]>;
  galleryItems: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;
  verifiedReviews: VerifiedReview[];
  dataConflicts: DataConflictItem[];
  resolveDataConflict: (id: string, chosenValue: string) => void;
  ignoreDataConflict: (id: string) => void;
  isLoading: boolean;
  refreshMenuData: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<RestaurantSettings>(INITIAL_RESTAURANT_SETTINGS);
  const [categories] = useState<MenuCategory[]>(MENU_CATEGORIES);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(REAL_GALLERY_PHOTOS);
  const [verifiedReviews, setVerifiedReviews] = useState<VerifiedReview[]>(VERIFIED_REVIEWS);
  const [dataConflicts, setDataConflicts] = useState<DataConflictItem[]>(INITIAL_DATA_CONFLICTS);
  const [isLoading, setIsLoading] = useState(false);

  // ── 1. Hydrate Menu Items with Local AsyncStorage Overrides on Mount ──
  useEffect(() => {
    async function loadPersistedLocalData() {
      try {
        const overrides = await loadLocalItemOverrides();
        if (overrides && Object.keys(overrides).length > 0) {
          setMenuItems((prev) =>
            prev.map((item) => {
              const itemOverride = overrides[item.id];
              return itemOverride ? { ...item, ...itemOverride } : item;
            })
          );
        }
      } catch (err) {
        console.warn('Notice loading local overrides:', err);
      }
    }
    loadPersistedLocalData();
  }, []);

  // ── 2. Fetch Remote Settings & Menu Items from Supabase ──
  const fetchRemoteData = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return;
    setIsLoading(true);
    try {
      // 2a. Fetch Settings
      const { data: dbSettings } = await supabase.from('restaurant_settings').select('*').single();
      if (dbSettings) {
        setSettings((prev) => ({
          ...prev,
          name: dbSettings.name || prev.name,
          tagline: dbSettings.tagline || prev.tagline,
          cuisines: dbSettings.cuisines || prev.cuisines,
          phone: dbSettings.phone || prev.phone,
          phoneSecondary: dbSettings.phone_secondary || prev.phoneSecondary,
          whatsapp: dbSettings.whatsapp || prev.whatsapp,
          email: dbSettings.email || prev.email,
          address: dbSettings.address || prev.address,
          plusCode: dbSettings.plus_code || prev.plusCode,
          googleMapsCid: dbSettings.google_maps_cid || prev.googleMapsCid,
          googleMapsUrl: dbSettings.google_maps_url || prev.googleMapsUrl,
          openingHours: dbSettings.opening_hours || prev.openingHours,
          priceRangeForTwo: dbSettings.price_range_for_two || prev.priceRangeForTwo,
          diningModes: dbSettings.dining_modes || prev.diningModes,
          googleRating: Number(dbSettings.google_rating) || prev.googleRating,
          googleReviewsCount: Number(dbSettings.google_reviews_count) || prev.googleReviewsCount,
          googleReviewsUrl: dbSettings.google_reviews_url || prev.googleReviewsUrl,
          justdialRating: Number(dbSettings.justdial_rating) || prev.justdialRating,
          justdialUrl: dbSettings.justdial_url || prev.justdialUrl,
          magicpinRating: Number(dbSettings.magicpin_rating) || prev.magicpinRating,
          magicpinUrl: dbSettings.magicpin_url || prev.magicpinUrl,
          orderInstructions: dbSettings.order_instructions || prev.orderInstructions,
          reservationInstructions: dbSettings.reservation_instructions || prev.reservationInstructions,
        }));
      }

      // 2b. Fetch Menu Items & Merge with Local Overrides
      const { data: dbMenu } = await supabase.from('menu_items').select('*').order('display_order', { ascending: true });
      const localOverrides = await loadLocalItemOverrides();

      if (dbMenu && dbMenu.length > 0) {
        const mappedMenu: MenuItem[] = dbMenu.map((item: any) => {
          const override = localOverrides[item.id] || {};
          const isRealPhoto = item.image_type === 'real_restaurant' || Boolean(item.image_verified);
          
          return {
            id: item.id,
            name: item.name,
            canonicalName: item.canonical_name || undefined,
            canonical_name: item.canonical_name || undefined,
            originalName: item.original_name || undefined,
            original_name: item.original_name || undefined,
            category: item.category_slug,
            category_id: item.category_id,
            subcategory: item.subcategory,
            description: item.description,
            price: item.price ? Number(item.price) : null,
            priceType: item.price_type || (item.price ? 'fixed' : 'owner_verification_required'),
            price_type: item.price_type || (item.price ? 'fixed' : 'owner_verification_required'),
            priceRange: item.price_range,
            portion: item.portion,
            serving_size: item.serving_size,
            image: item.image_url,
            image_url: item.image_url,
            image_type: item.image_type || (isRealPhoto ? 'real_restaurant' : 'mock_placeholder'),
            image_source: item.image_source || (isRealPhoto ? 'owner_upload' : 'temporary_generated'),
            image_license_status: item.image_license_status,
            image_verified: item.image_verified ?? isRealPhoto,
            image_replacement_required: item.image_replacement_required ?? !isRealPhoto,
            image_match_confidence: item.image_match_confidence || 'high',
            image_hash: item.image_hash || generateImageHash(item.image_url || ''),
            perceptual_hash: item.perceptual_hash || generatePerceptualHash(item.image_url || '', item.name),
            price_source: item.price_source || 'client_supplied_menu',
            price_verified: item.price_verified ?? true,
            ownerVerified: item.owner_verified ?? true,
            owner_verified: item.owner_verified ?? true,
            isAvailable: item.is_available ?? true,
            is_available: item.is_available ?? true,
            isFeatured: item.is_featured ?? false,
            is_featured: item.is_featured ?? false,
            isVeg: item.is_veg ?? false,
            is_vegetarian: item.is_veg ?? false,
            is_non_vegetarian: !item.is_veg,
            isEgg: item.is_egg ?? false,
            is_egg: item.is_egg ?? false,
            isSpicy: item.is_spicy ?? false,
            is_spicy: item.is_spicy ?? false,
            source: item.source || 'Client Menu',
            sourceUrl: item.source_url,
            dataQualityStatus: item.data_quality_status || 'verified',
            displayOrder: item.display_order ?? 0,
            sort_order: item.sort_order ?? item.display_order ?? 0,
            ...override,
          };
        });
        setMenuItems(mappedMenu);
      }
    } catch (err) {
      console.log('Remote data fetch skipped:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRemoteData();
  }, [fetchRemoteData]);

  const updateSettings = async (newSettings: Partial<RestaurantSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('restaurant_settings').update({
          phone: newSettings.phone,
          phone_secondary: newSettings.phoneSecondary,
          whatsapp: newSettings.whatsapp,
          email: newSettings.email,
          address: newSettings.address,
          opening_hours: newSettings.openingHours,
          price_range_for_two: newSettings.priceRangeForTwo,
          order_instructions: newSettings.orderInstructions,
          reservation_instructions: newSettings.reservationInstructions,
        }).match({ id: '1' });
      } catch (err) {
        console.warn('Remote settings update notice:', err);
      }
    }
  };

  const addMenuItem = async (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: `m-custom-${Date.now()}`,
    };
    setMenuItems((prev) => [...prev, newItem]);
    await saveLocalItemOverride(newItem.id, newItem);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('menu_items').insert([{
          name: item.name,
          canonical_name: item.canonicalName,
          category_slug: item.category,
          subcategory: item.subcategory,
          description: item.description,
          price: item.price,
          price_type: item.priceType,
          price_range: item.priceRange,
          portion: item.portion,
          image_url: item.image || item.image_url,
          image_type: item.image_type || 'mock_placeholder',
          image_verified: item.image_verified || false,
          is_available: item.isAvailable,
          is_featured: item.isFeatured,
          is_veg: item.isVeg,
          is_egg: item.isEgg,
          is_spicy: item.isSpicy,
          source: item.source || 'Client Menu',
          owner_verified: item.ownerVerified ?? true,
          data_quality_status: item.dataQualityStatus || 'verified',
          display_order: item.displayOrder ?? 0,
        }]);
      } catch (err) {
        console.warn('Remote menu item insert notice:', err);
      }
    }
  };

  const updateMenuItem = async (id: string, updatedFields: Partial<MenuItem>) => {
    // 1. Update React State
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );

    // 2. Persist to Local Storage
    await saveLocalItemOverride(id, updatedFields);

    // 3. Persist to Remote Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        const dbFields: any = {};
        if (updatedFields.name !== undefined) dbFields.name = updatedFields.name;
        if (updatedFields.price !== undefined) dbFields.price = updatedFields.price;
        if (updatedFields.image_url !== undefined) dbFields.image_url = updatedFields.image_url;
        if (updatedFields.image !== undefined && !dbFields.image_url) dbFields.image_url = updatedFields.image;
        if (updatedFields.image_type !== undefined) dbFields.image_type = updatedFields.image_type;
        if (updatedFields.image_source !== undefined) dbFields.image_source = updatedFields.image_source;
        if (updatedFields.image_verified !== undefined) dbFields.image_verified = updatedFields.image_verified;
        if (updatedFields.image_replacement_required !== undefined) dbFields.image_replacement_required = updatedFields.image_replacement_required;
        if (updatedFields.image_match_confidence !== undefined) dbFields.image_match_confidence = updatedFields.image_match_confidence;
        if (updatedFields.image_hash !== undefined) dbFields.image_hash = updatedFields.image_hash;
        if (updatedFields.perceptual_hash !== undefined) dbFields.perceptual_hash = updatedFields.perceptual_hash;
        if (updatedFields.isAvailable !== undefined) dbFields.is_available = updatedFields.isAvailable;
        if (updatedFields.is_available !== undefined) dbFields.is_available = updatedFields.is_available;
        if (updatedFields.isFeatured !== undefined) dbFields.is_featured = updatedFields.isFeatured;
        if (updatedFields.is_featured !== undefined) dbFields.is_featured = updatedFields.is_featured;

        if (Object.keys(dbFields).length > 0) {
          dbFields.updated_at = new Date().toISOString();
          await supabase.from('menu_items').update(dbFields).eq('id', id);
        }
      } catch (err) {
        console.warn('Remote menu item update notice:', err);
      }
    }
  };

  /**
   * Real Permanent Image Upload & Replace Handler
   */
  const uploadMenuItemPhoto = async (
    menuItemId: string,
    file: File | Blob,
    options?: { authorName?: string; altText?: string; onProgress?: UploadProgressCallback }
  ) => {
    const item = menuItems.find((i) => i.id === menuItemId);
    if (!item) throw new Error('Menu item not found.');

    const oldUrl = item.image_url || item.image;

    // Call persistent storage pipeline
    const uploadResult = await uploadAndSaveMenuImage({
      file,
      menuItemId,
      dishName: item.name,
      authorName: options?.authorName,
      altText: options?.altText,
      onProgress: options?.onProgress,
    });

    const updatedFields: Partial<MenuItem> = {
      image_url: uploadResult.imageUrl,
      image: uploadResult.imageUrl,
      image_type: 'real_restaurant',
      image_source: 'owner_upload',
      image_verified: true,
      image_replacement_required: false,
      image_match_confidence: 'high',
      image_hash: uploadResult.imageRecord.image_hash,
      perceptual_hash: uploadResult.imageRecord.perceptual_hash,
      previous_image_url: oldUrl,
      replacement_date: new Date().toISOString(),
      replaced_by: options?.authorName || 'Restaurant Owner',
    };

    // Update in-memory state and persistent storage
    setMenuItems((prev) =>
      prev.map((it) => (it.id === menuItemId ? { ...it, ...updatedFields } : it))
    );
    await saveLocalItemOverride(menuItemId, updatedFields);

    return {
      success: true,
      imageUrl: uploadResult.imageUrl,
      imageRecord: uploadResult.imageRecord,
    };
  };

  /**
   * Restore Previous Image Version Handler
   */
  const restoreMenuItemPhotoVersion = async (menuItemId: string, version: MenuImageVersion) => {
    const item = menuItems.find((i) => i.id === menuItemId);
    const oldUrl = item?.image_url || item?.image;

    const updatedFields: Partial<MenuItem> = {
      image_url: version.image_url,
      image: version.image_url,
      image_type: version.image_type,
      image_source: version.image_source || 'owner_upload',
      image_verified: version.image_type === 'real_restaurant',
      image_replacement_required: version.image_type !== 'real_restaurant',
      image_hash: generateImageHash(version.image_url),
      perceptual_hash: generatePerceptualHash(version.image_url, item?.name || ''),
      previous_image_url: oldUrl,
      replacement_date: new Date().toISOString(),
      replaced_by: version.replaced_by || 'Restored Version',
    };

    setMenuItems((prev) =>
      prev.map((it) => (it.id === menuItemId ? { ...it, ...updatedFields } : it))
    );
    await saveLocalItemOverride(menuItemId, updatedFields);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('menu_items')
          .update({
            image_url: version.image_url,
            image_type: version.image_type,
            image_verified: version.image_type === 'real_restaurant',
            image_replacement_required: version.image_type !== 'real_restaurant',
            updated_at: new Date().toISOString(),
          })
          .eq('id', menuItemId);
      } catch (err) {
        console.warn('Remote version restore notice:', err);
      }
    }
  };

  const getMenuItemPhotoHistory = async (menuItemId: string): Promise<MenuImageVersion[]> => {
    return getImageVersionHistory(menuItemId);
  };

  const deleteMenuItem = async (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
    await saveLocalItemOverride(id, { isAvailable: false, is_available: false });
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('menu_items').delete().eq('id', id);
      } catch (err) {
        console.warn('Remote delete menu item notice:', err);
      }
    }
  };

  const toggleAvailability = async (id: string) => {
    const item = menuItems.find((i) => i.id === id);
    if (!item) return;
    const newStatus = !item.isAvailable;
    await updateMenuItem(id, { isAvailable: newStatus, is_available: newStatus });
  };

  const toggleFeatured = async (id: string) => {
    const item = menuItems.find((i) => i.id === id);
    if (!item) return;
    const newStatus = !item.isFeatured;
    await updateMenuItem(id, { isFeatured: newStatus, is_featured: newStatus });
  };

  const addGalleryItem = async (item: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = {
      ...item,
      id: `g-custom-${Date.now()}`,
    };
    setGalleryItems((prev) => [newItem, ...prev]);
  };

  const deleteGalleryItem = async (id: string) => {
    setGalleryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const resolveDataConflict = (id: string, chosenValue: string) => {
    setDataConflicts((prev) =>
      prev.map((conflict) =>
        conflict.id === id
          ? {
              ...conflict,
              currentValue: chosenValue,
              status: 'resolved',
              resolvedAt: new Date().toISOString(),
            }
          : conflict
      )
    );

    if (id === 'conflict-phone') {
      updateSettings({ phone: chosenValue });
    } else if (id === 'conflict-hours') {
      updateSettings({ openingHours: chosenValue });
    }
  };

  const ignoreDataConflict = (id: string) => {
    setDataConflicts((prev) =>
      prev.map((conflict) =>
        conflict.id === id ? { ...conflict, status: 'ignored' } : conflict
      )
    );
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        categories,
        menuItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleAvailability,
        toggleFeatured,
        uploadMenuItemPhoto,
        restoreMenuItemPhotoVersion,
        getMenuItemPhotoHistory,
        galleryItems,
        addGalleryItem,
        deleteGalleryItem,
        verifiedReviews,
        dataConflicts,
        resolveDataConflict,
        ignoreDataConflict,
        isLoading,
        refreshMenuData: fetchRemoteData,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
