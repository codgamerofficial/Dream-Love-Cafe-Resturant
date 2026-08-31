import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform, useWindowDimensions } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Home, UtensilsCrossed, ShoppingBag, Calendar, MessageSquare, Phone, MapPin } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../theme';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import { analytics } from '../../services/analytics';

export const MobileBottomNav: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const { itemCount, openCart } = useCart();
  const { settings } = useSettings();

  // Hide bottom nav on desktop/tablet screens >= 768px
  if (width >= 768) {
    return null;
  }

  const isSmallMobile = width < 360;

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Menu', href: '/menu', icon: UtensilsCrossed },
    { label: 'Order', action: openCart, icon: ShoppingBag, badge: itemCount },
    { label: 'Bookings', href: '/book', icon: Calendar },
    { label: 'Visit', href: '/visit', icon: MapPin },
  ];

  const handleWhatsApp = () => {
    analytics.track('whatsapp_click', { source: 'floating_action' });
    const waUrl = `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`;
    Linking.openURL(waUrl).catch((err) => console.log('Could not open WhatsApp', err));
  };

  const handleCall = () => {
    analytics.track('call_click', { source: 'floating_action' });
    const phoneUrl = `tel:${settings.phone.replace(/[^0-9+]/g, '')}`;
    Linking.openURL(phoneUrl).catch((err) => console.log('Could not place call', err));
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <React.Fragment>
      {/* Floating Action Buttons */}
      <View style={[styles.floatingContainer, isSmallMobile && styles.floatingContainerSmall]}>
        {/* Call Button */}
        <TouchableOpacity
          style={[styles.floatingCallButton, isSmallMobile && styles.floatingBtnSmall]}
          onPress={handleCall}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Call restaurant directly"
        >
          <Phone size={isSmallMobile ? 15 : 17} color="#FFFFFF" />
        </TouchableOpacity>

        {/* WhatsApp Button */}
        <TouchableOpacity
          style={[styles.floatingWaButton, isSmallMobile && styles.floatingBtnSmall]}
          onPress={handleWhatsApp}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Chat on WhatsApp"
        >
          <MessageSquare size={isSmallMobile ? 15 : 17} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation Bar */}
      <View style={[styles.bottomNavContainer, isSmallMobile && styles.bottomNavContainerSmall]}>
        {navItems.map((item, index) => {
          const IconComponent = item.icon;
          const active = isActive(item.href);

          return (
            <TouchableOpacity
              key={index}
              style={[styles.tabItem, isSmallMobile && styles.tabItemSmall]}
              onPress={() => {
                if (item.action) {
                  item.action();
                } else if (item.href) {
                  router.push(item.href as any);
                }
              }}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel={item.label}
            >
              <View style={styles.iconContainer}>
                <IconComponent
                  size={isSmallMobile ? 17 : 19}
                  color={active ? COLORS.brandTurquoise : COLORS.textSubtle}
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <View style={[styles.badge, isSmallMobile && styles.badgeSmall]}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
              </View>
              <Text 
                style={[
                  styles.tabLabel, 
                  isSmallMobile && styles.tabLabelSmall,
                  active && styles.tabLabelActive
                ]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  floatingContainer: {
    position: Platform.OS === 'web' ? ('fixed' as any) : 'absolute',
    bottom: 72,
    right: 14,
    flexDirection: 'column',
    gap: 10,
    zIndex: 995,
  },
  floatingContainerSmall: {
    bottom: 66,
    right: 10,
    gap: 8,
  },
  floatingCallButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E40AF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    ...SHADOWS.cardHover,
  },
  floatingWaButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#15803D',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    ...SHADOWS.cardHover,
  },
  floatingBtnSmall: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  bottomNavContainer: {
    position: Platform.OS === 'web' ? ('fixed' as any) : 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(22, 18, 17, 0.98)',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 7,
    paddingBottom: Platform.OS === 'ios' ? 22 : 9,
    minHeight: 60,
    zIndex: 994,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 10,
  },
  bottomNavContainerSmall: {
    minHeight: 54,
    paddingVertical: 5,
    paddingBottom: Platform.OS === 'ios' ? 18 : 6,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 2,
    minHeight: 44,
  },
  tabItemSmall: {
    minHeight: 40,
    paddingVertical: 1,
  },
  iconContainer: {
    position: 'relative',
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: COLORS.brandHeart,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeSmall: {
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    top: -3,
    right: -8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  tabLabel: {
    fontSize: 10.5,
    color: COLORS.textSubtle,
    fontWeight: '500',
    marginTop: 3,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  tabLabelSmall: {
    fontSize: 9.5,
    marginTop: 2,
  },
  tabLabelActive: {
    color: COLORS.brandTurquoise,
    fontWeight: '700',
  },
});
