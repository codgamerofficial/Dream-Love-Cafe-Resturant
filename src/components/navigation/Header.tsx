import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, useWindowDimensions } from 'react-native';
import { Link, useRouter, usePathname } from 'expo-router';
import { ShoppingBag, Calendar, Menu as MenuIcon, X, Phone } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../theme';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';

export const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const { itemCount, openCart } = useCart();
  const { settings } = useSettings();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isDesktop = width >= 768;

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 30);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Menu', href: '/menu' },
    { label: 'About', href: '/about' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Reviews', href: '/reviews' },
    { label: 'Visit Us', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <View style={[styles.headerContainer, isScrolled && styles.headerScrolled]}>
      <View style={styles.headerContent}>
        {/* Brand Logo & Wordmark */}
        <TouchableOpacity 
          style={styles.brandContainer} 
          onPress={() => router.push('/')}
          activeOpacity={0.8}
        >
          <Image 
            source={require('../../../assets/icon.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
          <View style={styles.brandTextContainer}>
            <Text style={styles.brandTitle}>DREAM LOVE</Text>
            <Text style={styles.brandSubtitle}>CAFE & RESTAURANT</Text>
          </View>
        </TouchableOpacity>

        {/* Desktop Navigation Links */}
        {isDesktop && (
          <View style={styles.desktopNav}>
            {navLinks.map((link) => (
              <TouchableOpacity
                key={link.href}
                onPress={() => router.push(link.href as any)}
                style={styles.navItem}
              >
                <Text style={[styles.navText, isActive(link.href) && styles.navTextActive]}>
                  {link.label}
                </Text>
                {isActive(link.href) && <View style={styles.activeIndicator} />}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Header Actions */}
        <View style={styles.actionsContainer}>
          {/* Cart Icon */}
          <TouchableOpacity 
            style={styles.cartButton} 
            onPress={openCart}
            activeOpacity={0.8}
            accessibilityLabel="Open shopping cart"
          >
            <ShoppingBag size={20} color={COLORS.cream} />
            {itemCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{itemCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Desktop Primary CTAs */}
          {isDesktop && (
            <React.Fragment>
              <TouchableOpacity 
                style={styles.secondaryCta}
                onPress={() => router.push('/book')}
                activeOpacity={0.8}
              >
                <Calendar size={16} color={COLORS.copper} style={{ marginRight: 6 }} />
                <Text style={styles.secondaryCtaText}>Reserve Table</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.primaryCta}
                onPress={() => router.push('/menu')}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryCtaText}>Order Now</Text>
              </TouchableOpacity>
            </React.Fragment>
          )}

          {/* Mobile Hamburger Toggle */}
          {!isDesktop && (
            <TouchableOpacity
              style={styles.menuToggle}
              onPress={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X size={24} color={COLORS.cream} />
              ) : (
                <MenuIcon size={24} color={COLORS.cream} />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Mobile Drawer Menu Dropdown */}
      {!isDesktop && isMobileMenuOpen && (
        <View style={styles.mobileDrawer}>
          {navLinks.map((link) => (
            <TouchableOpacity
              key={link.href}
              style={[styles.mobileNavItem, isActive(link.href) && styles.mobileNavItemActive]}
              onPress={() => {
                setIsMobileMenuOpen(false);
                router.push(link.href as any);
              }}
            >
              <Text style={[styles.mobileNavText, isActive(link.href) && styles.mobileNavTextActive]}>
                {link.label}
              </Text>
            </TouchableOpacity>
          ))}

          <View style={styles.mobileCtaRow}>
            <TouchableOpacity
              style={[styles.secondaryCta, { flex: 1, marginRight: 8, justifyContent: 'center' }]}
              onPress={() => {
                setIsMobileMenuOpen(false);
                router.push('/book');
              }}
            >
              <Text style={styles.secondaryCtaText}>Reserve</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryCta, { flex: 1, justifyContent: 'center' }]}
              onPress={() => {
                setIsMobileMenuOpen(false);
                router.push('/menu');
              }}
            >
              <Text style={styles.primaryCtaText}>Order Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: COLORS.glassBackground,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    zIndex: 1000,
    width: '100%',
    position: Platform.OS === 'web' ? ('sticky' as any) : 'relative',
    top: 0,
  },
  headerScrolled: {
    backgroundColor: 'rgba(18, 15, 14, 0.96)',
    borderBottomColor: COLORS.copperDark + '40',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  headerContent: {
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 38,
    height: 38,
    marginRight: 10,
    borderRadius: BORDER_RADIUS.sm,
  },
  brandTextContainer: {
    justifyContent: 'center',
  },
  brandTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.cream,
    letterSpacing: 1.5,
  },
  brandSubtitle: {
    fontSize: 9,
    fontWeight: '600',
    color: COLORS.copper,
    letterSpacing: 2,
    marginTop: -2,
  },
  desktopNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 28,
  },
  navItem: {
    position: 'relative',
    paddingVertical: 6,
  },
  navText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  navTextActive: {
    color: COLORS.gold,
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: COLORS.copper,
    borderRadius: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.copper,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: COLORS.background,
    fontSize: 10,
    fontWeight: '700',
  },
  secondaryCta: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.copper + '80',
    backgroundColor: 'transparent',
  },
  secondaryCtaText: {
    color: COLORS.cream,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  primaryCta: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.copper,
    alignItems: 'center',
  },
  primaryCtaText: {
    color: COLORS.background,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  menuToggle: {
    padding: 6,
  },
  mobileDrawer: {
    backgroundColor: COLORS.surfaceElevated,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  mobileNavItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border + '40',
  },
  mobileNavItemActive: {
    borderBottomColor: COLORS.copper,
  },
  mobileNavText: {
    color: COLORS.textMuted,
    fontSize: 16,
    fontWeight: '500',
  },
  mobileNavTextActive: {
    color: COLORS.gold,
    fontWeight: '700',
  },
  mobileCtaRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
});
