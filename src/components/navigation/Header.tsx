import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, useWindowDimensions, Modal } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { ShoppingBag, Calendar, Menu as MenuIcon, X, Phone, MapPin, ArrowRight, Clock, MessageSquare, Utensils } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, LAYOUT, SHADOWS } from '../../theme';
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

  const isDesktop = width >= 920;
  const isTablet = width >= 600 && width < 920;
  const isSmallMobile = width < 380;

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 20);
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
    { label: 'Visit', href: '/visit' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const handleWhatsApp = () => {
    window?.open?.(`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`, '_blank');
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
            <ShoppingBag size={18} color={COLORS.cream} />
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
                <Utensils size={13} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.orderNowCtaText}>Order Now</Text>
              </TouchableOpacity>
            </React.Fragment>
          ) : (
            /* Mobile Menu Hamburger Toggle */
            <TouchableOpacity
              style={styles.mobileMenuToggle}
              onPress={() => setIsMobileMenuOpen(true)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Open navigation menu"
            >
              <MenuIcon size={20} color={COLORS.cream} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Elegant Full-Height Mobile Navigation Drawer Modal */}
      {!isDesktop && (
        <Modal
          visible={isMobileMenuOpen}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setIsMobileMenuOpen(false)}
        >
          <View style={styles.drawerBackdrop}>
            <TouchableOpacity 
              style={styles.drawerOverlayDismiss} 
              onPress={() => setIsMobileMenuOpen(false)} 
              activeOpacity={1} 
            />
            <View style={styles.drawerPanel}>
              {/* Drawer Top Bar */}
              <View style={styles.drawerTopBar}>
                <BrandLogo variant="compact" size="sm" />
                <TouchableOpacity
                  style={styles.drawerCloseBtn}
                  onPress={() => setIsMobileMenuOpen(false)}
                  accessibilityRole="button"
                  accessibilityLabel="Close navigation drawer"
                >
                  <X size={20} color={COLORS.cream} />
                </TouchableOpacity>
              </View>

              {/* Navigation Links */}
              <View style={styles.drawerNavLinks}>
                {navLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <TouchableOpacity
                      key={link.href}
                      onPress={() => {
                        setIsMobileMenuOpen(false);
                        router.push(link.href as any);
                      }}
                      style={[styles.drawerNavItem, active && styles.drawerNavItemActive]}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.drawerNavText, active && styles.drawerNavTextActive]}>
                        {link.label}
                      </Text>
                      <ArrowRight size={15} color={active ? COLORS.brandTurquoise : COLORS.textSubtle} />
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Action Buttons */}
              <View style={styles.drawerActionButtons}>
                <TouchableOpacity 
                  style={styles.drawerOrderBtn}
                  onPress={() => {
                    setIsMobileMenuOpen(false);
                    router.push('/menu');
                  }}
                  activeOpacity={0.85}
                >
                  <Utensils size={15} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.drawerOrderBtnText}>Explore Menu & Order</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.drawerReserveBtn}
                  onPress={() => {
                    setIsMobileMenuOpen(false);
                    router.push('/book');
                  }}
                  activeOpacity={0.85}
                >
                  <Calendar size={15} color={COLORS.brandTurquoise} style={{ marginRight: 8 }} />
                  <Text style={styles.drawerReserveBtnText}>Reserve a Table</Text>
                </TouchableOpacity>
              </View>

              {/* Bottom Quick Contact & Hours */}
              <View style={styles.drawerFooterInfo}>
                <View style={styles.drawerInfoItem}>
                  <Phone size={14} color={COLORS.brandTurquoise} style={{ marginRight: 8 }} />
                  <Text style={styles.drawerInfoText}>{settings.phone}</Text>
                </View>
                <View style={styles.drawerInfoItem}>
                  <Clock size={14} color={COLORS.gold} style={{ marginRight: 8 }} />
                  <Text style={styles.drawerInfoText}>12:00 PM – 12:00 AM Daily</Text>
                </View>
                <View style={styles.drawerInfoItem}>
                  <MapPin size={14} color={COLORS.copper} style={{ marginRight: 8 }} />
                  <Text style={styles.drawerInfoText}>Contai Bypass Rd, Contai</Text>
                </View>
              </View>
            </View>
          </View>
        </Modal>
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
    backgroundColor: COLORS.glassHeader,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  headerScrolled: {
    backgroundColor: 'rgba(18, 15, 14, 0.96)',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 10,
    elevation: 4,
  },
  headerContent: {
    maxWidth: LAYOUT.maxContainerWidth,
    width: '100%',
    marginHorizontal: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: 12,
    minHeight: 68,
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
    letterSpacing: 0.3,
    fontFamily: TYPOGRAPHY.fontFamilySans,
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
    width: 40,
    height: 40,
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
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  reserveCta: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8.5,
    paddingHorizontal: 15,
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
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  reserveCtaTextActive: {
    color: COLORS.brandTurquoise,
  },
  orderNowCta: {
    flexDirection: 'row',
    backgroundColor: COLORS.brandHeart,
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.brandHeart,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },
  orderNowCtaText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
    letterSpacing: 0.3,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  mobileMenuToggle: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.70)',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  drawerOverlayDismiss: {
    flex: 1,
  },
  drawerPanel: {
    width: '82%',
    maxWidth: 340,
    height: '100%',
    backgroundColor: COLORS.surfaceElevated,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.border,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
    flexDirection: 'column',
    justifyContent: 'space-between',
    ...SHADOWS.cardHover,
  },
  drawerTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  drawerCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  drawerNavLinks: {
    marginVertical: SPACING.lg,
    gap: 4,
  },
  drawerNavItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  drawerNavItemActive: {
    borderBottomColor: COLORS.borderAccent,
  },
  drawerNavText: {
    color: COLORS.creamMuted,
    fontSize: 16,
    fontWeight: '500',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  drawerNavTextActive: {
    color: COLORS.brandTurquoise,
    fontWeight: '700',
  },
  drawerActionButtons: {
    gap: 10,
    marginVertical: SPACING.md,
  },
  drawerOrderBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.brandHeart,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.brandHeart,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },
  drawerOrderBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  drawerReserveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingVertical: 11,
    borderRadius: BORDER_RADIUS.md,
  },
  drawerReserveBtnText: {
    color: COLORS.cream,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  drawerFooterInfo: {
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 8,
  },
  drawerInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerInfoText: {
    fontSize: 12.5,
    color: COLORS.textMuted,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
});
