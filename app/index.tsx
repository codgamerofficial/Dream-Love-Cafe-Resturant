import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Linking, 
  useWindowDimensions, 
  Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  MapPin, 
  Clock, 
  Utensils, 
  Star, 
  ChevronRight, 
  Phone, 
  MessageSquare, 
  Sparkles, 
  Flame, 
  Users, 
  Heart, 
  Award 
} from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../src/theme';
import { useSettings } from '../src/context/SettingsContext';
import { MenuCard } from '../src/components/menu/MenuCard';
import { analytics } from '../src/services/analytics';

export default function HomePage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { settings, categories, menuItems, customerStories } = useSettings();
  const isDesktop = width >= 768;

  // Filter chef specials for home section
  const chefSpecials = menuItems.filter((i) => i.category === 'chef-specials' || i.isFeatured).slice(0, 8);

  const handleOpenMaps = () => {
    analytics.track('directions_click');
    Linking.openURL(settings.googleMapsUrl);
  };

  const handleCall = () => {
    analytics.track('call_click');
    Linking.openURL(`tel:${settings.phone.replace(/[^0-9+]/g, '')}`);
  };

  const handleWhatsApp = () => {
    analytics.track('whatsapp_click');
    Linking.openURL(`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`);
  };

  return (
    <View style={styles.container}>
      {/* 1. HERO SECTION */}
      <View style={styles.heroSection}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80' }}
          style={styles.heroBackgroundImage}
          resizeMode="cover"
        />
        <View style={styles.heroOverlay} />

        <View style={styles.heroContent}>
          {/* Status Badges */}
          <View style={styles.heroBadgeRow}>
            <View style={styles.heroBadge}>
              <MapPin size={12} color={COLORS.gold} style={{ marginRight: 4 }} />
              <Text style={styles.heroBadgeText}>{settings.plusCode}</Text>
            </View>

            <View style={styles.heroBadge}>
              <Clock size={12} color={COLORS.gold} style={{ marginRight: 4 }} />
              <Text style={styles.heroBadgeText}>Open daily • 12 PM - Midnight</Text>
            </View>
          </View>

          {/* Main Title & Tagline */}
          <Text style={styles.heroPreTitle}>MULTI-CUISINE FAMILY CAFE & RESTAURANT</Text>
          <Text style={styles.heroTitle}>DREAM LOVE</Text>

          <View style={styles.cuisineCapsuleRow}>
            {settings.cuisines.map((c, i) => (
              <React.Fragment key={c}>
                <Text style={styles.cuisineCapsuleText}>{c.toUpperCase()}</Text>
                {i < settings.cuisines.length - 1 && <Text style={styles.bulletDot}>•</Text>}
              </React.Fragment>
            ))}
          </View>

          <Text style={styles.heroSubtitle}>
            A rich dining experience in the heart of Contai. Authentic recipes, sizzling tandoori plates, flavorful biryanis, and cozy evening moments for family and friends.
          </Text>

          {/* CTAs */}
          <View style={styles.heroCtaRow}>
            <TouchableOpacity
              style={styles.heroPrimaryBtn}
              onPress={() => router.push('/menu')}
              activeOpacity={0.85}
            >
              <Utensils size={18} color={COLORS.background} style={{ marginRight: 8 }} />
              <Text style={styles.heroPrimaryBtnText}>Explore Menu</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.heroSecondaryBtn}
              onPress={() => {
                analytics.track('reservation_started');
                router.push('/book');
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.heroSecondaryBtnText}>Reserve a Table</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 2. STORY SECTION ("Made for moments.") */}
      <View style={styles.storySection}>
        <View style={styles.sectionInner}>
          <View style={[styles.storyFlex, !isDesktop && styles.storyFlexMobile]}>
            
            {/* Story Text */}
            <View style={styles.storyTextCol}>
              <View style={styles.sectionHeaderBadge}>
                <Sparkles size={14} color={COLORS.copper} style={{ marginRight: 6 }} />
                <Text style={styles.sectionHeaderBadgeText}>THE EXPERIENCE</Text>
              </View>
              
              <Text style={styles.storyHeading}>Made for moments.</Text>
              
              <Text style={styles.storyParagraph}>
                At Dream Love Cafe & Restaurant, dining is about more than just great food — it's about sharing warmth, laughter, and memorable evenings with the people who matter most.
              </Text>
              
              <Text style={styles.storyParagraph}>
                Whether you're gathering with family for a weekend feast, sharing biryani with lifelong friends, or enjoying a cozy coffee date, our warm Midnight Café atmosphere and carefully crafted multi-cuisine menu create the perfect setting.
              </Text>

              <View style={styles.storyFeatureGrid}>
                <View style={styles.storyFeatureItem}>
                  <Users size={20} color={COLORS.copper} style={{ marginBottom: 6 }} />
                  <Text style={styles.storyFeatureTitle}>Family Dining</Text>
                  <Text style={styles.storyFeatureSub}>Welcoming space for all ages</Text>
                </View>

                <View style={styles.storyFeatureItem}>
                  <Heart size={20} color={COLORS.copper} style={{ marginBottom: 6 }} />
                  <Text style={styles.storyFeatureTitle}>Fresh Ingredients</Text>
                  <Text style={styles.storyFeatureSub}>Handcrafted daily with care</Text>
                </View>
              </View>
            </View>

            {/* Story Imagery Composition */}
            <View style={styles.storyImageCol}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80' }}
                style={styles.storyMainImage}
                resizeMode="cover"
              />
              <View style={styles.storyBadgeCard}>
                <Text style={styles.storyBadgeNum}>₹200–₹400</Text>
                <Text style={styles.storyBadgeLabel}>Price for two</Text>
              </View>
            </View>

          </View>
        </View>
      </View>

      {/* 3. CUISINE EXPLORER */}
      <View style={styles.cuisineSection}>
        <View style={styles.sectionInner}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionSubtitle}>EXPLORE OUR FLAVORS</Text>
            <Text style={styles.sectionTitle}>Interactive Cuisine Explorer</Text>
          </View>

          <View style={[styles.cuisineGrid, !isDesktop && styles.cuisineGridMobile]}>
            {categories.map((cat) => {
              const count = menuItems.filter((i) => i.category === cat.slug).length;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.cuisineCard}
                  onPress={() => router.push(`/menu?category=${cat.slug}` as any)}
                  activeOpacity={0.88}
                >
                  <Image
                    source={{ uri: cat.image }}
                    style={styles.cuisineCardImage}
                    resizeMode="cover"
                  />
                  <View style={styles.cuisineCardOverlay} />

                  <View style={styles.cuisineCardContent}>
                    <View style={styles.cuisineCountBadge}>
                      <Text style={styles.cuisineCountText}>{count} Items</Text>
                    </View>

                    <Text style={styles.cuisineCardName}>{cat.name}</Text>
                    <Text style={styles.cuisineCardDesc} numberOfLines={2}>
                      {cat.description}
                    </Text>

                    <View style={styles.cuisineCardLinkRow}>
                      <Text style={styles.cuisineCardLinkText}>View Category</Text>
                      <ChevronRight size={14} color={COLORS.copper} />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      {/* 4. CHEF SPECIALS & SIGNATURE DISHES */}
      <View style={styles.specialsSection}>
        <View style={styles.sectionInner}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionSubtitle}>HOUSE RECOMMENDATIONS</Text>
              <Text style={styles.sectionTitle}>Chef Specials & Favorites</Text>
            </View>

            {isDesktop && (
              <TouchableOpacity
                style={styles.viewAllBtn}
                onPress={() => router.push('/menu')}
              >
                <Text style={styles.viewAllBtnText}>View Full Menu</Text>
                <ChevronRight size={16} color={COLORS.copper} />
              </TouchableOpacity>
            )}
          </View>

          <View style={[styles.menuGrid, !isDesktop && styles.menuGridMobile]}>
            {chefSpecials.map((item) => (
              <View key={item.id} style={[styles.menuGridCol, !isDesktop && styles.menuGridColMobile]}>
                <MenuCard item={item} />
              </View>
            ))}
          </View>

          {!isDesktop && (
            <TouchableOpacity
              style={[styles.viewAllBtn, { marginTop: 16, alignSelf: 'center' }]}
              onPress={() => router.push('/menu')}
            >
              <Text style={styles.viewAllBtnText}>View Full Menu</Text>
              <ChevronRight size={16} color={COLORS.copper} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 5. VERIFIED GOOGLE REVIEWS BANNER */}
      <View style={styles.reviewsBannerSection}>
        <View style={styles.sectionInner}>
          <View style={[styles.reviewsBannerCard, !isDesktop && styles.reviewsBannerCardMobile]}>
            
            {/* Rating Summary */}
            <View style={styles.ratingBox}>
              <View style={styles.ratingNumberRow}>
                <Text style={styles.ratingNumber}>{settings.googleRating}</Text>
                <Star size={28} color={COLORS.gold} fill={COLORS.gold} style={{ marginLeft: 6 }} />
              </View>

              <Text style={styles.ratingCountText}>
                Based on {settings.googleReviewsCount} verified Google reviews
              </Text>

              <TouchableOpacity
                style={styles.googleReviewBtn}
                onPress={() => Linking.openURL(settings.googleReviewsUrl)}
              >
                <Text style={styles.googleReviewBtnText}>View Google Reviews</Text>
                <ChevronRight size={14} color={COLORS.gold} />
              </TouchableOpacity>
            </View>

            {/* Featured Customer Story */}
            <View style={styles.storyReviewBox}>
              <Text style={styles.storyReviewBadge}>GUEST TESTIMONIAL</Text>
              <Text style={styles.storyReviewText}>
                "{customerStories[0]?.text}"
              </Text>
              <Text style={styles.storyReviewAuthor}>
                — {customerStories[0]?.author} ({customerStories[0]?.date})
              </Text>
            </View>

          </View>
        </View>
      </View>

      {/* 6. VISIT US / CONTACT HIGHLIGHT */}
      <View style={styles.visitSection}>
        <View style={styles.sectionInner}>
          <View style={[styles.visitGrid, !isDesktop && styles.visitGridMobile]}>
            
            {/* Location Details */}
            <View style={styles.visitTextCol}>
              <Text style={styles.sectionSubtitle}>FIND US IN CONTAI</Text>
              <Text style={styles.visitTitle}>Visit Dream Love Cafe & Restaurant</Text>

              <View style={styles.visitDetailItem}>
                <MapPin size={20} color={COLORS.copper} style={styles.visitIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.visitDetailTitle}>Address</Text>
                  <Text style={styles.visitDetailText}>{settings.address}</Text>
                  <Text style={styles.visitPlusCode}>Plus Code: {settings.plusCode}</Text>
                </View>
              </View>

              <View style={styles.visitDetailItem}>
                <Clock size={20} color={COLORS.copper} style={styles.visitIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.visitDetailTitle}>Opening Hours</Text>
                  <Text style={styles.visitDetailText}>{settings.openingHours}</Text>
                </View>
              </View>

              <View style={styles.visitActionRow}>
                <TouchableOpacity style={styles.directionsBtn} onPress={handleOpenMaps}>
                  <MapPin size={16} color={COLORS.background} style={{ marginRight: 6 }} />
                  <Text style={styles.directionsBtnText}>Get Directions</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
                  <Phone size={16} color={COLORS.cream} style={{ marginRight: 6 }} />
                  <Text style={styles.callBtnText}>Call Now</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.waBtn} onPress={handleWhatsApp}>
                  <MessageSquare size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.waBtnText}>WhatsApp</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick Dining Modes Info */}
            <View style={styles.diningModesBox}>
              <Text style={styles.diningModesTitle}>Available Dining Modes</Text>

              {settings.diningModes.map((mode) => (
                <View key={mode} style={styles.diningModeItem}>
                  <View style={styles.diningDot} />
                  <Text style={styles.diningModeText}>{mode}</Text>
                </View>
              ))}

              <View style={styles.diningBoxCta}>
                <TouchableOpacity
                  style={styles.diningBookBtn}
                  onPress={() => router.push('/book')}
                >
                  <Text style={styles.diningBookBtnText}>Book a Table Online</Text>
                </TouchableOpacity>
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
  sectionInner: {
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: SPACING.md,
  },
  
  // Hero Styles
  heroSection: {
    minHeight: 560,
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    backgroundColor: COLORS.background,
  },
  heroBackgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(18, 15, 14, 0.88)',
  },
  heroContent: {
    maxWidth: 900,
    width: '100%',
    alignItems: 'center',
    textAlign: 'center',
    paddingHorizontal: SPACING.md,
    zIndex: 10,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 22, 21, 0.85)',
    borderWidth: 1,
    borderColor: COLORS.copper + '60',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BORDER_RADIUS.full,
  },
  heroBadgeText: {
    color: COLORS.creamMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  heroPreTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.copper,
    letterSpacing: 3,
    marginBottom: 8,
  },
  heroTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: Platform.OS === 'web' ? 52 : 36,
    fontWeight: '900',
    color: COLORS.cream,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 8,
  },
  cuisineCapsuleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: SPACING.md,
  },
  cuisineCapsuleText: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
  },
  bulletDot: {
    color: COLORS.copper,
    marginHorizontal: 8,
  },
  heroSubtitle: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.textMuted,
    textAlign: 'center',
    maxWidth: 680,
    marginBottom: SPACING.xl,
  },
  heroCtaRow: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  heroPrimaryBtn: {
    backgroundColor: COLORS.copper,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.glowCopper,
  },
  heroPrimaryBtnText: {
    color: COLORS.background,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroSecondaryBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.cream,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.md,
  },
  heroSecondaryBtnText: {
    color: COLORS.cream,
    fontSize: 15,
    fontWeight: '700',
  },

  // Story Styles
  storySection: {
    paddingVertical: SPACING.xxxl,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  storyFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 48,
  },
  storyFlexMobile: {
    flexDirection: 'column',
    gap: 32,
  },
  storyTextCol: {
    flex: 1,
  },
  sectionHeaderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionHeaderBadgeText: {
    color: COLORS.copper,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },
  storyHeading: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 34,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: SPACING.md,
  },
  storyParagraph: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  storyFeatureGrid: {
    flexDirection: 'row',
    gap: 20,
    marginTop: SPACING.sm,
  },
  storyFeatureItem: {
    backgroundColor: COLORS.surfaceElevated,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    flex: 1,
  },
  storyFeatureTitle: {
    color: COLORS.cream,
    fontSize: 14,
    fontWeight: '700',
  },
  storyFeatureSub: {
    color: COLORS.textSubtle,
    fontSize: 12,
    marginTop: 2,
  },
  storyImageCol: {
    flex: 1,
    position: 'relative',
    minHeight: 320,
    width: '100%',
  },
  storyMainImage: {
    width: '100%',
    height: 360,
    borderRadius: BORDER_RADIUS.xl,
  },
  storyBadgeCard: {
    position: 'absolute',
    bottom: -20,
    right: 20,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.copper,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.card,
  },
  storyBadgeNum: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.gold,
  },
  storyBadgeLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
  },

  // Cuisine Section
  cuisineSection: {
    paddingVertical: SPACING.xxxl,
    backgroundColor: COLORS.background,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  sectionSubtitle: {
    color: COLORS.copper,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 6,
    textAlign: 'center',
  },
  sectionTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.cream,
    textAlign: 'center',
  },
  cuisineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  cuisineGridMobile: {
    flexDirection: 'column',
    gap: 16,
  },
  cuisineCard: {
    flex: 1,
    minWidth: 280,
    height: 220,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
  },
  cuisineCardImage: {
    width: '100%',
    height: '100%',
  },
  cuisineCardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(18, 15, 14, 0.75)',
  },
  cuisineCardContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: SPACING.lg,
    justifyContent: 'flex-end',
  },
  cuisineCountBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: 'rgba(26, 22, 21, 0.85)',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  cuisineCountText: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '700',
  },
  cuisineCardName: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 4,
  },
  cuisineCardDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 16,
    marginBottom: 12,
  },
  cuisineCardLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cuisineCardLinkText: {
    color: COLORS.copper,
    fontSize: 13,
    fontWeight: '700',
    marginRight: 4,
  },

  // Specials Section
  specialsSection: {
    paddingVertical: SPACING.xxxl,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: SPACING.xxl,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  viewAllBtnText: {
    color: COLORS.cream,
    fontSize: 13,
    fontWeight: '600',
    marginRight: 4,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -10,
  },
  menuGridMobile: {
    flexDirection: 'column',
    marginHorizontal: 0,
  },
  menuGridCol: {
    width: '25%',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  menuGridColMobile: {
    width: '100%',
    paddingHorizontal: 0,
    marginBottom: 16,
  },

  // Reviews Banner
  reviewsBannerSection: {
    paddingVertical: SPACING.xxl,
    backgroundColor: COLORS.background,
  },
  reviewsBannerCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.copper + '40',
    padding: SPACING.xl,
    flexDirection: 'row',
    gap: 40,
    alignItems: 'center',
  },
  reviewsBannerCardMobile: {
    flexDirection: 'column',
    gap: 24,
  },
  ratingBox: {
    flex: 1,
    borderRightWidth: Platform.OS === 'web' ? 1 : 0,
    borderRightColor: COLORS.border,
    paddingRight: SPACING.md,
  },
  ratingNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingNumber: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.cream,
  },
  ratingCountText: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  googleReviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleReviewBtnText: {
    color: COLORS.gold,
    fontSize: 13,
    fontWeight: '700',
    marginRight: 4,
  },
  storyReviewBox: {
    flex: 1.5,
  },
  storyReviewBadge: {
    color: COLORS.copper,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  storyReviewText: {
    fontSize: 15,
    fontStyle: 'italic',
    lineHeight: 22,
    color: COLORS.creamMuted,
    marginBottom: 8,
  },
  storyReviewAuthor: {
    fontSize: 12,
    color: COLORS.textSubtle,
    fontWeight: '600',
  },

  // Visit Section
  visitSection: {
    paddingVertical: SPACING.xxxl,
    backgroundColor: COLORS.surface,
  },
  visitGrid: {
    flexDirection: 'row',
    gap: 40,
  },
  visitGridMobile: {
    flexDirection: 'column',
    gap: 32,
  },
  visitTextCol: {
    flex: 1.5,
  },
  visitTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: SPACING.xl,
  },
  visitDetailItem: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  visitIcon: {
    marginRight: 14,
    marginTop: 2,
  },
  visitDetailTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 2,
  },
  visitDetailText: {
    fontSize: 14,
    color: COLORS.textMuted,
    lineHeight: 20,
  },
  visitPlusCode: {
    fontSize: 12,
    color: COLORS.copper,
    marginTop: 4,
    fontWeight: '600',
  },
  visitActionRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    marginTop: SPACING.md,
  },
  directionsBtn: {
    backgroundColor: COLORS.copper,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.md,
  },
  directionsBtnText: {
    color: COLORS.background,
    fontSize: 13,
    fontWeight: '700',
  },
  callBtn: {
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.md,
  },
  callBtnText: {
    color: COLORS.cream,
    fontSize: 13,
    fontWeight: '600',
  },
  waBtn: {
    backgroundColor: '#25D366',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.md,
  },
  waBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  diningModesBox: {
    flex: 1,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
  },
  diningModesTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: SPACING.md,
  },
  diningModeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  diningDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.copper,
    marginRight: 10,
  },
  diningModeText: {
    color: COLORS.creamMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  diningBoxCta: {
    marginTop: SPACING.lg,
  },
  diningBookBtn: {
    backgroundColor: COLORS.copper + '20',
    borderWidth: 1,
    borderColor: COLORS.copper,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  diningBookBtnText: {
    color: COLORS.gold,
    fontSize: 14,
    fontWeight: '700',
  },
});
