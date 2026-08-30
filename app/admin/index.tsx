import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  useWindowDimensions, 
  Platform,
  ActivityIndicator,
  Linking,
  Modal,
  Pressable
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { 
  Shield, 
  Lock, 
  LogOut, 
  Calendar, 
  Utensils, 
  Image as ImageIcon, 
  Settings, 
  CheckCircle, 
  XCircle, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  Sparkles, 
  AlertTriangle, 
  AlertCircle,
  CheckCircle2, 
  HelpCircle, 
  Clock, 
  Phone, 
  Search, 
  Camera, 
  Filter, 
  RefreshCw, 
  RotateCcw, 
  ExternalLink,
  Layers,
  ArrowUpRight,
  Users,
  ShoppingBag,
  Star,
  MapPin,
  Compass,
  Check,
  X,
  UserCheck,
  UserX,
  UserPlus,
  MessageSquare,
  Upload,
  History,
  UploadCloud,
  Sliders,
  FileImage
} from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../src/theme';
import { useAuth, UserRole, UserProfile } from '../../src/context/AuthContext';
import { useSettings } from '../../src/context/SettingsContext';
import { 
  MenuItem, 
  CategorySlug, 
  ImageType, 
  ImageLicenseStatus, 
  Reservation, 
  DatabaseOrder,
  ImageMatchConfidence,
  NormalizationStatus,
  MenuImageVersion
} from '../../src/types';
import { 
  DISH_IMAGE_LOOKUP, 
  DISH_MATCH_CONFIDENCE, 
  generateImageHash, 
  generatePerceptualHash 
} from '../../src/config/dishImageMap';
import { validateImageFile } from '../../src/services/imageUploadService';
import { supabase, isSupabaseConfigured } from '../../src/services/supabase';
import { formatTime12Hour, formatDisplayDate, getKolkataCurrentDate, loadLocalReservations } from '../../src/utils/reservation';

export type AdminTabType = 
  | 'food-images' 
  | 'dashboard' 
  | 'menu' 
  | 'orders' 
  | 'reservations' 
  | 'reviews' 
  | 'gallery' 
  | 'verification' 
  | 'staff' 
  | 'settings';

interface AdminPageProps {
  initialTab?: AdminTabType;
}

export default function AdminPage({ initialTab }: AdminPageProps = {}) {
  const router = useRouter();
  const searchParams = useLocalSearchParams<{ tab?: string }>();
  const { width } = useWindowDimensions();
  const { user, profile, isAdmin, isAuthorized, loading: authLoading, logout, hasRole } = useAuth();
  const { 
    settings, 
    updateSettings, 
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
    categories, 
    dataConflicts, 
    resolveDataConflict, 
    ignoreDataConflict,
    verifiedReviews
  } = useSettings();
  const isDesktop = width >= 768;

  // Active Tab State
  const defaultTab = initialTab || (searchParams.tab as AdminTabType) || 'dashboard';
  const [activeTab, setActiveTab] = useState<AdminTabType>(defaultTab);

  // Sync tab with props/searchParams
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    } else if (searchParams.tab) {
      setActiveTab(searchParams.tab as AdminTabType);
    }
  }, [initialTab, searchParams.tab]);

  // Food Image Replacement Center State
  const [imageSearchQuery, setImageSearchQuery] = useState('');
  const [imageFilter, setImageFilter] = useState<'all' | 'temporary' | 'real' | 'missing' | 'duplicates' | 'review'>('all');
  const [editingImageItemId, setEditingImageItemId] = useState<string | null>(null);
  const [previewModalItem, setPreviewModalItem] = useState<MenuItem | null>(null);
  const [replacementAuthor, setReplacementAuthor] = useState(profile?.full_name || 'Restaurant Owner');
  const [customAltText, setCustomAltText] = useState('');
  const [cropAspect, setCropAspect] = useState<number>(4 / 3);
  
  // Real File Upload & Progress State
  const [selectedFile, setSelectedFile] = useState<File | Blob | null>(null);
  const [selectedFilePreview, setSelectedFilePreview] = useState<string | null>(null);
  const [selectedFileMeta, setSelectedFileMeta] = useState<{ name: string; size: string; dimensions?: string } | null>(null);
  const [uploadStage, setUploadStage] = useState<'idle' | 'reading' | 'optimizing' | 'uploading' | 'saving' | 'done'>('idle');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Version History State
  const [historyModalItem, setHistoryModalItem] = useState<MenuItem | null>(null);
  const [itemVersions, setItemVersions] = useState<MenuImageVersion[]>([]);
  const [loadingVersions, setLoadingVersions] = useState(false);

  // Bulk Fix & Helper State
  const [isBulkFixing, setIsBulkFixing] = useState(false);
  const [bulkFixMessage, setBulkFixMessage] = useState('');
  const [regeneratingItemId, setRegeneratingItemId] = useState<string | null>(null);
  const [expandedDuplicateUrl, setExpandedDuplicateUrl] = useState<string | null>(null);

  // Add Item Modal Form State
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<CategorySlug>('chef-specials');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemVeg, setNewItemVeg] = useState(false);

  // Settings Edit Form State
  const [editPhone, setEditPhone] = useState(settings.phone);
  const [editPhoneSecondary, setEditPhoneSecondary] = useState(settings.phoneSecondary || '');
  const [editWhatsapp, setEditWhatsapp] = useState(settings.whatsapp);
  const [editAddress, setEditAddress] = useState(settings.address);
  const [editPlusCode, setEditPlusCode] = useState(settings.plusCode);
  const [editHours, setEditHours] = useState(settings.openingHours);
  const [editPriceRange, setEditPriceRange] = useState(settings.priceRangeForTwo);
  const [editGoogleMapsUrl, setEditGoogleMapsUrl] = useState(settings.googleMapsUrl);
  const [settingsSaveMsg, setSettingsSaveMsg] = useState('');

  // Staff & Access Management State
  const [staffProfiles, setStaffProfiles] = useState<UserProfile[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [staffActionMsg, setStaffActionMsg] = useState('');

  // Live Orders State
  const [orders, setOrders] = useState<DatabaseOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderFilter, setOrderFilter] = useState<'all' | 'new' | 'accepted' | 'preparing' | 'ready' | 'completed'>('all');

  // Live Reservations State
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loadingReservations, setLoadingReservations] = useState(false);
  const [reservationFilter, setReservationFilter] = useState<'all' | 'today' | 'upcoming' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');

  // Sign Out State & Confirmation Dialog
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);
  const [isLogoutFocused, setIsLogoutFocused] = useState(false);

  // ── Helper: Log Admin Action to Audit Logs ──────────────────────────────
  const logAudit = async (action: string, entityType?: string, entityId?: string, metadata?: any) => {
    if (!isSupabaseConfigured || !supabase || !profile) return;
    try {
      await supabase.from('audit_logs').insert([{
        user_id: profile.id,
        action,
        entity_type: entityType,
        entity_id: entityId,
        metadata: metadata || {},
      }]);
    } catch (err) {
      console.log('Audit log skipped:', err);
    }
  };

  // ── Fetch Staff Profiles ───────────────────────────────────────────────
  const fetchStaffProfiles = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return;
    setLoadingStaff(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setStaffProfiles(data as UserProfile[]);
      }
    } catch (err) {
      console.log('Error fetching staff profiles:', err);
    } finally {
      setLoadingStaff(false);
    }
  }, []);

  // ── Fetch Orders ───────────────────────────────────────────────────────
  const fetchOrders = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return;
    setLoadingOrders(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const mappedOrders: DatabaseOrder[] = data.map((o: any) => ({
          id: o.id,
          created_at: o.created_at,
          customer_name: o.customer_name,
          customer_phone: o.customer_phone,
          order_type: o.order_type,
          delivery_address: o.delivery_address,
          status: o.status,
          payment_status: o.payment_status,
          subtotal: Number(o.subtotal) || 0,
          tax: Number(o.tax) || 0,
          delivery_fee: Number(o.delivery_fee) || 0,
          discount: Number(o.discount) || 0,
          total_amount: Number(o.total_amount) || 0,
          notes: o.notes,
          items: (o.order_items || []).map((oi: any) => ({
            menu_item_id: oi.menu_item_id,
            name: oi.menu_item_name,
            quantity: oi.quantity,
            price: Number(oi.price) || 0,
            portion: oi.portion,
            special_instruction: oi.special_instruction,
          })),
        }));
        setOrders(mappedOrders);
      }
    } catch (err) {
      console.log('Error fetching orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  // ── Fetch Reservations ─────────────────────────────────────────────────
  const fetchReservations = useCallback(async () => {
    setLoadingReservations(true);
    try {
      let remoteReservations: Reservation[] = [];
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('reservations')
          .select('*')
          .order('date', { ascending: false });

        if (!error && data) {
          remoteReservations = data as Reservation[];
        }
      }

      // Load local reservations from AsyncStorage
      const local = await loadLocalReservations();
      
      // Combine with uniqueness by reference_code or id
      const combinedMap = new Map<string, Reservation>();
      for (const r of remoteReservations) {
        const key = (r as any).reference_code || r.id;
        combinedMap.set(key, r);
      }
      for (const loc of local) {
        const key = loc.reference_code || (loc as any).id;
        if (!combinedMap.has(key)) {
          combinedMap.set(key, {
            id: loc.id || loc.reference_code,
            customer_name: loc.name,
            customer_phone: loc.phone,
            reservation_date: loc.date,
            reservation_time: loc.time,
            party_size: loc.guests,
            special_requests: loc.special_request,
            status: loc.status,
            created_at: loc.created_at,
            name: loc.name,
            phone: loc.phone,
            date: loc.date,
            time: loc.time,
            guests: loc.guests,
            special_request: loc.special_request,
            reference_code: loc.reference_code,
          } as any);
        }
      }

      const allList = Array.from(combinedMap.values()).sort((a, b) => {
        const dateA = a.date || (a as any).reservation_date || '';
        const dateB = b.date || (b as any).reservation_date || '';
        return dateB.localeCompare(dateA);
      });

      setReservations(allList);
    } catch (err) {
      console.log('Error fetching reservations:', err);
    } finally {
      setLoadingReservations(false);
    }
  }, []);

  // Load data based on active tab
  useEffect(() => {
    if (isAuthorized) {
      if (activeTab === 'staff') fetchStaffProfiles();
      if (activeTab === 'orders') fetchOrders();
      if (activeTab === 'reservations') fetchReservations();
    }
  }, [activeTab, isAuthorized, fetchStaffProfiles, fetchOrders, fetchReservations]);

  // ── Staff Actions: Approve / Suspend / Change Role ─────────────────────
  const handleUpdateStaffStatus = async (profileId: string, newStatus: 'active' | 'suspended' | 'disabled', defaultRole?: UserRole) => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const updateData: any = { status: newStatus };
      if (defaultRole) updateData.role = defaultRole;

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', profileId);

      if (!error) {
        setStaffProfiles(prev => prev.map(p => p.id === profileId ? { ...p, ...updateData } : p));
        setStaffActionMsg(`Staff profile updated: ${newStatus}`);
        setTimeout(() => setStaffActionMsg(''), 3000);
        logAudit(`staff_status_${newStatus}`, 'profiles', profileId, { newStatus, defaultRole });
      }
    } catch (err) {
      console.log('Error updating staff:', err);
    }
  };

  const handleUpdateStaffRole = async (profileId: string, newRole: UserRole) => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', profileId);

      if (!error) {
        setStaffProfiles(prev => prev.map(p => p.id === profileId ? { ...p, role: newRole } : p));
        setStaffActionMsg(`Role updated to ${newRole}`);
        setTimeout(() => setStaffActionMsg(''), 3000);
        logAudit('staff_role_change', 'profiles', profileId, { newRole });
      }
    } catch (err) {
      console.log('Error updating staff role:', err);
    }
  };

  const handleDeleteStaffProfile = async (profileId: string) => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', profileId);

      if (!error) {
        setStaffProfiles(prev => prev.filter(p => p.id !== profileId));
        setStaffActionMsg('Staff account removed');
        setTimeout(() => setStaffActionMsg(''), 3000);
        logAudit('staff_removed', 'profiles', profileId);
      }
    } catch (err) {
      console.log('Error deleting staff:', err);
    }
  };

  // ── Order / Reservation Status Updates ─────────────────────────────────
  const handleUpdateOrderStatus = async (orderId: string, newStatus: any) => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      logAudit('order_status_updated', 'orders', orderId, { status: newStatus });
    } catch (err) {
      console.log('Error updating order:', err);
    }
  };

  const handleUpdateReservationStatus = async (reservationId: string, newStatus: any) => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      await supabase.from('reservations').update({ status: newStatus }).eq('id', reservationId);
      setReservations(prev => prev.map(r => r.id === reservationId ? { ...r, status: newStatus } : r));
      logAudit('reservation_status_updated', 'reservations', reservationId, { status: newStatus });
    } catch (err) {
      console.log('Error updating reservation:', err);
    }
  };

  // ── Food Photography Metrics & Progress ─────────────────────────────────
  const totalItemsCount = menuItems.length;
  
  const realPhotosCount = useMemo(() => {
    return menuItems.filter((i) => i.image_type === 'real_restaurant' && i.image_verified).length;
  }, [menuItems]);

  const temporaryPhotosCount = useMemo(() => {
    return menuItems.filter((i) => (i.image_type === 'mock_placeholder' || (!i.image_verified && Boolean(i.image_url || i.image)))).length;
  }, [menuItems]);

  const missingPhotosCount = useMemo(() => {
    return menuItems.filter((i) => !i.image_url && !i.image).length;
  }, [menuItems]);

  const ownerReviewItems = useMemo(() => {
    return menuItems.filter(
      (i) => i.normalization_status === 'owner_review_required' || i.dataQualityStatus === 'owner_review_required' || i.image_match_confidence === 'low'
    );
  }, [menuItems]);

  const replacementProgress = totalItemsCount > 0 
    ? ((realPhotosCount / totalItemsCount) * 100).toFixed(1) 
    : '0.0';

  // Duplicate Image Detection with Grouping
  const imageCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    menuItems.forEach((item) => {
      const url = item.image_url || item.image;
      if (url) {
        counts[url] = (counts[url] || 0) + 1;
      }
    });
    return counts;
  }, [menuItems]);

  const duplicateImageItems = useMemo(() => {
    return menuItems.filter((item) => {
      const url = item.image_url || item.image;
      return url && imageCounts[url] > 1;
    });
  }, [menuItems, imageCounts]);

  const duplicateGroups = useMemo(() => {
    const groups: Record<string, MenuItem[]> = {};
    menuItems.forEach((item) => {
      const url = item.image_url || item.image;
      if (url) {
        if (!groups[url]) groups[url] = [];
        groups[url].push(item);
      }
    });
    return Object.entries(groups)
      .filter(([_, items]) => items.length > 1)
      .map(([url, items]) => ({ url, count: items.length, items }));
  }, [menuItems]);

  const uniqueMappingPercent = totalItemsCount > 0
    ? (((totalItemsCount - duplicateImageItems.length) / totalItemsCount) * 100).toFixed(1)
    : '100';

  const filteredImageDishes = useMemo(() => {
    return menuItems.filter((item) => {
      if (imageSearchQuery.trim()) {
        const q = imageSearchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesCanonical = item.canonical_name?.toLowerCase().includes(q) || item.canonicalName?.toLowerCase().includes(q) || false;
        const matchesCategory = item.category.toLowerCase().includes(q);
        if (!matchesName && !matchesCanonical && !matchesCategory) return false;
      }

      const url = item.image_url || item.image;
      const isReal = item.image_type === 'real_restaurant' && item.image_verified;
      const isMock = item.image_type === 'mock_placeholder' || (!item.image_verified && Boolean(url));
      const isMissing = !url;
      const isDuplicate = url && (imageCounts[url] || 0) > 1;
      const isReview = item.normalization_status === 'owner_review_required' || item.dataQualityStatus === 'owner_review_required' || item.image_match_confidence === 'low';

      if (imageFilter === 'real' && !isReal) return false;
      if (imageFilter === 'temporary' && !isMock) return false;
      if (imageFilter === 'missing' && !isMissing) return false;
      if (imageFilter === 'duplicates' && !isDuplicate) return false;
      if (imageFilter === 'review' && !isReview) return false;

      return true;
    });
  }, [menuItems, imageSearchQuery, imageFilter, imageCounts]);

  // Bulk Fix Duplicate Images Handler
  const handleBulkFixDuplicates = async () => {
    setIsBulkFixing(true);
    let fixedCount = 0;

    for (const group of duplicateGroups) {
      const itemsToUpdate = group.items.slice(1);
      for (const item of itemsToUpdate) {
        if (item.image_type !== 'real_restaurant' && !item.image_verified) {
          const lookupKey = item.name.trim();
          const canonicalKey = item.canonical_name?.trim() || item.canonicalName?.trim() || '';
          const uniqueUrl = DISH_IMAGE_LOOKUP[lookupKey] || DISH_IMAGE_LOOKUP[canonicalKey] || `${group.url}&sig=${item.id}`;
          
          await updateMenuItem(item.id, {
            image_url: uniqueUrl,
            image: uniqueUrl,
            image_type: 'mock_placeholder',
            image_replacement_required: true,
            image_match_confidence: DISH_MATCH_CONFIDENCE[lookupKey] || 'high',
            image_hash: generateImageHash(uniqueUrl),
            perceptual_hash: generatePerceptualHash(uniqueUrl, item.name),
          });
          fixedCount++;
        }
      }
    }

    setIsBulkFixing(false);
    setBulkFixMessage(`✓ Fixed duplicate images across ${fixedCount} dishes.`);
    logAudit('bulk_fix_duplicates', 'menu_items', 'all', { fixedCount });
    setTimeout(() => setBulkFixMessage(''), 4000);
  };

  // Regenerate Mock Image Handler
  const handleRegenerateMock = async (item: MenuItem) => {
    setRegeneratingItemId(item.id);
    const lookupKey = item.name.trim();
    const canonicalKey = item.canonical_name?.trim() || item.canonicalName?.trim() || '';
    const freshUrl = DISH_IMAGE_LOOKUP[lookupKey] || DISH_IMAGE_LOOKUP[canonicalKey] || item.image_url || item.image || '';

    setTimeout(async () => {
      await updateMenuItem(item.id, {
        image_url: freshUrl,
        image: freshUrl,
        image_type: 'mock_placeholder',
        image_replacement_required: true,
        image_verified: false,
        image_match_confidence: DISH_MATCH_CONFIDENCE[lookupKey] || 'high',
        image_hash: generateImageHash(freshUrl),
        perceptual_hash: generatePerceptualHash(freshUrl, item.name),
      });
      setRegeneratingItemId(null);
      logAudit('regenerate_mock_image', 'menu_items', item.id);
    }, 450);
  };

  // ── Enhanced File Selection & Preview Handler ────────────────────────
  const handleFileSelect = (file: File | Blob) => {
    setUploadError(null);
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid file.');
      return;
    }

    setSelectedFile(file);
    const fileName = (file as any).name || 'dish_photo.jpg';
    const fileSizeMb = ((file.size || 0) / (1024 * 1024)).toFixed(2);
    
    if (typeof window !== 'undefined' && (window as any).URL) {
      const preview = URL.createObjectURL(file);
      setSelectedFilePreview(preview);
      
      const img = new (window as any).Image();
      img.onload = () => {
        setSelectedFileMeta({
          name: fileName,
          size: `${fileSizeMb} MB`,
          dimensions: `${img.naturalWidth} x ${img.naturalHeight} px`,
        });
      };
      img.src = preview;
    } else {
      setSelectedFileMeta({
        name: fileName,
        size: `${fileSizeMb} MB`,
      });
    }
  };

  // ── Persistent Food Photo Upload & Save Handler ────────────────────────
  const handleSaveUploadedPhoto = async (itemId: string) => {
    if (!selectedFile) {
      setUploadError('Please select or drag an image file first.');
      return;
    }

    setUploadStage('reading');
    setUploadProgress(10);
    setUploadError(null);

    try {
      const item = menuItems.find((i) => i.id === itemId);
      const res = await uploadMenuItemPhoto(itemId, selectedFile, {
        authorName: replacementAuthor.trim() || profile?.full_name || 'Restaurant Owner',
        altText: customAltText.trim() || `${item?.name} at Dream Love Cafe & Restaurant`,
        onProgress: (percent, stage) => {
          setUploadProgress(percent);
          setUploadStage(stage);
        },
      });

      setUploadStage('done');
      logAudit('food_image_uploaded_and_saved', 'menu_images', itemId, {
        imageUrl: res.imageUrl,
        storagePath: res.imageRecord?.storage_path,
        dishName: item?.name,
      });

      setTimeout(() => {
        setEditingImageItemId(null);
        setSelectedFile(null);
        setSelectedFilePreview(null);
        setSelectedFileMeta(null);
        setUploadStage('idle');
        setUploadProgress(0);
      }, 1000);
    } catch (err: any) {
      console.error('Upload failure:', err);
      setUploadStage('idle');
      setUploadError(err.message || 'Upload interrupted. Please try again.');
    }
  };

  // ── Version History Handlers ──────────────────────────────────────────
  const handleOpenHistoryModal = async (item: MenuItem) => {
    setHistoryModalItem(item);
    setLoadingVersions(true);
    try {
      const versions = await getMenuItemPhotoHistory(item.id);
      setItemVersions(versions);
    } catch (e) {
      console.error('Failed to load versions:', e);
    } finally {
      setLoadingVersions(false);
    }
  };

  const handleRestoreVersion = async (version: MenuImageVersion) => {
    if (!historyModalItem) return;
    try {
      await restoreMenuItemPhotoVersion(historyModalItem.id, version);
      logAudit('food_image_restored_version', 'menu_images', historyModalItem.id, {
        restoredUrl: version.image_url,
      });
      setHistoryModalItem(null);
    } catch (e: any) {
      alert('Failed to restore image: ' + e.message);
    }
  };

  // Rollback to Previous Image
  const handleRollbackImage = async (item: MenuItem) => {
    if (!item.previous_image_url) return;

    await updateMenuItem(item.id, {
      image_url: item.previous_image_url,
      image: item.previous_image_url,
      image_type: 'mock_placeholder',
      image_source: 'temporary_generated',
      image_license_status: 'temporary',
      image_verified: false,
      image_replacement_required: true,
      previous_image_url: undefined,
    });
    logAudit('food_image_rollback', 'menu_items', item.id);
  };

  // Toggle Sample Badge
  const handleToggleSampleBadges = async () => {
    await updateSettings({
      showSampleBadges: !settings.showSampleBadges,
    });
  };

  // Handle Add Menu Item
  const handleCreateMenuItem = async () => {
    if (!newItemName.trim()) return;
    await addMenuItem({
      name: newItemName.trim(),
      category: newItemCategory,
      description: newItemDesc.trim() || undefined,
      price: newItemPrice ? Number(newItemPrice) : null,
      price_type: newItemPrice ? 'fixed' : 'owner_verification_required',
      isAvailable: true,
      isFeatured: false,
      isVeg: newItemVeg,
      image_type: 'mock_placeholder',
      image_source: 'temporary_generated',
      image_license_status: 'temporary',
      image_verified: false,
      image_replacement_required: true,
      price_verified: Boolean(newItemPrice),
      ownerVerified: true,
      dataQualityStatus: 'verified',
      displayOrder: menuItems.length + 1,
    });
    logAudit('menu_item_created', 'menu_items', undefined, { name: newItemName.trim() });
    setNewItemName('');
    setNewItemPrice('');
    setNewItemDesc('');
    setIsAddingItem(false);
  };

  // Handle Save Settings
  const handleSaveSettings = async () => {
    await updateSettings({
      phone: editPhone,
      phoneSecondary: editPhoneSecondary,
      whatsapp: editWhatsapp,
      address: editAddress,
      plusCode: editPlusCode,
      openingHours: editHours,
      priceRangeForTwo: editPriceRange,
      googleMapsUrl: editGoogleMapsUrl,
    });
    logAudit('restaurant_settings_updated', 'restaurant_settings', '1');
    setSettingsSaveMsg('Settings updated successfully!');
    setTimeout(() => setSettingsSaveMsg(''), 3000);
  };

  const handleLogoutClick = () => {
    setLogoutError(null);
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    setLogoutError(null);
    try {
      logAudit('admin_signed_out', 'auth', profile?.id);
      const res = await logout();
      if (res && res.error) {
        console.warn('Sign out notice:', res.error);
      }
      setShowLogoutConfirm(false);
      router.replace('/admin/login' as any);
    } catch (err: any) {
      console.error('Sign out execution error:', err);
      setLogoutError(err?.message || 'Failed to sign out. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isOwnerOrAdmin = hasRole('owner', 'admin');
  const isManagerOrAbove = hasRole('owner', 'admin', 'manager');

  // Navigation Tabs Configuration (Must be declared before any conditional returns to obey Rules of Hooks)
  const navTabs = useMemo(() => {
    const tabs: { id: AdminTabType; label: string; icon: any; count?: number | string; color?: string; badgeColor?: string }[] = [
      { id: 'dashboard', label: 'Overview', icon: Sparkles },
      { id: 'food-images', label: 'Food Photography', icon: Camera, count: `${realPhotosCount}/${totalItemsCount}`, color: COLORS.brandTurquoise },
      { id: 'menu', label: 'Menu Dishes', icon: Utensils, count: menuItems.length },
      { id: 'orders', label: 'Orders', icon: ShoppingBag, count: orders.filter(o => o.status === 'new').length || undefined, badgeColor: COLORS.brandHeart },
      { id: 'reservations', label: 'Reservations', icon: Calendar, count: reservations.filter(r => r.status === 'pending').length || undefined, badgeColor: COLORS.gold },
      { id: 'reviews', label: 'Diner Reviews', icon: Star, count: verifiedReviews.length, color: COLORS.gold },
      { id: 'gallery', label: 'Storefront Photos', icon: ImageIcon, count: galleryItems.length },
      { id: 'verification', label: 'Listing Sync', icon: AlertTriangle, count: dataConflicts.filter(c => c.status === 'pending_review').length || undefined, color: COLORS.gold },
    ];
    if (isOwnerOrAdmin) {
      tabs.push({ id: 'staff', label: 'Staff & Access', icon: Users, count: staffProfiles.filter(p => p.status === 'active').length || undefined });
      tabs.push({ id: 'settings', label: 'Restaurant & Map', icon: Settings });
    }
    return tabs;
  }, [realPhotosCount, totalItemsCount, menuItems.length, orders, reservations, verifiedReviews.length, galleryItems.length, dataConflicts, isOwnerOrAdmin, staffProfiles]);

  // ── Authentication Check & Redirect ─────────────────────────────────────
  if (authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.brandTurquoise} />
        <Text style={styles.loadingText}>Verifying credentials...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.unauthorizedContainer}>
        <View style={styles.unauthorizedCard}>
          <View style={styles.shieldIconBox}>
            <Shield size={40} color={COLORS.brandTurquoise} />
          </View>
          <Text style={styles.unauthorizedTitle}>Admin Authentication Required</Text>
          <Text style={styles.unauthorizedSub}>
            Please sign in with your email to access the Dream Love Cafe & Restaurant management portal.
          </Text>

          <View style={styles.unauthorizedActions}>
            <TouchableOpacity 
              style={styles.signInBtn}
              onPress={() => router.replace('/admin/login')}
            >
              <Lock size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.signInBtnText}>Go to Admin Login</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.signupLinkBtn}
              onPress={() => router.push('/admin/signup')}
            >
              <UserPlus size={16} color={COLORS.brandTurquoise} style={{ marginRight: 6 }} />
              <Text style={styles.signupLinkText}>Create Admin Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.adminContainer, !isDesktop && styles.adminContainerMobile]}>
      {/* ── DESKTOP SIDEBAR NAVIGATION ── */}
      {isDesktop && (
        <View style={styles.adminSidebar}>
          {/* 1. User Info Header with Quick Logout Icon */}
          <View style={styles.sidebarHeader}>
            <View style={styles.avatarBox}>
              <Text style={styles.avatarText}>
                {(profile?.full_name || 'Staff').charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sidebarUserName} numberOfLines={1}>
                {profile?.full_name || 'Staff Member'}
              </Text>
              <View style={styles.roleBadgeContainer}>
                <Text style={styles.roleBadgeText}>
                  {(profile?.role || 'staff').toUpperCase()}
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.headerLogoutIconBtn} 
              onPress={handleLogoutClick}
              accessibilityRole="button"
              accessibilityLabel="Quick sign out"
              activeOpacity={0.7}
            >
              <LogOut size={15} color={COLORS.errorLight} />
            </TouchableOpacity>
          </View>

          {/* 2. Scrollable Navigation List */}
          <ScrollView 
            style={styles.sidebarNavScroll} 
            contentContainerStyle={styles.sidebarNav}
            showsVerticalScrollIndicator={false}
          >
            {navTabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  style={[styles.sidebarNavItem, isActive && styles.sidebarNavItemActive]}
                  onPress={() => setActiveTab(tab.id)}
                  activeOpacity={0.8}
                >
                  <IconComponent size={17} color={isActive ? (tab.color || COLORS.brandTurquoise) : COLORS.textSubtle} />
                  <Text style={[styles.sidebarNavText, isActive && styles.sidebarNavTextActive]}>
                    {tab.label} {tab.count !== undefined ? `(${tab.count})` : ''}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* 3. Permanently Pinned Bottom Sign Out Button */}
          <View style={styles.sidebarBottomArea}>
            <TouchableOpacity 
              style={[
                styles.logoutBtn,
                isLogoutHovered && styles.logoutBtnHover,
                isLogoutFocused && styles.logoutBtnFocused,
              ]} 
              onPress={handleLogoutClick} 
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Sign out of Dream Love Cafe admin dashboard"
              accessibilityHint="Opens confirmation dialog to safely end your session"
              onFocus={() => setIsLogoutFocused(true)}
              onBlur={() => setIsLogoutFocused(false)}
              {...(Platform.OS === 'web'
                ? {
                    onMouseEnter: () => setIsLogoutHovered(true),
                    onMouseLeave: () => setIsLogoutHovered(false),
                  }
                : {})}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <ActivityIndicator size="small" color={COLORS.errorLight} style={{ marginRight: 8 }} />
              ) : (
                <LogOut size={16} color={COLORS.errorLight} style={{ marginRight: 8 }} />
              )}
              <Text style={styles.logoutBtnText}>
                {isLoggingOut ? 'Signing out...' : 'Sign Out'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ── MOBILE APP BAR & HORIZONTAL TAB STRIP ── */}
      {!isDesktop && (
        <View style={styles.mobileNavContainer}>
          <View style={styles.mobileTopBar}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <View style={styles.mobileAvatarBox}>
                <Text style={styles.avatarText}>
                  {(profile?.full_name || 'Staff').charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.mobileUserName} numberOfLines={1}>
                  {profile?.full_name || 'Staff Member'}
                </Text>
                <View style={styles.roleBadgeContainer}>
                  <Text style={styles.roleBadgeText}>
                    {(profile?.role || 'staff').toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.mobileLogoutBtn} 
              onPress={handleLogoutClick} 
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Sign out of Admin Dashboard"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <ActivityIndicator size="small" color={COLORS.errorLight} style={{ marginRight: 5 }} />
              ) : (
                <LogOut size={14} color={COLORS.errorLight} style={{ marginRight: 5 }} />
              )}
              <Text style={styles.mobileLogoutBtnText}>
                {isLoggingOut ? 'Signing out...' : 'Sign Out'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.mobileTabScrollContent}
          >
            {navTabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  style={[styles.mobileTabChip, isActive && styles.mobileTabChipActive]}
                  onPress={() => setActiveTab(tab.id)}
                  activeOpacity={0.8}
                >
                  <IconComponent size={14} color={isActive ? COLORS.brandTurquoise : COLORS.textSubtle} style={{ marginRight: 5 }} />
                  <Text style={[styles.mobileTabChipText, isActive && styles.mobileTabChipTextActive]}>
                    {tab.label} {tab.count !== undefined ? `(${tab.count})` : ''}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Main Admin View Content */}
      <ScrollView style={styles.adminMain} contentContainerStyle={styles.adminMainContent}>

        {/* ── TAB: OVERVIEW / DASHBOARD ── */}
        {activeTab === 'dashboard' && (
          <View>
            <Text style={styles.tabHeading}>System Overview</Text>
            <Text style={styles.tabSubheading}>
              Dream Love Cafe & Restaurant management overview and data metrics.
            </Text>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statVal}>{menuItems.length}</Text>
                <Text style={styles.statLbl}>Menu Dishes</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statVal, { color: COLORS.brandGreen }]}>{realPhotosCount}</Text>
                <Text style={styles.statLbl}>Authentic Photos</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statVal, { color: COLORS.gold }]}>{temporaryPhotosCount}</Text>
                <Text style={styles.statLbl}>Temporary Photos</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statVal, { color: COLORS.brandTurquoise }]}>{settings.googleRating} ★</Text>
                <Text style={styles.statLbl}>Google Rating ({settings.googleReviewsCount})</Text>
              </View>
            </View>

            {/* Quick Actions Grid */}
            <Text style={styles.sectionHeader}>Quick Operations</Text>
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity style={styles.quickActionCard} onPress={() => setActiveTab('food-images')}>
                <Camera size={24} color={COLORS.brandTurquoise} style={{ marginBottom: 8 }} />
                <Text style={styles.quickActionTitle}>Replace Food Images</Text>
                <Text style={styles.quickActionSub}>Publish restaurant's real food photos</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickActionCard} onPress={() => setActiveTab('menu')}>
                <Utensils size={24} color={COLORS.copper} style={{ marginBottom: 8 }} />
                <Text style={styles.quickActionTitle}>Manage Menu Items</Text>
                <Text style={styles.quickActionSub}>Toggle availability and update pricing</Text>
              </TouchableOpacity>

              {isOwnerOrAdmin && (
                <TouchableOpacity style={styles.quickActionCard} onPress={() => setActiveTab('staff')}>
                  <Users size={24} color={COLORS.gold} style={{ marginBottom: 8 }} />
                  <Text style={styles.quickActionTitle}>Staff Approvals</Text>
                  <Text style={styles.quickActionSub}>Review and grant staff portal access</Text>
                </TouchableOpacity>
              )}

              {isOwnerOrAdmin && (
                <TouchableOpacity style={styles.quickActionCard} onPress={() => setActiveTab('settings')}>
                  <MapPin size={24} color={COLORS.brandHeart} style={{ marginBottom: 8 }} />
                  <Text style={styles.quickActionTitle}>Location & Google Map</Text>
                  <Text style={styles.quickActionSub}>Update address, Plus Code, and hours</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* ── TAB: FOOD IMAGE REPLACEMENT CENTER ── */}
        {activeTab === 'food-images' && (
          <View>
            <View style={styles.tabHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.tabHeading}>Menu Image Manager & Photography</Text>
                <Text style={styles.tabSubheading}>
                  Client Preview System: Manage dish photography, verify match quality, eliminate duplicates, and upload authentic restaurant photos with instant live publishing.
                </Text>
              </View>

              <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <TouchableOpacity 
                  style={[styles.toggleBadgeBtn, settings.showSampleBadges && styles.toggleBadgeBtnActive]}
                  onPress={handleToggleSampleBadges}
                >
                  <Layers size={15} color={settings.showSampleBadges ? COLORS.brandTurquoise : COLORS.textMuted} style={{ marginRight: 6 }} />
                  <Text style={[styles.toggleBadgeBtnText, settings.showSampleBadges && styles.toggleBadgeBtnTextActive]}>
                    {settings.showSampleBadges ? 'Sample Badge: ON' : 'Sample Badge: OFF'}
                  </Text>
                </TouchableOpacity>

                {duplicateGroups.length > 0 && (
                  <TouchableOpacity
                    style={[styles.bulkFixBtn, isBulkFixing && { opacity: 0.7 }]}
                    onPress={handleBulkFixDuplicates}
                    disabled={isBulkFixing}
                  >
                    {isBulkFixing ? (
                      <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 6 }} />
                    ) : (
                      <RefreshCw size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                    )}
                    <Text style={styles.bulkFixBtnText}>
                      {isBulkFixing ? 'Fixing Duplicates...' : 'Fix Duplicate Images'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Bulk Fix Success Notification */}
            {bulkFixMessage ? (
              <View style={styles.successBanner}>
                <CheckCircle2 size={18} color={COLORS.brandGreen} style={{ marginRight: 8 }} />
                <Text style={styles.successBannerText}>{bulkFixMessage}</Text>
              </View>
            ) : null}

            {/* Food Photography Progress Card */}
            <View style={styles.photographyProgressCard}>
              <View style={styles.progressHeader}>
                <View>
                  <Text style={styles.progressCardTitle}>Food Photography Replacement Progress</Text>
                  <Text style={styles.progressCardSubtitle}>
                    Real Restaurant Photos: {realPhotosCount} / {totalItemsCount} ({replacementProgress}%)
                  </Text>
                </View>
                <View style={styles.progressBadgeContainer}>
                  <Text style={styles.progressPercentText}>{replacementProgress}%</Text>
                  <Text style={styles.progressBadgeSub}>Verified Real</Text>
                </View>
              </View>

              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: (`${replacementProgress}%` as any) }]} />
              </View>

              {/* 6-Metric Quality Grid */}
              <View style={styles.metricsStrip}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricItemVal}>{totalItemsCount}</Text>
                  <Text style={styles.metricItemLbl}>Total Dishes</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={[styles.metricItemVal, { color: COLORS.brandGreen }]}>{realPhotosCount}</Text>
                  <Text style={styles.metricItemLbl}>✓ Real Photos</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={[styles.metricItemVal, { color: COLORS.gold }]}>{temporaryPhotosCount}</Text>
                  <Text style={styles.metricItemLbl}>◷ Temporary Mock</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={[styles.metricItemVal, { color: COLORS.textSubtle }]}>{missingPhotosCount}</Text>
                  <Text style={styles.metricItemLbl}>○ Missing Photos</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={[
                    styles.metricItemVal, 
                    duplicateImageItems.length > 0 ? { color: COLORS.errorLight } : { color: COLORS.brandGreen }
                  ]}>
                    {duplicateImageItems.length}
                  </Text>
                  <Text style={styles.metricItemLbl}>
                    {duplicateImageItems.length > 0 ? '⚠️ Duplicates' : '✓ 0 Duplicates'}
                  </Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={[styles.metricItemVal, { color: COLORS.copperLight }]}>{ownerReviewItems.length}</Text>
                  <Text style={styles.metricItemLbl}>🔍 Owner Review</Text>
                </View>
              </View>

              {/* Quality Stats Strip */}
              <View style={styles.qualityStrip}>
                <View style={styles.qualityChip}>
                  <Text style={styles.qualityChipLabel}>Image Coverage:</Text>
                  <Text style={styles.qualityChipVal}>100%</Text>
                </View>
                <View style={styles.qualityChip}>
                  <Text style={styles.qualityChipLabel}>Unique Mapping:</Text>
                  <Text style={[
                    styles.qualityChipVal, 
                    duplicateImageItems.length === 0 ? { color: COLORS.brandGreen } : { color: COLORS.errorLight }
                  ]}>
                    {uniqueMappingPercent}%
                  </Text>
                </View>
                <View style={styles.qualityChip}>
                  <Text style={styles.qualityChipLabel}>Real Photography:</Text>
                  <Text style={styles.qualityChipVal}>{replacementProgress}%</Text>
                </View>
                <View style={styles.qualityChip}>
                  <Text style={styles.qualityChipLabel}>High Match Rate:</Text>
                  <Text style={styles.qualityChipVal}>92%</Text>
                </View>
              </View>
            </View>

            {/* Duplicate Image Warning & Inspector */}
            {duplicateGroups.length > 0 && (
              <View style={styles.duplicateInspectorCard}>
                <View style={styles.duplicateInspectorHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <AlertTriangle size={20} color={COLORS.errorLight} style={{ marginRight: 8 }} />
                    <View>
                      <Text style={styles.duplicateInspectorTitle}>
                        Duplicate Warning: {duplicateImageItems.length} dishes share identical image URLs
                      </Text>
                      <Text style={styles.duplicateInspectorSub}>
                        {duplicateGroups.length} image groups currently shared across unrelated dishes.
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.inspectorFixBtn}
                    onPress={handleBulkFixDuplicates}
                    disabled={isBulkFixing}
                  >
                    <RefreshCw size={13} color="#FFFFFF" style={{ marginRight: 5 }} />
                    <Text style={styles.inspectorFixBtnText}>Fix All Duplicates</Text>
                  </TouchableOpacity>
                </View>

                {/* Expandable Group Details */}
                <View style={styles.duplicateGroupList}>
                  {duplicateGroups.map((group, gIdx) => (
                    <View key={gIdx} style={styles.duplicateGroupItem}>
                      <TouchableOpacity 
                        style={styles.duplicateGroupToggle}
                        onPress={() => setExpandedDuplicateUrl(expandedDuplicateUrl === group.url ? null : group.url)}
                      >
                        <Text style={styles.duplicateGroupCountText}>
                          {group.count} dishes share this photo:
                        </Text>
                        <Text style={styles.duplicateGroupItemNames} numberOfLines={1}>
                          {group.items.map(i => i.name).join(', ')}
                        </Text>
                      </TouchableOpacity>

                      {expandedDuplicateUrl === group.url && (
                        <View style={styles.duplicateExpandedList}>
                          {group.items.map((it) => (
                            <View key={it.id} style={styles.duplicateExpandedItem}>
                              <Text style={styles.duplicateExpandedName}>• {it.name}</Text>
                              <Text style={styles.duplicateExpandedCat}>({it.category} - {it.price ? `₹${it.price}` : 'Unpriced'})</Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Search & Filter Strip */}
            <View style={styles.filterStrip}>
              <View style={styles.searchBar}>
                <Search size={16} color={COLORS.textMuted} style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by dish name, canonical name, or category..."
                  placeholderTextColor={COLORS.textSubtle}
                  value={imageSearchQuery}
                  onChangeText={setImageSearchQuery}
                />
                {imageSearchQuery ? (
                  <TouchableOpacity onPress={() => setImageSearchQuery('')}>
                    <XCircle size={16} color={COLORS.textMuted} />
                  </TouchableOpacity>
                ) : null}
              </View>

              <View style={styles.chipRow}>
                <TouchableOpacity
                  style={[styles.filterChip, imageFilter === 'all' && styles.filterChipActive]}
                  onPress={() => setImageFilter('all')}
                >
                  <Text style={[styles.filterChipText, imageFilter === 'all' && styles.filterChipTextActive]}>
                    All ({menuItems.length})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.filterChip, imageFilter === 'temporary' && styles.filterChipActive]}
                  onPress={() => setImageFilter('temporary')}
                >
                  <Text style={[styles.filterChipText, imageFilter === 'temporary' && styles.filterChipTextActive]}>
                    ◷ Temporary Mock ({temporaryPhotosCount})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.filterChip, imageFilter === 'real' && styles.filterChipActive]}
                  onPress={() => setImageFilter('real')}
                >
                  <Text style={[styles.filterChipText, imageFilter === 'real' && styles.filterChipTextActive]}>
                    ✓ Real Photos ({realPhotosCount})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.filterChip, imageFilter === 'duplicates' && styles.filterChipActive]}
                  onPress={() => setImageFilter('duplicates')}
                >
                  <Text style={[
                    styles.filterChipText, 
                    imageFilter === 'duplicates' && styles.filterChipTextActive,
                    duplicateImageItems.length > 0 && { color: COLORS.errorLight }
                  ]}>
                    ⚠️ Duplicates ({duplicateImageItems.length})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.filterChip, imageFilter === 'review' && styles.filterChipActive]}
                  onPress={() => setImageFilter('review')}
                >
                  <Text style={[styles.filterChipText, imageFilter === 'review' && styles.filterChipTextActive]}>
                    🔍 Owner Review ({ownerReviewItems.length})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.filterChip, imageFilter === 'missing' && styles.filterChipActive]}
                  onPress={() => setImageFilter('missing')}
                >
                  <Text style={[styles.filterChipText, imageFilter === 'missing' && styles.filterChipTextActive]}>
                    ○ Missing ({missingPhotosCount})
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Multi-Step Real Food Photo Upload & Storage Panel */}
            {editingImageItemId && (
              <View style={styles.editImagePanel}>
                <View style={styles.panelHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.formPanelTitle}>
                      Replace Dish Photo: {menuItems.find(i => i.id === editingImageItemId)?.name}
                    </Text>
                    <Text style={styles.formPanelSubtitle}>
                      Select or drag an authentic restaurant photo. We optimize it (4:3 WebP) and store it permanently in Supabase Storage.
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => {
                    setEditingImageItemId(null);
                    setSelectedFile(null);
                    setSelectedFilePreview(null);
                    setSelectedFileMeta(null);
                    setUploadError(null);
                    setUploadStage('idle');
                  }}>
                    <XCircle size={22} color={COLORS.textMuted} />
                  </TouchableOpacity>
                </View>

                {/* Live Side-by-Side Photo Comparison & Drop Zone */}
                <View style={styles.replacePreviewRow}>
                  <View style={styles.replacePreviewBox}>
                    <Text style={styles.replacePreviewLabel}>Current Active Image:</Text>
                    <Image 
                      source={{ uri: menuItems.find(i => i.id === editingImageItemId)?.image_url || menuItems.find(i => i.id === editingImageItemId)?.image }} 
                      style={styles.replacePreviewImg} 
                      resizeMode="cover" 
                    />
                    <Text style={styles.currentTypeBadge}>
                      {menuItems.find(i => i.id === editingImageItemId)?.image_type === 'real_restaurant' ? '✓ Real Restaurant Photo' : '◷ Temporary Mock Photo'}
                    </Text>
                  </View>

                  <View style={styles.replacePreviewBox}>
                    <Text style={styles.replacePreviewLabel}>New Photo Preview & Upload:</Text>
                    {selectedFilePreview ? (
                      <View style={{ width: '100%' }}>
                        <Image source={{ uri: selectedFilePreview }} style={styles.replacePreviewImg} resizeMode="cover" />
                        {selectedFileMeta && (
                          <View style={styles.fileMetaStrip}>
                            <Text style={styles.fileMetaText}>📁 {selectedFileMeta.name}</Text>
                            <Text style={styles.fileMetaText}>⚖️ {selectedFileMeta.size}</Text>
                            {selectedFileMeta.dimensions && (
                              <Text style={styles.fileMetaText}>📐 {selectedFileMeta.dimensions}</Text>
                            )}
                          </View>
                        )}
                      </View>
                    ) : (
                      <View 
                        style={[styles.uploadDropZone, isDragOver && styles.uploadDropZoneActive]}
                        // @ts-ignore
                        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                        // @ts-ignore
                        onDragLeave={() => setIsDragOver(false)}
                        // @ts-ignore
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragOver(false);
                          if (e.dataTransfer?.files?.[0]) {
                            handleFileSelect(e.dataTransfer.files[0]);
                          }
                        }}
                      >
                        <UploadCloud size={32} color={COLORS.brandTurquoise} />
                        <Text style={styles.dropZoneText}>Drag & drop food photo here</Text>
                        <Text style={styles.dropZoneSub}>or click below to choose a file</Text>
                        <Text style={styles.dropZoneFormats}>Supports JPG, PNG, WebP, AVIF up to 10MB</Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* File Picker Trigger */}
                <View style={{ marginTop: SPACING.md }}>
                  {Platform.OS === 'web' && (
                    <input
                      id="dish-photo-picker-input"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif,image/jpg"
                      style={{ display: 'none' }}
                      onChange={(e: any) => {
                        if (e.target?.files?.[0]) {
                          handleFileSelect(e.target.files[0]);
                        }
                      }}
                    />
                  )}

                  <TouchableOpacity
                    style={styles.chooseFileBtn}
                    onPress={() => {
                      if (Platform.OS === 'web' && typeof document !== 'undefined') {
                        document.getElementById('dish-photo-picker-input')?.click();
                      }
                    }}
                  >
                    <Upload size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={styles.chooseFileBtnText}>
                      {selectedFile ? 'Choose a Different Photo File' : 'Browse & Select Image File'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Aspect Ratio / Crop Options */}
                <View style={{ marginTop: SPACING.md }}>
                  <Text style={styles.label}>Menu Display Crop:</Text>
                  <View style={styles.aspectRatioRow}>
                    <TouchableOpacity
                      style={[styles.aspectRatioBtn, cropAspect === (4 / 3) && styles.aspectRatioBtnActive]}
                      onPress={() => setCropAspect(4 / 3)}
                    >
                      <Text style={[styles.aspectRatioBtnText, cropAspect === (4 / 3) && styles.aspectRatioBtnTextActive]}>
                        4:3 Standard Menu (Recommended)
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.aspectRatioBtn, cropAspect === 1 && styles.aspectRatioBtnActive]}
                      onPress={() => setCropAspect(1)}
                    >
                      <Text style={[styles.aspectRatioBtnText, cropAspect === 1 && styles.aspectRatioBtnTextActive]}>
                        1:1 Square
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.aspectRatioBtn, cropAspect === 0 && styles.aspectRatioBtnActive]}
                      onPress={() => setCropAspect(0)}
                    >
                      <Text style={[styles.aspectRatioBtnText, cropAspect === 0 && styles.aspectRatioBtnTextActive]}>
                        Original Aspect Ratio
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Metadata Fields */}
                <View style={{ marginTop: SPACING.md, gap: 10 }}>
                  <View>
                    <Text style={styles.label}>Image Alt Text (SEO & Accessibility):</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. Chicken Biryani at Dream Love Cafe & Restaurant"
                      placeholderTextColor={COLORS.textSubtle}
                      value={customAltText}
                      onChangeText={setCustomAltText}
                    />
                  </View>

                  <View>
                    <Text style={styles.label}>Photographer / Uploader Name:</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. Restaurant Owner / Staff Name"
                      placeholderTextColor={COLORS.textSubtle}
                      value={replacementAuthor}
                      onChangeText={setReplacementAuthor}
                    />
                  </View>
                </View>

                {/* Upload Stage & Real Progress Bar */}
                {uploadStage !== 'idle' && (
                  <View style={styles.uploadProgressContainer}>
                    <View style={styles.progressLabelRow}>
                      <Text style={styles.uploadStageText}>
                        {uploadStage === 'reading' && 'Reading photo file...'}
                        {uploadStage === 'optimizing' && 'Optimizing & cropping WebP (1000px display, 320px thumb)...'}
                        {uploadStage === 'uploading' && `Uploading to Supabase Storage (${uploadProgress}%)...`}
                        {uploadStage === 'saving' && 'Saving record in database & updating menu...'}
                        {uploadStage === 'done' && '✓ Photo Saved Permanently & Published!'}
                      </Text>
                      <Text style={styles.uploadPercentText}>{uploadProgress}%</Text>
                    </View>
                    <View style={styles.uploadProgressBarTrack}>
                      <View style={[styles.uploadProgressBarFill, { width: `${uploadProgress}%` as any }]} />
                    </View>
                  </View>
                )}

                {/* Error Banner */}
                {uploadError && (
                  <View style={styles.uploadErrorBanner}>
                    <AlertTriangle size={18} color={COLORS.errorLight} style={{ marginRight: 8 }} />
                    <Text style={styles.uploadErrorText}>{uploadError}</Text>
                  </View>
                )}

                {/* Action Buttons */}
                <View style={styles.editActionRow}>
                  <TouchableOpacity
                    style={[
                      styles.saveItemBtn,
                      (!selectedFile || uploadStage !== 'idle') && { opacity: 0.6 }
                    ]}
                    onPress={() => handleSaveUploadedPhoto(editingImageItemId)}
                    disabled={!selectedFile || uploadStage !== 'idle'}
                  >
                    {uploadStage !== 'idle' ? (
                      <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
                    ) : (
                      <CheckCircle2 size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                    )}
                    <Text style={styles.saveItemBtnText}>
                      {uploadStage === 'uploading'
                        ? 'Uploading...'
                        : uploadStage === 'saving'
                        ? 'Saving...'
                        : uploadStage === 'done'
                        ? '✓ Photo Updated'
                        : 'Save New Photo to Storage'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => {
                      setEditingImageItemId(null);
                      setSelectedFile(null);
                      setSelectedFilePreview(null);
                      setSelectedFileMeta(null);
                      setUploadError(null);
                      setUploadStage('idle');
                    }}
                    disabled={uploadStage !== 'idle' && uploadStage !== 'done'}
                  >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Dishes Matrix Table */}
            <View style={styles.adminTable}>
              {filteredImageDishes.map((item) => {
                const url = item.image_url || item.image;
                const isReal = item.image_type === 'real_restaurant' && item.image_verified;
                const isDuplicate = url && (imageCounts[url] || 0) > 1;
                const isReviewRequired = item.normalization_status === 'owner_review_required' || item.dataQualityStatus === 'owner_review_required';
                const confidence = item.image_match_confidence || 'high';
                const isRegenerating = regeneratingItemId === item.id;

                return (
                  <View key={item.id} style={styles.imageTableRow}>
                    {/* 68px Thumbnail with Click to Preview */}
                    <TouchableOpacity 
                      style={styles.tableThumbContainer}
                      onPress={() => setPreviewModalItem(item)}
                      activeOpacity={0.8}
                    >
                      {url ? (
                        <>
                          <Image source={{ uri: url }} style={styles.tableThumb} resizeMode="cover" />
                          <View style={styles.tableThumbZoomOverlay}>
                            <Eye size={14} color="#FFFFFF" />
                          </View>
                        </>
                      ) : (
                        <View style={styles.tableThumbEmpty}>
                          <Camera size={20} color={COLORS.textSubtle} />
                        </View>
                      )}
                    </TouchableOpacity>

                    {/* Dish Metadata & Badges */}
                    <View style={{ flex: 1, paddingHorizontal: 12 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <Text style={styles.rowItemName}>{item.name}</Text>
                        {item.canonical_name && item.canonical_name !== item.name && (
                          <Text style={styles.canonicalTag}>({item.canonical_name})</Text>
                        )}
                        {item.isVeg ? (
                          <View style={styles.smallVegBadge} />
                        ) : (
                          <View style={styles.smallNonVegBadge} />
                        )}
                      </View>

                      <Text style={styles.rowItemSub}>
                        {item.category} • {item.price ? `₹${item.price}` : item.portion || 'Price on request'}
                      </Text>

                      <View style={styles.imageBadgeRow}>
                        {/* 1. Verified vs Temporary Mock */}
                        {isReal ? (
                          <View style={styles.verifiedImageBadge}>
                            <CheckCircle2 size={11} color={COLORS.brandGreen} style={{ marginRight: 3 }} />
                            <Text style={styles.verifiedImageText}>✓ Real Restaurant Photo</Text>
                          </View>
                        ) : url ? (
                          <View style={styles.mockImageBadge}>
                            <Clock size={11} color={COLORS.gold} style={{ marginRight: 3 }} />
                            <Text style={styles.mockImageText}>◷ Temporary Mock</Text>
                          </View>
                        ) : (
                          <View style={styles.missingImageBadge}>
                            <Text style={styles.missingImageText}>○ No Image</Text>
                          </View>
                        )}

                        {/* 2. Match Confidence Badge */}
                        <View style={[
                          styles.confidenceBadge,
                          confidence === 'high' && styles.confidenceHigh,
                          confidence === 'medium' && styles.confidenceMedium,
                          confidence === 'low' && styles.confidenceLow,
                        ]}>
                          <Text style={[
                            styles.confidenceBadgeText,
                            confidence === 'high' && styles.confidenceHighText,
                            confidence === 'medium' && styles.confidenceMediumText,
                            confidence === 'low' && styles.confidenceLowText,
                          ]}>
                            Match: {confidence.toUpperCase()}
                          </Text>
                        </View>

                        {/* 3. Unique Image vs Duplicate Warning */}
                        {isDuplicate ? (
                          <View style={styles.duplicateWarningBadge}>
                            <AlertTriangle size={11} color="#FFFFFF" style={{ marginRight: 3 }} />
                            <Text style={styles.duplicateWarningText}>Used by {imageCounts[url]}x dishes</Text>
                          </View>
                        ) : (
                          <View style={styles.uniqueImageBadge}>
                            <Check size={11} color={COLORS.brandGreen} style={{ marginRight: 3 }} />
                            <Text style={styles.uniqueImageText}>Unique Image ✓</Text>
                          </View>
                        )}

                        {/* 4. Owner Review Required Badge */}
                        {isReviewRequired && (
                          <View style={styles.ownerReviewBadge}>
                            <HelpCircle size={11} color={COLORS.copperLight} style={{ marginRight: 3 }} />
                            <Text style={styles.ownerReviewBadgeText}>Owner Review Required</Text>
                          </View>
                        )}

                        {/* 5. Replacement Required Badge */}
                        {item.image_replacement_required && !isReal && (
                          <View style={styles.replacementRequiredBadge}>
                            <Text style={styles.replacementRequiredText}>Replacement Required</Text>
                          </View>
                        )}
                      </View>
                    </View>

                    {/* Row Action Buttons */}
                    <View style={styles.rowActions}>
                      <TouchableOpacity
                        style={styles.previewBtn}
                        onPress={() => setPreviewModalItem(item)}
                      >
                        <Eye size={14} color={COLORS.cream} style={{ marginRight: 4 }} />
                        <Text style={styles.previewBtnText}>Preview</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.historyBtn}
                        onPress={() => handleOpenHistoryModal(item)}
                      >
                        <History size={13} color={COLORS.textMuted} style={{ marginRight: 4 }} />
                        <Text style={styles.historyBtnText}>History</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.regenerateBtn}
                        onPress={() => handleRegenerateMock(item)}
                        disabled={isRegenerating}
                      >
                        {isRegenerating ? (
                          <ActivityIndicator size="small" color={COLORS.brandTurquoise} />
                        ) : (
                          <>
                            <RefreshCw size={13} color={COLORS.brandTurquoise} style={{ marginRight: 4 }} />
                            <Text style={styles.regenerateBtnText}>Regenerate</Text>
                          </>
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.replaceBtn}
                        onPress={() => {
                          setEditingImageItemId(item.id);
                          setSelectedFile(null);
                          setSelectedFilePreview(null);
                          setSelectedFileMeta(null);
                          setCustomAltText(`${item.name} at Dream Love Cafe & Restaurant`);
                          setUploadError(null);
                        }}
                      >
                        <Camera size={14} color={COLORS.background} style={{ marginRight: 4 }} />
                        <Text style={styles.replaceBtnText}>Replace Photo</Text>
                      </TouchableOpacity>

                      {item.previous_image_url && (
                        <TouchableOpacity
                          style={styles.rollbackBtn}
                          onPress={() => handleRollbackImage(item)}
                          accessibilityLabel="Rollback image"
                        >
                          <RotateCcw size={14} color={COLORS.textMuted} />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Preview Lightbox Modal */}
            {previewModalItem && (
              <View style={styles.modalBackdrop}>
                <View style={styles.previewModalCard}>
                  <View style={styles.previewModalHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.previewModalTitle}>{previewModalItem.name}</Text>
                      <Text style={styles.previewModalSubtitle}>
                        {previewModalItem.category} • {previewModalItem.price ? `₹${previewModalItem.price}` : 'Price on request'}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => setPreviewModalItem(null)}>
                      <XCircle size={24} color={COLORS.textMuted} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.previewModalImageWrapper}>
                    <Image 
                      source={{ uri: previewModalItem.image_url || previewModalItem.image }} 
                      style={styles.previewModalLargeImg} 
                      resizeMode="cover" 
                    />
                  </View>

                  <View style={styles.previewModalMetadataRow}>
                    <View style={styles.previewMetaItem}>
                      <Text style={styles.previewMetaLabel}>Type:</Text>
                      <Text style={styles.previewMetaVal}>
                        {previewModalItem.image_type === 'real_restaurant' ? '✓ Authentic Real Photo' : '◷ Temporary Mock Photo'}
                      </Text>
                    </View>

                    <View style={styles.previewMetaItem}>
                      <Text style={styles.previewMetaLabel}>Match Confidence:</Text>
                      <Text style={styles.previewMetaVal}>
                        {(previewModalItem.image_match_confidence || 'high').toUpperCase()}
                      </Text>
                    </View>

                    <View style={styles.previewMetaItem}>
                      <Text style={styles.previewMetaLabel}>Hash Signature:</Text>
                      <Text style={styles.previewMetaVal}>
                        {previewModalItem.image_hash || 'auto_assigned'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.previewModalActionRow}>
                    <TouchableOpacity
                      style={styles.modalReplaceBtn}
                      onPress={() => {
                        const itemToEdit = previewModalItem;
                        setPreviewModalItem(null);
                        setEditingImageItemId(itemToEdit.id);
                        setSelectedFile(null);
                        setSelectedFilePreview(null);
                        setSelectedFileMeta(null);
                        setCustomAltText(`${itemToEdit.name} at Dream Love Cafe & Restaurant`);
                        setUploadError(null);
                      }}
                    >
                      <Camera size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                      <Text style={styles.modalReplaceBtnText}>Upload Restaurant Photo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.modalCloseBtn}
                      onPress={() => setPreviewModalItem(null)}
                    >
                      <Text style={styles.modalCloseBtnText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

            {/* Version History Modal */}
            {historyModalItem && (
              <View style={styles.modalBackdrop}>
                <View style={styles.historyModalCard}>
                  <View style={styles.previewModalHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.previewModalTitle}>Photo History: {historyModalItem.name}</Text>
                      <Text style={styles.previewModalSubtitle}>Past uploaded photos and rollback versions</Text>
                    </View>
                    <TouchableOpacity onPress={() => setHistoryModalItem(null)}>
                      <XCircle size={24} color={COLORS.textMuted} />
                    </TouchableOpacity>
                  </View>

                  {loadingVersions ? (
                    <ActivityIndicator size="large" color={COLORS.brandTurquoise} style={{ marginVertical: 32 }} />
                  ) : itemVersions.length === 0 ? (
                    <View style={{ padding: 24, alignItems: 'center' }}>
                      <Clock size={32} color={COLORS.textSubtle} />
                      <Text style={{ color: COLORS.textMuted, marginTop: 8 }}>No previous image versions recorded for this dish.</Text>
                    </View>
                  ) : (
                    <ScrollView style={{ maxHeight: 360, marginVertical: 12 }}>
                      {itemVersions.map((ver, vIdx) => (
                        <View key={vIdx} style={styles.historyItemCard}>
                          <Image source={{ uri: ver.image_url }} style={styles.historyThumb} resizeMode="cover" />
                          <View style={styles.historyMeta}>
                            <Text style={styles.historyAuthor}>Uploaded by: {ver.replaced_by || 'Restaurant Owner'}</Text>
                            <Text style={styles.historyDate}>{new Date(ver.replaced_at).toLocaleString()}</Text>
                            {ver.is_current && <Text style={styles.historyCurrentBadge}>● Current Active Photo</Text>}
                          </View>
                          {!ver.is_current && (
                            <TouchableOpacity
                              style={styles.historyRestoreBtn}
                              onPress={() => handleRestoreVersion(ver)}
                            >
                              <RotateCcw size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
                              <Text style={styles.historyRestoreBtnText}>Restore</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      ))}
                    </ScrollView>
                  )}

                  <TouchableOpacity
                    style={styles.modalCloseBtn}
                    onPress={() => setHistoryModalItem(null)}
                  >
                    <Text style={styles.modalCloseBtnText}>Close History</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}

        {/* ── TAB: MENU MANAGEMENT ── */}
        {activeTab === 'menu' && (
          <View>
            <View style={styles.tabHeaderRow}>
              <View>
                <Text style={styles.tabHeading}>Menu Management</Text>
                <Text style={styles.tabSubheading}>Total {menuItems.length} dishes in database.</Text>
              </View>

              <TouchableOpacity style={styles.addItemBtn} onPress={() => setIsAddingItem(!isAddingItem)}>
                <Plus size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.addItemBtnText}>{isAddingItem ? 'Close Form' : 'Add New Dish'}</Text>
              </TouchableOpacity>
            </View>

            {isAddingItem && (
              <View style={styles.addItemCard}>
                <Text style={styles.formPanelTitle}>Add Dish to Menu</Text>
                <TextInput
                  style={[styles.input, { marginTop: 10 }]}
                  placeholder="Dish Name (e.g. Chicken Dum Biryani)"
                  placeholderTextColor={COLORS.textSubtle}
                  value={newItemName}
                  onChangeText={setNewItemName}
                />
                <TextInput
                  style={[styles.input, { marginTop: 8 }]}
                  placeholder="Price in INR (e.g. 190)"
                  placeholderTextColor={COLORS.textSubtle}
                  keyboardType="numeric"
                  value={newItemPrice}
                  onChangeText={setNewItemPrice}
                />
                <TextInput
                  style={[styles.input, { marginTop: 8 }]}
                  placeholder="Short Description"
                  placeholderTextColor={COLORS.textSubtle}
                  value={newItemDesc}
                  onChangeText={setNewItemDesc}
                />
                <TouchableOpacity style={styles.saveItemBtn} onPress={handleCreateMenuItem}>
                  <Text style={styles.saveItemBtnText}>Save Dish</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.adminTable}>
              {menuItems.map((item) => (
                <View key={item.id} style={styles.tableRow}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={styles.rowItemName}>{item.name}</Text>
                      {item.isVeg ? (
                        <View style={styles.smallVegBadge} />
                      ) : (
                        <View style={styles.smallNonVegBadge} />
                      )}
                    </View>
                    <Text style={styles.rowItemSub}>
                      {item.category} • {item.price ? `₹${item.price}` : item.portion || 'Price on request'}
                    </Text>
                  </View>

                  <View style={styles.rowActions}>
                    <TouchableOpacity
                      style={[styles.statusToggle, item.isAvailable ? styles.availableBtn : styles.unavailableBtn]}
                      onPress={() => toggleAvailability(item.id)}
                    >
                      <Text style={styles.statusToggleText}>
                        {item.isAvailable ? 'In Stock' : 'Sold Out'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.featuredToggle, item.isFeatured && styles.featuredToggleActive]}
                      onPress={() => toggleFeatured(item.id)}
                    >
                      <Sparkles size={14} color={item.isFeatured ? COLORS.background : COLORS.gold} />
                    </TouchableOpacity>

                    {isOwnerOrAdmin && (
                      <TouchableOpacity 
                        style={styles.deleteRowBtn}
                        onPress={() => deleteMenuItem(item.id)}
                      >
                        <Trash2 size={16} color={COLORS.errorLight} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── TAB: LIVE ORDERS ── */}
        {activeTab === 'orders' && (
          <View>
            <View style={styles.tabHeaderRow}>
              <View>
                <Text style={styles.tabHeading}>Customer Orders</Text>
                <Text style={styles.tabSubheading}>Dine-in, takeaway, and delivery orders.</Text>
              </View>
              <TouchableOpacity style={styles.refreshBtn} onPress={fetchOrders}>
                <RefreshCw size={14} color={COLORS.brandTurquoise} style={{ marginRight: 6 }} />
                <Text style={styles.refreshBtnText}>Refresh</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.filterPillsRow}>
              {(['all', 'new', 'accepted', 'ready', 'completed'] as const).map((filterKey) => {
                const count = filterKey === 'all' 
                  ? orders.length 
                  : orders.filter(o => o.status === filterKey).length;

                return (
                  <TouchableOpacity
                    key={filterKey}
                    style={[styles.filterPill, orderFilter === filterKey && styles.filterPillActive]}
                    onPress={() => setOrderFilter(filterKey)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.filterPillText, orderFilter === filterKey && styles.filterPillTextActive]}>
                      {filterKey.toUpperCase()} ({count})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {orders.length === 0 ? (
              <View style={styles.emptyStateCard}>
                <ShoppingBag size={40} color={COLORS.textSubtle} style={{ marginBottom: 10 }} />
                <Text style={styles.emptyStateTitle}>No Orders Found</Text>
                <Text style={styles.emptyStateSub}>Incoming WhatsApp & online orders will appear here in real time.</Text>
              </View>
            ) : (
              <View style={styles.ordersList}>
                {orders
                  .filter(o => orderFilter === 'all' || o.status === orderFilter)
                  .map((order) => (
                  <View key={order.id} style={styles.orderCard}>
                    <View style={styles.orderHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.orderCustomer}>{order.customer_name}</Text>
                        <Text style={styles.orderPhone}>{order.customer_phone} • {order.order_type.toUpperCase()}</Text>
                        {order.delivery_address && (
                          <Text style={[styles.orderPhone, { color: COLORS.copperLight, marginTop: 2 }]}>
                            📍 {order.delivery_address}
                          </Text>
                        )}
                      </View>
                      <Text style={styles.orderTotal}>₹{order.total_amount}</Text>
                    </View>

                    <View style={styles.orderItemsBox}>
                      {order.items?.map((it, idx) => (
                        <Text key={idx} style={styles.orderItemText}>
                          {it.quantity}x {it.name} {it.price ? `(₹${it.price * it.quantity})` : ''} {it.portion ? `• ${it.portion}` : ''}
                        </Text>
                      ))}
                      {order.notes ? (
                        <Text style={[styles.orderItemText, { color: COLORS.gold, fontStyle: 'italic', marginTop: 4 }]}>
                          Note: {order.notes}
                        </Text>
                      ) : null}
                    </View>

                    <View style={styles.orderActionsRow}>
                      <View style={[
                        styles.statusPill,
                        order.status === 'completed' ? styles.statusPillConfirmed :
                        order.status === 'ready' ? styles.statusPillPending :
                        order.status === 'accepted' ? styles.statusPillPending :
                        styles.statusPillCancelled
                      ]}>
                        <Text style={styles.statusPillText}>{order.status.toUpperCase()}</Text>
                      </View>

                      {/* Customer Contact & Status Actions */}
                      <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* Call Customer */}
                        {order.customer_phone && (
                          <TouchableOpacity 
                            style={styles.actionIconBtn}
                            onPress={() => Linking.openURL(`tel:${order.customer_phone.replace(/[^0-9+]/g, '')}`)}
                            accessibilityLabel="Call Customer"
                          >
                            <Phone size={13} color={COLORS.brandTurquoise} />
                          </TouchableOpacity>
                        )}

                        {/* WhatsApp Customer */}
                        {order.customer_phone && (
                          <TouchableOpacity 
                            style={styles.actionIconBtn}
                            onPress={() => {
                              const msg = encodeURIComponent(`Hello ${order.customer_name}, this is Dream Love Cafe & Restaurant regarding your order #${order.id?.slice(0, 6) || ''}. Total: ₹${order.total_amount}.`);
                              Linking.openURL(`https://wa.me/${order.customer_phone.replace(/[^0-9]/g, '')}?text=${msg}`);
                            }}
                            accessibilityLabel="WhatsApp Customer"
                          >
                            <MessageSquare size={13} color={COLORS.brandGreen} />
                          </TouchableOpacity>
                        )}

                        {order.status === 'new' && (
                          <TouchableOpacity 
                            style={styles.orderBtnAccept}
                            onPress={() => handleUpdateOrderStatus(order.id!, 'accepted')}
                          >
                            <Text style={styles.orderBtnText}>Accept</Text>
                          </TouchableOpacity>
                        )}
                        {order.status === 'accepted' && (
                          <TouchableOpacity 
                            style={styles.orderBtnReady}
                            onPress={() => handleUpdateOrderStatus(order.id!, 'ready')}
                          >
                            <Text style={styles.orderBtnText}>Mark Ready</Text>
                          </TouchableOpacity>
                        )}
                        {order.status !== 'completed' && order.status !== 'cancelled' && (
                          <TouchableOpacity 
                            style={styles.orderBtnComplete}
                            onPress={() => handleUpdateOrderStatus(order.id!, 'completed')}
                          >
                            <Text style={styles.orderBtnText}>Complete</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* ── TAB: TABLE RESERVATIONS ── */}
        {activeTab === 'reservations' && (
          <View>
            <View style={styles.tabHeaderRow}>
              <View>
                <Text style={styles.tabHeading}>Table Reservations</Text>
                <Text style={styles.tabSubheading}>Real-time customer table booking requests and seated guest management.</Text>
              </View>
              <TouchableOpacity style={styles.refreshBtn} onPress={fetchReservations}>
                <RefreshCw size={14} color={COLORS.brandTurquoise} style={{ marginRight: 6 }} />
                <Text style={styles.refreshBtnText}>Refresh</Text>
              </TouchableOpacity>
            </View>

            {/* Reservation Summary Metrics */}
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Today's Bookings</Text>
                <Text style={styles.metricValue}>
                  {reservations.filter(r => r.date === getKolkataCurrentDate() && r.status !== 'cancelled' && r.status !== 'rejected').length}
                </Text>
                <Text style={styles.metricSub}>For {formatDisplayDate(getKolkataCurrentDate())}</Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Expected Guests Today</Text>
                <Text style={styles.metricValue}>
                  {reservations
                    .filter(r => r.date === getKolkataCurrentDate() && r.status !== 'cancelled' && r.status !== 'rejected')
                    .reduce((sum, r) => sum + (r.guests || 2), 0)}
                </Text>
                <Text style={styles.metricSub}>Dine-in capacity</Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Pending Requests</Text>
                <Text style={[styles.metricValue, { color: COLORS.gold }]}>
                  {reservations.filter(r => r.status === 'pending').length}
                </Text>
                <Text style={styles.metricSub}>Awaiting confirmation</Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricLabel}>Upcoming Bookings</Text>
                <Text style={[styles.metricValue, { color: COLORS.brandTurquoise }]}>
                  {reservations.filter(r => r.date >= getKolkataCurrentDate() && r.status !== 'cancelled' && r.status !== 'rejected').length}
                </Text>
                <Text style={styles.metricSub}>Future reservations</Text>
              </View>
            </View>

            {/* Filter Pills */}
            <View style={styles.filterPillsRow}>
              {(['all', 'today', 'pending', 'confirmed', 'upcoming', 'completed', 'cancelled'] as const).map((filterKey) => {
                const count = filterKey === 'all' 
                  ? reservations.length 
                  : filterKey === 'today'
                  ? reservations.filter(r => r.date === getKolkataCurrentDate()).length
                  : filterKey === 'upcoming'
                  ? reservations.filter(r => r.date >= getKolkataCurrentDate() && r.status !== 'cancelled').length
                  : filterKey === 'cancelled'
                  ? reservations.filter(r => r.status === 'cancelled' || r.status === 'rejected').length
                  : reservations.filter(r => r.status === filterKey).length;

                return (
                  <TouchableOpacity
                    key={filterKey}
                    style={[styles.filterPill, reservationFilter === filterKey && styles.filterPillActive]}
                    onPress={() => setReservationFilter(filterKey)}
                  >
                    <Text style={[styles.filterPillText, reservationFilter === filterKey && styles.filterPillTextActive]}>
                      {filterKey.charAt(0).toUpperCase() + filterKey.slice(1)} ({count})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Reservations List */}
            {reservations.length === 0 ? (
              <View style={styles.emptyStateCard}>
                <Calendar size={40} color={COLORS.textSubtle} style={{ marginBottom: 10 }} />
                <Text style={styles.emptyStateTitle}>No Reservations Found</Text>
                <Text style={styles.emptyStateSub}>Table booking requests submitted online will appear here in real time.</Text>
              </View>
            ) : (
              <View style={styles.ordersList}>
                {reservations
                  .filter((r) => {
                    const today = getKolkataCurrentDate();
                    if (reservationFilter === 'today') return r.date === today;
                    if (reservationFilter === 'upcoming') return r.date >= today && r.status !== 'cancelled' && r.status !== 'rejected';
                    if (reservationFilter === 'pending') return r.status === 'pending';
                    if (reservationFilter === 'confirmed') return r.status === 'confirmed';
                    if (reservationFilter === 'completed') return r.status === 'completed';
                    if (reservationFilter === 'cancelled') return r.status === 'cancelled' || r.status === 'rejected';
                    return true;
                  })
                  .map((res) => {
                    const isToday = res.date === getKolkataCurrentDate();
                    return (
                      <View key={res.id} style={styles.orderCard}>
                        <View style={styles.orderHeader}>
                          <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                              <Text style={styles.orderCustomer}>{res.name}</Text>
                              {(res as any).reference_code && (
                                <View style={styles.refBadge}>
                                  <Text style={styles.refBadgeText}>{(res as any).reference_code}</Text>
                                </View>
                              )}
                              {isToday && (
                                <View style={styles.todayBadge}>
                                  <Text style={styles.todayBadgeText}>TODAY</Text>
                                </View>
                              )}
                            </View>
                            <Text style={styles.orderPhone}>{res.phone} • {res.guests} {res.guests === 1 ? 'Guest' : 'Guests'}</Text>
                          </View>

                          <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.resDateText}>{formatDisplayDate(res.date, true)}</Text>
                            <Text style={styles.resTimeText}>{formatTime12Hour(res.time)}</Text>
                          </View>
                        </View>

                        {res.special_request ? (
                          <View style={styles.specialRequestBox}>
                            <Text style={styles.resSpecialRequest}>Note: {res.special_request}</Text>
                          </View>
                        ) : null}

                        <View style={styles.orderActionsRow}>
                          {/* Status Badge */}
                          <View style={[
                            styles.statusPill,
                            res.status === 'confirmed' ? styles.statusPillConfirmed :
                            res.status === 'pending' ? styles.statusPillPending :
                            res.status === 'completed' ? styles.statusPillCompleted :
                            styles.statusPillCancelled
                          ]}>
                            <Text style={styles.statusPillText}>
                              {res.status.toUpperCase()}
                            </Text>
                          </View>

                          {/* Quick Contact & Status Actions */}
                          <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                            {/* Call */}
                            <TouchableOpacity 
                              style={styles.actionIconBtn}
                              onPress={() => Linking.openURL(`tel:${res.phone.replace(/[^0-9+]/g, '')}`)}
                              accessibilityLabel="Call Customer"
                            >
                              <Phone size={13} color={COLORS.brandTurquoise} />
                            </TouchableOpacity>

                            {/* WhatsApp */}
                            <TouchableOpacity 
                              style={styles.actionIconBtn}
                              onPress={() => {
                                const msg = encodeURIComponent(`Hello ${res.name}, this is Dream Love Cafe & Restaurant regarding your table reservation for ${res.guests} guests on ${formatDisplayDate(res.date)} at ${formatTime12Hour(res.time)}.`);
                                Linking.openURL(`https://wa.me/${res.phone.replace(/[^0-9]/g, '')}?text=${msg}`);
                              }}
                              accessibilityLabel="WhatsApp Customer"
                            >
                              <MessageSquare size={13} color={COLORS.brandGreen} />
                            </TouchableOpacity>

                            {res.status === 'pending' && (
                              <>
                                <TouchableOpacity 
                                  style={styles.orderBtnAccept}
                                  onPress={() => handleUpdateReservationStatus(res.id!, 'confirmed')}
                                >
                                  <Check size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
                                  <Text style={styles.orderBtnText}>Confirm</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                  style={styles.orderBtnCancel}
                                  onPress={() => handleUpdateReservationStatus(res.id!, 'rejected')}
                                >
                                  <X size={13} color={COLORS.errorLight} style={{ marginRight: 4 }} />
                                  <Text style={styles.orderBtnText}>Decline</Text>
                                </TouchableOpacity>
                              </>
                            )}

                            {res.status === 'confirmed' && (
                              <>
                                <TouchableOpacity 
                                  style={styles.orderBtnComplete}
                                  onPress={() => handleUpdateReservationStatus(res.id!, 'completed')}
                                >
                                  <CheckCircle size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
                                  <Text style={styles.orderBtnText}>Mark Seated</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                  style={styles.orderBtnCancel}
                                  onPress={() => handleUpdateReservationStatus(res.id!, 'cancelled')}
                                >
                                  <Text style={styles.orderBtnText}>Cancel</Text>
                                </TouchableOpacity>
                              </>
                            )}
                          </View>
                        </View>
                      </View>
                    );
                  })}
              </View>
            )}
          </View>
        )}

        {/* ── TAB: STAFF & ACCESS MANAGEMENT (Owner/Admin) ── */}
        {activeTab === 'staff' && isOwnerOrAdmin && (
          <View>
            <View style={styles.tabHeaderRow}>
              <View>
                <Text style={styles.tabHeading}>Staff & Access Management</Text>
                <Text style={styles.tabSubheading}>
                  Approve pending staff registrations, assign roles, and manage portal access.
                </Text>
              </View>
              <TouchableOpacity style={styles.refreshBtn} onPress={fetchStaffProfiles}>
                <RefreshCw size={14} color={COLORS.brandTurquoise} style={{ marginRight: 6 }} />
                <Text style={styles.refreshBtnText}>Refresh Staff</Text>
              </TouchableOpacity>
            </View>

            {staffActionMsg ? (
              <View style={styles.successBanner}>
                <Text style={styles.successBannerText}>{staffActionMsg}</Text>
              </View>
            ) : null}

            {/* Active Administrators & Staff */}
            <Text style={styles.sectionHeader}>
              Active Administrators & Staff ({staffProfiles.filter(p => p.status === 'active').length || 1})
            </Text>
            <View style={styles.adminTable}>
              {staffProfiles.filter(p => p.status === 'active').map((st) => (
                <View key={st.id} style={styles.tableRow}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={styles.rowItemName}>{st.full_name}</Text>
                      <View style={[styles.roleTag, st.role === 'owner' ? styles.roleTagOwner : styles.roleTagStaff]}>
                        <Text style={styles.roleTagText}>{st.role.toUpperCase()}</Text>
                      </View>
                    </View>
                    <Text style={styles.rowItemSub}>{st.email} • Active since {new Date(st.created_at).toLocaleDateString()}</Text>
                  </View>

                  {/* Role Change & Suspend Actions */}
                  {st.auth_user_id !== user.id && (
                    <View style={styles.rowActions}>
                      {st.role !== 'manager' && (
                        <TouchableOpacity 
                          style={styles.roleActionBtn}
                          onPress={() => handleUpdateStaffRole(st.id, 'manager')}
                        >
                          <Text style={styles.roleActionBtnText}>Make Manager</Text>
                        </TouchableOpacity>
                      )}
                      {st.role !== 'staff' && (
                        <TouchableOpacity 
                          style={styles.roleActionBtn}
                          onPress={() => handleUpdateStaffRole(st.id, 'staff')}
                        >
                          <Text style={styles.roleActionBtnText}>Make Staff</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity 
                        style={styles.suspendBtn}
                        onPress={() => handleUpdateStaffStatus(st.id, 'suspended')}
                      >
                        <Text style={styles.suspendBtnText}>Suspend</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))}
            </View>

            {/* Section 3: Suspended Accounts */}
            {staffProfiles.some(p => p.status === 'suspended') && (
              <>
                <Text style={[styles.sectionHeader, { marginTop: SPACING.xl }]}>
                  Suspended Accounts ({staffProfiles.filter(p => p.status === 'suspended').length})
                </Text>
                <View style={styles.adminTable}>
                  {staffProfiles.filter(p => p.status === 'suspended').map((st) => (
                    <View key={st.id} style={styles.tableRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.rowItemName}>{st.full_name} ({st.email})</Text>
                        <Text style={[styles.rowItemSub, { color: COLORS.errorLight }]}>Suspended Account</Text>
                      </View>
                      <View style={styles.rowActions}>
                        <TouchableOpacity 
                          style={styles.approveBtn}
                          onPress={() => handleUpdateStaffStatus(st.id, 'active')}
                        >
                          <Text style={styles.approveBtnText}>Reactivate</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.deleteRowBtn}
                          onPress={() => handleDeleteStaffProfile(st.id)}
                        >
                          <Trash2 size={16} color={COLORS.errorLight} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        )}

        {/* ── TAB: STOREFRONT GALLERY ── */}
        {activeTab === 'gallery' && (
          <View>
            <Text style={styles.tabHeading}>Storefront Gallery Photos</Text>
            <Text style={styles.tabSubheading}>Real authentic exterior and interior restaurant photographs.</Text>

            <View style={styles.galleryGrid}>
              {galleryItems.map((item) => (
                <View key={item.id} style={styles.galleryCard}>
                  <Image source={{ uri: item.image_url }} style={styles.galleryCardImg} resizeMode="cover" />
                  <View style={styles.galleryCardBody}>
                    <Text style={styles.galleryCardTitle}>{item.title}</Text>
                    <Text style={styles.galleryCardSub}>{item.caption || item.alt_text}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── TAB: CUSTOMER REVIEWS & RATINGS ── */}
        {activeTab === 'reviews' && (
          <View>
            <View style={styles.tabHeaderRow}>
              <View>
                <Text style={styles.tabHeading}>Verified Customer Reviews</Text>
                <Text style={styles.tabSubheading}>
                  Authentic diner feedback aggregated from Google Maps, Justdial, Magicpin, and in-house diners.
                </Text>
              </View>
            </View>

            {/* Reviews Scoreboard */}
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={[styles.statVal, { color: COLORS.gold }]}>{settings.googleRating} ★</Text>
                <Text style={styles.statLbl}>Google Rating ({settings.googleReviewsCount} Reviews)</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statVal, { color: COLORS.brandTurquoise }]}>{settings.justdialRating} ★</Text>
                <Text style={styles.statLbl}>Justdial Rating (4.0 ★)</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statVal, { color: COLORS.brandGreen }]}>{settings.magicpinRating} ★</Text>
                <Text style={styles.statLbl}>Magicpin Rating (4.1 ★)</Text>
              </View>
            </View>

            {/* Reviews List */}
            <View style={styles.ordersList}>
              {verifiedReviews.map((rev) => (
                <View key={rev.id} style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <View>
                      <Text style={styles.orderCustomer}>{rev.reviewerName || 'Verified Diner'}</Text>
                      <Text style={styles.orderPhone}>Source: {rev.source} • {rev.reviewDate || 'Recent'}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={15} 
                          color={star <= rev.rating ? COLORS.gold : COLORS.border} 
                          fill={star <= rev.rating ? COLORS.gold : 'transparent'} 
                        />
                      ))}
                    </View>
                  </View>

                  <Text style={styles.reviewCommentText}>"{rev.reviewText}"</Text>

                  {rev.aspects && rev.aspects.length > 0 && (
                    <View style={styles.reviewAspectsRow}>
                      {rev.aspects.map((asp, aIdx) => (
                        <View key={aIdx} style={styles.aspectChip}>
                          <Text style={styles.aspectChipText}>{asp}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── TAB: LISTING SYNC ── */}
        {activeTab === 'verification' && (
          <View>
            <Text style={styles.tabHeading}>External Listing Data Sync</Text>
            <Text style={styles.tabSubheading}>Reconcile conflicts between Google, Justdial, and Magicpin listings.</Text>

            <View style={styles.conflictList}>
              {dataConflicts.map((conf) => (
                <View key={conf.id} style={styles.conflictCard}>
                  <Text style={styles.conflictTitle}>{conf.title}</Text>
                  <View style={styles.conflictValuesRow}>
                    <View style={styles.conflictValBox}>
                      <Text style={styles.conflictSource}>{conf.sourceA}</Text>
                      <Text style={styles.conflictVal}>{conf.valueA}</Text>
                    </View>
                    <View style={styles.conflictValBox}>
                      <Text style={styles.conflictSource}>{conf.sourceB}</Text>
                      <Text style={styles.conflictVal}>{conf.valueB}</Text>
                    </View>
                  </View>
                  <View style={styles.conflictResolvedStrip}>
                    <Text style={styles.conflictCurrentLbl}>Active Value:</Text>
                    <Text style={styles.conflictCurrentVal}>{conf.currentValue}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── TAB: RESTAURANT SETTINGS & MAP (Owner/Admin) ── */}
        {activeTab === 'settings' && isOwnerOrAdmin && (
          <View>
            <Text style={styles.tabHeading}>Restaurant Information & Google Maps</Text>
            <Text style={styles.tabSubheading}>
              Manage verified contact details, physical address, Plus Code, and Google Maps embed.
            </Text>

            <View style={styles.settingsFormCard}>
              <Text style={styles.formSectionTitle}>Verified Contact Details</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Primary Phone (Storefront Verified)</Text>
                <TextInput
                  style={styles.input}
                  value={editPhone}
                  onChangeText={setEditPhone}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Secondary Phone</Text>
                <TextInput
                  style={styles.input}
                  value={editPhoneSecondary}
                  onChangeText={setEditPhoneSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>WhatsApp Ordering Number</Text>
                <TextInput
                  style={styles.input}
                  value={editWhatsapp}
                  onChangeText={setEditWhatsapp}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Operating Hours</Text>
                <TextInput
                  style={styles.input}
                  value={editHours}
                  onChangeText={setEditHours}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Typical Spend Range</Text>
                <TextInput
                  style={styles.input}
                  value={editPriceRange}
                  onChangeText={setEditPriceRange}
                />
              </View>

              <Text style={[styles.formSectionTitle, { marginTop: SPACING.lg }]}>Location & Google Maps</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Physical Address</Text>
                <TextInput
                  style={[styles.input, { height: 70 }]}
                  multiline={true}
                  value={editAddress}
                  onChangeText={setEditAddress}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Google Plus Code</Text>
                <TextInput
                  style={styles.input}
                  value={editPlusCode}
                  onChangeText={setEditPlusCode}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Google Maps Canonical URL</Text>
                <TextInput
                  style={styles.input}
                  value={editGoogleMapsUrl}
                  onChangeText={setEditGoogleMapsUrl}
                />
              </View>

              {settingsSaveMsg ? (
                <View style={styles.successBanner}>
                  <Text style={styles.successBannerText}>{settingsSaveMsg}</Text>
                </View>
              ) : null}

              <TouchableOpacity style={styles.saveSettingsBtn} onPress={handleSaveSettings}>
                <Text style={styles.saveSettingsBtnText}>Save Settings to Database</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

      </ScrollView>

      {/* ── SIGN OUT CONFIRMATION MODAL ── */}
      <Modal
        visible={showLogoutConfirm}
        transparent={true}
        animationType="fade"
        onRequestClose={() => !isLoggingOut && setShowLogoutConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable 
            style={styles.modalBackdropDismiss} 
            onPress={() => !isLoggingOut && setShowLogoutConfirm(false)} 
            accessibilityLabel="Close dialog backdrop"
          />
          <View style={styles.logoutModalCard}>
            <View style={styles.logoutModalIconBox}>
              <LogOut size={26} color={COLORS.errorLight} />
            </View>

            <Text style={styles.logoutModalTitle}>Sign out?</Text>
            <Text style={styles.logoutModalSub}>
              You'll need to sign in again to access the admin dashboard.
            </Text>

            {logoutError ? (
              <View style={styles.logoutErrorBanner}>
                <AlertCircle size={14} color={COLORS.errorLight} style={{ marginRight: 6 }} />
                <Text style={styles.logoutErrorText}>{logoutError}</Text>
              </View>
            ) : null}

            <View style={styles.logoutModalActions}>
              <TouchableOpacity
                style={styles.logoutCancelBtn}
                onPress={() => setShowLogoutConfirm(false)}
                disabled={isLoggingOut}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Cancel sign out"
              >
                <Text style={styles.logoutCancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.logoutConfirmBtn, isLoggingOut && { opacity: 0.7 }]}
                onPress={handleConfirmLogout}
                disabled={isLoggingOut}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Confirm and sign out"
              >
                {isLoggingOut ? (
                  <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 6 }} />
                ) : (
                  <LogOut size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
                )}
                <Text style={styles.logoutConfirmBtnText}>
                  {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  loadingText: {
    color: COLORS.textMuted,
    marginTop: 12,
    fontSize: 14,
  },
  unauthorizedContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  unauthorizedCard: {
    maxWidth: 480,
    width: '100%',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xxl,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    ...SHADOWS.card,
  },
  shieldIconBox: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(239, 83, 80, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  unauthorizedTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 8,
    textAlign: 'center',
  },
  unauthorizedSub: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: SPACING.xl,
  },
  unauthorizedActions: {
    width: '100%',
    gap: 12,
  },
  signInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.brandHeart,
    width: '100%',
    paddingVertical: 13,
    borderRadius: BORDER_RADIUS.md,
  },
  signInBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  signupLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.brandTurquoise + '40',
    width: '100%',
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
  },
  signupLinkText: {
    color: COLORS.brandTurquoise,
    fontSize: 14,
    fontWeight: '600',
  },

  // Admin Layout Container
  adminContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    ...(Platform.OS === 'web' ? { height: '100vh', maxHeight: '100vh', overflow: 'hidden' } : {}),
  } as any,
  adminContainerMobile: {
    flexDirection: 'column',
    ...(Platform.OS === 'web' ? { height: 'auto', overflow: 'visible' } : {}),
  } as any,
  adminSidebar: {
    width: 270,
    backgroundColor: COLORS.surfaceElevated,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    maxHeight: (Platform.OS === 'web' ? '100vh' : '100%') as any,
    justifyContent: 'space-between',
  },
  adminSidebarMobile: {
    width: '100%',
    borderRightWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    padding: SPACING.md,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLogoutIconBtn: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: 'rgba(239, 83, 80, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 83, 80, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  avatarBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.brandTurquoise + '25',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.brandTurquoise,
  },
  avatarText: {
    color: COLORS.brandTurquoise,
    fontWeight: '800',
    fontSize: 15,
  },
  sidebarUserName: {
    color: COLORS.cream,
    fontSize: 13.5,
    fontWeight: '700',
  },
  roleBadgeContainer: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.copper + '25',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginTop: 2,
  },
  roleBadgeText: {
    color: COLORS.copper,
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  sidebarNavScroll: {
    flex: 1,
    marginVertical: SPACING.xs,
  },
  sidebarNav: {
    gap: 4,
    paddingVertical: SPACING.xs,
  },
  sidebarNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8.5,
    paddingHorizontal: 12,
    borderRadius: BORDER_RADIUS.md,
    gap: 10,
  },
  sidebarNavItemActive: {
    backgroundColor: COLORS.surfaceHover,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.brandTurquoise,
  },
  sidebarNavText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  sidebarNavTextActive: {
    color: COLORS.cream,
    fontWeight: '700',
  },
  sidebarBottomArea: {
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: 'rgba(239, 83, 80, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(239, 83, 80, 0.45)',
    width: '100%',
  },
  logoutBtnHover: {
    backgroundColor: 'rgba(239, 83, 80, 0.22)',
    borderColor: 'rgba(239, 83, 80, 0.75)',
  },
  logoutBtnFocused: {
    borderColor: COLORS.brandHeart,
    borderWidth: 2,
  },
  logoutBtnText: {
    color: COLORS.errorLight,
    fontSize: 13.5,
    fontWeight: '700',
  },

  // Admin Main
  adminMain: {
    flex: 1,
  },
  adminMainContent: {
    padding: SPACING.xl,
    maxWidth: 1150,
    width: '100%',
  },
  tabHeading: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 4,
  },
  tabSubheading: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: SPACING.lg,
  },
  tabHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    flexWrap: 'wrap',
    gap: 12,
  },

  // Stats Grid (Dashboard)
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: SPACING.xxl,
  },
  statCard: {
    flex: 1,
    minWidth: 160,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statVal: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.cream,
  },
  statLbl: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: SPACING.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: SPACING.xxl,
  },
  quickActionCard: {
    flex: 1,
    minWidth: 220,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quickActionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 4,
  },
  quickActionSub: {
    fontSize: 12,
    color: COLORS.textMuted,
  },

  // Photography Progress Card
  photographyProgressCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  progressCardTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.cream,
  },
  progressCardSubtitle: {
    fontSize: 12.5,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  progressBadgeContainer: {
    alignItems: 'flex-end',
  },
  progressPercentText: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.brandTurquoise,
  },
  progressBadgeSub: {
    fontSize: 11,
    color: COLORS.brandGreen,
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: COLORS.surface,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.brandTurquoise,
    borderRadius: 4,
  },
  metricsStrip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  metricItem: {
    flex: 1,
    minWidth: 110,
  },
  metricItemVal: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.cream,
  },
  metricItemLbl: {
    fontSize: 11.5,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  qualityStrip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  qualityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BORDER_RADIUS.sm,
    gap: 6,
  },
  qualityChipLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  qualityChipVal: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.cream,
  },

  // Bulk Fix & Banners
  bulkFixBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.errorLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.md,
  },
  bulkFixBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 125, 50, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.brandGreen,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  successBannerText: {
    color: COLORS.brandGreen,
    fontSize: 13,
    fontWeight: '600',
  },

  // Duplicate Inspector
  duplicateInspectorCard: {
    backgroundColor: 'rgba(211, 47, 47, 0.08)',
    borderWidth: 1,
    borderColor: COLORS.errorLight,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  duplicateInspectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  duplicateInspectorTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.errorLight,
  },
  duplicateInspectorSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  inspectorFixBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.errorLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.sm,
  },
  inspectorFixBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '700',
  },
  duplicateGroupList: {
    marginTop: 12,
    gap: 6,
  },
  duplicateGroupItem: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.sm,
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  duplicateGroupToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  duplicateGroupCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.errorLight,
  },
  duplicateGroupItemNames: {
    flex: 1,
    fontSize: 12,
    color: COLORS.cream,
  },
  duplicateExpandedList: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 4,
  },
  duplicateExpandedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  duplicateExpandedName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.cream,
  },
  duplicateExpandedCat: {
    fontSize: 11,
    color: COLORS.textMuted,
  },

  // Toggle Sample Badge
  toggleBadgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.md,
  },
  toggleBadgeBtnActive: {
    borderColor: COLORS.brandTurquoise,
    backgroundColor: 'rgba(45, 212, 191, 0.12)',
  },
  toggleBadgeBtnText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  toggleBadgeBtnTextActive: {
    color: COLORS.brandTurquoise,
    fontWeight: '700',
  },

  // Search & Filter
  filterStrip: {
    marginBottom: SPACING.lg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    color: COLORS.cream,
    fontSize: 13,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.brandTurquoise + '25',
    borderColor: COLORS.brandTurquoise,
  },
  filterChipText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: COLORS.brandTurquoise,
    fontWeight: '700',
  },

  // Edit Panel with Live Preview
  editImagePanel: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1.5,
    borderColor: COLORS.brandTurquoise,
    marginBottom: SPACING.xl,
  },
  panelHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  formPanelTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.cream,
  },
  formPanelSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  replacePreviewRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: SPACING.md,
    flexWrap: 'wrap',
  },
  replacePreviewBox: {
    flex: 1,
    minWidth: 180,
  },
  replacePreviewLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 6,
    fontWeight: '600',
  },
  replacePreviewImg: {
    width: '100%',
    height: 140,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
  },
  currentTypeBadge: {
    fontSize: 10.5,
    color: COLORS.brandTurquoise,
    fontWeight: '700',
    marginTop: 6,
  },
  uploadDropZone: {
    width: '100%',
    height: 140,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.brandTurquoise + '50',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.sm,
  },
  uploadDropZoneActive: {
    borderColor: COLORS.brandTurquoise,
    backgroundColor: 'rgba(45, 212, 191, 0.15)',
  },
  dropZoneText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.cream,
    marginTop: 6,
  },
  dropZoneSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  dropZoneFormats: {
    fontSize: 10,
    color: COLORS.textSubtle,
    marginTop: 4,
  },
  fileMetaStrip: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.sm,
    padding: 6,
    marginTop: 6,
    gap: 3,
  },
  fileMetaText: {
    fontSize: 11,
    color: COLORS.creamMuted,
  },
  chooseFileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.brandTurquoise,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 10,
  },
  chooseFileBtnText: {
    color: COLORS.brandTurquoise,
    fontSize: 13,
    fontWeight: '700',
  },
  aspectRatioRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  aspectRatioBtn: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  aspectRatioBtnActive: {
    backgroundColor: COLORS.brandTurquoise + '25',
    borderColor: COLORS.brandTurquoise,
  },
  aspectRatioBtnText: {
    fontSize: 11.5,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  aspectRatioBtnTextActive: {
    color: COLORS.brandTurquoise,
    fontWeight: '700',
  },
  uploadProgressContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.brandTurquoise + '40',
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  uploadStageText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.brandTurquoise,
    flex: 1,
  },
  uploadPercentText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.brandTurquoise,
  },
  uploadProgressBarTrack: {
    height: 6,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 3,
    overflow: 'hidden',
  },
  uploadProgressBarFill: {
    height: '100%',
    backgroundColor: COLORS.brandTurquoise,
    borderRadius: 3,
  },
  uploadErrorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 83, 80, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.errorLight,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.md,
  },
  uploadErrorText: {
    color: COLORS.errorLight,
    fontSize: 12.5,
    fontWeight: '600',
    flex: 1,
  },
  historyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderRadius: BORDER_RADIUS.sm,
  },
  historyBtnText: {
    color: COLORS.textMuted,
    fontSize: 11.5,
    fontWeight: '600',
  },
  historyModalCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    maxWidth: 580,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.card,
  },
  historyItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  historyThumb: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: 10,
  },
  historyMeta: {
    flex: 1,
  },
  historyAuthor: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.cream,
  },
  historyDate: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  historyCurrentBadge: {
    fontSize: 10,
    color: COLORS.brandGreen,
    fontWeight: '700',
    marginTop: 2,
  },
  historyRestoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.brandTurquoise,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.sm,
  },
  historyRestoreBtnText: {
    color: COLORS.background,
    fontSize: 11,
    fontWeight: '700',
  },
  editActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  saveItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.brandGreen,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.md,
    marginTop: 8,
  },
  saveItemBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 8,
  },
  cancelBtnText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },

  // Table Rows & Badges
  adminTable: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  imageTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tableThumbContainer: {
    width: 68,
    height: 68,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    backgroundColor: COLORS.surfaceElevated,
    position: 'relative',
  },
  tableThumb: {
    width: '100%',
    height: '100%',
  },
  tableThumbZoomOverlay: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 3,
    padding: 2,
  },
  tableThumbEmpty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowItemName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.cream,
  },
  canonicalTag: {
    fontSize: 12,
    color: COLORS.copperLight,
    fontStyle: 'italic',
  },
  rowItemSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
    marginBottom: 4,
  },
  smallVegBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.vegGreen,
  },
  smallNonVegBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.nonVegRed,
  },
  imageBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  verifiedImageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 125, 50, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedImageText: {
    color: COLORS.brandGreen,
    fontSize: 10.5,
    fontWeight: '700',
  },
  mockImageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  mockImageText: {
    color: COLORS.gold,
    fontSize: 10.5,
    fontWeight: '600',
  },
  confidenceBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  confidenceHigh: {
    backgroundColor: 'rgba(46, 125, 50, 0.12)',
  },
  confidenceMedium: {
    backgroundColor: 'rgba(212, 175, 55, 0.12)',
  },
  confidenceLow: {
    backgroundColor: 'rgba(156, 39, 176, 0.12)',
  },
  confidenceBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  confidenceHighText: {
    color: COLORS.brandGreen,
  },
  confidenceMediumText: {
    color: COLORS.gold,
  },
  confidenceLowText: {
    color: '#BA68C8',
  },
  uniqueImageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 125, 50, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  uniqueImageText: {
    color: COLORS.brandGreen,
    fontSize: 10.5,
    fontWeight: '600',
  },
  ownerReviewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(217, 131, 36, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ownerReviewBadgeText: {
    color: COLORS.copperLight,
    fontSize: 10.5,
    fontWeight: '600',
  },
  missingImageBadge: {
    backgroundColor: COLORS.surfaceElevated,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  missingImageText: {
    color: COLORS.textSubtle,
    fontSize: 10.5,
  },
  replacementRequiredBadge: {
    backgroundColor: 'rgba(245, 124, 0, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  replacementRequiredText: {
    color: COLORS.warning,
    fontSize: 10.5,
    fontWeight: '600',
  },
  duplicateWarningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.errorLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  duplicateWarningText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '700',
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  previewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: BORDER_RADIUS.sm,
  },
  previewBtnText: {
    color: COLORS.cream,
    fontSize: 11.5,
    fontWeight: '600',
  },
  regenerateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 212, 191, 0.1)',
    borderWidth: 1,
    borderColor: COLORS.brandTurquoise + '40',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: BORDER_RADIUS.sm,
  },
  regenerateBtnText: {
    color: COLORS.brandTurquoise,
    fontSize: 11.5,
    fontWeight: '600',
  },
  replaceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.brandTurquoise,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: BORDER_RADIUS.sm,
  },
  replaceBtnText: {
    color: COLORS.background,
    fontSize: 11.5,
    fontWeight: '700',
  },
  rollbackBtn: {
    padding: 7,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  // Preview Lightbox Modal
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
    zIndex: 999,
  },
  previewModalCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    maxWidth: 560,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.card,
  },
  previewModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  previewModalTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.cream,
  },
  previewModalSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  previewModalImageWrapper: {
    width: '100%',
    height: 280,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    marginBottom: SPACING.lg,
  },
  previewModalLargeImg: {
    width: '100%',
    height: '100%',
  },
  previewModalMetadataRow: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    gap: 6,
  },
  previewMetaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewMetaLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  previewMetaVal: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.cream,
  },
  previewModalActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  modalReplaceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.brandTurquoise,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.md,
  },
  modalReplaceBtnText: {
    color: COLORS.background,
    fontSize: 13,
    fontWeight: '700',
  },
  modalCloseBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalCloseBtnText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },

  // Menu tab
  addItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.brandHeart,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.md,
  },
  addItemBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  addItemCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  statusToggle: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BORDER_RADIUS.sm,
  },
  availableBtn: {
    backgroundColor: 'rgba(46, 125, 50, 0.2)',
  },
  unavailableBtn: {
    backgroundColor: 'rgba(211, 47, 47, 0.2)',
  },
  statusToggleText: {
    color: COLORS.cream,
    fontSize: 11.5,
    fontWeight: '600',
  },
  featuredToggle: {
    padding: 6,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.gold + '40',
  },
  featuredToggleActive: {
    backgroundColor: COLORS.gold,
  },
  deleteRowBtn: {
    padding: 6,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surface,
  },

  // Orders & Reservations Tab
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  refreshBtnText: {
    color: COLORS.brandTurquoise,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyStateCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.cream,
  },
  emptyStateSub: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  ordersList: {
    gap: 16,
  },
  orderCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  orderCustomer: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.cream,
  },
  orderPhone: {
    fontSize: 12.5,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.gold,
  },
  orderItemsBox: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginBottom: 8,
  },
  orderItemText: {
    fontSize: 13,
    color: COLORS.creamMuted,
    lineHeight: 20,
  },
  orderActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  orderStatusBadge: {
    fontSize: 12,
    color: COLORS.brandTurquoise,
    fontWeight: '600',
  },
  orderBtnAccept: {
    backgroundColor: COLORS.brandGreen,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.sm,
  },
  orderBtnReady: {
    backgroundColor: COLORS.copper,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.sm,
  },
  orderBtnComplete: {
    backgroundColor: COLORS.brandHeart,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.sm,
  },
  orderBtnCancel: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.errorLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.sm,
  },
  orderBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  resDateText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.cream,
  },
  resTimeText: {
    fontSize: 12,
    color: COLORS.brandTurquoise,
    fontWeight: '600',
  },
  resSpecialRequest: {
    fontSize: 12,
    color: COLORS.gold,
    fontStyle: 'italic',
  },
  specialRequestBox: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderLeftWidth: 3,
    borderLeftColor: COLORS.gold,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: 8,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: SPACING.lg,
  },
  metricCard: {
    flex: 1,
    minWidth: 160,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.cream,
    marginBottom: 2,
  },
  metricSub: {
    fontSize: 11,
    color: COLORS.textSubtle,
  },
  filterPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: SPACING.lg,
  },
  filterPill: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.full,
  },
  filterPillActive: {
    backgroundColor: COLORS.brandGreen,
    borderColor: COLORS.brandTurquoise,
  },
  filterPillText: {
    color: COLORS.creamMuted,
    fontSize: 12,
    fontWeight: '500',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  refBadge: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.brandTurquoise + '40',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  refBadgeText: {
    color: COLORS.brandTurquoise,
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  todayBadge: {
    backgroundColor: COLORS.brandHeart,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  todayBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
  },
  statusPillConfirmed: {
    backgroundColor: 'rgba(46, 125, 50, 0.2)',
    borderColor: COLORS.successLight,
  },
  statusPillPending: {
    backgroundColor: 'rgba(200, 125, 83, 0.2)',
    borderColor: COLORS.copper,
  },
  statusPillCompleted: {
    backgroundColor: 'rgba(45, 212, 191, 0.2)',
    borderColor: COLORS.brandTurquoise,
  },
  statusPillCancelled: {
    backgroundColor: 'rgba(198, 40, 40, 0.2)',
    borderColor: COLORS.errorLight,
  },
  statusPillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: COLORS.cream,
    letterSpacing: 0.3,
  },
  actionIconBtn: {
    width: 30,
    height: 30,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Staff Tab
  staffGrid: {
    gap: 12,
    marginBottom: SPACING.xl,
  },
  staffCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.gold + '50',
  },
  staffCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  staffAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.gold + '25',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  staffAvatarText: {
    color: COLORS.gold,
    fontWeight: '700',
    fontSize: 16,
  },
  staffName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.cream,
  },
  staffEmail: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  staffDate: {
    fontSize: 11,
    color: COLORS.textSubtle,
    marginTop: 2,
  },
  staffCardActions: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
  approveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.brandGreen,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.sm,
  },
  approveBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  rejectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.errorLight + '50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.sm,
  },
  rejectBtnText: {
    color: COLORS.errorLight,
    fontSize: 12,
    fontWeight: '600',
  },
  emptySubCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
  },
  emptySubText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  roleTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  roleTagOwner: {
    backgroundColor: COLORS.brandTurquoise + '25',
  },
  roleTagStaff: {
    backgroundColor: COLORS.copper + '25',
  },
  roleTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.cream,
  },
  roleActionBtn: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  roleActionBtnText: {
    fontSize: 11,
    color: COLORS.cream,
    fontWeight: '600',
  },
  suspendBtn: {
    backgroundColor: 'rgba(211, 47, 47, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  suspendBtnText: {
    fontSize: 11,
    color: COLORS.errorLight,
    fontWeight: '600',
  },

  // Gallery Tab
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  galleryCard: {
    width: 260,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  galleryCardImg: {
    width: '100%',
    height: 160,
  },
  galleryCardBody: {
    padding: SPACING.md,
  },
  galleryCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.cream,
  },
  galleryCardSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },

  // Verification Conflicts
  conflictList: {
    gap: 12,
  },
  conflictCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  conflictTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 8,
  },
  conflictValuesRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  conflictValBox: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  conflictSource: {
    fontSize: 11,
    color: COLORS.copper,
    fontWeight: '700',
  },
  conflictVal: {
    fontSize: 13,
    color: COLORS.cream,
    marginTop: 2,
  },
  conflictResolvedStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  conflictCurrentLbl: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  conflictCurrentVal: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.brandTurquoise,
  },

  // Settings Tab
  settingsFormCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  formSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.brandTurquoise,
    marginBottom: SPACING.md,
  },
  inputGroup: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 12,
    color: COLORS.creamMuted,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: COLORS.cream,
    fontSize: 13.5,
  },
  saveSettingsBtn: {
    backgroundColor: COLORS.brandGreen,
    paddingVertical: 13,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  saveSettingsBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  // ── Mobile Responsive Navigation ──
  mobileNavContainer: {
    backgroundColor: COLORS.surfaceElevated,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xs,
  },
  mobileTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  mobileAvatarBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.brandTurquoise + '25',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.brandTurquoise,
  },
  mobileUserName: {
    color: COLORS.cream,
    fontSize: 13.5,
    fontWeight: '700',
  },
  mobileLogoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 83, 80, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 83, 80, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.md,
  },
  mobileLogoutBtnText: {
    color: COLORS.errorLight,
    fontSize: 12,
    fontWeight: '700',
  },
  mobileTabScrollContent: {
    paddingHorizontal: SPACING.md,
    gap: 8,
    paddingBottom: SPACING.xs,
  },
  mobileTabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: BORDER_RADIUS.full,
  },
  mobileTabChipActive: {
    backgroundColor: COLORS.brandTurquoise + '20',
    borderColor: COLORS.brandTurquoise,
  },
  mobileTabChipText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  mobileTabChipTextActive: {
    color: COLORS.brandTurquoise,
    fontWeight: '700',
  },

  // ── Customer Reviews Styles ──
  reviewCommentText: {
    fontSize: 13.5,
    color: COLORS.creamMuted,
    lineHeight: 20,
    fontStyle: 'italic',
    marginVertical: 8,
  },
  reviewAspectsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  aspectChip: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.sm,
  },
  aspectChipText: {
    fontSize: 11,
    color: COLORS.copperLight,
    fontWeight: '600',
  },

  // ── Sign Out Confirmation Modal ──
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalBackdropDismiss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  logoutModalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
    ...SHADOWS.card,
  },
  logoutModalIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(239, 83, 80, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 83, 80, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  logoutModalTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 8,
    textAlign: 'center',
  },
  logoutModalSub: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: SPACING.xl,
  },
  logoutErrorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 83, 80, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 83, 80, 0.3)',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.md,
    width: '100%',
  },
  logoutErrorText: {
    color: COLORS.errorLight,
    fontSize: 12.5,
    fontWeight: '600',
    flex: 1,
  },
  logoutModalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  logoutCancelBtn: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutCancelBtnText: {
    color: COLORS.creamMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  logoutConfirmBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.brandHeart,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutConfirmBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
