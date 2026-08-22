import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Phone, Clock, MessageSquare, ExternalLink, ShieldCheck } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../theme';
import { useSettings } from '../../context/SettingsContext';

export const Footer: React.FC = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { settings } = useSettings();
  const isDesktop = width >= 768;

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
          <View style={[styles.column, { flex: 1.4 }]}>
            <View style={styles.brandHeader}>
              <Image 
                source={require('../../../assets/icon.png')} 
                style={styles.footerLogo} 
                resizeMode="contain"
              />
              <View>
                <Text style={styles.brandName}>{settings.name}</Text>
                <Text style={styles.brandTagline}>{settings.tagline}</Text>
              </View>
            </View>

            <Text style={styles.brandDescription}>
              Crafted for unforgettable dining experiences. Serving authentic Indian curries, tandoori kebabs, wok-tossed Chinese specials, and dum handi biryanis in Contai, West Bengal.
            </Text>

            <View style={styles.cuisinesBadgeRow}>
              {settings.cuisines.map((c) => (
                <View key={c} style={styles.cuisineBadge}>
                  <Text style={styles.cuisineBadgeText}>{c}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Column 2: Quick Links */}
          <View style={styles.column}>
            <Text style={styles.columnTitle}>Explore</Text>
            <TouchableOpacity onPress={() => router.push('/')} style={styles.linkItem}>
              <Text style={styles.linkText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/menu')} style={styles.linkItem}>
              <Text style={styles.linkText}>Complete Menu</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/about')} style={styles.linkItem}>
              <Text style={styles.linkText}>Our Story</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/gallery')} style={styles.linkItem}>
              <Text style={styles.linkText}>Photo Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/reviews')} style={styles.linkItem}>
              <Text style={styles.linkText}>Guest Reviews</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/book')} style={styles.linkItem}>
              <Text style={styles.linkText}>Reserve Table</Text>
            </TouchableOpacity>
          </View>

          {/* Column 3: Contact & Location */}
          <View style={[styles.column, { flex: 1.2 }]}>
            <Text style={styles.columnTitle}>Visit & Contact</Text>
            
            <TouchableOpacity style={styles.contactRow} onPress={handleOpenMaps}>
              <MapPin size={18} color={COLORS.copper} style={styles.contactIcon} />
              <Text style={styles.contactText}>{settings.address}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactRow} onPress={handleCall}>
              <Phone size={18} color={COLORS.copper} style={styles.contactIcon} />
              <Text style={styles.contactText}>{settings.phone}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactRow} onPress={handleWhatsApp}>
              <MessageSquare size={18} color={COLORS.copper} style={styles.contactIcon} />
              <Text style={styles.contactText}>WhatsApp Order & Inquiry</Text>
            </TouchableOpacity>

            <View style={styles.contactRow}>
              <Clock size={18} color={COLORS.copper} style={styles.contactIcon} />
              <Text style={styles.contactText}>{settings.openingHours}</Text>
            </View>
          </View>

        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Footer Bottom Bar */}
        <View style={[styles.bottomBar, !isDesktop && styles.bottomBarMobile]}>
          <Text style={styles.copyrightText}>
            © {new Date().getFullYear()} {settings.name}. All rights reserved.
          </Text>

          <View style={styles.bottomRightLinks}>
            <TouchableOpacity onPress={handleOpenMaps} style={styles.externalLink}>
              <Text style={styles.externalLinkText}>Plus Code: {settings.plusCode}</Text>
              <ExternalLink size={12} color={COLORS.copper} style={{ marginLeft: 4 }} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/admin')} style={styles.adminLoginLink}>
              <ShieldCheck size={14} color={COLORS.textSubtle} style={{ marginRight: 4 }} />
              <Text style={styles.adminLinkText}>Admin Portal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: '#0E0C0B',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xl,
  },
  footerContainerMobile: {
    paddingBottom: 90,
  },
  footerContent: {
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: SPACING.md,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 40,
    justifyContent: 'space-between',
  },
  gridRowMobile: {
    flexDirection: 'column',
    gap: 32,
  },
  column: {
    flex: 1,
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  footerLogo: {
    width: 42,
    height: 42,
    marginRight: 12,
    borderRadius: BORDER_RADIUS.sm,
  },
  brandName: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.cream,
    letterSpacing: 1.2,
  },
  brandTagline: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.copper,
    letterSpacing: 1.5,
  },
  brandDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  cuisinesBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  cuisineBadge: {
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  cuisineBadgeText: {
    fontSize: 11,
    color: COLORS.gold,
    fontWeight: '600',
  },
  columnTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: SPACING.md,
    letterSpacing: 0.8,
  },
  linkItem: {
    paddingVertical: 6,
  },
  linkText: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: '400',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  contactIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  contactText: {
    fontSize: 13,
    color: COLORS.creamMuted,
    lineHeight: 18,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.xl,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomBarMobile: {
    flexDirection: 'column',
    gap: 16,
    alignItems: 'flex-start',
  },
  copyrightText: {
    fontSize: 12,
    color: COLORS.textSubtle,
  },
  bottomRightLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  externalLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  externalLinkText: {
    fontSize: 12,
    color: COLORS.copper,
    fontWeight: '500',
  },
  adminLoginLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminLinkText: {
    fontSize: 12,
    color: COLORS.textSubtle,
  },
});
