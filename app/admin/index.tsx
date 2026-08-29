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
  Linking
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
  MessageSquare
} from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../src/theme';
import { useAuth, UserRole, UserProfile } from '../../src/context/AuthContext';
import { useSettings } from '../../src/context/SettingsContext';
import { MenuItem, CategorySlug, ImageType, ImageLicenseStatus, Reservation, DatabaseOrder } from '../../src/types';
import { supabase, isSupabaseConfigured } from '../../src/services/supabase';
import { formatTime12Hour, formatDisplayDate, getKolkataCurrentDate } from '../../src/utils/reservation';

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
  const [imageFilter, setImageFilter] = useState<'all' | 'temporary' | 'real' | 'missing' | 'duplicates'>('all');
  const [editingImageItemId, setEditingImageItemId] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [replacementAuthor, setReplacementAuthor] = useState(profile?.full_name || 'Restaurant Owner');

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
    if (!isSupabaseConfigured || !supabase) return;
    setLoadingReservations(true);
    try {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('date', { ascending: false });

      if (!error && data) {
        setReservations(data as Reservation[]);
      }
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

  const replacementProgress = totalItemsCount > 0 
    ? ((realPhotosCount / totalItemsCount) * 100).toFixed(1) 
    : '0';

  // Duplicate Image Detection
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

      if (imageFilter === 'real' && !isReal) return false;
      if (imageFilter === 'temporary' && !isMock) return false;
      if (imageFilter === 'missing' && !isMissing) return false;
      if (imageFilter === 'duplicates' && !isDuplicate) return false;

      return true;
    });
  }, [menuItems, imageSearchQuery, imageFilter, imageCounts]);

  // One-Click Real Photo Replacement Workflow
  const handleSaveRealPhoto = async (itemId: string) => {
    if (!uploadedImageUrl.trim()) return;

    const item = menuItems.find((i) => i.id === itemId);
    const oldUrl = item?.image_url || item?.image;

    await updateMenuItem(itemId, {
      image_url: uploadedImageUrl.trim(),
      image: uploadedImageUrl.trim(),
      image_type: 'real_restaurant',
      image_source: 'owner',
      image_license_status: 'owner_provided',
      image_verified: true,
      image_replacement_required: false,
      previous_image_url: oldUrl,
      replacement_date: new Date().toISOString(),
      replaced_by: replacementAuthor.trim() || profile?.full_name || 'Restaurant Owner',
    });

    logAudit('food_image_replaced', 'menu_items', itemId, { newUrl: uploadedImageUrl.trim() });
    setEditingImageItemId(null);
    setUploadedImageUrl('');
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

  const handleLogout = async () => {
    await logout();
    router.replace('/admin/login' as any);
  };

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

  const isOwnerOrAdmin = hasRole('owner', 'admin');
  const isManagerOrAbove = hasRole('owner', 'admin', 'manager');

  return (
    <View style={[styles.adminContainer, !isDesktop && styles.adminContainerMobile]}>
      {/* Sidebar Navigation */}
      <View style={[styles.adminSidebar, !isDesktop && styles.adminSidebarMobile]}>
        <View>
          {/* Header with User Info */}
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
          </View>

          {/* Navigation Links */}
          <View style={styles.sidebarNav}>
            <TouchableOpacity
              style={[styles.sidebarNavItem, activeTab === 'dashboard' && styles.sidebarNavItemActive]}
              onPress={() => setActiveTab('dashboard')}
            >
              <Sparkles size={18} color={activeTab === 'dashboard' ? COLORS.brandTurquoise : COLORS.textSubtle} />
              <Text style={[styles.sidebarNavText, activeTab === 'dashboard' && styles.sidebarNavTextActive]}>Overview</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sidebarNavItem, activeTab === 'food-images' && styles.sidebarNavItemActive]}
              onPress={() => setActiveTab('food-images')}
            >
              <Camera size={18} color={activeTab === 'food-images' ? COLORS.brandTurquoise : COLORS.textSubtle} />
              <Text style={[styles.sidebarNavText, activeTab === 'food-images' && styles.sidebarNavTextActive]}>
                Food Images ({realPhotosCount}/{totalItemsCount})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sidebarNavItem, activeTab === 'menu' && styles.sidebarNavItemActive]}
              onPress={() => setActiveTab('menu')}
            >
              <Utensils size={18} color={activeTab === 'menu' ? COLORS.brandTurquoise : COLORS.textSubtle} />
              <Text style={[styles.sidebarNavText, activeTab === 'menu' && styles.sidebarNavTextActive]}>Menu Items ({menuItems.length})</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sidebarNavItem, activeTab === 'orders' && styles.sidebarNavItemActive]}
              onPress={() => setActiveTab('orders')}
            >
              <ShoppingBag size={18} color={activeTab === 'orders' ? COLORS.brandTurquoise : COLORS.textSubtle} />
              <Text style={[styles.sidebarNavText, activeTab === 'orders' && styles.sidebarNavTextActive]}>Orders</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sidebarNavItem, activeTab === 'reservations' && styles.sidebarNavItemActive]}
              onPress={() => setActiveTab('reservations')}
            >
              <Calendar size={18} color={activeTab === 'reservations' ? COLORS.brandTurquoise : COLORS.textSubtle} />
              <Text style={[styles.sidebarNavText, activeTab === 'reservations' && styles.sidebarNavTextActive]}>Reservations</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sidebarNavItem, activeTab === 'gallery' && styles.sidebarNavItemActive]}
              onPress={() => setActiveTab('gallery')}
            >
              <ImageIcon size={18} color={activeTab === 'gallery' ? COLORS.brandTurquoise : COLORS.textSubtle} />
              <Text style={[styles.sidebarNavText, activeTab === 'gallery' && styles.sidebarNavTextActive]}>Storefront Photos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sidebarNavItem, activeTab === 'verification' && styles.sidebarNavItemActive]}
              onPress={() => setActiveTab('verification')}
            >
              <AlertTriangle size={18} color={activeTab === 'verification' ? COLORS.gold : COLORS.textSubtle} />
              <Text style={[styles.sidebarNavText, activeTab === 'verification' && styles.sidebarNavTextActive]}>
                Listing Sync ({dataConflicts.filter(c => c.status === 'pending_review').length})
              </Text>
            </TouchableOpacity>

            {/* Owner/Admin Only Tabs */}
            {isOwnerOrAdmin && (
              <TouchableOpacity
                style={[styles.sidebarNavItem, activeTab === 'staff' && styles.sidebarNavItemActive]}
                onPress={() => setActiveTab('staff')}
              >
                <Users size={18} color={activeTab === 'staff' ? COLORS.brandTurquoise : COLORS.textSubtle} />
                <Text style={[styles.sidebarNavText, activeTab === 'staff' && styles.sidebarNavTextActive]}>Staff & Access</Text>
              </TouchableOpacity>
            )}

            {isOwnerOrAdmin && (
              <TouchableOpacity
                style={[styles.sidebarNavItem, activeTab === 'settings' && styles.sidebarNavItemActive]}
                onPress={() => setActiveTab('settings')}
              >
                <Settings size={18} color={activeTab === 'settings' ? COLORS.brandTurquoise : COLORS.textSubtle} />
                <Text style={[styles.sidebarNavText, activeTab === 'settings' && styles.sidebarNavTextActive]}>Restaurant Info & Map</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={16} color={COLORS.errorLight} style={{ marginRight: 6 }} />
          <Text style={styles.logoutBtnText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

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
              <View>
                <Text style={styles.tabHeading}>Replace Temporary Food Images</Text>
                <Text style={styles.tabSubheading}>
                  Client Preview Version: Upload your restaurant's original food photographs with one-click instant publishing.
                </Text>
              </View>

              <TouchableOpacity 
                style={[styles.toggleBadgeBtn, settings.showSampleBadges && styles.toggleBadgeBtnActive]}
                onPress={handleToggleSampleBadges}
              >
                <Layers size={15} color={settings.showSampleBadges ? COLORS.brandTurquoise : COLORS.textMuted} style={{ marginRight: 6 }} />
                <Text style={[styles.toggleBadgeBtnText, settings.showSampleBadges && styles.toggleBadgeBtnTextActive]}>
                  {settings.showSampleBadges ? 'Sample Badge: ON' : 'Sample Badge: OFF'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Food Photography Progress Card */}
            <View style={styles.photographyProgressCard}>
              <View style={styles.progressHeader}>
                <View>
                  <Text style={styles.progressCardTitle}>Food Photography Replacement Progress</Text>
                  <Text style={styles.progressCardSubtitle}>
                    {totalItemsCount} Total Menu Dishes
                  </Text>
                </View>
                <Text style={styles.progressPercentText}>{replacementProgress}%</Text>
              </View>

              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: (`${replacementProgress}%` as any) }]} />
              </View>

              <View style={styles.metricsStrip}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricItemVal}>{realPhotosCount}</Text>
                  <Text style={styles.metricItemLbl}>✓ Real Photos</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricItemVal}>{temporaryPhotosCount}</Text>
                  <Text style={styles.metricItemLbl}>◷ Temporary Mock</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricItemVal}>{missingPhotosCount}</Text>
                  <Text style={styles.metricItemLbl}>○ Missing Photos</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={[styles.metricItemVal, duplicateImageItems.length > 0 && { color: COLORS.errorLight }]}>
                    {duplicateImageItems.length}
                  </Text>
                  <Text style={styles.metricItemLbl}>⚠️ Duplicate Warnings</Text>
                </View>
              </View>
            </View>

            {/* Duplicate Image Warning Banner */}
            {duplicateImageItems.length > 0 && (
              <View style={styles.warningBanner}>
                <AlertTriangle size={18} color={COLORS.errorLight} style={{ marginRight: 8 }} />
                <Text style={styles.warningBannerText}>
                  Duplicate Warning: {duplicateImageItems.length} dishes share duplicate image URLs. Replace them below with distinct authentic dish photos.
                </Text>
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
                  style={[styles.filterChip, imageFilter === 'missing' && styles.filterChipActive]}
                  onPress={() => setImageFilter('missing')}
                >
                  <Text style={[styles.filterChipText, imageFilter === 'missing' && styles.filterChipTextActive]}>
                    ○ Missing ({missingPhotosCount})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.filterChip, imageFilter === 'duplicates' && styles.filterChipActive]}
                  onPress={() => setImageFilter('duplicates')}
                >
                  <Text style={[styles.filterChipText, imageFilter === 'duplicates' && styles.filterChipTextActive]}>
                    ⚠️ Duplicates ({duplicateImageItems.length})
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* One-Click Replace Image Panel */}
            {editingImageItemId && (
              <View style={styles.editImagePanel}>
                <View style={styles.panelHeaderRow}>
                  <Text style={styles.formPanelTitle}>
                    Upload Restaurant Photo for: {menuItems.find(i => i.id === editingImageItemId)?.name}
                  </Text>
                  <TouchableOpacity onPress={() => setEditingImageItemId(null)}>
                    <XCircle size={18} color={COLORS.textMuted} />
                  </TouchableOpacity>
                </View>

                <TextInput
                  style={styles.input}
                  placeholder="Paste direct photo URL (e.g. /photos/chicken-biryani-real.jpg or cloud URL)"
                  placeholderTextColor={COLORS.textSubtle}
                  value={uploadedImageUrl}
                  onChangeText={setUploadedImageUrl}
                />

                <TextInput
                  style={[styles.input, { marginTop: 8 }]}
                  placeholder="Photographer / Uploader Name (e.g. Restaurant Owner)"
                  placeholderTextColor={COLORS.textSubtle}
                  value={replacementAuthor}
                  onChangeText={setReplacementAuthor}
                />

                <View style={styles.editActionRow}>
                  <TouchableOpacity
                    style={styles.saveItemBtn}
                    onPress={() => handleSaveRealPhoto(editingImageItemId)}
                  >
                    <CheckCircle2 size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.saveItemBtnText}>Save & Publish Real Photo</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => {
                      setEditingImageItemId(null);
                      setUploadedImageUrl('');
                    }}
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

                return (
                  <View key={item.id} style={styles.imageTableRow}>
                    <View style={styles.tableThumbContainer}>
                      {url ? (
                        <Image source={{ uri: url }} style={styles.tableThumb} resizeMode="cover" />
                      ) : (
                        <View style={styles.tableThumbEmpty}>
                          <Camera size={20} color={COLORS.textSubtle} />
                        </View>
                      )}
                    </View>

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

                        {item.image_replacement_required && (
                          <View style={styles.replacementRequiredBadge}>
                            <Text style={styles.replacementRequiredText}>⚠ Replacement Required</Text>
                          </View>
                        )}

                        {isDuplicate && (
                          <View style={styles.duplicateWarningBadge}>
                            <AlertTriangle size={11} color="#FFFFFF" style={{ marginRight: 3 }} />
                            <Text style={styles.duplicateWarningText}>Duplicate ({imageCounts[url]}x)</Text>
                          </View>
                        )}
                      </View>
                    </View>

                    <View style={styles.rowActions}>
                      <TouchableOpacity
                        style={styles.replaceBtn}
                        onPress={() => {
                          setEditingImageItemId(item.id);
                          setUploadedImageUrl(item.image_url || item.image || '');
                        }}
                      >
                        <Camera size={14} color={COLORS.background} style={{ marginRight: 4 }} />
                        <Text style={styles.replaceBtnText}>Replace Photo</Text>
                      </TouchableOpacity>

                      {item.previous_image_url && (
                        <TouchableOpacity
                          style={styles.rollbackBtn}
                          onPress={() => handleRollbackImage(item)}
                        >
                          <RotateCcw size={14} color={COLORS.textMuted} />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
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

            {orders.length === 0 ? (
              <View style={styles.emptyStateCard}>
                <ShoppingBag size={40} color={COLORS.textSubtle} style={{ marginBottom: 10 }} />
                <Text style={styles.emptyStateTitle}>No Orders Found</Text>
                <Text style={styles.emptyStateSub}>Incoming WhatsApp & online orders will appear here.</Text>
              </View>
            ) : (
              <View style={styles.ordersList}>
                {orders.map((order) => (
                  <View key={order.id} style={styles.orderCard}>
                    <View style={styles.orderHeader}>
                      <View>
                        <Text style={styles.orderCustomer}>{order.customer_name}</Text>
                        <Text style={styles.orderPhone}>{order.customer_phone} • {order.order_type.toUpperCase()}</Text>
                      </View>
                      <Text style={styles.orderTotal}>₹{order.total_amount}</Text>
                    </View>

                    <View style={styles.orderItemsBox}>
                      {order.items?.map((it, idx) => (
                        <Text key={idx} style={styles.orderItemText}>
                          {it.quantity}x {it.name} {it.price ? `(₹${it.price * it.quantity})` : ''}
                        </Text>
                      ))}
                    </View>

                    <View style={styles.orderActionsRow}>
                      <Text style={styles.orderStatusBadge}>Status: {order.status}</Text>
                      <View style={{ flexDirection: 'row', gap: 8 }}>
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
  },
  adminContainerMobile: {
    flexDirection: 'column',
  },
  adminSidebar: {
    width: 270,
    backgroundColor: COLORS.surfaceElevated,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    padding: SPACING.lg,
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
    marginBottom: SPACING.xl,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatarBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    fontSize: 16,
  },
  sidebarUserName: {
    color: COLORS.cream,
    fontSize: 14,
    fontWeight: '700',
  },
  roleBadgeContainer: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.copper + '25',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  roleBadgeText: {
    color: COLORS.copper,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  sidebarNav: {
    gap: 6,
  },
  sidebarNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
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
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: SPACING.xl,
  },
  logoutBtnText: {
    color: COLORS.errorLight,
    fontSize: 13,
    fontWeight: '600',
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
  progressPercentText: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.brandTurquoise,
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
    gap: 20,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  metricItem: {
    flex: 1,
    minWidth: 120,
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

  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(211, 47, 47, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.errorLight,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
  },
  warningBannerText: {
    color: COLORS.errorLight,
    fontSize: 12.5,
    flex: 1,
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

  // Edit Panel
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
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  formPanelTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.cream,
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
    width: 65,
    height: 65,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    backgroundColor: COLORS.surfaceElevated,
  },
  tableThumb: {
    width: '100%',
    height: '100%',
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
    gap: 8,
  },
  replaceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.brandTurquoise,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.sm,
  },
  replaceBtnText: {
    color: COLORS.background,
    fontSize: 12,
    fontWeight: '700',
  },
  rollbackBtn: {
    padding: 8,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
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
  successBanner: {
    backgroundColor: 'rgba(46, 125, 50, 0.2)',
    borderWidth: 1,
    borderColor: COLORS.brandGreen,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginVertical: SPACING.md,
  },
  successBannerText: {
    color: COLORS.brandGreen,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});
