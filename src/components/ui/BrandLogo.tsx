import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { Link } from 'expo-router';
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import { COLORS, TYPOGRAPHY } from '../../theme';

interface BrandLogoProps {
  variant?: 'primary' | 'compact' | 'icon' | 'monochrome';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'dark' | 'light';
  asLink?: boolean;
  style?: ViewStyle;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'primary',
  size = 'md',
  theme = 'dark',
  asLink = true,
  style,
}) => {
  // Scaling factors
  const scale = size === 'sm' ? 0.78 : size === 'lg' ? 1.25 : size === 'xl' ? 1.55 : 1;
  const isLight = theme === 'light';

  const textColorDream = isLight ? '#065F46' : COLORS.brandTurquoise;
  const textColorLove = isLight ? '#9F1239' : COLORS.brandHeartLight;
  const textSubtitle = isLight ? '#4B5563' : COLORS.creamMuted;
  const iconPulse = isLight ? '#E11D48' : '#F43F5E';
  const iconGreen = isLight ? '#0D7C66' : '#2DD4BF';

  const iconWidth = 36 * scale;
  const iconHeight = 32 * scale;

  const content = (
    <View style={[styles.container, style]}>
      {/* Authentic Storefront Heart & Pulse SVG Icon */}
      <View style={styles.iconContainer}>
        <Svg width={iconWidth} height={iconHeight} viewBox="0 0 48 40" fill="none">
          <Defs>
            <LinearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#FB7185" />
              <Stop offset="100%" stopColor="#BE123C" />
            </LinearGradient>
            <LinearGradient id="pulseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={iconGreen} />
              <Stop offset="50%" stopColor="#FB7185" />
              <Stop offset="100%" stopColor={iconGreen} />
            </LinearGradient>
          </Defs>

          {/* Heart Silhouette */}
          <Path
            d="M24 36.5L21.3 34.05C11.7 25.35 5.3 19.55 5.3 12.45C5.3 6.65 9.85 2.1 15.65 2.1C18.9 2.1 22.05 3.65 24 6.05C25.95 3.65 29.1 2.1 32.35 2.1C38.15 2.1 42.7 6.65 42.7 12.45C42.7 19.55 36.3 25.35 26.7 34.05L24 36.5Z"
            fill="url(#heartGrad)"
            opacity={0.35}
          />

          {/* Heart Contour */}
          <Path
            d="M24 36.5L21.3 34.05C11.7 25.35 5.3 19.55 5.3 12.45C5.3 6.65 9.85 2.1 15.65 2.1C18.9 2.1 22.05 3.65 24 6.05C25.95 3.65 29.1 2.1 32.35 2.1C38.15 2.1 42.7 6.65 42.7 12.45C42.7 19.55 36.3 25.35 26.7 34.05L24 36.5Z"
            stroke={iconPulse}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Heartbeat / ECG Wave matching storefront sign */}
          <Path
            d="M1 20H12L15 11L20 28L25 14L28 24L31 20H47"
            stroke="url(#pulseGrad)"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Glowing pulse dots */}
          <Circle cx="20" cy="28" r="1.5" fill="#FFF" />
          <Circle cx="25" cy="14" r="1.5" fill="#FFF" />
        </Svg>
      </View>

      {variant !== 'icon' && (
        <View style={styles.textBlock}>
          <View style={styles.brandTitleRow}>
            <Text style={[styles.brandDream, { color: textColorDream, fontSize: 18 * scale }]}>
              DREAM
            </Text>
            <Text style={[styles.brandLove, { color: textColorLove, fontSize: 18 * scale }]}>
              {' '}LOVE
            </Text>
            {/* Real Storefront 3-Heart Accent */}
            <View style={styles.heartTrio}>
              <Text style={{ color: COLORS.brandHeart, fontSize: 9 * scale, letterSpacing: 1 }}>♥♥♥</Text>
            </View>
          </View>

          {variant !== 'compact' && (
            <View style={styles.subtitleRow}>
              <Text style={[styles.brandSubtitle, { color: textSubtitle, fontSize: 9 * scale }]}>
                CAFÉ & RESTAURANT
              </Text>
              <View style={[styles.subtitleBadge, { backgroundColor: isLight ? '#E0E7FF' : COLORS.brandGreenMuted }]}>
                <Text style={[styles.subtitleBadgeText, { color: iconGreen, fontSize: 7.5 * scale }]}>
                  CONTAI
                </Text>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );

  if (asLink) {
    return (
      <Link href="/" asChild>
        <Pressable accessibilityRole="link" accessibilityLabel="Dream Love Cafe & Restaurant Home">
          {content}
        </Pressable>
      </Link>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBlock: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heartTrio: {
    marginLeft: 4,
    marginBottom: 2,
  },
  brandDream: {
    fontWeight: '800',
    letterSpacing: 1.5,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  brandLove: {
    fontWeight: '900',
    letterSpacing: 1.5,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 1,
  },
  brandSubtitle: {
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  subtitleBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  subtitleBadgeText: {
    fontWeight: '700',
    letterSpacing: 1,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
});
