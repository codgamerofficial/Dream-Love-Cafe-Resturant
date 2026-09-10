import React from 'react';
import { View, Text, StyleSheet, Platform, useWindowDimensions, TouchableOpacity } from 'react-native';
import { TYPOGRAPHY, COLORS } from '../../theme';

interface ScrollIndicatorProps {
  onPress?: () => void;
}

export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ onPress }) => {
  const { height } = useWindowDimensions();

  // Hide on very short viewports to avoid overlapping CTA
  if (height < 620) {
    return null;
  }

  const handleScrollDown = () => {
    if (onPress) {
      onPress();
      return;
    }
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth',
      });
    }
  };

  return (
    <TouchableOpacity
      onPress={handleScrollDown}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Scroll to explore restaurant story, menu and atmosphere"
      style={styles.container}
      {...(Platform.OS === 'web' ? { className: 'animate-dream-rise-delay-6' } : {})}
    >
      <Text style={styles.text}>SCROLL TO EXPLORE</Text>
      
      {/* Minimal Animated Vertical Line */}
      <View style={styles.lineTrack}>
        <View 
          style={styles.lineIndicator}
          {...(Platform.OS === 'web' ? { className: 'animate-scroll-pulse' } : {})}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 'auto',
    marginBottom: 16,
    zIndex: 10,
    cursor: Platform.OS === 'web' ? ('pointer' as any) : undefined,
  },
  text: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2.2,
    color: 'rgba(255, 255, 255, 0.46)',
    fontFamily: TYPOGRAPHY.fontFamilySans,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  lineTrack: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  lineIndicator: {
    width: 1,
    height: 14,
    backgroundColor: COLORS.dreamTeal,
    borderRadius: 1,
  },
});
