import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { ShoppingBag, Calendar, Menu as MenuIcon, X, Phone, MapPin, ArrowRight } from 'lucide-react-native';
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

  const isDesktop = width >= 860;
  const isSmallMobile = width < 380;

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 24);
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Menu', href: '/menu' },
    { label: 'About', href: '/about' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Reviews', href: '/reviews' },
    { label: 'Visit Us', href: '/visit' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <View style={[
      styles.headerContainer, 
      isScrolled ? styles.headerScrolled : styles.headerInitial
    ]}>
      <View style={styles.headerContent}>
        {/* Left: Authentic Storefront Brand Logo */}
        <View style={styles.logoWrapper}>
          <BrandLogo 
            variant={isDesktop ? 'primary' : 'compact'} 
            size={isDesktop ? 'md' : isSmallMobile ? 'sm' : 'sm'} 
          />
        </View>

        {/* Center: Desktop Navigation Links with Editorial Underlines */}
        {isDesktop && (
          <View style={styles.desktopNav}>
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <TouchableOpacity
                  key={link.href}
                  onPress={() => router.push(link.href as any)}
                  style={styles.navItem}
                  accessibilityRole="link"
                  accessibilityLabel={link.label}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.navText, active && styles.navTextActive]}>
                    {link.label}
                  </Text>
                  {active && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Right: Header Actions */}
        <View style={styles.actionsContainer}>
          {/* Cart Icon with Live Item Count Badge */}
          <TouchableOpacity 
            style={styles.cartButton} 
            onPress={openCart}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={`Shopping cart with ${itemCount} items`}
          >
            <ShoppingBag size={19} color={COLORS.cream} />
            {itemCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{itemCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Desktop Primary CTAs */}
          {isDesktop ? (
            <React.Fragment>
              <TouchableOpacity 
                style={[styles.reserveCta, (isActive('/book') || isActive('/bookings')) && styles.reserveCtaActive]}
                onPress={() => router.push('/book')}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Reserve a table"
              >
                <Calendar size={14} color={(isActive('/book') || isActive('/bookings')) ? COLORS.cream : COLORS.brandTurquoise} style={{ marginRight: 6 }} />
                <Text style={[styles.reserveCtaText, (isActive('/book') || isActive('/bookings')) && styles.reserveCtaTextActive]}>
                  Reserve
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.orderNowCta}
                onPress={() => router.push('/menu')}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel="Order now from our menu"
              >
                <Text style={styles.orderNowCtaText}>Order Now</Text>
              </TouchableOpacity>
            </React.Fragment>
          ) : (
            /* Mobile Menu Hamburger Toggle */
            <TouchableOpacity
              style={styles.mobileMenuToggle}
              onPress={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={isMobileMenuOpen ? 'Close menu' : 'Open navigation menu'}
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

      {/* Mobile Slide-Down Dropdown Menu */}
      {!isDesktop && isMobileMenuOpen && (
        <View style={styles.mobileDropdown}>
          <View style={styles.mobileNavLinks}>
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <TouchableOpacity
                  key={link.href}
                  onPress={() => router.push(link.href as any)}
                  style={[styles.mobileNavItem, active && styles.mobileNavItemActive]}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.mobileNavText, active && styles.mobileNavTextActive]}>
                    {link.label}
                  </Text>
                  <ArrowRight size={14} color={active ? COLORS.brandTurquoise : COLORS.textSubtle} />
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.mobileActionButtons}>
            <TouchableOpacity 
              style={styles.mobileOrderBtn}
              onPress={() => router.push('/menu')}
              activeOpacity={0.85}
            >
              <Text style={styles.mobileOrderBtnText}>Order Now</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.mobileReserveBtn}
              onPress={() => router.push('/book')}
              activeOpacity={0.85}
            >
              <Calendar size={15} color={COLORS.brandTurquoise} style={{ marginRight: 6 }} />
              <Text style={styles.mobileReserveBtnText}>Reserve a Table</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.mobileFooterInfo}>
            <View style={styles.mobileInfoRow}>
              <Phone size={13} color={COLORS.copper} style={{ marginRight: 6 }} />
              <Text style={styles.mobileInfoText}>{settings.phone}</Text>
            </View>
            <View style={styles.mobileInfoRow}>
              <MapPin size={13} color={COLORS.copper} style={{ marginRight: 6 }} />
              <Text style={styles.mobileInfoText}>Central Bus Stand, Contai</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: Platform.OS === 'web' ? ('sticky' as any) : 'relative',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    width: '100%',
  },
  headerInitial: {
    backgroundColor: 'rgba(18, 15, 14, 0.88)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerScrolled: {
    backgroundColor: 'rgba(18, 15, 14, 0.96)',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  headerContent: {
    maxWidth: 1240,
    width: '100%',
    marginHorizontal: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 12,
    minHeight: 64,
  },
  logoWrapper: {
    flexShrink: 0,
  },
  desktopNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 28,
  },
  navItem: {
    position: 'relative',
    paddingVertical: 8,
    paddingHorizontal: 2,
  },
  navText: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  navTextActive: {
    color: COLORS.cream,
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 2,
    right: 2,
    height: 2,
    backgroundColor: COLORS.brandTurquoise,
    borderRadius: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cartButton: {
    width: 38,
    height: 38,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.brandHeart,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  reserveCta: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  reserveCtaActive: {
    backgroundColor: COLORS.surfaceElevated,
    borderColor: COLORS.brandTurquoise,
  },
  reserveCtaText: {
    color: COLORS.cream,
    fontSize: 13,
    fontWeight: '600',
  },
  reserveCtaTextActive: {
    color: COLORS.brandTurquoise,
  },
  orderNowCta: {
    backgroundColor: COLORS.brandHeart,
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.brandHeart,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  orderNowCtaText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  mobileMenuToggle: {
    width: 38,
    height: 38,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileDropdown: {
    backgroundColor: COLORS.surfaceElevated,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  mobileNavLinks: {
    marginBottom: SPACING.md,
  },
  mobileNavItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  mobileNavItemActive: {
    borderBottomColor: COLORS.brandTurquoise + '40',
  },
  mobileNavText: {
    color: COLORS.creamMuted,
    fontSize: 15,
    fontWeight: '500',
  },
  mobileNavTextActive: {
    color: COLORS.brandTurquoise,
    fontWeight: '700',
  },
  mobileActionButtons: {
    gap: 10,
    marginBottom: SPACING.md,
  },
  mobileOrderBtn: {
    backgroundColor: COLORS.brandHeart,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileOrderBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700',
  },
  mobileReserveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingVertical: 11,
    borderRadius: BORDER_RADIUS.md,
  },
  mobileReserveBtnText: {
    color: COLORS.cream,
    fontSize: 14,
    fontWeight: '600',
  },
  mobileFooterInfo: {
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 6,
  },
  mobileInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mobileInfoText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
});
