import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Phone, Clock, MessageSquare, ExternalLink, Calendar, ShoppingBag, Compass } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../src/theme';
import { useSettings } from '../../src/context/SettingsContext';

export default function ContactPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { settings } = useSettings();
  const isDesktop = width >= 768;

  const handleOpenMaps = () => {
    Linking.openURL(settings.googleMapsUrl);
  };

  const handleGetDirections = () => {
    const dirUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(settings.plusCode)}`;
    Linking.openURL(dirUrl);
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
          <Text style={styles.preTitle}>CONTAI, WEST BENGAL</Text>
          <Text style={styles.title}>Visit Dream Love</Text>
          <Text style={styles.subtitle}>
            Multi-Cuisine Family Cafe & Restaurant. Located at Central Bus Stand, Contai Bypass Road.
          </Text>
        </View>

        {/* Action Cards Row */}
        <View style={[styles.contactGrid, !isDesktop && styles.contactGridMobile]}>
          
          {/* Main Info Card */}
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Location & Directions</Text>

            <View style={styles.infoRow}>
              <MapPin size={22} color={COLORS.copper} style={styles.infoIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoValue}>{settings.address}</Text>
                <Text style={styles.plusCodeLabel}>Plus Code: {settings.plusCode}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Clock size={22} color={COLORS.copper} style={styles.infoIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Opening Hours</Text>
                <Text style={styles.infoValue}>{settings.openingHours}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Phone size={22} color={COLORS.copper} style={styles.infoIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.infoLabel}>Telephone & WhatsApp</Text>
                <Text style={styles.infoValue}>{settings.phone}</Text>
              </View>
            </View>

            {/* Direct Google Maps Actions */}
            <View style={styles.mapsActionRow}>
              <TouchableOpacity style={styles.mapsBtnPrimary} onPress={handleOpenMaps}>
                <ExternalLink size={16} color={COLORS.background} style={{ marginRight: 6 }} />
                <Text style={styles.mapsBtnPrimaryText}>View on Google Maps</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.mapsBtnSecondary} onPress={handleGetDirections}>
                <Compass size={16} color={COLORS.cream} style={{ marginRight: 6 }} />
                <Text style={styles.mapsBtnSecondaryText}>Get Directions</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Actions & Dining Info Sidebar */}
          <View style={styles.sidebarCol}>
            
            {/* Quick Primary Actions */}
            <View style={styles.quickActionCard}>
              <Text style={styles.cardTitle}>Instant Actions</Text>

              <TouchableOpacity style={styles.actionBtnCall} onPress={handleCall}>
                <Phone size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.actionBtnText}>Call Restaurant Now</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionBtnWa} onPress={handleWhatsApp}>
                <MessageSquare size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.actionBtnText}>Order / Chat on WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionBtnBook} onPress={() => router.push('/book')}>
                <Calendar size={18} color={COLORS.background} style={{ marginRight: 8 }} />
                <Text style={styles.actionBtnBookText}>Reserve Table Online</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionBtnMenu} onPress={() => router.push('/menu')}>
                <ShoppingBag size={18} color={COLORS.cream} style={{ marginRight: 8 }} />
                <Text style={styles.actionBtnMenuText}>Browse Complete Menu</Text>
              </TouchableOpacity>
            </View>

            {/* Operational Specs Card */}
            <View style={styles.specsCard}>
              <Text style={styles.specsTitle}>Dining & Pricing Specs</Text>

              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Price for two:</Text>
                <Text style={styles.specValue}>{settings.priceRangeForTwo}</Text>
              </View>

              <View style={styles.specItem}>
                <Text style={styles.specLabel}>Dining Modes:</Text>
                <Text style={styles.specValue}>{settings.diningModes.join(' • ')}</Text>
              </View>

              <View style={styles.specItem}>
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
  scrollContent: {
    paddingVertical: SPACING.xxl,
  },
  innerContainer: {
    maxWidth: 1100,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: SPACING.md,
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  preTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.copper,
    letterSpacing: 2.5,
    marginBottom: 6,
  },
  title: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.cream,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    maxWidth: 600,
    lineHeight: 20,
  },
  contactGrid: {
    flexDirection: 'row',
    gap: 32,
  },
  contactGridMobile: {
    flexDirection: 'column',
  },
  infoCard: {
    flex: 1.4,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  sidebarCol: {
    flex: 1,
    gap: 20,
  },
  cardTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: SPACING.lg,
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
    color: COLORS.copper,
    letterSpacing: 1,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.cream,
    lineHeight: 20,
  },
  plusCodeLabel: {
    fontSize: 12,
    color: COLORS.gold,
    marginTop: 4,
    fontWeight: '600',
  },
  mapsActionRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    marginTop: SPACING.md,
  },
  mapsBtnPrimary: {
    backgroundColor: COLORS.copper,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
  },
  mapsBtnPrimaryText: {
    color: COLORS.background,
    fontSize: 13,
    fontWeight: '700',
  },
  mapsBtnSecondary: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
  },
  mapsBtnSecondaryText: {
    color: COLORS.cream,
    fontSize: 13,
    fontWeight: '600',
  },
  quickActionCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionBtnCall: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: 10,
  },
  actionBtnWa: {
    backgroundColor: '#25D366',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: 10,
  },
  actionBtnBook: {
    backgroundColor: COLORS.copper,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: 10,
  },
  actionBtnMenu: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  actionBtnBookText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: '700',
  },
  actionBtnMenuText: {
    color: COLORS.cream,
    fontSize: 14,
    fontWeight: '600',
  },
  specsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  specsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: SPACING.md,
  },
  specItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  specLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  specValue: {
    fontSize: 13,
    color: COLORS.gold,
    fontWeight: '700',
  },
});
