import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { MapPin, Clock, UtensilsCrossed, Star } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY } from '../../theme';
import { useSettings } from '../../context/SettingsContext';

interface HeroMetaProps {
  className?: string;
}

export const HeroMeta: React.FC<HeroMetaProps> = () => {
  const { settings } = useSettings();

  return (
    <View 
      style={styles.container}
      {...(Platform.OS === 'web' ? { className: 'animate-dream-rise-delay-4' } : {})}
    >
      {/* Location Chip */}
      <View style={styles.metaChip}>
        <MapPin size={13} color={COLORS.dreamCopper} style={styles.icon} />
        <Text style={styles.chipText}>Contai, West Bengal</Text>
      </View>

      <Text style={styles.separator}>•</Text>

      {/* Opening Hours Chip */}
      <View style={styles.metaChip}>
        <Clock size={13} color={COLORS.dreamTeal} style={styles.icon} />
        <Text style={styles.chipText}>12:00 PM – 12:00 AM</Text>
      </View>

      <Text style={styles.separator}>•</Text>

      {/* Cuisines Chip */}
      <View style={styles.metaChip}>
        <UtensilsCrossed size={13} color={COLORS.dreamPink} style={styles.icon} />
        <Text style={styles.chipText}>Indian • Tandoor • Chinese • Biryani</Text>
      </View>

      <Text style={styles.separator}>•</Text>

      {/* Google Rating Chip */}
      <View style={styles.metaChip}>
        <Star size={13} color={COLORS.gold} fill={COLORS.gold} style={styles.icon} />
        <Text style={styles.chipText}>
          Google {settings.googleRating} ★ {settings.googleReviewsCount ? `(${settings.googleReviewsCount}+)` : ''}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 24,
    paddingHorizontal: 12,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  icon: {
    marginRight: 6,
  },
  chipText: {
    color: 'rgba(255, 255, 255, 0.82)',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: TYPOGRAPHY.fontFamilySans,
    letterSpacing: 0.2,
  },
  separator: {
    color: 'rgba(255, 255, 255, 0.25)',
    fontSize: 12,
    marginHorizontal: 2,
  },
});
