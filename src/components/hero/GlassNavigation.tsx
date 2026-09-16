import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { ShoppingBag, Calendar, Utensils, Menu as MenuIcon } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY } from '../../theme';
import { BrandLogo } from '../ui/BrandLogo';
import { useCart } from '../../context/CartContext';
import { MobileMenu } from './MobileMenu';

export const GlassNavigation: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const { itemCount, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDesktop = width >= 960;
  const isSmallMobile = width < 380;

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
    <View 
      style={styles.headerWrapper}
      {...(Platform.OS === 'web' ? { role: 'banner' } : {})}
    >
      <View 
        style={[
          styles.navContainer,
          isDesktop ? styles.navContainerDesktop : styles.navContainerMobile,
        ]}
        {...(Platform.OS === 'web' ? { className: 'glass-navigation' } : {})}
      >
        {/* LEFT: Authentic Dream Love Logo */}
        <View style={styles.logoWrapper}>
          <BrandLogo 
            variant={isDesktop ? 'primary' : 'compact'} 
            size={isDesktop ? 'md' : 'sm'} 
          />
        </View>

        {/* CENTER: Desktop Navigation Links */}
        {isDesktop && (
          <View style={styles.desktopLinks} {...(Platform.OS === 'web' ? { role: 'navigation' } : {})}>
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <TouchableOpacity
                  key={link.href}
                  onPress={() => router.push(link.href as any)}
                  style={styles.navLinkItem}
                  activeOpacity={0.75}
                  accessibilityRole="link"
                  accessibilityLabel={link.label}
                >
                  <Text style={[styles.navLinkText, active && styles.navLinkTextActive]}>
                    {link.label}
                  </Text>
                  {active && <View style={styles.activeUnderline} />}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* RIGHT: CTAs & Cart / Mobile Menu */}
        <View style={styles.actionsWrapper}>
          {/* Cart Icon with Live Badge */}
          <TouchableOpacity
            style={styles.cartBtn}
            onPress={openCart}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={`Shopping cart with ${itemCount} items`}
          >
            <ShoppingBag size={17} color={COLORS.dreamCream} />
            {itemCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{itemCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Desktop Right CTAs */}
          {isDesktop ? (
            <View style={styles.desktopCtas}>
              <TouchableOpacity
                style={styles.reserveNavBtn}
                onPress={() => router.push('/book')}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel="Reserve a table"
                {...(Platform.OS === 'web' ? { className: 'liquid-glass' } : {})}
              >
                <Calendar size={14} color={COLORS.dreamTeal} style={{ marginRight: 6 }} />
                <Text style={styles.reserveNavText}>Reserve</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.orderNavBtn}
                onPress={() => router.push('/menu')}
                activeOpacity={0.88}
                accessibilityRole="button"
                accessibilityLabel="Order now from our menu"
              >
                <Utensils size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.orderNavText}>Order Now</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Mobile Hamburger Menu Toggle */
            <TouchableOpacity
              style={styles.hamburgerBtn}
              onPress={() => setMobileMenuOpen(true)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Open mobile navigation menu"
            >
              <MenuIcon size={20} color={COLORS.dreamCream} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Fullscreen Glass Mobile Drawer */}
      {!isDesktop && (
        <MobileMenu 
          isOpen={mobileMenuOpen} 
          onClose={() => setMobileMenuOpen(false)} 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    width: '100%',
    alignItems: 'center',
    paddingTop: Platform.OS === 'web' ? 16 : 40,
    paddingHorizontal: 16,
  },
  navContainer: {
    width: '100%',
    maxWidth: 1440,
    backgroundColor: 'rgba(18, 15, 13, 0.42)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navContainerDesktop: {
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  navContainerMobile: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  logoWrapper: {
    flexShrink: 0,
  },
  desktopLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
  },
  navLinkItem: {
    position: 'relative',
    paddingVertical: 8,
    paddingHorizontal: 4,
    cursor: Platform.OS === 'web' ? ('pointer' as any) : undefined,
  },
  navLinkText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.70)',
    fontFamily: TYPOGRAPHY.fontFamilySans,
    letterSpacing: 0.3,
  },
  navLinkTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  activeUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 4,
    right: 4,
    height: 2,
    backgroundColor: COLORS.dreamTeal,
    borderRadius: 1,
  },
  actionsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cartBtn: {
    width: 38,
    height: 38,
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    cursor: Platform.OS === 'web' ? ('pointer' as any) : undefined,
  },
  cartBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: COLORS.dreamPink,
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
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  desktopCtas: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  reserveNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.055)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    cursor: Platform.OS === 'web' ? ('pointer' as any) : undefined,
  },
  reserveNavText: {
    color: COLORS.dreamCream,
    fontSize: 13,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  orderNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 9999,
    backgroundColor: COLORS.dreamPink,
    cursor: Platform.OS === 'web' ? ('pointer' as any) : undefined,
  },
  orderNavText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  hamburgerBtn: {
    width: 38,
    height: 38,
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: Platform.OS === 'web' ? ('pointer' as any) : undefined,
  },
});
