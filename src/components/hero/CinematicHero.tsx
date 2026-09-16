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

const VIDEO_SOURCE = '/videos/restaurant_video_1.mp4';
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
              // Autoplay blocked by browser policy; poster/fallback active
              setVideoLoaded(true);
            });
        }
      }
    }
  }, []);

  return (
    <View 
      style={styles.heroRoot}
      {...(Platform.OS === 'web' ? { role: 'main', className: 'relative isolate min-h-[100svh] overflow-hidden' } : {})}
    >
      {/* ── 1. FULLSCREEN HTML5 BACKGROUND VIDEO (Authentic Restaurant Footage) ── */}
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
          className="absolute inset-0 z-0 h-full w-full object-cover object-center"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            minHeight: '100svh',
            objectFit: 'cover',
            objectPosition: 'center center',
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

      {/* ── 2. SUBTLE READABILITY LAYER (Clean & Authentic, Not Heavy Neon or Murky Black) ── */}
      <View style={styles.subtleScrim} />

      {/* ── 3. FLOATING GLASS NAVIGATION (z-index: 50) ── */}
      <GlassNavigation />

      {/* ── 4. CENTERED HERO CONTENT (Clear of navbar, normal document flow) ── */}
      <View style={[
        styles.heroContentWrapper,
        isDesktop ? styles.heroContentDesktop : styles.heroContentMobile,
      ]}>
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

        {/* Large Editorial Headline: Normal document flow, no absolute positioning of words */}
        <View 
          style={styles.headingWrapper}
          {...(Platform.OS === 'web' ? { className: 'animate-dream-rise-delay-2' } : {})}
        >
          {Platform.OS === 'web' ? (
            <h1
              className="font-display"
              style={{
                fontFamily: "var(--font-display, 'Instrument Serif', Georgia, serif)",
                fontSize: isMobile ? 'clamp(2.75rem, 11vw, 4.25rem)' : 'clamp(3.85rem, 6.2vw, 7.5rem)',
                lineHeight: 1.02,
                fontWeight: 400,
                letterSpacing: '-0.025em',
                color: 'var(--dream-cream, #F6F1EA)',
                margin: 0,
                textAlign: 'center',
                maxWidth: '1100px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: isMobile ? 4 : 8,
              }}
            >
              <span style={{ display: 'block' }}>Good Food.</span>
              <span style={{ display: 'block' }}>
                Warm <em style={{ fontStyle: 'normal', color: 'var(--dream-pink, #F43F67)' }}>Moments.</em>
              </span>
              <span style={{ display: 'block' }}>
                Made with <em style={{ fontStyle: 'normal', color: 'var(--dream-pink, #F43F67)' }}>Love.</em>
              </span>
            </h1>
          ) : (
            <View style={styles.headingColumn}>
              <Text style={[styles.headingText, isMobile && styles.headingMobile]}>Good Food.</Text>
              <Text style={[styles.headingText, isMobile && styles.headingMobile]}>
                Warm <Text style={{ color: COLORS.dreamPink }}>Moments.</Text>
              </Text>
              <Text style={[styles.headingText, isMobile && styles.headingMobile]}>
                Made with <Text style={{ color: COLORS.dreamPink }}>Love.</Text>
              </Text>
            </View>
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
    minHeight: Platform.OS === 'web' ? ('100svh' as any) : 740,
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
    backgroundColor: 'rgba(0, 0, 0, 0.26)',
    pointerEvents: 'none',
  },
  heroContentWrapper: {
    position: 'relative',
    zIndex: 10,
    width: '100%',
    maxWidth: 1100,
    alignItems: 'center',
    justifyContent: 'flex-start',
    textAlign: 'center',
    marginHorizontal: 'auto',
    flex: 1,
  },
  heroContentDesktop: {
    paddingTop: 112,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  heroContentMobile: {
    paddingTop: 88,
    paddingBottom: 84,
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
  headingColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
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
});
