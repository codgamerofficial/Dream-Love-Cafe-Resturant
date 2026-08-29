import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, useWindowDimensions, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Phone, Clock, MessageSquare, ExternalLink, Calendar, ShoppingBag, Compass, Navigation } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../src/theme';
import { useSettings } from '../../src/context/SettingsContext';

export default function ContactPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { settings } = useSettings();
  const isDesktop = width >= 768;

  // Google Maps embed URL using Plus Code
  const mapQuery = encodeURIComponent('Dream Love Cafe & Restaurant, QPHM+8QV, Contai, West Bengal 721404, India');
  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${mapQuery}&t=&z=17&ie=UTF8&iwloc=&output=embed`;
  const googleMapsDirectUrl = settings.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;

  const handleOpenMaps = () => {
    Linking.openURL(googleMapsDirectUrl);
  };

  const handleGetDirections = () => {
    Linking.openURL(directionsUrl);
  };

  const handleCall = () => {
    Linking.openURL(`tel:${settings.phone.replace(/[^0-9+]/g, '')}`);
  };

  const handleWhatsApp = () => {
    Linking.openURL(`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Header */}
        <View style={styles.headerBox}>
          <Text style={styles.eyebrow}>CONTAI, WEST BENGAL</Text>
          <Text style={[styles.title, isDesktop && styles.titleDesktop]}>Visit Dream Love</Text>
          <Text style={styles.subtitle}>
            Multi-Cuisine Family Cafe & Restaurant. Located at Central Bus Stand, Contai Bypass Road.
          </Text>
        </View>

        {/* Main Content Grid */}
        <View style={[styles.contentGrid, !isDesktop && styles.contentGridMobile]}>

          {/* Left Column: Location & Map */}
          <View style={[styles.mainColumn, !isDesktop && styles.mainColumnMobile]}>

            {/* Google Maps Embed Card */}
            <View style={styles.mapCard}>
              <Text style={styles.cardTitle}>Location & Directions</Text>

              {/* Interactive Google Map */}
              <View style={[styles.mapContainer, !isDesktop && styles.mapContainerMobile]}>
                {Platform.OS === 'web' ? (
                  <iframe
                    src={googleMapsEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0, borderRadius: 16 } as any}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Maps location of Dream Love Cafe & Restaurant"
                  />
                ) : (
                  <TouchableOpacity style={styles.mapFallback} onPress={handleOpenMaps}>
                    <MapPin size={32} color={COLORS.brandTurquoise} />
                    <Text style={styles.mapFallbackText}>View Restaurant Location on Google Maps</Text>
                    <Text style={styles.mapFallbackSub}>Tap to open in Google Maps</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Accessible location text */}
              <Text style={styles.mapAccessibleText}>
                Dream Love Cafe & Restaurant is located at {settings.plusCode}, Central Bus Stand, Contai Bypass Road, opposite Jawed Habib's, Contai, West Bengal 721404.
              </Text>

              {/* Map Action Buttons */}
              <View style={styles.mapActionsRow}>
                <TouchableOpacity style={styles.mapBtnPrimary} onPress={handleOpenMaps}>
                  <ExternalLink size={15} color={COLORS.background} style={{ marginRight: 6 }} />
                  <Text style={styles.mapBtnPrimaryText}>View on Google Maps</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.mapBtnSecondary} onPress={handleGetDirections}>
                  <Navigation size={15} color={COLORS.cream} style={{ marginRight: 6 }} />
                  <Text style={styles.mapBtnSecondaryText}>Get Directions</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Restaurant Info Card */}
            <View style={styles.infoCard}>
              {/* Real Storefront Photo */}
              <View style={styles.storefrontBox}>
                <Image
                  source={{ uri: '/photos/storefront_signboard.jpg' }}
                  style={styles.storefrontImage}
                  resizeMode="cover"
                />
                <Text style={styles.storefrontCaption}>
                  Dream Love Cafe & Restaurant storefront on Contai Bypass Road.
                </Text>
              </View>

              <View style={styles.infoRow}>
                <MapPin size={20} color={COLORS.brandTurquoise} style={styles.infoIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>Address</Text>
                  <Text style={styles.infoValue}>{settings.address}</Text>
                  <Text style={styles.plusCodeText}>Plus Code: {settings.plusCode}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Clock size={20} color={COLORS.brandTurquoise} style={styles.infoIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>Opening Hours</Text>
                  <Text style={styles.infoValue}>{settings.openingHours}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Phone size={20} color={COLORS.brandTurquoise} style={styles.infoIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>Telephone & WhatsApp</Text>
                  <Text style={styles.infoValue}>{settings.phone}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Right Column: Actions + Specs */}
          <View style={[styles.sideColumn, !isDesktop && styles.sideColumnMobile]}>

            {/* Instant Actions */}
            <View style={styles.actionsCard}>
              <Text style={styles.cardTitle}>Quick Actions</Text>

              {/* Primary: Reserve */}
              <TouchableOpacity style={styles.actionPrimary} onPress={() => router.push('/book')}>
                <Calendar size={18} color={COLORS.background} style={{ marginRight: 8 }} />
                <Text style={styles.actionPrimaryText}>Reserve Table Online</Text>
              </TouchableOpacity>

              {/* Secondary: WhatsApp */}
              <TouchableOpacity style={styles.actionWhatsApp} onPress={handleWhatsApp}>
                <MessageSquare size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.actionWhatsAppText}>Order / Chat on WhatsApp</Text>
              </TouchableOpacity>

              {/* Utility buttons */}
              <TouchableOpacity style={styles.actionUtility} onPress={handleCall}>
                <Phone size={16} color={COLORS.cream} style={{ marginRight: 8 }} />
                <Text style={styles.actionUtilityText}>Call Restaurant</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionUtility} onPress={handleGetDirections}>
                <Compass size={16} color={COLORS.cream} style={{ marginRight: 8 }} />
                <Text style={styles.actionUtilityText}>Get Directions</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionUtility} onPress={() => router.push('/menu')}>
                <ShoppingBag size={16} color={COLORS.cream} style={{ marginRight: 8 }} />
                <Text style={styles.actionUtilityText}>Browse Complete Menu</Text>
              </TouchableOpacity>
            </View>

            {/* Dining Specs */}
            <View style={styles.specsCard}>
              <Text style={styles.specsTitle}>Dining & Pricing</Text>

              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Typical spend for two:</Text>
                <Text style={styles.specValue}>{settings.priceRangeForTwo}</Text>
              </View>
              <Text style={styles.specDisclaimer}>Based on public listings</Text>

              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Dining Modes:</Text>
                <Text style={styles.specValue}>{settings.diningModes.join(' · ')}</Text>
              </View>

              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Cuisines:</Text>
                <Text style={styles.specValue}>{settings.cuisines.join(', ')}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  innerContainer: {
    maxWidth: 1240,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xxl,
  },

  // Header
  headerBox: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.copper,
    letterSpacing: 3,
    marginBottom: 6,
  },
  title: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 34,
    fontWeight: '800',
    color: COLORS.cream,
    textAlign: 'center',
    marginBottom: 8,
  },
  titleDesktop: {
    fontSize: 48,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textMuted,
    textAlign: 'center',
    maxWidth: 600,
    lineHeight: 22,
  },

  // Content Grid
  contentGrid: {
    flexDirection: 'row',
    gap: 28,
  },
  contentGridMobile: {
    flexDirection: 'column',
  },
  mainColumn: {
    flex: 1.5,
    gap: 24,
  },
  mainColumnMobile: {
    width: '100%',
  },
  sideColumn: {
    flex: 1,
    gap: 20,
  },
  sideColumnMobile: {
    width: '100%',
  },

  // Map Card
  mapCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  cardTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: SPACING.md,
  },
  mapContainer: {
    width: '100%',
    height: 400,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    marginBottom: SPACING.md,
  },
  mapContainerMobile: {
    height: 280,
  },
  mapFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.xl,
  },
  mapFallbackText: {
    fontSize: 16,
    color: COLORS.cream,
    fontWeight: '600',
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  mapFallbackSub: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  mapAccessibleText: {
    fontSize: 12,
    color: COLORS.textSubtle,
    lineHeight: 17,
    marginBottom: SPACING.md,
  },
  mapActionsRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  mapBtnPrimary: {
    backgroundColor: COLORS.copper,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: BORDER_RADIUS.md,
  },
  mapBtnPrimaryText: {
    color: COLORS.background,
    fontSize: 13,
    fontWeight: '700',
  },
  mapBtnSecondary: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: BORDER_RADIUS.md,
  },
  mapBtnSecondaryText: {
    color: COLORS.cream,
    fontSize: 13,
    fontWeight: '600',
  },

  // Info Card
  infoCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  storefrontBox: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.surface,
  },
  storefrontImage: {
    width: '100%',
    height: 180,
  },
  storefrontCaption: {
    padding: SPACING.sm,
    fontSize: 12,
    color: COLORS.textSubtle,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  infoIcon: {
    marginRight: 14,
    marginTop: 2,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.brandTurquoise,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.cream,
    lineHeight: 20,
  },
  plusCodeText: {
    fontSize: 12,
    color: COLORS.gold,
    marginTop: 3,
    fontWeight: '600',
  },

  // Actions Card
  actionsCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  actionPrimary: {
    backgroundColor: COLORS.copper,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: 12,
  },
  actionPrimaryText: {
    color: COLORS.background,
    fontSize: 15,
    fontWeight: '700',
  },
  actionWhatsApp: {
    backgroundColor: '#16A34A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: 12,
  },
  actionWhatsAppText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  actionUtility: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: 8,
  },
  actionUtilityText: {
    color: COLORS.cream,
    fontSize: 14,
    fontWeight: '600',
  },

  // Specs Card
  specsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  specsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: SPACING.md,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  specLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
    flex: 1,
  },
  specValue: {
    fontSize: 13,
    color: COLORS.gold,
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
  specDisclaimer: {
    fontSize: 11,
    color: COLORS.textSubtle,
    fontStyle: 'italic',
    marginBottom: 10,
    marginTop: -4,
    textAlign: 'right',
  },
});
