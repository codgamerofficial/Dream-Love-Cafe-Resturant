import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Utensils, Users, Store } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../src/theme';
import { useSettings } from '../../src/context/SettingsContext';

export default function AboutPage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { settings } = useSettings();
  const isDesktop = width >= 768;
  const isLargeDesktop = width >= 1024;

  const featureCards = [
    {
      icon: Utensils,
      title: 'Multi-Cuisine Menu',
      description: 'Indian main courses, dum biryani, tandoori items, Chinese wok dishes, milkshakes, and cafe beverages.',
    },
    {
      icon: Users,
      title: 'Casual Family Dining',
      description: 'Comfortable indoor booth and table seating suitable for families, students, and groups of friends.',
    },
    {
      icon: Store,
      title: 'Dine-in, Takeaway & Delivery',
      description: 'Flexible dining modes with direct WhatsApp ordering and online reservation requests.',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Hero Header */}
        <View style={styles.headerBox}>
          <Text style={styles.eyebrow}>ABOUT DREAM LOVE</Text>
          <Text style={[styles.title, isDesktop && styles.titleDesktop]}>About Our Restaurant</Text>
          <Text style={styles.subtitle}>
            Multi-cuisine dining destination located on Contai Bypass Road, Contai, West Bengal.
          </Text>
        </View>

        {/* Editorial Grid: Photo + Philosophy */}
        <View style={[styles.editorialGrid, !isDesktop && styles.editorialGridMobile]}>
          {/* Left: Real Restaurant Photo */}
          <View style={[styles.photoColumn, !isDesktop && styles.photoColumnMobile]}>
            <View style={styles.photoWrapper}>
              <Image
                source={{ uri: '/photos/interior_dining_counter.jpg' }}
                style={[styles.heroImage, !isDesktop && styles.heroImageMobile]}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.photoCaption}>
              Dining area at Dream Love Cafe & Restaurant, Contai.
            </Text>
          </View>

          {/* Right: Philosophy + Description */}
          <View style={[styles.textColumn, !isDesktop && styles.textColumnMobile]}>
            <Text style={[styles.sectionTitle, isDesktop && styles.sectionTitleDesktop]}>Our Dining Concept</Text>
            <Text style={styles.bodyText}>
              Dream Love Cafe & Restaurant is a local multi-cuisine eatery situated conveniently on Contai Bypass Road opposite Jawed Habib's near Central Bus Stand.
            </Text>
            <Text style={styles.bodyText}>
              Operating daily from {settings.openingHours.replace('Monday - Sunday: ', '')}, we serve lunch, evening refreshments, shakes, and dinner for dine-in, takeaway, and delivery.
            </Text>
          </View>
        </View>

        {/* Feature Cards Grid */}
        <View style={[
          styles.cardsGrid,
          isLargeDesktop && styles.cardsGridDesktop,
          !isDesktop && styles.cardsGridMobile,
        ]}>
          {featureCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <View key={index} style={[styles.featureCard, isLargeDesktop && styles.featureCardDesktop]}>
                <View style={styles.cardIconBox}>
                  <IconComponent size={22} color={COLORS.brandTurquoise} />
                </View>
                <Text style={styles.cardTitle}>{card.title}</Text>
                <Text style={styles.cardDescription}>{card.description}</Text>
              </View>
            );
          })}
        </View>

        {/* CTA Banner */}
        <View style={styles.ctaBanner}>
          <Text style={[styles.ctaTitle, isDesktop && styles.ctaTitleDesktop]}>
            Ready to experience Dream Love?
          </Text>
          <Text style={styles.ctaSubtitle}>
            Explore our complete menu or request a table for your next dining occasion.
          </Text>
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
  innerContainer: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xxl,
  },

  // Hero Header
  headerBox: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.copper,
    letterSpacing: 3,
    marginBottom: 8,
  },
  title: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.cream,
    textAlign: 'center',
    marginBottom: 10,
  },
  titleDesktop: {
    fontSize: 52,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textMuted,
    textAlign: 'center',
    maxWidth: 640,
    lineHeight: 24,
  },

  // Editorial Grid
  editorialGrid: {
    flexDirection: 'row',
    gap: 48,
    alignItems: 'flex-start',
    marginBottom: SPACING.xxxl,
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
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    backgroundColor: COLORS.surface,
  },
  heroImage: {
    width: '100%',
    height: 400,
  },
  heroImageMobile: {
    height: 240,
  },
  photoCaption: {
    fontSize: 13,
    color: COLORS.textSubtle,
    fontStyle: 'italic',
    marginTop: 10,
    textAlign: 'center',
  },
  textColumn: {
    flex: 1,
    paddingTop: 8,
  },
  textColumnMobile: {
    width: '100%',
  },
  sectionTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: SPACING.md,
  },
  sectionTitleDesktop: {
    fontSize: 34,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 26,
    color: COLORS.creamMuted,
    marginBottom: SPACING.md,
  },

  // Feature Cards
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: SPACING.xxxl,
  },
  cardsGridDesktop: {
    flexWrap: 'nowrap',
  },
  cardsGridMobile: {
    flexDirection: 'column',
  },
  featureCard: {
    flex: 1,
    minWidth: 240,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  featureCardDesktop: {
    minWidth: 0,
  },
  cardIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(45, 212, 191, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 21,
  },

  // CTA Banner
  ctaBanner: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.brandTurquoise + '25',
  },
  ctaTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaTitleDesktop: {
    fontSize: 32,
  },
  ctaSubtitle: {
    fontSize: 15,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    maxWidth: 500,
  },
  ctaBtnRow: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  primaryBtn: {
    backgroundColor: COLORS.brandHeart,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.md,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.md,
  },
  secondaryBtnText: {
    color: COLORS.cream,
    fontSize: 15,
    fontWeight: '600',
  },
});
