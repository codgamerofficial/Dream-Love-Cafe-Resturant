import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  useWindowDimensions,
  Platform 
} from 'react-native';
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
  Sparkles 
} from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../src/theme';
import { useAuth } from '../../src/context/AuthContext';
import { useSettings } from '../../src/context/SettingsContext';
import { MenuItem, CategorySlug } from '../../src/types';

export default function AdminPage() {
  const { width } = useWindowDimensions();
  const { user, isAdmin, loginWithEmail, logout } = useAuth();
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
    categories 
  } = useSettings();
  const isDesktop = width >= 768;

  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Active Tab State inside Admin Dashboard
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reservations' | 'menu' | 'gallery' | 'settings'>('dashboard');

  // Add Item Modal Form State
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<CategorySlug>('chef-specials');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemVeg, setNewItemVeg] = useState(false);

  // Settings Edit Form State
  const [editPhone, setEditPhone] = useState(settings.phone);
  const [editWhatsapp, setEditWhatsapp] = useState(settings.whatsapp);
  const [editAddress, setEditAddress] = useState(settings.address);
  const [editHours, setEditHours] = useState(settings.openingHours);
  const [settingsSaveMsg, setSettingsSaveMsg] = useState('');

  // Handle Admin Login
  const handleLogin = async () => {
    setLoginError('');
    setIsSubmittingLogin(true);
    const { error } = await loginWithEmail(email, password);
    setIsSubmittingLogin(false);
    if (error) {
      setLoginError(error);
    }
  };

  // Handle Add Menu Item
  const handleCreateMenuItem = async () => {
    if (!newItemName.trim()) return;
    await addMenuItem({
      name: newItemName.trim(),
      category: newItemCategory,
      description: newItemDesc.trim() || undefined,
      price: newItemPrice ? Number(newItemPrice) : undefined,
      isAvailable: true,
      isFeatured: false,
      isVeg: newItemVeg,
      displayOrder: menuItems.length + 1,
    });
    setNewItemName('');
    setNewItemPrice('');
    setNewItemDesc('');
    setIsAddingItem(false);
  };

  // Handle Save Settings
  const handleSaveSettings = async () => {
    await updateSettings({
      phone: editPhone,
      whatsapp: editWhatsapp,
      address: editAddress,
      openingHours: editHours,
    });
    setSettingsSaveMsg('Settings updated successfully!');
    setTimeout(() => setSettingsSaveMsg(''), 3000);
  };

  // 1. Render Login Screen if not authenticated (Section 18)
  if (!isAdmin) {
    return (
      <View style={styles.loginContainer}>
        <View style={styles.loginCard}>
          <Shield size={40} color={COLORS.copper} style={{ marginBottom: 12 }} />
          <Text style={styles.loginTitle}>Admin Portal Login</Text>
          <Text style={styles.loginSub}>Dream Love Cafe & Restaurant Management System</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. admin@dreamlove.com"
              placeholderTextColor={COLORS.textSubtle}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter admin password"
              placeholderTextColor={COLORS.textSubtle}
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}

          <TouchableOpacity 
            style={styles.loginBtn}
            onPress={handleLogin}
            disabled={isSubmittingLogin}
          >
            <Lock size={16} color={COLORS.background} style={{ marginRight: 6 }} />
            <Text style={styles.loginBtnText}>{isSubmittingLogin ? 'Authenticating...' : 'Sign In to Admin'}</Text>
          </TouchableOpacity>

          <Text style={styles.demoNotice}>
            Demo credentials: admin@dreamlove.com / admin123
          </Text>
        </View>
      </View>
    );
  }

  // 2. Render Authenticated Admin Dashboard Layout
  return (
    <View style={styles.adminLayout}>
      {/* Sidebar Navigation */}
      <View style={[styles.adminSidebar, !isDesktop && styles.adminSidebarMobile]}>
        <View style={styles.sidebarHeader}>
          <Shield size={22} color={COLORS.gold} style={{ marginRight: 8 }} />
          <Text style={styles.sidebarTitle}>Admin Panel</Text>
        </View>

        <View style={styles.sidebarNav}>
          <TouchableOpacity
            style={[styles.sidebarNavItem, activeTab === 'dashboard' && styles.sidebarNavItemActive]}
            onPress={() => setActiveTab('dashboard')}
          >
            <Calendar size={18} color={activeTab === 'dashboard' ? COLORS.gold : COLORS.textSubtle} />
            <Text style={[styles.sidebarNavText, activeTab === 'dashboard' && styles.sidebarNavTextActive]}>Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sidebarNavItem, activeTab === 'menu' && styles.sidebarNavItemActive]}
            onPress={() => setActiveTab('menu')}
          >
            <Utensils size={18} color={activeTab === 'menu' ? COLORS.gold : COLORS.textSubtle} />
            <Text style={[styles.sidebarNavText, activeTab === 'menu' && styles.sidebarNavTextActive]}>Menu Admin</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sidebarNavItem, activeTab === 'gallery' && styles.sidebarNavItemActive]}
            onPress={() => setActiveTab('gallery')}
          >
            <ImageIcon size={18} color={activeTab === 'gallery' ? COLORS.gold : COLORS.textSubtle} />
            <Text style={[styles.sidebarNavText, activeTab === 'gallery' && styles.sidebarNavTextActive]}>Gallery Admin</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sidebarNavItem, activeTab === 'settings' && styles.sidebarNavItemActive]}
            onPress={() => setActiveTab('settings')}
          >
            <Settings size={18} color={activeTab === 'settings' ? COLORS.gold : COLORS.textSubtle} />
            <Text style={[styles.sidebarNavText, activeTab === 'settings' && styles.sidebarNavTextActive]}>Restaurant Settings</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <LogOut size={16} color={COLORS.errorLight} style={{ marginRight: 6 }} />
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Main Admin View Content */}
      <ScrollView style={styles.adminMain} contentContainerStyle={styles.adminMainContent}>
        
        {/* DASHBOARD TAB OVERVIEW */}
        {activeTab === 'dashboard' && (
          <View>
            <Text style={styles.tabHeading}>Dashboard Overview</Text>

            {/* Metrics Cards */}
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Utensils size={24} color={COLORS.copper} style={{ marginBottom: 8 }} />
                <Text style={styles.metricNumber}>{menuItems.length}</Text>
                <Text style={styles.metricLabel}>Total Menu Items</Text>
              </View>

              <View style={styles.metricCard}>
                <Sparkles size={24} color={COLORS.gold} style={{ marginBottom: 8 }} />
                <Text style={styles.metricNumber}>
                  {menuItems.filter((i) => i.isFeatured).length}
                </Text>
                <Text style={styles.metricLabel}>Chef Specials</Text>
              </View>

              <View style={styles.metricCard}>
                <ImageIcon size={24} color={COLORS.copper} style={{ marginBottom: 8 }} />
                <Text style={styles.metricNumber}>{galleryItems.length}</Text>
                <Text style={styles.metricLabel}>Gallery Photos</Text>
              </View>

              <View style={styles.metricCard}>
                <Calendar size={24} color={COLORS.gold} style={{ marginBottom: 8 }} />
                <Text style={styles.metricNumber}>Active</Text>
                <Text style={styles.metricLabel}>Table Reservation System</Text>
              </View>
            </View>

            <View style={styles.adminNoticeCard}>
              <Text style={styles.adminNoticeTitle}>Operational Status</Text>
              <Text style={styles.adminNoticeText}>
                Your restaurant details are currently configured to serve dine-in, takeaway, and delivery orders. Use the sidebar tabs to modify menu availability, upload photos, or adjust business hours.
              </Text>
            </View>
          </View>
        )}

        {/* MENU ADMIN TAB */}
        {activeTab === 'menu' && (
          <View>
            <View style={styles.tabHeaderRow}>
              <Text style={styles.tabHeading}>Menu Management</Text>

              <TouchableOpacity 
                style={styles.addPrimaryBtn}
                onPress={() => setIsAddingItem(!isAddingItem)}
              >
                <Plus size={16} color={COLORS.background} style={{ marginRight: 4 }} />
                <Text style={styles.addPrimaryBtnText}>{isAddingItem ? 'Cancel' : 'Add New Item'}</Text>
              </TouchableOpacity>
            </View>

            {/* Add Item Form Panel */}
            {isAddingItem && (
              <View style={styles.addFormPanel}>
                <Text style={styles.formPanelTitle}>Add New Menu Item</Text>

                <View style={styles.formRow}>
                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Item Name *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. Mutton Biriyani"
                      placeholderTextColor={COLORS.textSubtle}
                      value={newItemName}
                      onChangeText={setNewItemName}
                    />
                  </View>

                  <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Price in INR (Leave blank if "Ask for price")</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. 395"
                      placeholderTextColor={COLORS.textSubtle}
                      keyboardType="numeric"
                      value={newItemPrice}
                      onChangeText={setNewItemPrice}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Description</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Short taste profile or portion details"
                    placeholderTextColor={COLORS.textSubtle}
                    value={newItemDesc}
                    onChangeText={setNewItemDesc}
                  />
                </View>

                <View style={styles.formRow}>
                  <TouchableOpacity 
                    style={[styles.vegToggleBtn, newItemVeg && styles.vegToggleBtnActive]}
                    onPress={() => setNewItemVeg(!newItemVeg)}
                  >
                    <Text style={styles.vegToggleBtnText}>
                      {newItemVeg ? 'Pure Veg' : 'Non-Veg'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.saveItemBtn} onPress={handleCreateMenuItem}>
                    <Text style={styles.saveItemBtnText}>Save Dish</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Menu Items Table */}
            <View style={styles.adminTable}>
              {menuItems.map((item) => (
                <View key={item.id} style={styles.tableRow}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.rowItemName}>{item.name}</Text>
                      {item.isVeg && <View style={styles.smallVegBadge} />}
                    </View>
                    <Text style={styles.rowItemSub}>
                      {item.category} • {item.price ? `₹${item.price}` : item.priceRange || 'Ask for price'}
                    </Text>
                  </View>

                  {/* Actions */}
                  <View style={styles.rowActionGroup}>
                    <TouchableOpacity
                      style={[styles.iconActionBtn, !item.isAvailable && styles.iconActionDisabled]}
                      onPress={() => toggleAvailability(item.id)}
                      accessibilityLabel="Toggle availability"
                    >
                      {item.isAvailable ? <Eye size={16} color={COLORS.gold} /> : <EyeOff size={16} color={COLORS.textSubtle} />}
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.iconActionBtn}
                      onPress={() => toggleFeatured(item.id)}
                      accessibilityLabel="Toggle Chef Special"
                    >
                      <Sparkles size={16} color={item.isFeatured ? COLORS.copper : COLORS.textSubtle} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.iconActionBtn}
                      onPress={() => deleteMenuItem(item.id)}
                      accessibilityLabel="Delete item"
                    >
                      <Trash2 size={16} color={COLORS.errorLight} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* GALLERY ADMIN TAB */}
        {activeTab === 'gallery' && (
          <View>
            <Text style={styles.tabHeading}>Gallery Photo Manager</Text>
            <Text style={styles.tabSubheading}>View and manage photos displayed in the public gallery.</Text>

            <View style={styles.galleryAdminGrid}>
              {galleryItems.map((photo) => (
                <View key={photo.id} style={styles.photoAdminCard}>
                  <Text style={styles.photoTitle}>{photo.title}</Text>
                  <Text style={styles.photoCategory}>{photo.category}</Text>

                  <TouchableOpacity
                    style={styles.deletePhotoBtn}
                    onPress={() => deleteGalleryItem(photo.id)}
                  >
                    <Trash2 size={14} color={COLORS.errorLight} style={{ marginRight: 4 }} />
                    <Text style={styles.deletePhotoText}>Delete Photo</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <View>
            <Text style={styles.tabHeading}>Restaurant Configuration</Text>

            <View style={styles.settingsFormCard}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Telephone Number</Text>
                <TextInput
                  style={styles.input}
                  value={editPhone}
                  onChangeText={setEditPhone}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>WhatsApp Number</Text>
                <TextInput
                  style={styles.input}
                  value={editWhatsapp}
                  onChangeText={setEditWhatsapp}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Restaurant Address</Text>
                <TextInput
                  style={[styles.input, { height: 70 }]}
                  multiline={true}
                  value={editAddress}
                  onChangeText={setEditAddress}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Opening Hours</Text>
                <TextInput
                  style={styles.input}
                  value={editHours}
                  onChangeText={setEditHours}
                />
              </View>

              {settingsSaveMsg ? (
                <Text style={styles.successMsg}>{settingsSaveMsg}</Text>
              ) : null}

              <TouchableOpacity style={styles.saveSettingsBtn} onPress={handleSaveSettings}>
                <Text style={styles.saveSettingsBtnText}>Save Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
  },
  loginCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xxl,
    width: '100%',
    maxWidth: 440,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  loginTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 4,
  },
  loginSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  inputGroup: {
    width: '100%',
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 12,
    color: COLORS.creamMuted,
    marginBottom: 4,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: COLORS.cream,
    fontSize: 13,
  },
  errorText: {
    color: COLORS.errorLight,
    fontSize: 12,
    marginBottom: SPACING.md,
  },
  loginBtn: {
    backgroundColor: COLORS.copper,
    width: '100%',
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.sm,
  },
  loginBtnText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: '800',
  },
  demoNotice: {
    fontSize: 11,
    color: COLORS.textSubtle,
    marginTop: SPACING.lg,
    fontStyle: 'italic',
  },

  // Admin Dashboard Layout
  adminLayout: {
    flex: 1,
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    backgroundColor: COLORS.background,
  },
  adminSidebar: {
    width: 240,
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
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  sidebarTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.cream,
  },
  sidebarNav: {
    gap: 8,
  },
  sidebarNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.md,
  },
  sidebarNavItemActive: {
    backgroundColor: COLORS.copper + '30',
  },
  sidebarNavText: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginLeft: 10,
  },
  sidebarNavTextActive: {
    color: COLORS.gold,
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
  adminMain: {
    flex: 1,
  },
  adminMainContent: {
    padding: SPACING.xxl,
  },
  tabHeading: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: SPACING.lg,
  },
  tabSubheading: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: SPACING.xl,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
    marginBottom: SPACING.xxl,
  },
  metricCard: {
    flex: 1,
    minWidth: 180,
    backgroundColor: COLORS.surfaceElevated,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  metricNumber: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.cream,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  adminNoticeCard: {
    backgroundColor: COLORS.surfaceElevated,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  adminNoticeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 6,
  },
  adminNoticeText: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 20,
  },

  // Menu Admin
  tabHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  addPrimaryBtn: {
    backgroundColor: COLORS.copper,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.md,
  },
  addPrimaryBtnText: {
    color: COLORS.background,
    fontSize: 13,
    fontWeight: '700',
  },
  addFormPanel: {
    backgroundColor: COLORS.surfaceElevated,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
  },
  formPanelTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: SPACING.md,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  vegToggleBtn: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.md,
  },
  vegToggleBtnActive: {
    borderColor: COLORS.vegGreen,
  },
  vegToggleBtnText: {
    color: COLORS.cream,
    fontSize: 13,
    fontWeight: '600',
  },
  saveItemBtn: {
    backgroundColor: COLORS.copper,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.md,
    flex: 1,
    alignItems: 'center',
  },
  saveItemBtnText: {
    color: COLORS.background,
    fontSize: 13,
    fontWeight: '700',
  },
  adminTable: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border + '40',
  },
  rowItemName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.cream,
  },
  rowItemSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  smallVegBadge: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.vegGreen,
    marginLeft: 6,
  },
  rowActionGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  iconActionBtn: {
    padding: 6,
  },
  iconActionDisabled: {
    opacity: 0.4,
  },

  // Gallery Admin
  galleryAdminGrid: {
    gap: 12,
  },
  photoAdminCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  photoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.cream,
  },
  photoCategory: {
    fontSize: 12,
    color: COLORS.gold,
  },
  deletePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deletePhotoText: {
    color: COLORS.errorLight,
    fontSize: 12,
    fontWeight: '600',
  },

  // Settings Admin
  settingsFormCard: {
    backgroundColor: COLORS.surfaceElevated,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    maxWidth: 600,
  },
  saveSettingsBtn: {
    backgroundColor: COLORS.copper,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  saveSettingsBtnText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: '800',
  },
  successMsg: {
    color: COLORS.successLight,
    fontSize: 13,
    marginBottom: 8,
  },
});
