import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, Utensils, Heart, ShieldCheck, Users } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../src/theme';
import { useSettings } from '../../src/context/SettingsContext';

export default function AboutPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { settings } = useSettings();
  const isDesktop = width >= 768;

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Header */}
        <View style={styles.headerBox}>
          <Text style={styles.preTitle}>DREAM LOVE CAFE & RESTAURANT</Text>
          <Text style={styles.title}>Made for moments.</Text>
          <Text style={styles.subtitle}>
            A vibrant culinary destination in Contai, West Bengal. Multi-cuisine family cafe & evening dining experience.
          </Text>
        </View>

        {/* Narrative Grid */}
        <View style={[styles.narrativeGrid, !isDesktop && styles.narrativeGridMobile]}>
          <View style={styles.imageCol}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80' }}
              style={styles.narrativeImage}
            />
          </View>

          <View style={styles.textCol}>
            <Text style={styles.sectionHeading}>Our Philosophy</Text>
            <Text style={styles.paragraph}>
              At Dream Love Cafe & Restaurant, we believe that dining out is an essential pleasure of life — a time to slow down, connect with family, share laughter with friends, and savor flavorful dishes prepared with genuine hospitality.
            </Text>
            <Text style={styles.paragraph}>
              Located conveniently on Contai Bypass Road opposite Jawed Habib's, our doors open daily from 12:00 PM to 12:00 AM to welcome guests for lunch feasts, casual afternoon shakes, and intimate evening dinners.
            </Text>

            <View style={styles.valuesList}>
              <View style={styles.valueRow}>
                <Utensils size={18} color={COLORS.copper} style={{ marginRight: 10 }} />
                <View>
                  <Text style={styles.valueTitle}>Diverse Multi-Cuisine Menu</Text>
                  <Text style={styles.valueSub}>Authentic Indian curries, slow-cooked handi biryanis, tandoori kebabs, wok Chinese, and shakes.</Text>
                </View>
              </View>

              <View style={styles.valueRow}>
                <Users size={18} color={COLORS.copper} style={{ marginRight: 10 }} />
                <View>
                  <Text style={styles.valueTitle}>Family & Friends Gathering</Text>
                  <Text style={styles.valueSub}>Thoughtfully arranged cozy seating suitable for intimate dates or celebratory family dinners.</Text>
                </View>
              </View>

              <View style={styles.valueRow}>
                <ShieldCheck size={18} color={COLORS.copper} style={{ marginRight: 10 }} />
                <View>
                  <Text style={styles.valueTitle}>Hygiene & Quality Standard</Text>
                  <Text style={styles.valueSub}>Strict kitchen cleanliness, fresh ingredient sourcing, and prompt attentive service.</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* CTA Banner */}
        <View style={styles.ctaBanner}>
          <Text style={styles.ctaBannerTitle}>Ready to experience Dream Love?</Text>
          <Text style={styles.ctaBannerSubtitle}>Explore our complete menu or book a table for your next dining occasion.</Text>

          <View style={styles.ctaBtnRow}>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/menu')}>
              <Text style={styles.primaryBtnText}>Explore Complete Menu</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push('/book')}>
              <Text style={styles.secondaryBtnText}>Reserve Table</Text>
            </TouchableOpacity>
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
    fontSize: 38,
    fontWeight: '800',
    color: COLORS.cream,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textMuted,
    textAlign: 'center',
    maxWidth: 600,
    lineHeight: 22,
  },
  narrativeGrid: {
    flexDirection: 'row',
    gap: 40,
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
  },
  narrativeGridMobile: {
    flexDirection: 'column',
  },
  imageCol: {
    flex: 1,
    width: '100%',
  },
  narrativeImage: {
    width: '100%',
    height: 380,
    borderRadius: BORDER_RADIUS.xl,
  },
  textCol: {
    flex: 1.2,
  },
  sectionHeading: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: SPACING.md,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  valuesList: {
    marginTop: SPACING.md,
    gap: 16,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.surfaceElevated,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  valueTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 2,
  },
  valueSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 16,
  },
  ctaBanner: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.copper + '40',
  },
  ctaBannerTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 6,
    textAlign: 'center',
  },
  ctaBannerSubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  ctaBtnRow: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  primaryBtn: {
    backgroundColor: COLORS.copper,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
  },
  primaryBtnText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.cream,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
  },
  secondaryBtnText: {
    color: COLORS.cream,
    fontSize: 14,
    fontWeight: '600',
  },
});
