import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Phone, Clock, MessageSquare, ExternalLink, ShieldCheck } from 'lucide-react-native';
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
        {/* Main Grid Columns */}
        <View style={[styles.gridRow, !isDesktop && styles.gridRowMobile]}>
          
          {/* Column 1: Brand & Philosophy */}
          <View style={isDesktop ? [styles.columnDesktop, { flex: 1.3 }] : styles.columnMobile}>
            <BrandLogo variant="primary" size="md" />

            <Text style={styles.brandDescription}>
              A local multi-cuisine dining destination in Contai, West Bengal. Serving comforting classics, Indian tandoor, dum biryani, Chinese favorites, mocktails, and fresh cafe beverages.
            </Text>

            <View style={styles.cuisinesBadgeRow}>
              {settings.cuisines.map((c) => (
                <View key={c} style={styles.cuisineBadge}>
                  <Text style={styles.cuisineBadgeText}>{c}</Text>
                </View>
              ))}
            </View>

            {/* Verified Listings Badges */}
            <View style={styles.listingLinksContainer}>
              <Text style={styles.listingHeading}>Verified Public Listings:</Text>
              <View style={styles.listingBadgesRow}>
                <TouchableOpacity 
                  style={styles.listingBadge}
                  onPress={() => Linking.openURL(settings.googleReviewsUrl)}
                >
                  <Text style={styles.listingBadgeName}>Google</Text>
                  <Text style={styles.listingBadgeRating}>★ {settings.googleRating}</Text>
                </TouchableOpacity>

                {settings.justdialUrl && (
                  <TouchableOpacity 
                    style={styles.listingBadge}
                    onPress={() => Linking.openURL(settings.justdialUrl!)}
                  >
                    <Text style={styles.listingBadgeName}>Justdial</Text>
                    <Text style={styles.listingBadgeRating}>★ {settings.justdialRating || '4.0'}</Text>
                  </TouchableOpacity>
                )}

                {settings.magicpinUrl && (
                  <TouchableOpacity 
                    style={styles.listingBadge}
                    onPress={() => Linking.openURL(settings.magicpinUrl!)}
                  >
                    <Text style={styles.listingBadgeName}>Magicpin</Text>
                    <Text style={styles.listingBadgeRating}>★ {settings.magicpinRating || '4.1'}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          {/* Column 2: Quick Links */}
          <View style={isDesktop ? [styles.columnDesktop, { flex: 0.9 }] : styles.columnMobile}>
            <Text style={styles.columnTitle}>Explore</Text>
            <TouchableOpacity onPress={() => router.push('/')} style={styles.linkItem}>
              <Text style={styles.linkText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/menu')} style={styles.linkItem}>
              <Text style={styles.linkText}>Full Menu</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/about')} style={styles.linkItem}>
              <Text style={styles.linkText}>About Restaurant</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/gallery')} style={styles.linkItem}>
              <Text style={styles.linkText}>Real Photo Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/reviews')} style={styles.linkItem}>
              <Text style={styles.linkText}>Guest Reviews</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/book')} style={styles.linkItem}>
              <Text style={styles.linkText}>Book Table</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/visit')} style={styles.linkItem}>
              <Text style={styles.linkText}>Visit & Directions</Text>
            </TouchableOpacity>
          </View>

          {/* Column 3: Contact & Location */}
          <View style={isDesktop ? [styles.columnDesktop, { flex: 1.2 }] : styles.columnMobile}>
            <Text style={styles.columnTitle}>Visit & Contact</Text>
            
            <TouchableOpacity style={styles.contactRow} onPress={handleOpenMaps}>
              <MapPin size={16} color={COLORS.brandTurquoise} style={styles.contactIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.contactText}>{settings.address}</Text>
                <Text style={styles.landmarkText}>Landmark: Central Bus Stand / Opp. Jawed Habib's</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactRow} onPress={handleCall}>
              <Phone size={16} color={COLORS.brandTurquoise} style={styles.contactIcon} />
              <Text style={styles.contactText}>{settings.phone}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactRow} onPress={handleWhatsApp}>
              <MessageSquare size={16} color={COLORS.brandTurquoise} style={styles.contactIcon} />
              <Text style={styles.contactText}>WhatsApp: {settings.whatsapp}</Text>
            </TouchableOpacity>

            <View style={styles.contactRow}>
              <Clock size={16} color={COLORS.brandTurquoise} style={styles.contactIcon} />
              <View>
                <Text style={styles.contactText}>{settings.openingHours}</Text>
                <Text style={styles.openDaysText}>Open 7 Days a Week (Dine-in • Takeaway • Delivery)</Text>
              </View>
            </View>
          </View>

        </View>

        {/* Informational Disclaimer */}
        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerText}>
            Notice: Menu items, pricing, and availability are subject to daily kitchen operations. Please confirm current prices and availability with the restaurant staff during order placement.
          </Text>
        </View>

        {/* Footer Bottom Bar */}
        <View style={styles.bottomBar}>
          <Text style={styles.copyrightText}>
            © {new Date().getFullYear()} Dream Love Cafe & Restaurant. All rights reserved. Contai, West Bengal.
          </Text>

          <View style={styles.bottomLinks}>
            <TouchableOpacity 
              onPress={() => router.push('/admin/login')} 
              style={styles.adminAccessLink}
              accessibilityRole="link"
              accessibilityLabel="Admin Portal Access"
            >
              <ShieldCheck size={14} color={COLORS.textMuted} style={{ marginRight: 4 }} />
              <Text style={styles.adminAccessText}>Staff Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: COLORS.surfaceElevated,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
    marginTop: 'auto',
  },
  footerContainerMobile: {
    paddingTop: SPACING.lg,
    paddingBottom: 85, // Clear space above mobile bottom bar
  },
  footerContent: {
    maxWidth: 1150,
    width: '100%',
    alignSelf: 'center',
  },
  gridRow: {
    flexDirection: 'row',
    gap: SPACING.lg,
    justifyContent: 'space-between',
  },
  gridRowMobile: {
    flexDirection: 'column',
    gap: SPACING.lg,
  },
  columnDesktop: {
    flex: 1,
  },
  columnMobile: {
    width: '100%',
  },
  brandDescription: {
    color: COLORS.creamMuted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  cuisinesBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: SPACING.sm,
  },
  cuisineBadge: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cuisineBadgeText: {
    color: COLORS.brandTurquoise,
    fontSize: 10.5,
    fontWeight: '600',
  },
  listingLinksContainer: {
    marginTop: 4,
  },
  listingHeading: {
    color: COLORS.textMuted,
    fontSize: 10.5,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listingBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  listingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  listingBadgeName: {
    color: COLORS.cream,
    fontSize: 10.5,
    fontWeight: '600',
  },
  listingBadgeRating: {
    color: COLORS.gold,
    fontSize: 10.5,
    fontWeight: '700',
  },
  columnTitle: {
    color: COLORS.cream,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: SPACING.sm,
    letterSpacing: 0.5,
  },
  linkItem: {
    paddingVertical: 4,
  },
  linkText: {
    color: COLORS.creamMuted,
    fontSize: 13,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 8,
  },
  contactIcon: {
    marginTop: 2,
  },
  contactText: {
    color: COLORS.cream,
    fontSize: 12.5,
    fontWeight: '500',
    lineHeight: 17,
  },
  landmarkText: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  openDaysText: {
    color: COLORS.brandTurquoise,
    fontSize: 11,
    marginTop: 1,
  },
  disclaimerBox: {
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  disclaimerText: {
    color: COLORS.textSubtle,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 15,
  },
  bottomBar: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  copyrightText: {
    color: COLORS.textMuted,
    fontSize: 11.5,
  },
  bottomLinks: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminAccessLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surface,
  },
  adminAccessText: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
});
