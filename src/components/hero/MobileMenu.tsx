import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { X, ArrowRight, Utensils, Calendar, Phone, MapPin, Clock } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY } from '../../theme';
import { BrandLogo } from '../ui/BrandLogo';
import { useSettings } from '../../context/SettingsContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { settings } = useSettings();

  // Escape key listener for accessibility
  useEffect(() => {
    if (Platform.OS === 'web' && isOpen && typeof window !== 'undefined') {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

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

  const handleNavigate = (href: string) => {
    onClose();
    router.push(href as any);
  };

  return (
    <Modal
      visible={isOpen}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        {/* Outside click dismiss */}
        <TouchableOpacity
          style={styles.backdropDismiss}
          onPress={onClose}
          activeOpacity={1}
          accessibilityLabel="Close navigation menu"
        />

        {/* Glass Drawer Panel */}
        <View 
          style={styles.drawerPanel}
          {...(Platform.OS === 'web' ? { className: 'glass-navigation' } : {})}
        >
          {/* Top Bar */}
          <View style={styles.topBar}>
            <BrandLogo variant="compact" size="sm" />
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Close navigation menu"
            >
              <X size={20} color={COLORS.dreamCream} />
            </TouchableOpacity>
          </View>

          {/* Nav Links */}
          <View style={styles.linksContainer}>
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <TouchableOpacity
                  key={link.href}
                  onPress={() => handleNavigate(link.href)}
                  style={[styles.navItem, active && styles.navItemActive]}
                  activeOpacity={0.8}
                  accessibilityRole="link"
                  accessibilityLabel={link.label}
                >
                  <Text style={[styles.navText, active && styles.navTextActive]}>
                    {link.label}
                  </Text>
                  <ArrowRight 
                    size={16} 
                    color={active ? COLORS.dreamTeal : 'rgba(255, 255, 255, 0.3)'} 
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.primaryActionBtn}
              onPress={() => handleNavigate('/menu')}
              activeOpacity={0.88}
              accessibilityRole="button"
              accessibilityLabel="Explore menu and order"
            >
              <Utensils size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.primaryActionText}>Order Now</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryActionBtn}
              onPress={() => handleNavigate('/book')}
              activeOpacity={0.88}
              accessibilityRole="button"
              accessibilityLabel="Reserve a table"
              {...(Platform.OS === 'web' ? { className: 'liquid-glass' } : {})}
            >
              <Calendar size={16} color={COLORS.dreamTeal} style={{ marginRight: 8 }} />
              <Text style={styles.secondaryActionText}>Reserve a Table</Text>
            </TouchableOpacity>
          </View>

          {/* Footer Info */}
          <View style={styles.footerInfo}>
            <View style={styles.infoRow}>
              <Clock size={13} color={COLORS.dreamTeal} style={{ marginRight: 8 }} />
              <Text style={styles.infoText}>{settings.openingHours || '12:00 PM – 12:00 AM'}</Text>
            </View>
            <View style={styles.infoRow}>
              <MapPin size={13} color={COLORS.dreamCopper} style={{ marginRight: 8 }} />
              <Text style={styles.infoText}>Contai Bypass Road, West Bengal</Text>
            </View>
            {settings.phone && (
              <View style={styles.infoRow}>
                <Phone size={13} color={COLORS.dreamPink} style={{ marginRight: 8 }} />
                <Text style={styles.infoText}>{settings.phone}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  backdropDismiss: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  drawerPanel: {
    width: '85%',
    maxWidth: 340,
    height: '100%',
    backgroundColor: 'rgba(18, 15, 13, 0.94)',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.10)',
    paddingTop: Platform.OS === 'web' ? 24 : 48,
    paddingBottom: 28,
    paddingHorizontal: 20,
    flexDirection: 'column',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: Platform.OS === 'web' ? ('pointer' as any) : undefined,
  },
  linksContainer: {
    marginTop: 20,
    flexDirection: 'column',
    gap: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    cursor: Platform.OS === 'web' ? ('pointer' as any) : undefined,
  },
  navItemActive: {
    backgroundColor: 'rgba(45, 212, 191, 0.08)',
  },
  navText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.75)',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  navTextActive: {
    color: COLORS.dreamTeal,
    fontWeight: '600',
  },
  actionsContainer: {
    marginTop: 'auto',
    flexDirection: 'column',
    gap: 12,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  primaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 9999,
    backgroundColor: COLORS.dreamPink,
    cursor: Platform.OS === 'web' ? ('pointer' as any) : undefined,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  secondaryActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.055)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    cursor: Platform.OS === 'web' ? ('pointer' as any) : undefined,
  },
  secondaryActionText: {
    color: COLORS.dreamCream,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  footerInfo: {
    marginTop: 18,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.55)',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
});
