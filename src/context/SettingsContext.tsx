import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  RestaurantSettings, 
  MenuItem, 
  MenuCategory, 
  GalleryItem, 
  VerifiedReview,
  DataConflictItem 
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
  galleryItems: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;
  verifiedReviews: VerifiedReview[];
  dataConflicts: DataConflictItem[];
  resolveDataConflict: (id: string, chosenValue: string) => void;
  ignoreDataConflict: (id: string) => void;
  isLoading: boolean;
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

  // Fetch remote settings & menu items if Supabase is connected
  useEffect(() => {
    async function fetchData() {
      if (!isSupabaseConfigured || !supabase) return;
      setIsLoading(true);
      try {
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

        const { data: dbMenu } = await supabase.from('menu_items').select('*').order('display_order', { ascending: true });
        if (dbMenu && dbMenu.length > 0) {
          const mappedMenu: MenuItem[] = dbMenu.map((item: any) => ({
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
            image_source: item.image_source,
            image_license_status: item.image_license_status,
            image_verified: item.image_verified ?? false,
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
          }));
          setMenuItems(mappedMenu);
        }
      } catch (err) {
        console.log('Using static restaurant data fallback:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const updateSettings = async (newSettings: Partial<RestaurantSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    if (isSupabaseConfigured && supabase) {
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
    }
  };

  const addMenuItem = async (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: `m-custom-${Date.now()}`,
    };
    setMenuItems((prev) => [...prev, newItem]);
    if (isSupabaseConfigured && supabase) {
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
        image_url: item.image,
        is_available: item.isAvailable,
        is_featured: item.isFeatured,
        is_veg: item.isVeg,
        is_egg: item.isEgg,
        is_spicy: item.isSpicy,
        source: item.source,
        owner_verified: item.ownerVerified,
        data_quality_status: item.dataQualityStatus,
        display_order: item.displayOrder,
      }]);
    }
  };

  const updateMenuItem = async (id: string, updatedFields: Partial<MenuItem>) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
    if (isSupabaseConfigured && supabase) {
      await supabase.from('menu_items').update(updatedFields).eq('id', id);
    }
  };

  const deleteMenuItem = async (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
    if (isSupabaseConfigured && supabase) {
      await supabase.from('menu_items').delete().eq('id', id);
    }
  };

  const toggleAvailability = async (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  const toggleFeatured = async (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFeatured: !item.isFeatured } : item
      )
    );
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

    // Automatically sync chosen setting if relevant
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
        galleryItems,
        addGalleryItem,
        deleteGalleryItem,
        verifiedReviews,
        dataConflicts,
        resolveDataConflict,
        ignoreDataConflict,
        isLoading,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
