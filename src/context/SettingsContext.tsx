import React, { createContext, useContext, useState, useEffect } from 'react';
import { RestaurantSettings, MenuItem, MenuCategory, GalleryItem, CustomerStory } from '../types';
import { 
  INITIAL_RESTAURANT_SETTINGS, 
  INITIAL_MENU_ITEMS, 
  MENU_CATEGORIES, 
  INITIAL_GALLERY_ITEMS, 
  INITIAL_CUSTOMER_STORIES 
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
  customerStories: CustomerStory[];
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<RestaurantSettings>(INITIAL_RESTAURANT_SETTINGS);
  const [categories] = useState<MenuCategory[]>(MENU_CATEGORIES);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(INITIAL_GALLERY_ITEMS);
  const [customerStories] = useState<CustomerStory[]>(INITIAL_CUSTOMER_STORIES);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch remote settings & menu items if Supabase is connected
  useEffect(() => {
    async function fetchData() {
      if (!isSupabaseConfigured || !supabase) return;
      setIsLoading(true);
      try {
        const { data: dbSettings } = await supabase.from('restaurant_settings').select('*').single();
        if (dbSettings) {
          setSettings({
            name: dbSettings.name,
            tagline: dbSettings.tagline,
            cuisines: dbSettings.cuisines,
            phone: dbSettings.phone,
            whatsapp: dbSettings.whatsapp,
            address: dbSettings.address,
            plusCode: dbSettings.plus_code,
            googleMapsCid: dbSettings.google_maps_cid,
            googleMapsUrl: dbSettings.google_maps_url,
            openingHours: dbSettings.opening_hours,
            priceRangeForTwo: dbSettings.price_range_for_two,
            diningModes: dbSettings.dining_modes,
            googleRating: Number(dbSettings.google_rating) || 4.1,
            googleReviewsCount: Number(dbSettings.google_reviews_count) || 96,
            googleReviewsUrl: dbSettings.google_reviews_url || dbSettings.google_maps_url,
            orderInstructions: dbSettings.order_instructions || INITIAL_RESTAURANT_SETTINGS.orderInstructions,
            reservationInstructions: dbSettings.reservation_instructions || INITIAL_RESTAURANT_SETTINGS.reservationInstructions,
          });
        }

        const { data: dbMenu } = await supabase.from('menu_items').select('*').order('display_order', { ascending: true });
        if (dbMenu && dbMenu.length > 0) {
          const mappedMenu: MenuItem[] = dbMenu.map((item: any) => ({
            id: item.id,
            name: item.name,
            category: item.category_slug,
            description: item.description,
            price: item.price ? Number(item.price) : undefined,
            priceRange: item.price_range,
            portion: item.portion,
            image: item.image_url,
            isAvailable: item.is_available,
            isFeatured: item.is_featured,
            isVeg: item.is_veg,
            displayOrder: item.display_order,
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
        whatsapp: newSettings.whatsapp,
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
        category_slug: item.category,
        description: item.description,
        price: item.price,
        price_range: item.priceRange,
        portion: item.portion,
        image_url: item.image,
        is_available: item.isAvailable,
        is_featured: item.isFeatured,
        is_veg: item.isVeg,
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
        customerStories,
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
