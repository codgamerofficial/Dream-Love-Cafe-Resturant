export type CategorySlug = 
  | 'chef-specials'
  | 'tandoori-kebabs'
  | 'biryani-rice'
  | 'starters-bites'
  | 'breads-kulchas'
  | 'chinese-noodles-rice'
  | 'main-course-chicken-mutton'
  | 'main-course-veg'
  | 'seafood-fish'
  | 'soups'
  | 'beverages-shakes-mocktails'
  | 'all';

export type MenuDataQualityStatus = 'verified' | 'owner_review_required' | 'source_conflict';
export type DietaryType = 'veg' | 'non-veg' | 'egg';
export type PriceType = 'fixed' | 'portion_based' | 'size_based' | 'owner_verification_required' | 'as_per_size' | 'unpriced';
export type ImageType = 'real_restaurant' | 'mock_placeholder' | 'missing';
export type ImageSource = 'owner' | 'client' | 'authorized' | 'temporary_generated' | 'uploaded' | 'external';
export type ImageLicenseStatus = 'verified' | 'owner_provided' | 'owner_authorized' | 'licensed' | 'temporary' | 'pending_verification' | 'missing';

export interface MenuCategory {
  id: string;
  slug: CategorySlug;
  name: string;
  description: string;
  icon: string;
  displayOrder: number;
  image?: string;
  isActive?: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  canonical_name?: string;       // Normalized name if OCR/transcription spelling exists
  canonicalName?: string;        // Backward compatible alias
  original_name?: string;        // Raw transcribed name
  originalName?: string;
  slug?: string;
  category: CategorySlug;
  category_id?: string;
  subcategory?: string;          // e.g. "Mocktail", "Shakes", "Fresh Juice", "Tandoori"
  description?: string;
  price?: number | null;         // Explicit price in INR, null if unpriced
  price_type?: PriceType;        // 'fixed' | 'portion_based' | 'size_based' | 'owner_verification_required' | 'as_per_size' | 'unpriced'
  priceType?: PriceType;
  priceRange?: string;           // e.g. "₹220–₹260"
  portion?: string;              // e.g. "Half / Full", "As per size", "Full"
  serving_size?: string;
  
  // Real / Mock Food Image Metadata (3-State System)
  image_url?: string;            // URL of the image
  image?: string;                // Backward compatible alias
  image_type?: ImageType;        // 'real_restaurant' | 'mock_placeholder' | 'missing'
  imageType?: ImageType;
  image_source?: string;         // 'owner' | 'client' | 'authorized' | 'temporary_generated' | 'uploaded' | 'external'
  image_source_url?: string;
  image_license_status?: ImageLicenseStatus;
  image_verified?: boolean;      // TRUE only when authentic restaurant photo
  image_replacement_required?: boolean; // TRUE for temporary mock placeholders
  imageReplacementRequired?: boolean;
  
  // Image Versioning & Rollback
  previous_image_url?: string;
  previousImageUrl?: string;
  replacement_date?: string;
  replacementDate?: string;
  replaced_by?: string;
  replacedBy?: string;
  
  // Real Price Metadata
  price_source?: string;         // 'client_supplied_menu' | 'owner_verified'
  price_source_url?: string;
  price_verified?: boolean;
  owner_verified?: boolean;
  ownerVerified?: boolean;
  
  // Dietary & Flags
  is_available?: boolean;
  isAvailable: boolean;
  is_featured?: boolean;
  isFeatured: boolean;
  is_vegetarian?: boolean;
  isVeg: boolean;
  is_non_vegetarian?: boolean;
  is_egg?: boolean;
  isEgg?: boolean;
  is_spicy?: boolean;
  isSpicy?: boolean;
  dietary_type?: DietaryType;
  
  // Metadata & Sorting
  source?: 'Client Menu' | 'Storefront' | 'Owner Verified' | 'Online Listing';
  sourceUrl?: string;
  dataQualityStatus?: MenuDataQualityStatus;
  displayOrder: number;
  sort_order?: number;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  selectedPortion?: string;
  itemTotal?: number;
  specialInstructions?: string;
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

export type ReservationStatus = 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled' | 'no_show';

export interface Reservation {
  id?: string;
  created_at?: string;
  name: string;
  phone: string;
  email?: string;
  date: string;              // YYYY-MM-DD
  time: string;              // HH:MM
  guests: number;
  special_request?: string;
  status: ReservationStatus;
  reference_code?: string;
  source?: string;
}

export type OrderStatus = 'new' | 'accepted' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'pay_on_delivery' | 'pay_at_counter';

export interface DatabaseOrder {
  id?: string;
  created_at?: string;
  customer_name: string;
  customer_phone: string;
  order_type: OrderType;
  delivery_address?: string;
  status: OrderStatus;
  payment_status?: PaymentStatus;
  subtotal: number;
  tax?: number;
  delivery_fee?: number;
  discount?: number;
  total_amount: number;
  items: {
    menu_item_id?: string;
    name: string;
    quantity: number;
    price?: number;
    portion?: string;
    special_instruction?: string;
  }[];
  notes?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Storefront' | 'Interior' | 'Dining Area' | 'Food' | 'Beverages' | 'Ambience';
  image_url: string;
  thumbnail_url?: string;
  caption?: string;
  alt_text: string;
  source: 'Client Real Photo' | 'Verified Storefront' | 'Owner Upload';
  source_url?: string;
  owner_verified: boolean;
  is_featured: boolean;
  display_order: number;
}

export interface VerifiedReview {
  id: string;
  source: 'Google' | 'Justdial' | 'Magicpin' | 'Zomato';
  reviewerName: string;
  rating: number;
  reviewText: string;
  reviewDate: string;
  externalReviewUrl: string;
  isFeatured: boolean;
  isVerified: boolean;
  aspects?: string[];           // e.g. ["Biryani", "Ambience", "Pocket Friendly"]
}

export interface DataConflictItem {
  id: string;
  field: string;
  title: string;
  sourceA: string;
  valueA: string;
  sourceB: string;
  valueB: string;
  currentValue: string;
  status: 'pending_review' | 'resolved' | 'ignored';
  resolvedAt?: string;
}

export interface RestaurantHoursDay {
  day: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
  specialNote?: string;
}

export interface RestaurantSettings {
  name: string;
  tagline: string;
  cuisines: string[];
  phone: string;
  phoneSecondary?: string;
  whatsapp: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  plusCode: string;
  latitude: number;
  longitude: number;
  googleMapsCid: string;
  googleMapsUrl: string;
  openingHours: string;
  weeklyHours?: RestaurantHoursDay[];
  priceRangeForTwo: string;
  diningModes: string[];
  reservationEnabled: boolean;
  onlineOrderingEnabled: boolean;
  deliveryEnabled: boolean;
  takeawayEnabled: boolean;
  dineInEnabled: boolean;
  showSampleBadges?: boolean;    // Admin toggle for subtle "Sample image" badge
  googleRating: number;
  googleReviewsCount: number;
  googleReviewsUrl: string;
  justdialRating?: number;
  justdialUrl?: string;
  magicpinRating?: number;
  magicpinUrl?: string;
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
