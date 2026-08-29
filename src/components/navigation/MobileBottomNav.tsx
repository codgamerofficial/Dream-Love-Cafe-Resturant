import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform, useWindowDimensions } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Home, UtensilsCrossed, ShoppingBag, Calendar, MessageSquare, Phone, MapPin } from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../../theme';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import { analytics } from '../../services/analytics';

export const MobileBottomNav: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const { itemCount, openCart } = useCart();
  const { settings } = useSettings();

  // Hide bottom nav on desktop screens
  if (width >= 768) {
    return null;
  }

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
      <View style={styles.floatingContainer}>
        {/* Call Button */}
        <TouchableOpacity
          style={styles.floatingCallButton}
          onPress={handleCall}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Call restaurant directly"
        >
          <Phone size={18} color="#FFFFFF" />
        </TouchableOpacity>

        {/* WhatsApp Button */}
        <TouchableOpacity
          style={styles.floatingWaButton}
          onPress={handleWhatsApp}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Chat on WhatsApp"
        >
          <MessageSquare size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNavContainer}>
        {navItems.map((item, index) => {
          const IconComponent = item.icon;
          const active = isActive(item.href);

          return (
            <TouchableOpacity
              key={index}
              style={styles.tabItem}
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
                  size={19}
                  color={active ? COLORS.brandTurquoise : COLORS.textSubtle}
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
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
    bottom: 68,
    right: 14,
    flexDirection: 'column',
    gap: 10,
    zIndex: 999,
  },
  floatingCallButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 6,
  },
  floatingWaButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 6,
  },
  bottomNavContainer: {
    position: Platform.OS === 'web' ? ('fixed' as any) : 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(26, 22, 21, 0.98)',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 6,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    minHeight: 56,
    zIndex: 998,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 2,
    minHeight: 42,
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
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  tabLabel: {
    fontSize: 10,
    color: COLORS.textSubtle,
    fontWeight: '500',
    marginTop: 2,
  },
  tabLabelActive: {
    color: COLORS.brandTurquoise,
    fontWeight: '700',
  },
});
