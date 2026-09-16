import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Platform, 
  useWindowDimensions, 
  Image,
  TouchableOpacity
} from 'react-native';
import { COLORS, TYPOGRAPHY } from '../../theme';
import { GlassNavigation } from './GlassNavigation';
import { HeroMeta } from './HeroMeta';
import { HeroCTA } from './HeroCTA';
import { ScrollIndicator } from './ScrollIndicator';

const VIDEO_SOURCE = '/videos/restaurant_video_2.mp4';
const FALLBACK_IMAGE = '/photos/storefront_signboard.jpg';

interface CinematicHeroProps {
  onScrollDown?: () => void;
}

export const CinematicHero: React.FC<CinematicHeroProps> = ({ onScrollDown }) => {
  const { width, height } = useWindowDimensions();
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Responsive Breakpoints
  const isSmallMobile = width < 380;
  const isMobile = width < 600;
  const isTablet = width >= 600 && width < 1024;
  const isDesktop = width >= 1024;
  const isLargeDesktop = width >= 1440;

  // Autoplay attempt on web with reduced-motion respect
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
      if (prefersReducedMotion) {
        setVideoLoaded(true);
        return;
      }

      if (videoRef.current) {
        const video = videoRef.current;
        video.muted = true;
        video.playsInline = true;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setVideoLoaded(true);
            })
            .catch(() => {
              // Autoplay blocked by browser policy; video remains behind UI, poster or fallback active
              setVideoLoaded(true);
            });
        }
      }
    }
  }, []);

  return (
    <View 
      style={styles.heroRoot}
      {...(Platform.OS === 'web' ? { role: 'main', className: 'relative min-h-screen overflow-hidden' } : {})}
    >
      {/* ── 1. FULLSCREEN HTML5 BACKGROUND VIDEO ── */}
      {Platform.OS === 'web' && !videoError ? (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          poster={FALLBACK_IMAGE}
          onError={() => setVideoError(true)}
          onLoadedData={() => setVideoLoaded(true)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            minHeight: '100svh',
            objectFit: 'cover',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        >
          <source src={VIDEO_SOURCE} type="video/mp4" />
        </video>
      ) : (
        <Image
          source={{ uri: FALLBACK_IMAGE }}
          style={styles.fallbackImage}
          resizeMode="cover"
          accessibilityLabel="Dream Love Cafe & Restaurant storefront"
        />
      )}

      {/* ── 2. SUBTLE LOCALIZED READABILITY SCRIM (NO HEAVY BLACK GRADIENT, NO BLOBS) ── */}
      <View style={styles.subtleScrim} />

      {/* ── 3. FLOATING GLASS NAVIGATION ── */}
      <GlassNavigation />

      {/* ── 4. CENTERED HERO CONTENT ── */}
      <View style={[
        styles.heroContentWrapper,
        isDesktop ? styles.heroContentDesktop : styles.heroContentMobile,
      ]}>
        {/* Safe Top Spacer to guarantee zero collision with GlassNavigation */}
        <View style={{ height: isDesktop ? 96 : isMobile ? 112 : 90, width: '100%' }} />

        {/* Brand Eyebrow with Heartbeat Accent */}
        <View 
          style={[styles.eyebrowContainer, isMobile && styles.eyebrowContainerMobile]}
          {...(Platform.OS === 'web' ? { className: 'animate-dream-rise-delay-1' } : {})}
        >
          <View style={styles.eyebrowDot} />
          <Text style={[styles.eyebrowText, isMobile && styles.eyebrowTextMobile]}>
            DREAM LOVE CAFÉ & RESTAURANT • CONTAI • WEST BENGAL
          </Text>
          <View style={styles.eyebrowDot} />
        </View>

        {/* Large Editorial Headline in Instrument Serif */}
        <View 
          style={styles.headingWrapper}
          {...(Platform.OS === 'web' ? { className: 'animate-dream-rise-delay-2' } : {})}
        >
          {Platform.OS === 'web' ? (
            <h1
              className="font-display"
              style={{
                fontFamily: "var(--font-display, 'Instrument Serif', Georgia, serif)",
                fontSize: isSmallMobile ? '38px' : isMobile ? '46px' : isTablet ? '72px' : isLargeDesktop ? '104px' : '88px',
                lineHeight: 0.93,
                fontWeight: 400,
                letterSpacing: '-0.03em',
                color: 'var(--dream-cream, #F6F1EA)',
                margin: 0,
                textAlign: 'center',
                maxWidth: '1100px',
              }}
            >
              Good Food.<br />
              Warm <em style={{ fontStyle: 'normal', color: 'var(--dream-pink, #F43F67)' }}>Moments.</em><br />
              Made with <em style={{ fontStyle: 'normal', color: 'var(--dream-pink, #F43F67)' }}>Love.</em>
            </h1>
          ) : (
            <Text style={[
              styles.headingText,
              isSmallMobile && styles.headingSmallMobile,
              isMobile && !isSmallMobile && styles.headingMobile,
              isTablet && styles.headingTablet,
              isDesktop && styles.headingDesktop,
            ]}>
              Good Food.{'\n'}
              Warm Moments.{'\n'}
              Made with Love.
            </Text>
          )}
        </View>

        {/* Editorial Subtitle / Description */}
        <View 
          style={styles.descriptionWrapper}
          {...(Platform.OS === 'web' ? { className: 'animate-dream-rise-delay-3' } : {})}
        >
          <Text style={[
            styles.descriptionText,
            isMobile ? styles.descriptionMobile : styles.descriptionDesktop,
          ]}>
            Welcome to Dream Love Café & Restaurant — a warm, multi-cuisine dining destination in Contai, West Bengal, serving Indian favourites, tandoor specialties, biryani, Chinese favourites, refreshing beverages and memorable moments.
          </Text>
        </View>

        {/* Compact Restaurant Meta Chips */}
        <HeroMeta />

        {/* Primary Action Buttons */}
        <HeroCTA />

        {/* Brand Micro-Detail Line */}
        <View 
          style={styles.microDetailWrapper}
          {...(Platform.OS === 'web' ? { className: 'animate-dream-rise-delay-5' } : {})}
        >
          <Text style={styles.microDetailText}>
            INDIAN • TANDOOR • CHINESE • BIRYANI • BEVERAGES
          </Text>
        </View>

      </View>

      {/* ── 5. BOTTOM SCROLL INDICATOR ── */}
      <ScrollIndicator onPress={onScrollDown} />

    </View>
  );
};

const styles = StyleSheet.create({
  heroRoot: {
    position: 'relative',
    width: '100%',
    minHeight: Platform.OS === 'web' ? ('100svh' as any) : '100%',
    height: Platform.OS === 'web' ? ('100svh' as any) : 740,
    backgroundColor: COLORS.dreamEspresso,
    overflow: 'hidden',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fallbackImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  subtleScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
    // Very subtle cinematic exposure tint - preserves video clarity while ensuring text contrast
    backgroundColor: 'rgba(18, 15, 13, 0.44)',
    pointerEvents: 'none',
  },
  heroContentWrapper: {
    position: 'relative',
    zIndex: 10,
    width: '100%',
    maxWidth: 1100,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginHorizontal: 'auto',
    flex: 1,
  },
  heroContentDesktop: {
    paddingTop: 8,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  heroContentMobile: {
    paddingTop: 4,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  eyebrowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 14,
  },
  eyebrowContainerMobile: {
    marginBottom: 8,
    gap: 6,
  },
  eyebrowDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.dreamTeal,
  },
  eyebrowText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2.2,
    color: COLORS.dreamCopper,
    fontFamily: TYPOGRAPHY.fontFamilySans,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  eyebrowTextMobile: {
    fontSize: 9.5,
    letterSpacing: 1.5,
  },
  headingWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingText: {
    fontFamily: TYPOGRAPHY.fontFamilyDisplay,
    color: COLORS.dreamCream,
    fontWeight: '400',
    textAlign: 'center',
    letterSpacing: -1.2,
    lineHeight: 56,
    fontSize: 48,
  },
  headingSmallMobile: {
    fontSize: 42,
    lineHeight: 44,
  },
  headingMobile: {
    fontSize: 52,
    lineHeight: 52,
  },
  headingTablet: {
    fontSize: 74,
    lineHeight: 74,
  },
  headingDesktop: {
    fontSize: 96,
    lineHeight: 94,
  },
  descriptionWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  descriptionText: {
    color: 'rgba(255, 255, 255, 0.76)',
    fontFamily: TYPOGRAPHY.fontFamilySans,
    textAlign: 'center',
    lineHeight: 25,
  },
  descriptionDesktop: {
    fontSize: 16,
    maxWidth: 680,
  },
  descriptionMobile: {
    fontSize: 14,
    maxWidth: 340,
    lineHeight: 22,
  },
  microDetailWrapper: {
    marginTop: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  microDetailText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.8,
    color: COLORS.dreamTeal,
    fontFamily: TYPOGRAPHY.fontFamilySans,
    textTransform: 'uppercase',
    opacity: 0.85,
  },
});
