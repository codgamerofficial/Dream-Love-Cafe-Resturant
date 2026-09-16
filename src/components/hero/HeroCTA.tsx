import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Utensils, Calendar, MapPin, ArrowUpRight } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY } from '../../theme';
import { useSettings } from '../../context/SettingsContext';
import { analytics } from '../../services/analytics';

export const HeroCTA: React.FC = () => {
  const router = useRouter();
  const { settings } = useSettings();
  const { width } = useWindowDimensions();

  const isSmallMobile = width < 380;
  const isMobile = width < 600;

  const handleOpenMaps = () => {
    try {
      analytics.track('directions_click');
    } catch {
      // analytics fallback
    }
    if (settings.googleMapsUrl) {
      if (Platform.OS === 'web') {
        window.open(settings.googleMapsUrl, '_blank', 'noopener,noreferrer');
      } else {
        Linking.openURL(settings.googleMapsUrl);
      }
    }
  };

  return (
    <View 
      style={[styles.container, isMobile && styles.containerMobile]}
      {...(Platform.OS === 'web' ? { className: 'animate-dream-rise-delay-5' } : {})}
    >
      {/* Primary Action: Explore Menu */}
      <TouchableOpacity
        style={[
          styles.btnBase,
          styles.primaryBtn,
          isSmallMobile && styles.btnFullWidth,
        ]}
        onPress={() => router.push('/menu')}
        activeOpacity={0.88}
        accessibilityRole="button"
        accessibilityLabel="Explore the complete multi-cuisine menu"
      >
        <Utensils size={17} color="#FFFFFF" style={styles.btnIcon} />
        <Text style={styles.primaryBtnText}>Explore Menu</Text>
      </TouchableOpacity>

      {/* Secondary Action: Reserve a Table (Liquid Glass) */}
      <TouchableOpacity
        style={[
          styles.btnBase,
          styles.secondaryGlassBtn,
          isSmallMobile && styles.btnFullWidth,
        ]}
        onPress={() => router.push('/book')}
        activeOpacity={0.88}
        accessibilityRole="button"
        accessibilityLabel="Reserve a table at Dream Love Cafe & Restaurant"
        {...(Platform.OS === 'web' ? { className: 'liquid-glass' } : {})}
      >
        <Calendar size={17} color={COLORS.dreamTeal} style={styles.btnIcon} />
        <Text style={styles.secondaryBtnText}>Reserve a Table</Text>
      </TouchableOpacity>

      {/* Tertiary Action: Get Directions (Subtle Glass) */}
      <TouchableOpacity
        style={styles.directionsBtn}
        onPress={handleOpenMaps}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Get directions to Dream Love Restaurant on Google Maps"
      >
        <MapPin size={14} color={COLORS.dreamCopper} style={{ marginRight: 5 }} />
        <Text style={styles.directionsText}>Get Directions</Text>
        <ArrowUpRight size={13} color={COLORS.dreamCopper} style={{ marginLeft: 2 }} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 14,
    marginTop: 36,
    width: '100%',
    maxWidth: 620,
    paddingHorizontal: 8,
  },
  containerMobile: {
    gap: 10,
    marginTop: 18,
  },
  btnBase: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    paddingHorizontal: 28,
    borderRadius: 9999,
    minWidth: 160,
    cursor: Platform.OS === 'web' ? ('pointer' as any) : undefined,
  },
  btnFullWidth: {
    width: '100%',
    minWidth: '100%',
  },
  btnIcon: {
    marginRight: 8,
  },
  primaryBtn: {
    backgroundColor: COLORS.dreamPink,
    shadowColor: COLORS.dreamPink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
    letterSpacing: 0.2,
  },
  secondaryGlassBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.055)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
  },
  secondaryBtnText: {
    color: COLORS.dreamCream,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
    letterSpacing: 0.2,
  },
  directionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    cursor: Platform.OS === 'web' ? ('pointer' as any) : undefined,
  },
  directionsText: {
    color: 'rgba(255, 255, 255, 0.76)',
    fontSize: 13,
    fontWeight: '500',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
});
