import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Utensils, Users, Flame, MapPin, Calendar, Clock, ArrowRight } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../src/theme';
import { useSettings } from '../../src/context/SettingsContext';

export default function AboutPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { settings } = useSettings();
  const isDesktop = width >= 860;
  const isMobile = width < 600;

  const highlights = [
    {
      icon: Users,
      title: 'Family Friendly Ambiance',
      description: 'Comfortable indoor booth and table seating suitable for families, students, and groups of friends.',
    },
    {
      icon: Flame,
      title: 'Freshly Prepared Food',
      description: 'Traditional clay-oven tandoor, authentic dum biryanis, and Chinese wok dishes prepared fresh to order.',
    },
    {
      icon: Utensils,
      title: 'Multi-Cuisine Variety',
      description: 'A curated menu spanning North Indian specialties, tandoor kebabs, fried rice, mocktails, and cafe shakes.',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Editorial Header */}
        <View style={styles.headerBox}>
          <Text style={styles.eyebrow}>OUR STORY</Text>
          <Text style={[styles.title, isDesktop && styles.titleDesktop]}>
            A place made for{'\n'}good food & good company.
          </Text>
          <Text style={styles.subtitle}>
            An intimate multi-cuisine dining destination located on Contai Bypass Road, Contai, West Bengal.
          </Text>
        </View>

        {/* 2-Column Editorial Grid */}
        <View style={[styles.editorialGrid, !isDesktop && styles.editorialGridMobile]}>
          {/* Left Column: Real Restaurant Photo */}
          <View style={[styles.photoColumn, !isDesktop && styles.photoColumnMobile]}>
            <View style={styles.photoWrapper}>
              <Image
                source={{ uri: '/photos/interior_dining_counter.jpg' }}
                style={styles.heroImage}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.photoCaption}>
              Dining counter and guest area at Dream Love Cafe & Restaurant, Contai.
            </Text>
          </View>

          {/* Right Column: Verified Narrative */}
          <View style={[styles.textColumn, !isDesktop && styles.textColumnMobile]}>
            <Text style={styles.sectionHeading}>Our Dining Concept</Text>
            <Text style={styles.bodyText}>
              Dream Love Cafe & Restaurant was created to provide Contai with a welcoming dining spot where flavor, comfort, and hospitality come together.
            </Text>
            <Text style={styles.bodyText}>
              Located conveniently on Contai Bypass Road opposite Jawed Habib's near the Central Bus Stand, we cater to daily diners, family celebrations, and evening gatherings.
            </Text>
            <Text style={styles.bodyText}>
              Operating daily from 12:00 PM to 12:00 AM, our kitchen offers generous portions across Indian, Tandoor, Chinese, Biryani, and Beverage categories for dine-in, takeaway, and delivery.
            </Text>
          </View>
        </View>

        {/* 3 Compact Highlights */}
        <View style={[styles.highlightsGrid, !isDesktop && styles.highlightsGridMobile]}>
          {highlights.map((item, index) => {
            const IconComp = item.icon;
            return (
              <View key={index} style={styles.highlightCard}>
                <View style={styles.cardIconBox}>
                  <IconComp size={20} color={COLORS.brandTurquoise} />
                </View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
              </View>
            );
          })}
        </View>

        {/* Pre-Footer Action Banner */}
        <View style={styles.ctaBanner}>
          <Text style={styles.ctaTitle}>Experience Dream Love</Text>
          <Text style={styles.ctaSubtitle}>
            Explore our complete menu, reserve your table, or come visit us on Contai Bypass Road.
          </Text>

          <View style={styles.ctaButtonsRow}>
            <TouchableOpacity 
              style={styles.ctaPrimaryBtn}
              onPress={() => router.push('/menu')}
              activeOpacity={0.85}
            >
              <Utensils size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.ctaPrimaryBtnText}>Explore Menu</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.ctaSecondaryBtn}
              onPress={() => router.push('/book')}
              activeOpacity={0.85}
            >
              <Calendar size={15} color={COLORS.brandTurquoise} style={{ marginRight: 6 }} />
              <Text style={styles.ctaSecondaryBtnText}>Reserve a Table</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.ctaTertiaryBtn}
              onPress={() => router.push('/visit')}
              activeOpacity={0.8}
            >
              <MapPin size={15} color={COLORS.cream} style={{ marginRight: 6 }} />
              <Text style={styles.ctaTertiaryBtnText}>Visit Us</Text>
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
    paddingBottom: SPACING.xxxl,
  },
  innerContainer: {
    maxWidth: 1140,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
  },
  headerBox: {
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: SPACING.xxl,
  },
  eyebrow: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.copper,
    letterSpacing: 2,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.cream,
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 44,
    marginBottom: 10,
  },
  titleDesktop: {
    fontSize: 44,
    lineHeight: 52,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textMuted,
    textAlign: 'center',
    maxWidth: 620,
    lineHeight: 23,
  },
  editorialGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 48,
    marginBottom: SPACING.xxl,
  },
  editorialGridMobile: {
    flexDirection: 'column',
    gap: 28,
  },
  photoColumn: {
    flex: 1,
  },
  photoColumnMobile: {
    width: '100%',
  },
  photoWrapper: {
    height: 380,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  photoCaption: {
    fontSize: 12,
    color: COLORS.textSubtle,
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  textColumn: {
    flex: 1.1,
  },
  textColumnMobile: {
    width: '100%',
  },
  sectionHeading: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 14,
  },
  bodyText: {
    fontSize: 15,
    color: COLORS.creamMuted,
    lineHeight: 24,
    marginBottom: 14,
  },
  highlightsGrid: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: SPACING.xxl,
  },
  highlightsGridMobile: {
    flexDirection: 'column',
    gap: 14,
  },
  highlightCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  cardIconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 19,
  },
  ctaBanner: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 22,
    paddingVertical: 36,
    paddingHorizontal: 28,
    alignItems: 'center',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    ...SHADOWS.card,
  },
  ctaTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaSubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    maxWidth: 540,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: SPACING.xl,
  },
  ctaButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  ctaPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.brandHeart,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: BORDER_RADIUS.md,
  },
  ctaPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  ctaSecondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.brandTurquoise + '60',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: BORDER_RADIUS.md,
  },
  ctaSecondaryBtnText: {
    color: COLORS.brandTurquoise,
    fontSize: 14,
    fontWeight: '600',
  },
  ctaTertiaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: BORDER_RADIUS.md,
  },
  ctaTertiaryBtnText: {
    color: COLORS.cream,
    fontSize: 14,
    fontWeight: '600',
  },
});
