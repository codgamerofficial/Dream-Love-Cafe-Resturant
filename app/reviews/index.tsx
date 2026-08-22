import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, useWindowDimensions } from 'react-native';
import { Star, ExternalLink, MessageSquareQuote, ShieldCheck } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../src/theme';
import { useSettings } from '../../src/context/SettingsContext';

export default function ReviewsPage() {
  const { width } = useWindowDimensions();
  const { settings, customerStories } = useSettings();
  const isDesktop = width >= 768;

  const handleOpenGoogle = () => {
    Linking.openURL(settings.googleReviewsUrl);
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Header */}
        <View style={styles.headerBox}>
          <Text style={styles.preTitle}>VERIFIED FEEDBACK</Text>
          <Text style={styles.title}>Guest Reviews & Rating</Text>
          <Text style={styles.subtitle}>
            Read verified rating metrics from Google Maps and guest feedback stories.
          </Text>
        </View>

        {/* Google Metrics Hero Card (Section 23) */}
        <View style={styles.googleHeroCard}>
          <View style={styles.googleBadgeRow}>
            <ShieldCheck size={18} color={COLORS.copper} style={{ marginRight: 6 }} />
            <Text style={styles.googleBadgeText}>VERIFIED GOOGLE BUSINESS PROFILE</Text>
          </View>

          <View style={styles.ratingNumberRow}>
            <Text style={styles.ratingBigText}>{settings.googleRating}</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4].map((s) => (
                <Star key={s} size={28} color={COLORS.gold} fill={COLORS.gold} style={{ marginRight: 4 }} />
              ))}
              <Star size={28} color={COLORS.gold} fill="transparent" />
            </View>
          </View>

          <Text style={styles.reviewCountLabel}>
            Overall rating from {settings.googleReviewsCount} Google Maps reviews
          </Text>

          <TouchableOpacity style={styles.googleActionBtn} onPress={handleOpenGoogle}>
            <Text style={styles.googleActionBtnText}>View Google Reviews on Maps</Text>
            <ExternalLink size={16} color={COLORS.background} style={{ marginLeft: 6 }} />
          </TouchableOpacity>

          <Text style={styles.disclaimerText}>
            Official Google reviews are accessed directly on Google Maps to ensure 100% authenticity.
          </Text>
        </View>

        {/* Clearly Labelled "Customer Stories" (Section 23) */}
        <View style={styles.storiesSection}>
          <Text style={styles.storiesSectionTitle}>Curated Customer Stories</Text>

          <View style={[styles.storiesGrid, !isDesktop && styles.storiesGridMobile]}>
            {customerStories.map((story) => (
              <View key={story.id} style={styles.storyCard}>
                <View style={styles.storyHeader}>
                  <MessageSquareQuote size={24} color={COLORS.copper} />
                  <View style={styles.storyStars}>
                    {Array.from({ length: story.rating }).map((_, i) => (
                      <Star key={i} size={14} color={COLORS.gold} fill={COLORS.gold} style={{ marginLeft: 2 }} />
                    ))}
                  </View>
                </View>

                <Text style={styles.storyText}>"{story.text}"</Text>

                <View style={styles.storyFooter}>
                  <Text style={styles.storyAuthor}>{story.author}</Text>
                  <Text style={styles.storySourceTag}>{story.source} • {story.date}</Text>
                </View>
              </View>
            ))}
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
  },
  googleHeroCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.copper + '60',
    marginBottom: SPACING.xxxl,
    ...SHADOWS.card,
  },
  googleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  googleBadgeText: {
    color: COLORS.copper,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  ratingNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  ratingBigText: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 56,
    fontWeight: '900',
    color: COLORS.cream,
    marginRight: 16,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewCountLabel: {
    fontSize: 14,
    color: COLORS.creamMuted,
    marginBottom: SPACING.xl,
  },
  googleActionBtn: {
    backgroundColor: COLORS.copper,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    ...SHADOWS.glowCopper,
  },
  googleActionBtnText: {
    color: COLORS.background,
    fontSize: 15,
    fontWeight: '800',
  },
  disclaimerText: {
    fontSize: 11,
    color: COLORS.textSubtle,
    fontStyle: 'italic',
  },
  storiesSection: {
    marginTop: SPACING.md,
  },
  storiesSectionTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: SPACING.xl,
  },
  storiesGrid: {
    flexDirection: 'row',
    gap: 20,
  },
  storiesGridMobile: {
    flexDirection: 'column',
  },
  storyCard: {
    flex: 1,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'space-between',
  },
  storyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  storyStars: {
    flexDirection: 'row',
  },
  storyText: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.creamMuted,
    fontStyle: 'italic',
    marginBottom: SPACING.lg,
  },
  storyFooter: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border + '40',
    paddingTop: SPACING.sm,
  },
  storyAuthor: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.cream,
  },
  storySourceTag: {
    fontSize: 11,
    color: COLORS.textSubtle,
    marginTop: 2,
  },
});
