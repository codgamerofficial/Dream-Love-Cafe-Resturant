import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform, useWindowDimensions } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Home, UtensilsCrossed, ShoppingBag, Calendar, MessageSquare, Phone, Info } from 'lucide-react-native';
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
    { label: 'Visit', href: '/contact', icon: Info },
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
          accessibilityLabel="Call restaurant directly"
        >
          <Phone size={20} color="#FFFFFF" />
        </TouchableOpacity>

        {/* WhatsApp Button */}
        <TouchableOpacity
          style={styles.floatingWaButton}
          onPress={handleWhatsApp}
          activeOpacity={0.85}
          accessibilityLabel="Chat on WhatsApp"
        >
          <MessageSquare size={20} color="#FFFFFF" />
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
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <IconComponent
                  size={20}
                  color={active ? COLORS.gold : COLORS.textSubtle}
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
    bottom: 80,
    right: 16,
    flexDirection: 'column',
    gap: 12,
    zIndex: 999,
  },
  floatingCallButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6', // Crisp action blue for phone calls
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
  },
  floatingWaButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#25D366', // Authentic WhatsApp Green
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
  },
  bottomNavContainer: {
    position: Platform.OS === 'web' ? ('fixed' as any) : 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surfaceElevated,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: SPACING.xs + 2,
    paddingBottom: Platform.OS === 'ios' ? 24 : SPACING.xs + 4,
    zIndex: 998,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 2,
  },
  iconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: COLORS.copper,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  badgeText: {
    color: COLORS.background,
    fontSize: 9,
    fontWeight: '700',
  },
  tabLabel: {
    fontSize: 10,
    color: COLORS.textSubtle,
    fontWeight: '500',
    marginTop: 3,
  },
  tabLabelActive: {
    color: COLORS.gold,
    fontWeight: '700',
  },
});
