import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Utensils, Users, Flame, MapPin, Calendar, Clock, ArrowRight, Sparkles, Heart } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, LAYOUT, SHADOWS } from '../../src/theme';
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
      description: 'A curated menu spanning North Indian specialties, tandoor kebabs, fried rice, mocktails, and café shakes.',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Editorial Header */}
        <View style={styles.headerBox}>
          <Text style={styles.eyebrow}>OUR STORY</Text>
          <Text style={[styles.title, !isDesktop && styles.titleMobile]}>
            A place made for{'\n'}good food & good company.
          </Text>
          <Text style={styles.subtitle}>
            An intimate multi-cuisine dining destination located on Contai Bypass Road, Contai, West Bengal.
          </Text>
        </View>

        {/* 2-Column Editorial Grid */}
        <View style={[styles.editorialGrid, !isDesktop && styles.editorialGridMobile]}>
          {/* Left Column: Real Restaurant Photo */}
          <View style={[styles.photoColumn, !isDesktop && styles.columnFullWidth]}>
            <View style={[styles.photoWrapper, !isDesktop && styles.photoWrapperMobile]}>
              <Image
                source={{ uri: '/photos/interior_dining_counter.jpg' }}
                style={styles.heroImage}
                resizeMode="cover"
              />
              <View style={styles.photoBadge}>
                <Sparkles size={12} color={COLORS.brandTurquoise} style={{ marginRight: 4 }} />
                <Text style={styles.photoBadgeText}>Dining Counter & Kitchen</Text>
              </View>
            </View>
            <Text style={styles.photoCaption}>
              Dining counter and guest area at Dream Love Cafe & Restaurant, Contai.
            </Text>
          </View>

          {/* Right Column: Verified Narrative */}
          <View style={[styles.textColumn, !isDesktop && styles.columnFullWidth]}>
            <Text style={styles.sectionHeading}>Our Dining Concept</Text>
            <Text style={styles.bodyText}>
              Dream Love Cafe & Restaurant was created to provide Contai with a welcoming dining destination where authentic flavor, generous portions, and genuine hospitality come together.
            </Text>
            <Text style={styles.bodyText}>
              Conveniently situated on Contai Bypass Road opposite Jawed Habib's near the Central Bus Stand, we cater to everyday lunches, evening coffee chats, family dinners, and birthday celebrations.
            </Text>
            <Text style={styles.bodyText}>
              Operating daily from 12:00 PM to 12:00 AM, our kitchen prepares 134 authentic recipes across North Indian classics, clay-oven tandoor, dum biryanis, Chinese wok specialties, and refreshing mocktails for dine-in, takeaway, and delivery.
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
          <Text style={styles.ctaTitle}>Experience Dream Love in Contai</Text>
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
    color: COLORS.copper,
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
    letterSpacing: -0.3,
    lineHeight: 50,
    marginBottom: 10,
  },
  titleMobile: {
    fontSize: 30,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textMuted,
    textAlign: 'center',
    maxWidth: 620,
    lineHeight: 23,
    fontFamily: TYPOGRAPHY.fontFamilySans,
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
  columnFullWidth: {
    width: '100%',
  },
  photoWrapper: {
    height: 380,
    borderRadius: BORDER_RADIUS.hero,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
    ...SHADOWS.card,
  },
  photoWrapperMobile: {
    height: 250,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  photoBadge: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    backgroundColor: 'rgba(18, 15, 14, 0.88)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: BORDER_RADIUS.xs,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  photoBadgeText: {
    color: COLORS.cream,
    fontSize: 11.5,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  photoCaption: {
    fontSize: 12,
    color: COLORS.textSubtle,
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  textColumn: {
    flex: 1.15,
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
    fontFamily: TYPOGRAPHY.fontFamilySans,
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
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  cardIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    color: COLORS.cream,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  cardDescription: {
    color: COLORS.textMuted,
    fontSize: 13,
    lineHeight: 19,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  ctaBanner: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.xl,
    alignItems: 'center',
    textAlign: 'center',
    ...SHADOWS.card,
  },
  ctaTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 6,
  },
  ctaSubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    maxWidth: 540,
    lineHeight: 21,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  ctaButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  ctaPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.brandHeart,
    paddingVertical: 11,
    paddingHorizontal: 20,
    borderRadius: BORDER_RADIUS.md,
  },
  ctaPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  ctaSecondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.brandTurquoise + '60',
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: BORDER_RADIUS.md,
  },
  ctaSecondaryBtnText: {
    color: COLORS.brandTurquoise,
    fontSize: 13.5,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  ctaTertiaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: BORDER_RADIUS.md,
  },
  ctaTertiaryBtnText: {
    color: COLORS.cream,
    fontSize: 13.5,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
});
