import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  useWindowDimensions,
  TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Shield } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../../theme';
import { BrandLogo } from '../ui/BrandLogo';

interface AuthPageShellProps {
  children: React.ReactNode;
}

const AUTH_HERO_IMAGE = '/photos/interior_cafe_lounge.jpg';

export const AuthPageShell: React.FC<AuthPageShellProps> = ({ children }) => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 992;
  const isMobile = width < 600;

  return (
    <View style={styles.outerContainer}>
      {/* ── Top Bar with Logo, Admin Portal Badge, and Back to Website ── */}
      <View style={styles.topHeader}>
        <View style={styles.headerInner}>
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={() => router.push('/' as any)}
            style={styles.headerLogoTouch}
            accessibilityRole="link"
            accessibilityLabel="Dream Love Home"
          >
            <BrandLogo variant={isDesktop ? 'primary' : 'compact'} size="sm" />
          </TouchableOpacity>

          <View style={styles.headerRight}>
            <View style={styles.portalBadge}>
              <Shield size={11} color={COLORS.dreamTeal} style={{ marginRight: 5 }} />
              <Text style={styles.portalBadgeText}>ADMIN PORTAL</Text>
            </View>

            <TouchableOpacity
              style={styles.backLink}
              onPress={() => router.push('/' as any)}
              activeOpacity={0.75}
              accessibilityRole="link"
              accessibilityLabel="Back to Website"
            >
              <ArrowLeft size={14} color={COLORS.dreamCream} style={{ marginRight: 6 }} />
              <Text style={styles.backLinkText}>
                {isMobile ? 'Website' : 'Back to Website'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ── Main Split-Screen Layout (Desktop) or Stacked (Mobile) ── */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.contentFlex}
      >
        <View style={[styles.mainLayout, isDesktop ? styles.splitLayout : styles.stackedLayout]}>
          
          {/* ── LEFT PANEL: Cinematic Authentic Restaurant Photography ── */}
          <View style={[styles.visualPanel, isDesktop ? styles.visualPanelDesktop : styles.visualPanelMobile]}>
            <Image
              source={{ uri: AUTH_HERO_IMAGE }}
              style={styles.visualImage}
              resizeMode="cover"
              accessibilityLabel="Dream Love Cafe & Restaurant interior dining atmosphere"
            />
            {/* Subtle Exposure Scrim */}
            <View style={styles.visualScrim} />

            {/* Editorial Brand Overlay on Visual Panel */}
            <View style={styles.visualBrandOverlay}>
              <View style={styles.visualEyebrowRow}>
                <View style={styles.eyebrowDot} />
                <Text style={styles.visualEyebrowText}>CONTAI • WEST BENGAL</Text>
              </View>

              <Text style={styles.visualBrandTitle}>
                DREAM LOVE
              </Text>
              <Text style={styles.visualBrandSubtitle}>
                CAFÉ & RESTAURANT
              </Text>

              <View style={styles.visualQuoteRow}>
                <Text style={styles.visualQuoteText}>
                  "Good food. Warm moments. Made with love."
                </Text>
              </View>
            </View>
          </View>

          {/* ── RIGHT PANEL: Seamless Admin Authentication Card ── */}
          <View style={[styles.authPanel, isDesktop ? styles.authPanelDesktop : styles.authPanelMobile]}>
            <ScrollView
              style={styles.authScroll}
              contentContainerStyle={styles.authScrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.authCard}>
                {children}
              </View>
            </ScrollView>
          </View>

        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: COLORS.dreamEspresso,
    minHeight: Platform.OS === 'web' ? ('100svh' as any) : '100%',
    width: '100%',
    flexDirection: 'column',
  },
  topHeader: {
    backgroundColor: 'rgba(18, 15, 13, 0.90)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    width: '100%',
    zIndex: 50,
  },
  headerInner: {
    maxWidth: 1440,
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerLogoTouch: {
    flexShrink: 0,
    cursor: Platform.OS === 'web' ? ('pointer' as any) : undefined,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  portalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999,
    backgroundColor: 'rgba(34, 211, 197, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(34, 211, 197, 0.20)',
  },
  portalBadgeText: {
    color: COLORS.dreamTeal,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    cursor: Platform.OS === 'web' ? ('pointer' as any) : undefined,
  },
  backLinkText: {
    color: COLORS.dreamCream,
    fontSize: 13,
    fontWeight: '500',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  contentFlex: {
    flex: 1,
    width: '100%',
  },
  mainLayout: {
    flex: 1,
    width: '100%',
  },
  splitLayout: {
    flexDirection: 'row',
    minHeight: Platform.OS === 'web' ? ('calc(100svh - 61px)' as any) : '100%',
  },
  stackedLayout: {
    flexDirection: 'column',
  },
  visualPanel: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: COLORS.dreamSurface,
  },
  visualPanelDesktop: {
    flex: 1.15,
    height: '100%',
    minHeight: Platform.OS === 'web' ? ('calc(100svh - 61px)' as any) : 600,
  },
  visualPanelMobile: {
    width: '100%',
    height: 190,
  },
  visualImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  visualScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(18, 15, 13, 0.58)',
  },
  visualBrandOverlay: {
    position: 'absolute',
    bottom: 36,
    left: 36,
    right: 36,
    zIndex: 10,
  },
  visualEyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  eyebrowDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.dreamTeal,
  },
  visualEyebrowText: {
    color: COLORS.dreamCopper,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 2.2,
    fontFamily: TYPOGRAPHY.fontFamilySans,
    textTransform: 'uppercase',
  },
  visualBrandTitle: {
    color: COLORS.dreamCream,
    fontSize: 38,
    fontFamily: TYPOGRAPHY.fontFamilyDisplay,
    fontWeight: '400',
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  visualBrandSubtitle: {
    color: COLORS.dreamTeal,
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamilySans,
    fontWeight: '600',
    letterSpacing: 2,
    marginTop: 4,
  },
  visualQuoteRow: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.12)',
    maxWidth: 420,
  },
  visualQuoteText: {
    color: 'rgba(255, 255, 255, 0.78)',
    fontSize: 14,
    fontStyle: 'italic',
    fontFamily: TYPOGRAPHY.fontFamilySerif,
  },
  authPanel: {
    backgroundColor: COLORS.dreamEspresso,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authPanelDesktop: {
    flex: 1,
    maxWidth: 580,
    paddingHorizontal: 40,
    paddingVertical: 32,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.06)',
  },
  authPanelMobile: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  authScroll: {
    width: '100%',
  },
  authScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  authCard: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: COLORS.dreamSurface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: Platform.OS === 'web' ? 36 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 8,
  },
});
