import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { ShoppingBag, Calendar, Menu as MenuIcon, X, ShieldCheck } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../theme';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import { BrandLogo } from '../ui/BrandLogo';

export const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const { itemCount, openCart } = useCart();
  const { settings } = useSettings();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isDesktop = width >= 768;
  const isSmallMobile = width < 380;

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 20);
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
        {/* Authentic Storefront Brand Logo */}
        <View style={styles.logoWrapper}>
          <BrandLogo 
            variant={isDesktop ? 'primary' : 'compact'} 
            size={isDesktop ? 'md' : isSmallMobile ? 'sm' : 'sm'} 
          />
        </View>

        {/* Desktop Navigation Links */}
        {isDesktop && (
          <View style={styles.desktopNav}>
            {navLinks.map((link) => (
              <TouchableOpacity
                key={link.href}
                onPress={() => router.push(link.href as any)}
                style={styles.navItem}
                accessibilityRole="link"
                accessibilityLabel={link.label}
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
            accessibilityRole="button"
            accessibilityLabel={`Shopping cart with ${itemCount} items`}
          >
            <ShoppingBag size={18} color={COLORS.cream} />
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
                style={[styles.secondaryCta, (isActive('/book') || isActive('/bookings')) && styles.secondaryCtaActive]}
                onPress={() => router.push('/book')}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Reserve a table"
                accessibilityState={{ selected: isActive('/book') || isActive('/bookings') }}
              >
                <Calendar size={15} color={(isActive('/book') || isActive('/bookings')) ? COLORS.cream : COLORS.brandTurquoise} style={{ marginRight: 6 }} />
                <Text style={[styles.secondaryCtaText, (isActive('/book') || isActive('/bookings')) && styles.secondaryCtaTextActive]}>Reserve</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.primaryCta}
                onPress={() => router.push('/menu')}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel="Order now"
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
              accessibilityRole="button"
              accessibilityLabel="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X size={22} color={COLORS.cream} />
              ) : (
                <MenuIcon size={22} color={COLORS.cream} />
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

          {/* Admin Quick Link */}
          <TouchableOpacity
            style={styles.mobileAdminLink}
            onPress={() => {
              setIsMobileMenuOpen(false);
              router.push('/admin');
            }}
          >
            <ShieldCheck size={16} color={COLORS.textMuted} style={{ marginRight: 8 }} />
            <Text style={styles.mobileAdminText}>Owner / Admin Portal</Text>
          </TouchableOpacity>

          <View style={styles.mobileCtaRow}>
            <TouchableOpacity
              style={[styles.secondaryCta, { flex: 1, marginRight: 8, justifyContent: 'center' }]}
              onPress={() => {
                setIsMobileMenuOpen(false);
                router.push('/book');
              }}
            >
              <Text style={styles.secondaryCtaText}>Book Table</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryCta, { flex: 1, justifyContent: 'center' }]}
              onPress={() => {
                setIsMobileMenuOpen(false);
                router.push('/menu');
              }}
            >
              <Text style={styles.primaryCtaText}>View Menu</Text>
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
    backgroundColor: 'rgba(18, 15, 14, 0.97)',
    borderBottomColor: COLORS.brandGreen + '50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  headerContent: {
    maxWidth: 1240,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: Platform.OS === 'web' ? 10 : 8,
    minHeight: 56,
  },
  logoWrapper: {
    flexShrink: 1,
    marginRight: 8,
  },
  desktopNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  navItem: {
    paddingVertical: SPACING.xs,
    position: 'relative',
  },
  navText: {
    color: COLORS.creamMuted,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  navTextActive: {
    color: COLORS.cream,
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -6,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: COLORS.brandTurquoise,
    borderRadius: 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cartButton: {
    width: 38,
    height: 38,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.brandHeart,
    borderRadius: BORDER_RADIUS.full,
    minWidth: 17,
    height: 17,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
  },
  secondaryCta: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.brandGreen,
    backgroundColor: COLORS.brandGreen + '1A',
  },
  secondaryCtaActive: {
    backgroundColor: COLORS.brandGreen,
    borderColor: COLORS.brandTurquoise,
  },
  secondaryCtaText: {
    color: COLORS.cream,
    fontSize: 12.5,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  secondaryCtaTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  primaryCta: {
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.brandHeart,
    shadowColor: COLORS.brandHeart,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryCtaText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  menuToggle: {
    width: 38,
    height: 38,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileDrawer: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  mobileNavItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  mobileNavItemActive: {
    borderBottomColor: COLORS.brandTurquoise,
  },
  mobileNavText: {
    color: COLORS.creamMuted,
    fontSize: 15,
    fontWeight: '500',
  },
  mobileNavTextActive: {
    color: COLORS.cream,
    fontWeight: '700',
  },
  mobileAdminLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  mobileAdminText: {
    color: COLORS.textMuted,
    fontSize: 13.5,
  },
  mobileCtaRow: {
    flexDirection: 'row',
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
});
