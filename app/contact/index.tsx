import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, useWindowDimensions, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Phone, Clock, MessageSquare, ExternalLink, Calendar, ShoppingBag, Compass, Navigation } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, LAYOUT, SHADOWS } from '../../src/theme';
import { useSettings } from '../../src/context/SettingsContext';

export default function ContactPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { settings } = useSettings();
  const isDesktop = width >= 860;
  const isMobile = width < 600;

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
          <Text style={[styles.title, !isDesktop && styles.titleMobile]}>Visit Dream Love</Text>
          <Text style={styles.subtitle}>
            Multi-Cuisine Family Café & Restaurant located near Central Bus Stand on Contai Bypass Road.
          </Text>
        </View>

        {/* Main Content Grid */}
        <View style={[styles.contentGrid, !isDesktop && styles.contentGridMobile]}>

          {/* Left Column: Location, Map & Storefront Photo */}
          <View style={[styles.mainColumn, !isDesktop && styles.columnFullWidth]}>

            {/* Google Maps Embed Card */}
            <View style={styles.mapCard}>
              <Text style={styles.cardTitle}>Location & Directions</Text>

              {/* Interactive Google Map */}
              <View style={styles.mapContainer}>
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
                <TouchableOpacity style={styles.mapBtnPrimary} onPress={handleGetDirections} activeOpacity={0.85}>
                  <Navigation size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.mapBtnPrimaryText}>Get Directions</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.mapBtnSecondary} onPress={handleOpenMaps} activeOpacity={0.85}>
                  <ExternalLink size={15} color={COLORS.cream} style={{ marginRight: 6 }} />
                  <Text style={styles.mapBtnSecondaryText}>View on Google Maps</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Real Storefront Photo Card */}
            <View style={styles.storefrontCard}>
              <View style={styles.storefrontBox}>
                <Image
                  source={{ uri: '/photos/storefront_signboard.jpg' }}
                  style={styles.storefrontImage}
                  resizeMode="cover"
                />
                <View style={styles.storefrontOverlay} />
                <View style={styles.storefrontBadge}>
                  <Text style={styles.storefrontBadgeText}>Contai Bypass Road</Text>
                </View>
              </View>
              <Text style={styles.storefrontCaption}>
                Storefront & neon signboard of Dream Love Cafe & Restaurant opposite Jawed Habib's.
              </Text>
            </View>
          </View>

          {/* Right Column: Actions + Specs + Contact */}
          <View style={[styles.sideColumn, !isDesktop && styles.columnFullWidth]}>

            {/* Restaurant Info Card */}
            <View style={styles.infoCard}>
              <Text style={styles.cardTitle}>Restaurant Details</Text>

              <View style={styles.infoRow}>
                <MapPin size={18} color={COLORS.copper} style={styles.infoIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>Address</Text>
                  <Text style={styles.infoValue}>{settings.address}</Text>
                  <Text style={styles.plusCodeText}>Plus Code: {settings.plusCode}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Clock size={18} color={COLORS.brandTurquoise} style={styles.infoIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>Opening Hours</Text>
                  <Text style={styles.infoValue}>{settings.openingHours}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Phone size={18} color={COLORS.gold} style={styles.infoIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>Phone & WhatsApp</Text>
                  <Text style={styles.infoValue}>{settings.phone}</Text>
                </View>
              </View>
            </View>

            {/* Quick Actions Card */}
            <View style={styles.actionsCard}>
              <Text style={styles.cardTitle}>Quick Actions</Text>

              {/* Primary: Reserve */}
              <TouchableOpacity style={styles.actionPrimary} onPress={() => router.push('/book')} activeOpacity={0.85}>
                <Calendar size={17} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.actionPrimaryText}>Reserve Table Online</Text>
              </TouchableOpacity>

              {/* Secondary: WhatsApp */}
              <TouchableOpacity style={styles.actionWhatsApp} onPress={handleWhatsApp} activeOpacity={0.85}>
                <MessageSquare size={17} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.actionWhatsAppText}>Order / Chat on WhatsApp</Text>
              </TouchableOpacity>

              {/* Utility buttons */}
              <TouchableOpacity style={styles.actionUtility} onPress={handleCall} activeOpacity={0.8}>
                <Phone size={16} color={COLORS.cream} style={{ marginRight: 8 }} />
                <Text style={styles.actionUtilityText}>Call Restaurant Directly</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionUtility} onPress={() => router.push('/menu')} activeOpacity={0.8}>
                <ShoppingBag size={16} color={COLORS.cream} style={{ marginRight: 8 }} />
                <Text style={styles.actionUtilityText}>Browse Complete Menu</Text>
              </TouchableOpacity>
            </View>

            {/* Dining Specs Card */}
            <View style={styles.specsCard}>
              <Text style={styles.specsTitle}>Dining & Amenities</Text>

              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Typical spend for two:</Text>
                <Text style={styles.specValue}>{settings.priceRangeForTwo}</Text>
              </View>

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
    width: '100%',
    backgroundColor: COLORS.background,
    minHeight: '100%',
    paddingBottom: SPACING.giant,
  },
  innerContainer: {
    maxWidth: LAYOUT.maxContainerWidth,
    width: '100%',
    marginHorizontal: 'auto',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
  },
  headerBox: {
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: SPACING.xxl,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.brandTurquoise,
    letterSpacing: 2.5,
    marginBottom: 6,
    textTransform: 'uppercase',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  title: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 42,
    fontWeight: '800',
    color: COLORS.cream,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  titleMobile: {
    fontSize: 30,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textMuted,
    textAlign: 'center',
    maxWidth: 620,
    lineHeight: 23,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  contentGrid: {
    flexDirection: 'row',
    gap: 32,
  },
  contentGridMobile: {
    flexDirection: 'column',
    gap: 24,
  },
  mainColumn: {
    flex: 1.25,
    gap: 20,
  },
  sideColumn: {
    flex: 1,
    gap: 20,
  },
  columnFullWidth: {
    width: '100%',
  },
  mapCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    ...SHADOWS.card,
  },
  cardTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: SPACING.md,
  },
  mapContainer: {
    height: 320,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    backgroundColor: COLORS.surfaceElevated,
    marginBottom: SPACING.md,
  },
  mapFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  mapFallbackText: {
    color: COLORS.cream,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 8,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  mapFallbackSub: {
    color: COLORS.textMuted,
    fontSize: 12.5,
    marginTop: 2,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  mapAccessibleText: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 19,
    marginBottom: SPACING.md,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  mapActionsRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  mapBtnPrimary: {
    flex: 1,
    minWidth: 150,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.copper,
    paddingVertical: 11,
    borderRadius: BORDER_RADIUS.md,
  },
  mapBtnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  mapBtnSecondary: {
    flex: 1,
    minWidth: 150,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingVertical: 11,
    borderRadius: BORDER_RADIUS.md,
  },
  mapBtnSecondaryText: {
    color: COLORS.cream,
    fontSize: 13.5,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  storefrontCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    ...SHADOWS.card,
  },
  storefrontBox: {
    height: 220,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 8,
  },
  storefrontImage: {
    width: '100%',
    height: '100%',
  },
  storefrontOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(18, 15, 14, 0.20)',
  },
  storefrontBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(18, 15, 14, 0.85)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: BORDER_RADIUS.xs,
  },
  storefrontBadgeText: {
    color: COLORS.cream,
    fontSize: 11.5,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  storefrontCaption: {
    fontSize: 12.5,
    color: COLORS.textMuted,
    lineHeight: 18,
    fontStyle: 'italic',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    gap: 14,
    ...SHADOWS.card,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoIcon: {
    marginTop: 2,
    flexShrink: 0,
  },
  infoLabel: {
    fontSize: 11,
    color: COLORS.textSubtle,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  infoValue: {
    fontSize: 13.5,
    color: COLORS.cream,
    lineHeight: 20,
    fontWeight: '500',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  plusCodeText: {
    color: COLORS.copperLight,
    fontSize: 11.5,
    marginTop: 2,
    fontWeight: '500',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  actionsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    gap: 10,
    ...SHADOWS.card,
  },
  actionPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.brandHeart,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
  },
  actionPrimaryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  actionWhatsApp: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#15803D',
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
  },
  actionWhatsAppText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  actionUtility: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.md,
  },
  actionUtilityText: {
    color: COLORS.cream,
    fontSize: 13.5,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  specsCard: {
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    gap: 10,
  },
  specsTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 4,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  specLabel: {
    color: COLORS.textMuted,
    fontSize: 12.5,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  specValue: {
    color: COLORS.cream,
    fontSize: 13,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
});
