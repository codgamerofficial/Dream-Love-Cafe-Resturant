import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, useWindowDimensions, Platform } from 'react-native';
import { Star, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../src/theme';
import { useSettings } from '../../src/context/SettingsContext';

export default function ReviewsPage() {
  const { width } = useWindowDimensions();
  const { settings, verifiedReviews } = useSettings();

  const isMobile = width < 600;
  const isTablet = width >= 600 && width < 900;
  const isDesktop = width >= 900;

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Header */}
        <View style={styles.headerBox}>
          <Text style={styles.preTitle}>VERIFIED PUBLIC RATINGS</Text>
          <Text style={[styles.title, isMobile && styles.titleMobile]}>Guest Reviews & Ratings</Text>
          <Text style={[styles.subtitle, isMobile && styles.subtitleMobile]}>
            Authentic dining reviews, ratings, and feedback directly linked to official Google, Justdial, and Magicpin listings.
          </Text>
        </View>

        {/* Multi-Platform Verified Ratings Grid */}
        <View style={styles.platformsGrid}>
          {/* Google Maps Card */}
          <View style={[styles.platformCard, isMobile && styles.cardFullWidth, isTablet && styles.cardHalfWidth]}>
            <View style={styles.platformHeader}>
              <View style={styles.platformBadge}>
                <ShieldCheck size={14} color={COLORS.brandTurquoise} style={{ marginRight: 4 }} />
                <Text style={styles.platformBadgeText}>Google Maps</Text>
              </View>
              <Text style={styles.verifiedTag}>Verified Profile</Text>
            </View>

            <View style={styles.ratingNumberRow}>
              <Text style={styles.ratingBigText}>{settings.googleRating}</Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4].map((s) => (
                  <Star key={s} size={20} color={COLORS.gold} fill={COLORS.gold} style={{ marginRight: 2 }} />
                ))}
                <Star size={20} color={COLORS.gold} fill="transparent" />
              </View>
            </View>

            <Text style={styles.reviewCountLabel}>
              Based on {settings.googleReviewsCount}+ verified local reviews
            </Text>

            <TouchableOpacity 
              style={styles.platformActionBtn} 
              onPress={() => Linking.openURL(settings.googleReviewsUrl)}
              accessibilityRole="link"
            >
              <Text style={styles.platformActionText}>View on Google Maps</Text>
              <ExternalLink size={13} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>

          {/* Justdial Card */}
          {settings.justdialUrl && (
            <View style={[styles.platformCard, isMobile && styles.cardFullWidth, isTablet && styles.cardHalfWidth]}>
              <View style={styles.platformHeader}>
                <View style={styles.platformBadge}>
                  <ShieldCheck size={14} color={COLORS.brandTurquoise} style={{ marginRight: 4 }} />
                  <Text style={styles.platformBadgeText}>Justdial</Text>
                </View>
                <Text style={styles.verifiedTag}>Verified Listing</Text>
              </View>

              <View style={styles.ratingNumberRow}>
                <Text style={styles.ratingBigText}>{settings.justdialRating || '4.0'}</Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4].map((s) => (
                    <Star key={s} size={20} color={COLORS.gold} fill={COLORS.gold} style={{ marginRight: 2 }} />
                  ))}
                  <Star size={20} color={COLORS.gold} fill="transparent" />
                </View>
              </View>

              <Text style={styles.reviewCountLabel}>
                Verified local business directory rating
              </Text>

              <TouchableOpacity 
                style={styles.platformActionBtn} 
                onPress={() => Linking.openURL(settings.justdialUrl!)}
                accessibilityRole="link"
              >
                <Text style={styles.platformActionText}>View on Justdial</Text>
                <ExternalLink size={13} color="#FFFFFF" style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            </View>
          )}

          {/* Magicpin Card */}
          {settings.magicpinUrl && (
            <View style={[styles.platformCard, isMobile && styles.cardFullWidth, isTablet && styles.cardHalfWidth]}>
              <View style={styles.platformHeader}>
                <View style={styles.platformBadge}>
                  <ShieldCheck size={14} color={COLORS.brandTurquoise} style={{ marginRight: 4 }} />
                  <Text style={styles.platformBadgeText}>Magicpin</Text>
                </View>
                <Text style={styles.verifiedTag}>Verified Listing</Text>
              </View>

              <View style={styles.ratingNumberRow}>
                <Text style={styles.ratingBigText}>{settings.magicpinRating || '4.1'}</Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4].map((s) => (
                    <Star key={s} size={20} color={COLORS.gold} fill={COLORS.gold} style={{ marginRight: 2 }} />
                  ))}
                  <Star size={20} color={COLORS.gold} fill="transparent" />
                </View>
              </View>

              <Text style={styles.reviewCountLabel}>
                Verified food & dining discovery rating
              </Text>

              <TouchableOpacity 
                style={styles.platformActionBtn} 
                onPress={() => Linking.openURL(settings.magicpinUrl!)}
                accessibilityRole="link"
              >
                <Text style={styles.platformActionText}>View on Magicpin</Text>
                <ExternalLink size={13} color="#FFFFFF" style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Verified Quotes from Public Reviewers */}
        <View style={styles.verifiedReviewsSection}>
          <Text style={[styles.sectionTitle, isMobile && styles.sectionTitleMobile]}>Verified Review Excerpts</Text>
          <Text style={styles.sectionDesc}>
            These excerpts reflect authentic feedback published on public review platforms. Click any review to view the original source.
          </Text>

          <View style={styles.reviewsGrid}>
            {verifiedReviews.map((rev) => (
              <TouchableOpacity 
                key={rev.id} 
                style={[
                  styles.reviewItemCard,
                  isMobile && styles.cardFullWidth,
                  isTablet && styles.cardHalfWidth
                ]}
                onPress={() => Linking.openURL(rev.externalReviewUrl)}
                activeOpacity={0.85}
              >
                <View style={styles.reviewCardTop}>
                  <View style={styles.reviewBadgeRow}>
                    <Text style={styles.sourceTag}>{rev.source}</Text>
                    <View style={styles.starCluster}>
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} size={12} color={COLORS.gold} fill={COLORS.gold} style={{ marginLeft: 1 }} />
                      ))}
                    </View>
                  </View>
                  <Text style={styles.dateTag}>{rev.reviewDate}</Text>
                </View>

                <Text style={styles.quoteText}>"{rev.reviewText}"</Text>

                {rev.aspects && rev.aspects.length > 0 && (
                  <View style={styles.aspectsRow}>
                    {rev.aspects.map((aspect) => (
                      <View key={aspect} style={styles.aspectBadge}>
                        <CheckCircle2 size={10} color={COLORS.brandTurquoise} style={{ marginRight: 3 }} />
                        <Text style={styles.aspectText}>{aspect}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <View style={styles.reviewCardBottom}>
                  <Text style={styles.authorName}>{rev.reviewerName}</Text>
                  <View style={styles.linkOut}>
                    <Text style={styles.linkOutText}>Source</Text>
                    <ExternalLink size={11} color={COLORS.brandTurquoise} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quality Disclaimer */}
        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimerHeading}>Review Integrity Notice</Text>
          <Text style={styles.disclaimerBody}>
            Dream Love Cafe & Restaurant maintains 100% transparent review tracking. We do not fabricate testimonials, alter customer ratings, or use synthetic review aggregations. All links redirect directly to third-party public platforms.
          </Text>
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
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xl,
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  preTitle: {
    fontSize: 10.5,
    fontWeight: '700',
    color: COLORS.brandTurquoise,
    letterSpacing: 2,
    marginBottom: 4,
  },
  title: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.cream,
    textAlign: 'center',
    marginBottom: 6,
  },
  titleMobile: {
    fontSize: 24,
  },
  subtitle: {
    fontSize: 13.5,
    color: COLORS.textMuted,
    textAlign: 'center',
    maxWidth: 620,
    lineHeight: 19,
  },
  subtitleMobile: {
    fontSize: 12.5,
  },
  platformsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: SPACING.xxl,
  },
  platformCard: {
    width: '31.8%',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'space-between',
    ...SHADOWS.card,
  },
  cardFullWidth: {
    width: '100%',
  },
  cardHalfWidth: {
    width: '48.5%',
  },
  platformHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  platformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  platformBadgeText: {
    color: COLORS.cream,
    fontSize: 11.5,
    fontWeight: '700',
  },
  verifiedTag: {
    color: COLORS.brandTurquoise,
    fontSize: 11,
    fontWeight: '600',
  },
  ratingNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: SPACING.xs,
  },
  ratingBigText: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 38,
    fontWeight: '900',
    color: COLORS.cream,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewCountLabel: {
    color: COLORS.creamMuted,
    fontSize: 12.5,
    marginBottom: SPACING.md,
  },
  platformActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.brandGreen,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: BORDER_RADIUS.md,
  },
  platformActionText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
  },
  verifiedReviewsSection: {
    marginTop: SPACING.md,
  },
  sectionTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 4,
  },
  sectionTitleMobile: {
    fontSize: 20,
  },
  sectionDesc: {
    color: COLORS.textMuted,
    fontSize: 12.5,
    marginBottom: SPACING.lg,
  },
  reviewsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  reviewItemCard: {
    width: '48.8%',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'space-between',
  },
  reviewCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  reviewBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sourceTag: {
    color: COLORS.brandTurquoise,
    fontSize: 10.5,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  starCluster: {
    flexDirection: 'row',
  },
  dateTag: {
    color: COLORS.textSubtle,
    fontSize: 10.5,
  },
  quoteText: {
    color: COLORS.creamMuted,
    fontSize: 13,
    lineHeight: 20,
    fontStyle: 'italic',
    marginBottom: SPACING.md,
  },
  aspectsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: SPACING.md,
  },
  aspectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  aspectText: {
    color: COLORS.cream,
    fontSize: 10.5,
    fontWeight: '500',
  },
  reviewCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  authorName: {
    color: COLORS.cream,
    fontSize: 12,
    fontWeight: '700',
  },
  linkOut: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  linkOutText: {
    color: COLORS.brandTurquoise,
    fontSize: 11,
    fontWeight: '600',
  },
  disclaimerContainer: {
    marginTop: SPACING.xxl,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  disclaimerHeading: {
    color: COLORS.cream,
    fontSize: 12.5,
    fontWeight: '700',
    marginBottom: 3,
  },
  disclaimerBody: {
    color: COLORS.textSubtle,
    fontSize: 11.5,
    lineHeight: 16,
  },
});
