export type CategorySlug = 
  | 'chef-specials'
  | 'tandoori-kebabs'
  | 'starters-bites'
  | 'breads-kulchas'
  | 'chinese-noodles-rice'
  | 'beverages-shakes-mocktails';

export interface MenuCategory {
  id: string;
  slug: CategorySlug;
  name: string;
  description: string;
  icon: string;
  displayOrder: number;
  image?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: CategorySlug;
  description?: string;
  price?: number;            // Explicit price in INR, undefined if unpriced ("Ask for price")
  priceRange?: string;       // e.g. "₹220–₹260"
  portion?: string;          // e.g. "Half / Full", "As per size"
  image?: string;            // URL or placeholder configuration
  isAvailable: boolean;
  isFeatured: boolean;
  isVeg: boolean;
  displayOrder: number;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  selectedPortion?: string;
  itemTotal?: number;
}

export type OrderType = 'dine-in' | 'takeaway' | 'delivery';

export interface OrderCustomerDetails {
  name: string;
  phone: string;
  orderType: OrderType;
  tableNumber?: string;
  deliveryAddress?: string;
  specialInstructions?: string;
}

export type ReservationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Reservation {
  id?: string;
  created_at?: string;
  name: string;
  phone: string;
  date: string;              // YYYY-MM-DD
  time: string;              // HH:MM
  guests: number;
  special_request?: string;
  status: ReservationStatus;
}

export type OrderStatus = 'new' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface DatabaseOrder {
  id?: string;
  created_at?: string;
  customer_name: string;
  customer_phone: string;
  order_type: OrderType;
  status: OrderStatus;
  total_amount: number;
  items: {
    name: string;
    quantity: number;
    price?: number;
    portion?: string;
  }[];
  notes?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image_url: string;
  caption?: string;
  is_featured: boolean;
  display_order: number;
}

export interface RestaurantSettings {
  name: string;
  tagline: string;
  cuisines: string[];
  phone: string;
  whatsapp: string;
  address: string;
  plusCode: string;
  googleMapsCid: string;
  googleMapsUrl: string;
  openingHours: string;
  priceRangeForTwo: string;
  diningModes: string[];
  googleRating: number;
  googleReviewsCount: number;
  googleReviewsUrl: string;
  instagramUrl?: string;
  facebookUrl?: string;
  orderInstructions: string;
  reservationInstructions: string;
}

export interface CustomerStory {
  id: string;
  author: string;
  date: string;
  rating: number;
  text: string;
  source: 'Customer Story';
}
