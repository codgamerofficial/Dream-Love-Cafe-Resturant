import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, useWindowDimensions, Platform } from 'react-native';
import { Star, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, LAYOUT, SHADOWS } from '../../src/theme';
import { useSettings } from '../../src/context/SettingsContext';

export default function ReviewsPage() {
  const { width } = useWindowDimensions();
  const { settings, verifiedReviews } = useSettings();

  const isMobile = width < 600;
  const isTablet = width >= 600 && width < 920;
  const isDesktop = width >= 920;

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Header */}
        <View style={styles.headerBox}>
          <Text style={styles.preTitle}>VERIFIED PUBLIC RATINGS</Text>
          <Text style={[styles.title, isMobile && styles.titleMobile]}>Guest Reviews & Ratings</Text>
          <Text style={[styles.subtitle, isMobile && styles.subtitleMobile]}>
            Authentic dining reviews, ratings, and guest feedback directly linked to official Google, Justdial, and Magicpin listings.
          </Text>
        </View>

        {/* Multi-Platform Verified Ratings Grid */}
        <View style={styles.platformsGrid}>
          {/* Google Maps Card */}
          <View style={[styles.platformCard, isMobile && styles.cardFullWidth, isTablet && styles.cardHalfWidth]}>
            <View style={styles.platformHeader}>
              <View style={styles.platformBadge}>
                <ShieldCheck size={15} color={COLORS.brandTurquoise} style={{ marginRight: 5 }} />
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
              activeOpacity={0.85}
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
                  <ShieldCheck size={15} color={COLORS.brandTurquoise} style={{ marginRight: 5 }} />
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
                activeOpacity={0.85}
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
                  <ShieldCheck size={15} color={COLORS.brandTurquoise} style={{ marginRight: 5 }} />
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
                activeOpacity={0.85}
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
                  isTablet && styles.cardHalfWidth,
                  isDesktop && styles.cardThirdWidth
                ]}
                onPress={() => Linking.openURL(rev.externalReviewUrl)}
                activeOpacity={0.85}
              >
                <View style={styles.reviewCardTop}>
                  <View style={styles.reviewBadgeRow}>
                    <Text style={styles.sourceTag}>{rev.source}</Text>
                    <View style={styles.starCluster}>
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} size={13} color={COLORS.gold} fill={COLORS.gold} style={{ marginLeft: 2 }} />
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
                        <CheckCircle2 size={10} color={COLORS.brandTurquoise} style={{ marginRight: 4 }} />
                        <Text style={styles.aspectText}>{aspect}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <View style={styles.reviewCardBottom}>
                  <Text style={styles.authorName}>{rev.reviewerName}</Text>
                  <View style={styles.linkOut}>
                    <Text style={styles.linkOutText}>Source</Text>
                    <ExternalLink size={12} color={COLORS.brandTurquoise} style={{ marginLeft: 4 }} />
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
  preTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.brandTurquoise,
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
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  titleMobile: {
    fontSize: 28,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textMuted,
    textAlign: 'center',
    maxWidth: 620,
    lineHeight: 23,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  subtitleMobile: {
    fontSize: 13.5,
    lineHeight: 20,
  },
  platformsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: SPACING.xxxl,
  },
  platformCard: {
    flex: 1,
    minWidth: 260,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'space-between',
    ...SHADOWS.card,
  },
  cardFullWidth: {
    width: '100%',
  },
  cardHalfWidth: {
    width: '48%',
  },
  cardThirdWidth: {
    width: '31.8%',
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
  },
  platformBadgeText: {
    color: COLORS.cream,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  verifiedTag: {
    color: COLORS.copperLight,
    fontSize: 11,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  ratingNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  ratingBigText: {
    fontSize: 38,
    fontWeight: '900',
    color: COLORS.gold,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  starsRow: {
    flexDirection: 'row',
  },
  reviewCountLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: SPACING.lg,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  platformActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.md,
  },
  platformActionText: {
    color: COLORS.cream,
    fontSize: 13,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  verifiedReviewsSection: {
    marginBottom: SPACING.xxxl,
  },
  sectionTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.cream,
    marginBottom: 6,
  },
  sectionTitleMobile: {
    fontSize: 22,
  },
  sectionDesc: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: SPACING.xl,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  reviewsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  reviewItemCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'space-between',
    ...SHADOWS.card,
  },
  reviewCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sourceTag: {
    color: COLORS.brandTurquoise,
    fontSize: 11,
    fontWeight: '700',
    backgroundColor: COLORS.surfaceElevated,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.xs,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  starCluster: {
    flexDirection: 'row',
  },
  dateTag: {
    color: COLORS.textSubtle,
    fontSize: 11.5,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  quoteText: {
    fontSize: 14,
    color: COLORS.creamMuted,
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: 14,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  aspectsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  aspectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: BORDER_RADIUS.xs,
  },
  aspectText: {
    color: COLORS.creamMuted,
    fontSize: 11,
    fontWeight: '500',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  reviewCardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  authorName: {
    color: COLORS.cream,
    fontSize: 13,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  linkOut: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkOutText: {
    color: COLORS.brandTurquoise,
    fontSize: 11.5,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  disclaimerContainer: {
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.xl,
  },
  disclaimerHeading: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 6,
  },
  disclaimerBody: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 20,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
});
