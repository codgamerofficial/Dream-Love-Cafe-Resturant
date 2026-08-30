import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Phone, Clock, MessageSquare, ExternalLink, Star } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../theme';
import { useSettings } from '../../context/SettingsContext';
import { BrandLogo } from '../ui/BrandLogo';

export const Footer: React.FC = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { settings } = useSettings();
  const isDesktop = width >= 900;

  const handleOpenMaps = () => {
    Linking.openURL(settings.googleMapsUrl).catch((err) => console.log('Could not open maps', err));
  };

  const handleCall = () => {
    Linking.openURL(`tel:${settings.phone.replace(/[^0-9+]/g, '')}`);
  };

  const handleWhatsApp = () => {
    Linking.openURL(`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`);
  };

  return (
    <View style={[styles.footerContainer, !isDesktop && styles.footerContainerMobile]}>
      <View style={styles.footerContent}>
        {/* Main 3-Column Editorial Grid */}
        <View style={[styles.gridRow, !isDesktop && styles.gridRowMobile]}>
          
          {/* Column 1: Brand & Cuisines */}
          <View style={isDesktop ? [styles.columnDesktop, { flex: 1.35 }] : styles.columnMobile}>
            <BrandLogo variant="primary" size="md" />

            <Text style={styles.brandDescription}>
              An intimate multi-cuisine dining destination in Contai, West Bengal. Serving comforting classics, Indian tandoor, authentic dum biryani, Chinese favorites, mocktails, and fresh cafe beverages.
            </Text>

            {/* Clean Cuisine Pills */}
            <View style={styles.cuisinesBadgeRow}>
              {settings.cuisines.map((c) => (
                <View key={c} style={styles.cuisineBadge}>
                  <Text style={styles.cuisineBadgeText}>{c}</Text>
                </View>
              ))}
            </View>

            {/* Dining Modes */}
            <Text style={styles.diningModesText}>
              Available for Dine-in • Takeaway • No-contact Delivery
            </Text>
          </View>

          {/* Column 2: Explore Navigation */}
          <View style={isDesktop ? [styles.columnDesktop, { flex: 0.85 }] : styles.columnMobile}>
            <Text style={styles.columnTitle}>Explore</Text>
            <View style={styles.linkList}>
              <TouchableOpacity onPress={() => router.push('/')} style={styles.linkItem}>
                <Text style={styles.linkText}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/menu')} style={styles.linkItem}>
                <Text style={styles.linkText}>Full Menu</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/about')} style={styles.linkItem}>
                <Text style={styles.linkText}>About Our Story</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/gallery')} style={styles.linkItem}>
                <Text style={styles.linkText}>Real Photo Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/reviews')} style={styles.linkItem}>
                <Text style={styles.linkText}>Guest Reviews</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/book')} style={styles.linkItem}>
                <Text style={styles.linkText}>Reserve a Table</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/visit')} style={styles.linkItem}>
                <Text style={styles.linkText}>Visit & Directions</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Column 3: Visit & Contact Details */}
          <View style={isDesktop ? [styles.columnDesktop, { flex: 1.2 }] : styles.columnMobile}>
            <Text style={styles.columnTitle}>Visit & Contact</Text>
            
            {/* Address */}
            <TouchableOpacity onPress={handleOpenMaps} style={styles.contactItem} activeOpacity={0.8}>
              <MapPin size={16} color={COLORS.copper} style={{ marginRight: 10, marginTop: 3, flexShrink: 0 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.contactValueBold}>Central Bus Stand, Contai</Text>
                <Text style={styles.contactValueSub}>
                  Contai Bypass Rd, opposite Jawed Habib's, Kishore Nagar Garh, Contai, West Bengal 721404
                </Text>
                <Text style={styles.plusCodeText}>Plus Code: {settings.plusCode}</Text>
              </View>
            </TouchableOpacity>

            {/* Phone */}
            <TouchableOpacity onPress={handleCall} style={styles.contactItem} activeOpacity={0.8}>
              <Phone size={16} color={COLORS.brandTurquoise} style={{ marginRight: 10, flexShrink: 0 }} />
              <Text style={styles.contactValue}>{settings.phone}</Text>
            </TouchableOpacity>

            {/* WhatsApp */}
            <TouchableOpacity onPress={handleWhatsApp} style={styles.contactItem} activeOpacity={0.8}>
              <MessageSquare size={16} color={COLORS.brandGreen} style={{ marginRight: 10, flexShrink: 0 }} />
              <Text style={styles.contactValue}>WhatsApp: {settings.phone}</Text>
            </TouchableOpacity>

            {/* Hours */}
            <View style={styles.contactItem}>
              <Clock size={16} color={COLORS.gold} style={{ marginRight: 10, flexShrink: 0 }} />
              <View>
                <Text style={styles.contactValue}>Monday – Sunday</Text>
                <Text style={styles.contactValueHighlight}>12:00 PM – 12:00 AM Daily</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Verified Public Ratings Strip */}
        <View style={styles.ratingsStrip}>
          <Text style={styles.ratingsLabel}>Verified Listings & Reviews:</Text>
          <View style={styles.ratingsBadgesRow}>
            <TouchableOpacity 
              style={styles.ratingBadge}
              onPress={() => Linking.openURL(settings.googleReviewsUrl)}
              activeOpacity={0.8}
            >
              <Star size={12} color={COLORS.gold} fill={COLORS.gold} style={{ marginRight: 4 }} />
              <Text style={styles.ratingBadgeName}>Google</Text>
              <Text style={styles.ratingBadgeVal}>★ {settings.googleRating} ({settings.googleReviewsCount}+)</Text>
            </TouchableOpacity>

            {settings.justdialUrl && (
              <TouchableOpacity 
                style={styles.ratingBadge}
                onPress={() => Linking.openURL(settings.justdialUrl!)}
                activeOpacity={0.8}
              >
                <Text style={styles.ratingBadgeName}>Justdial</Text>
                <Text style={styles.ratingBadgeVal}>★ {settings.justdialRating || '4.0'}</Text>
              </TouchableOpacity>
            )}

            {settings.magicpinUrl && (
              <TouchableOpacity 
                style={styles.ratingBadge}
                onPress={() => Linking.openURL(settings.magicpinUrl!)}
                activeOpacity={0.8}
              >
                <Text style={styles.ratingBadgeName}>Magicpin</Text>
                <Text style={styles.ratingBadgeVal}>★ {settings.magicpinRating || '4.1'}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Bottom Copyright & Staff Portal Bar */}
        <View style={styles.bottomBar}>
          <Text style={styles.copyrightText}>
            © 2026 Dream Love Café & Restaurant. All rights reserved. Contai, West Bengal.
          </Text>
          
          <TouchableOpacity 
            onPress={() => router.push('/admin')} 
            style={styles.staffLink}
            activeOpacity={0.7}
          >
            <Text style={styles.staffLinkText}>Staff & Admin Portal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: COLORS.backgroundDeep,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    width: '100%',
  },
  footerContainerMobile: {
    paddingTop: SPACING.xl,
    paddingBottom: 84, // Space for mobile bottom nav
  },
  footerContent: {
    maxWidth: 1240,
    width: '100%',
    marginHorizontal: 'auto',
  },
  gridRow: {
    flexDirection: 'row',
    gap: 48,
    marginBottom: SPACING.xxl,
  },
  gridRowMobile: {
    flexDirection: 'column',
    gap: 36,
    marginBottom: SPACING.xl,
  },
  columnDesktop: {
    flex: 1,
  },
  columnMobile: {
    width: '100%',
  },
  brandDescription: {
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 22,
    marginTop: 14,
    marginBottom: 16,
    maxWidth: 380,
  },
  cuisinesBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  cuisineBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  cuisineBadgeText: {
    color: COLORS.creamMuted,
    fontSize: 11.5,
    fontWeight: '600',
  },
  diningModesText: {
    fontSize: 12,
    color: COLORS.textSubtle,
    fontStyle: 'italic',
  },
  columnTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: SPACING.md,
    letterSpacing: 0.2,
  },
  linkList: {
    gap: 10,
  },
  linkItem: {
    paddingVertical: 2,
  },
  linkText: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  contactValueBold: {
    color: COLORS.cream,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  contactValueSub: {
    color: COLORS.textMuted,
    fontSize: 12.5,
    lineHeight: 18,
  },
  plusCodeText: {
    color: COLORS.copperLight,
    fontSize: 11.5,
    marginTop: 2,
    fontWeight: '500',
  },
  contactValue: {
    color: COLORS.creamMuted,
    fontSize: 13.5,
    fontWeight: '500',
  },
  contactValueHighlight: {
    color: COLORS.brandTurquoise,
    fontSize: 12.5,
    fontWeight: '600',
    marginTop: 2,
  },
  ratingsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  ratingsLabel: {
    fontSize: 12.5,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  ratingsBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BORDER_RADIUS.sm,
  },
  ratingBadgeName: {
    color: COLORS.cream,
    fontSize: 12,
    fontWeight: '600',
    marginRight: 6,
  },
  ratingBadgeVal: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '700',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
    paddingTop: SPACING.sm,
  },
  copyrightText: {
    color: COLORS.textSubtle,
    fontSize: 12,
  },
  staffLink: {
    paddingVertical: 4,
  },
  staffLinkText: {
    color: COLORS.copper,
    fontSize: 12,
    fontWeight: '600',
  },
});
