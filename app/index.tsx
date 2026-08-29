import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
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
  Users, 
  Heart, 
  CheckCircle2,
  ExternalLink,
  Camera
} from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../src/theme';
import { useSettings } from '../src/context/SettingsContext';
import { MenuCard } from '../src/components/menu/MenuCard';
import { BrandLogo } from '../src/components/ui/BrandLogo';
import { analytics } from '../src/services/analytics';

export default function HomePage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { settings, categories, menuItems, galleryItems, verifiedReviews } = useSettings();

  // Responsive Breakpoints
  const isSmallMobile = width < 380;
  const isMobile = width < 600;
  const isTablet = width >= 600 && width < 900;
  const isDesktop = width >= 900;

  // Filter featured chef specials (Distinct dish-specific culinary presentation)
  const featuredItems = menuItems.filter((i) => i.isFeatured && (i.image_url || i.image)).slice(0, 6);

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
      <View style={[styles.heroSection, isMobile && styles.heroSectionMobile]}>
        <Image
          source={{ uri: '/photos/storefront_signboard.jpg' }}
          style={styles.heroBackgroundImage}
          resizeMode="cover"
        />
        <View style={styles.heroOverlay} />

        <View style={styles.heroContent}>
          {/* Brand Logo */}
          <View style={styles.heroLogoWrapper}>
            <BrandLogo 
              variant="primary" 
              size={isSmallMobile ? 'md' : isMobile ? 'lg' : 'xl'} 
            />
          </View>

          {/* Status & Location Badges */}
          <View style={styles.heroBadgeRow}>
            <View style={styles.heroBadge}>
              <MapPin size={11} color={COLORS.brandTurquoise} style={{ marginRight: 4 }} />
              <Text style={styles.heroBadgeText}>{settings.plusCode}</Text>
            </View>

            <View style={styles.heroBadge}>
              <Clock size={11} color={COLORS.brandTurquoise} style={{ marginRight: 4 }} />
              <Text style={styles.heroBadgeText}>Open Daily • 12 PM – 12 AM</Text>
            </View>

            <View style={[styles.heroBadge, { borderColor: COLORS.gold + '60' }]}>
              <Star size={11} color={COLORS.gold} fill={COLORS.gold} style={{ marginRight: 4 }} />
              <Text style={styles.heroBadgeText}>Google {settings.googleRating} ★ ({settings.googleReviewsCount}+ Reviews)</Text>
            </View>
          </View>

          {/* Responsive Headline */}
          <Text style={[
            styles.heroTitle, 
            isSmallMobile && styles.heroTitleSmallMobile, 
            isMobile && !isSmallMobile && styles.heroTitleMobile,
            isTablet && styles.heroTitleTablet
          ]}>
            Good Food. Warm Moments. Made with Love.
          </Text>

          {/* Short Description */}
          <Text style={[styles.heroSubtitle, isMobile && styles.heroSubtitleMobile]}>
            Welcome to Dream Love Cafe & Restaurant — a local dining destination in Contai serving comforting favourites, Indian classics, tandoori dishes, biryani, Chinese dishes, and refreshing drinks.
          </Text>

          {/* Cuisine Highlights */}
          <View style={styles.cuisineCapsuleRow}>
            {settings.cuisines.map((c, i) => (
              <React.Fragment key={c}>
                <Text style={styles.cuisineCapsuleText}>{c.toUpperCase()}</Text>
                {i < settings.cuisines.length - 1 && <Text style={styles.bulletDot}>•</Text>}
              </React.Fragment>
            ))}
          </View>

          {/* Responsive CTAs */}
          <View style={[styles.heroCtaContainer, isMobile && styles.heroCtaContainerMobile]}>
            <TouchableOpacity
              style={[styles.heroBtn, styles.heroPrimaryBtn, isMobile && styles.heroBtnFullWidth]}
              onPress={() => router.push('/menu')}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Explore our complete menu"
            >
              <Utensils size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.heroPrimaryBtnText}>Explore Menu</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.heroBtn, styles.heroSecondaryBtn, isMobile && styles.heroBtnFullWidth]}
              onPress={handleOpenMaps}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Get driving directions to restaurant"
            >
              <MapPin size={16} color={COLORS.brandTurquoise} style={{ marginRight: 6 }} />
              <Text style={styles.heroSecondaryBtnText}>Get Directions</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.heroBtn, styles.heroBookBtn, isMobile && styles.heroBtnFullWidth]}
              onPress={() => {
                analytics.track('reservation_started');
                router.push('/book');
              }}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Reserve a table online"
            >
              <Text style={styles.heroBookBtnText}>Book Table</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 2. AUTHENTIC STORY SECTION */}
      <View style={styles.storySection}>
        <View style={styles.sectionInner}>
          <View style={[styles.storyFlex, isMobile && styles.storyFlexMobile]}>
            
            {/* Story Text */}
            <View style={styles.storyTextCol}>
              <View style={styles.sectionHeaderBadge}>
                <Sparkles size={14} color={COLORS.brandTurquoise} style={{ marginRight: 6 }} />
                <Text style={styles.sectionHeaderBadgeText}>LOCAL DINING DESTINATION</Text>
              </View>
              
              <Text style={styles.storyHeading}>About Dream Love Cafe & Restaurant</Text>
              
              <Text style={styles.storyParagraph}>
                Dream Love Cafe & Restaurant is a local dining destination in Contai where guests can enjoy a broad selection of Indian, tandoori, biryani, Chinese and cafe-style favourites in a casual setting.
              </Text>
              
              <Text style={styles.storyParagraph}>
                Conveniently located in Kishore Nagar Garh on Contai Bypass Road (near the Central Bus Stand, opposite Jawed Habib's), we offer spacious air-conditioned seating for families, couples, and group gatherings, with prompt dine-in, takeaway, and delivery services.
              </Text>

              {/* Responsive Feature Cards */}
              <View style={[styles.storyFeatureGrid, isMobile && styles.storyFeatureGridMobile]}>
                <View style={styles.storyFeatureItem}>
                  <Users size={18} color={COLORS.brandTurquoise} style={{ marginBottom: 6 }} />
                  <Text style={styles.storyFeatureTitle}>Family Friendly</Text>
                  <Text style={styles.storyFeatureSub}>Comfortable multi-cuisine dining with AC seating</Text>
                </View>

                <View style={styles.storyFeatureItem}>
                  <Heart size={18} color={COLORS.brandHeart} style={{ marginBottom: 6 }} />
                  <Text style={styles.storyFeatureTitle}>Fresh Daily Prep</Text>
                  <Text style={styles.storyFeatureSub}>Authentic spices, fresh ingredients, crafted with care</Text>
                </View>

                <View style={styles.storyFeatureItem}>
                  <CheckCircle2 size={18} color={COLORS.brandTurquoise} style={{ marginBottom: 6 }} />
                  <Text style={styles.storyFeatureTitle}>3 Dining Modes</Text>
                  <Text style={styles.storyFeatureSub}>Dine-in • Takeaway • Fast Delivery</Text>
                </View>
              </View>
            </View>

            {/* Real Interior Dining Photo */}
            <View style={styles.storyImageCol}>
              <Image
                source={{ uri: '/photos/interior_dining_counter.jpg' }}
                style={[styles.storyMainImage, isMobile && styles.storyMainImageMobile]}
                resizeMode="cover"
              />
              <View style={styles.storyBadgeCard}>
                <Text style={styles.storyBadgeNum}>₹200–₹400</Text>
                <Text style={styles.storyBadgeLabel}>Average price for two</Text>
              </View>
            </View>

          </View>
        </View>
      </View>

      {/* 3. REAL RESTAURANT PHOTOGRAPHS */}
      <View style={styles.galleryPreviewSection}>
        <View style={styles.sectionInner}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionSubtitle}>REAL ATMOSPHERE</Text>
              <Text style={styles.sectionTitle}>Real Restaurant Photographs</Text>
            </View>

            <TouchableOpacity
              style={styles.viewAllBtn}
              onPress={() => router.push('/gallery')}
            >
              <Camera size={15} color={COLORS.brandTurquoise} style={{ marginRight: 4 }} />
              <Text style={styles.viewAllBtnText}>Full Gallery</Text>
              <ChevronRight size={15} color={COLORS.brandTurquoise} />
            </TouchableOpacity>
          </View>

          <View style={styles.realPhotosGrid}>
            {galleryItems.map((photo) => (
              <TouchableOpacity
                key={photo.id}
                style={[
                  styles.realPhotoCard, 
                  isMobile && styles.realPhotoCardMobile,
                  isTablet && styles.realPhotoCardTablet
                ]}
                onPress={() => router.push('/gallery')}
                activeOpacity={0.9}
              >
                <Image
                  source={{ uri: photo.image_url }}
                  style={styles.realPhotoImage}
                  resizeMode="cover"
                />
                <View style={styles.realPhotoOverlay}>
                  <Text style={styles.realPhotoCategory}>{photo.category}</Text>
                  <Text style={styles.realPhotoTitle} numberOfLines={1}>{photo.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* 4. CUISINE EXPLORER */}
      <View style={styles.cuisineSection}>
        <View style={styles.sectionInner}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionSubtitle}>EXPLORE OUR MENU</Text>
            <Text style={styles.sectionTitle}>Interactive Cuisine Explorer</Text>
          </View>

          <View style={styles.cuisineGrid}>
            {categories.map((cat) => {
              const count = menuItems.filter((i) => i.category === cat.slug).length;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.cuisineCard,
                    isMobile && styles.cuisineCardMobile,
                    isTablet && styles.cuisineCardTablet
                  ]}
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
                      <Text style={styles.cuisineCardLinkText}>Explore Category</Text>
                      <ChevronRight size={13} color={COLORS.brandTurquoise} />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      {/* 5. FEATURED MENU SPECIALS */}
      <View style={styles.specialsSection}>
        <View style={styles.sectionInner}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionSubtitle}>POPULAR PICKS</Text>
              <Text style={styles.sectionTitle}>Featured Dishes & Specials</Text>
            </View>

            {!isMobile && (
              <TouchableOpacity
                style={styles.viewAllBtn}
                onPress={() => router.push('/menu')}
              >
                <Text style={styles.viewAllBtnText}>View Full Menu</Text>
                <ChevronRight size={15} color={COLORS.brandTurquoise} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.menuGrid}>
            {featuredItems.map((item) => (
              <View 
                key={item.id} 
                style={[
                  styles.menuGridCol,
                  isMobile && styles.menuGridColMobile,
                  isTablet && styles.menuGridColTablet
                ]}
              >
                <MenuCard item={item} />
              </View>
            ))}
          </View>

          {isMobile && (
            <TouchableOpacity
              style={[styles.viewAllBtn, { marginTop: 16, alignSelf: 'center', paddingVertical: 8 }]}
              onPress={() => router.push('/menu')}
            >
              <Text style={styles.viewAllBtnText}>View Full Menu ({menuItems.length} Dishes)</Text>
              <ChevronRight size={15} color={COLORS.brandTurquoise} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 6. VERIFIED PUBLIC REVIEWS & RATINGS */}
      <View style={styles.reviewsBannerSection}>
        <View style={styles.sectionInner}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionSubtitle}>AUTHENTIC FEEDBACK</Text>
            <Text style={styles.sectionTitle}>Verified Guest Ratings & Reviews</Text>
          </View>

          <View style={styles.reviewCardsGrid}>
            {verifiedReviews.map((rev) => (
              <TouchableOpacity
                key={rev.id}
                style={[
                  styles.verifiedReviewCard,
                  isMobile && styles.verifiedReviewCardMobile,
                  isTablet && styles.verifiedReviewCardTablet
                ]}
                onPress={() => Linking.openURL(rev.externalReviewUrl)}
                activeOpacity={0.85}
              >
                <View style={styles.revHeaderRow}>
                  <View style={styles.revSourceBadge}>
                    <Text style={styles.revSourceText}>{rev.source} Listing</Text>
                  </View>
                  <View style={styles.revRatingRow}>
                    <Star size={13} color={COLORS.gold} fill={COLORS.gold} />
                    <Text style={styles.revRatingNum}>{rev.rating}.0</Text>
                  </View>
                </View>

                <Text style={styles.revQuote}>"{rev.reviewText}"</Text>

                <View style={styles.revFooterRow}>
                  <Text style={styles.revAuthor}>{rev.reviewerName}</Text>
                  <View style={styles.revExternalLink}>
                    <Text style={styles.revExternalText}>Source Link</Text>
                    <ExternalLink size={11} color={COLORS.brandTurquoise} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* 7. VISIT US & LOCATION DETAILS */}
      <View style={styles.visitSection}>
        <View style={styles.sectionInner}>
          <View style={[styles.visitGrid, isMobile && styles.visitGridMobile]}>
            
            {/* Location Details */}
            <View style={styles.visitTextCol}>
              <Text style={styles.sectionSubtitle}>FIND US IN CONTAI</Text>
              <Text style={styles.visitTitle}>Visit Dream Love Cafe & Restaurant</Text>

              <View style={styles.visitDetailItem}>
                <MapPin size={18} color={COLORS.brandTurquoise} style={styles.visitIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.visitDetailTitle}>Exact Address</Text>
                  <Text style={styles.visitDetailText}>{settings.address}</Text>
                  <Text style={styles.visitLandmark}>Landmark: Opposite Jawed Habib's, near Central Bus Stand</Text>
                  <Text style={styles.visitPlusCode}>Plus Code: {settings.plusCode}</Text>
                </View>
              </View>

              <View style={styles.visitDetailItem}>
                <Clock size={18} color={COLORS.brandTurquoise} style={styles.visitIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.visitDetailTitle}>Operating Hours</Text>
                  <Text style={styles.visitDetailText}>{settings.openingHours}</Text>
                  <Text style={styles.visitLandmark}>Open 7 Days a Week for Dine-in, Takeaway & Delivery</Text>
                </View>
              </View>

              <View style={[styles.visitActionRow, isMobile && styles.visitActionRowMobile]}>
                <TouchableOpacity style={[styles.directionsBtn, isMobile && { width: '100%' }]} onPress={handleOpenMaps}>
                  <MapPin size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.directionsBtnText}>Get Directions</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.callBtn, isMobile && { width: '100%' }]} onPress={handleCall}>
                  <Phone size={15} color={COLORS.cream} style={{ marginRight: 6 }} />
                  <Text style={styles.callBtnText}>Call Restaurant</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.waBtn, isMobile && { width: '100%' }]} onPress={handleWhatsApp}>
                  <MessageSquare size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.waBtnText}>WhatsApp Order</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick Dining & Booking Box */}
            <View style={styles.diningModesBox}>
              <Text style={styles.diningModesTitle}>Dining Options</Text>

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
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: SPACING.md,
  },

  // HERO STYLES
  heroSection: {
    minHeight: 520,
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    backgroundColor: COLORS.background,
  },
  heroSectionMobile: {
    minHeight: 'auto' as any,
    paddingVertical: SPACING.lg,
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
    backgroundColor: 'rgba(18, 15, 14, 0.78)',
  },
  heroContent: {
    maxWidth: 820,
    width: '100%',
    alignItems: 'center',
    textAlign: 'center',
    paddingHorizontal: SPACING.md,
    zIndex: 10,
  },
  heroLogoWrapper: {
    marginBottom: SPACING.sm,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 22, 21, 0.88)',
    borderWidth: 1,
    borderColor: COLORS.brandGreen + '80',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
  },
  heroBadgeText: {
    color: COLORS.cream,
    fontSize: 11,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: '800',
    color: COLORS.cream,
    textAlign: 'center',
    lineHeight: 50,
    marginBottom: SPACING.sm,
    fontFamily: TYPOGRAPHY.fontFamilySerif,
  },
  heroTitleTablet: {
    fontSize: 34,
    lineHeight: 42,
  },
  heroTitleMobile: {
    fontSize: 27,
    lineHeight: 33,
    marginBottom: 8,
  },
  heroTitleSmallMobile: {
    fontSize: 23,
    lineHeight: 29,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 15,
    color: COLORS.creamMuted,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 680,
    marginBottom: SPACING.sm,
  },
  heroSubtitleMobile: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 8,
  },
  cuisineCapsuleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginBottom: SPACING.md,
  },
  cuisineCapsuleText: {
    color: COLORS.brandTurquoise,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  bulletDot: {
    color: COLORS.textSubtle,
    fontSize: 11,
  },
  heroCtaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    width: '100%',
    marginTop: 4,
  },
  heroCtaContainerMobile: {
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: 340,
  },
  heroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
    minHeight: 44,
  },
  heroBtnFullWidth: {
    width: '100%',
  },
  heroPrimaryBtn: {
    backgroundColor: COLORS.brandHeart,
    shadowColor: COLORS.brandHeart,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  heroPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  heroSecondaryBtn: {
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.brandTurquoise,
  },
  heroSecondaryBtnText: {
    color: COLORS.cream,
    fontSize: 14,
    fontWeight: '600',
  },
  heroBookBtn: {
    backgroundColor: COLORS.brandGreen,
  },
  heroBookBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  // STORY SECTION STYLES
  storySection: {
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  storyFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xl,
  },
  storyFlexMobile: {
    flexDirection: 'column',
    gap: SPACING.lg,
  },
  storyTextCol: {
    flex: 1.1,
  },
  sectionHeaderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  sectionHeaderBadgeText: {
    color: COLORS.brandTurquoise,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  storyHeading: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: SPACING.sm,
    fontFamily: TYPOGRAPHY.fontFamilySerif,
  },
  storyParagraph: {
    color: COLORS.creamMuted,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: SPACING.sm,
  },
  storyFeatureGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: SPACING.sm,
  },
  storyFeatureGridMobile: {
    flexDirection: 'column',
    gap: 8,
  },
  storyFeatureItem: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    flex: 1,
  },
  storyFeatureTitle: {
    color: COLORS.cream,
    fontSize: 13.5,
    fontWeight: '700',
    marginBottom: 2,
  },
  storyFeatureSub: {
    color: COLORS.textMuted,
    fontSize: 11.5,
    lineHeight: 16,
  },
  storyImageCol: {
    flex: 0.9,
    width: '100%',
    position: 'relative',
  },
  storyMainImage: {
    width: '100%',
    height: 320,
    borderRadius: BORDER_RADIUS.lg,
  },
  storyMainImageMobile: {
    height: 220,
  },
  storyBadgeCard: {
    position: 'absolute',
    bottom: -10,
    left: 16,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.md,
  },
  storyBadgeNum: {
    color: COLORS.gold,
    fontSize: 15,
    fontWeight: '800',
  },
  storyBadgeLabel: {
    color: COLORS.textMuted,
    fontSize: 10.5,
  },

  // GALLERY PREVIEW STYLES
  galleryPreviewSection: {
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.surfaceElevated,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: SPACING.lg,
  },
  sectionSubtitle: {
    color: COLORS.brandTurquoise,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.cream,
    fontFamily: TYPOGRAPHY.fontFamilySerif,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllBtnText: {
    color: COLORS.brandTurquoise,
    fontSize: 13,
    fontWeight: '600',
  },
  realPhotosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  realPhotoCard: {
    width: '23.8%',
    height: 200,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: COLORS.surface,
  },
  realPhotoCardTablet: {
    width: '48.5%',
  },
  realPhotoCardMobile: {
    width: '100%',
    height: 190,
  },
  realPhotoImage: {
    width: '100%',
    height: '100%',
  },
  realPhotoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.sm,
    backgroundColor: 'rgba(18, 15, 14, 0.75)',
  },
  realPhotoCategory: {
    color: COLORS.brandTurquoise,
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  realPhotoTitle: {
    color: COLORS.cream,
    fontSize: 12.5,
    fontWeight: '600',
    marginTop: 1,
  },

  // CUISINE EXPLORER STYLES
  cuisineSection: {
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  cuisineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cuisineCard: {
    width: '31.8%',
    height: 190,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  cuisineCardTablet: {
    width: '48.5%',
  },
  cuisineCardMobile: {
    width: '100%',
    height: 160,
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
    backgroundColor: 'rgba(18, 15, 14, 0.60)',
  },
  cuisineCardContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: SPACING.md,
    justifyContent: 'flex-end',
  },
  cuisineCountBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: 'rgba(18, 15, 14, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.sm,
  },
  cuisineCountText: {
    color: COLORS.gold,
    fontSize: 10.5,
    fontWeight: '700',
  },
  cuisineCardName: {
    color: COLORS.cream,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 2,
  },
  cuisineCardDesc: {
    color: COLORS.creamMuted,
    fontSize: 11.5,
    lineHeight: 15,
    marginBottom: 6,
  },
  cuisineCardLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cuisineCardLinkText: {
    color: COLORS.brandTurquoise,
    fontSize: 11.5,
    fontWeight: '600',
  },

  // SPECIALS STYLES
  specialsSection: {
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.surface,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  menuGridCol: {
    width: '32%',
  },
  menuGridColTablet: {
    width: '48.5%',
  },
  menuGridColMobile: {
    width: '100%',
  },

  // REVIEWS BANNER STYLES
  reviewsBannerSection: {
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  reviewCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  verifiedReviewCard: {
    width: '32%',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'space-between',
  },
  verifiedReviewCardTablet: {
    width: '48.5%',
  },
  verifiedReviewCardMobile: {
    width: '100%',
  },
  revHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  revSourceBadge: {
    backgroundColor: COLORS.surfaceElevated,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  revSourceText: {
    color: COLORS.brandTurquoise,
    fontSize: 10.5,
    fontWeight: '700',
  },
  revRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  revRatingNum: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '700',
  },
  revQuote: {
    color: COLORS.creamMuted,
    fontSize: 13,
    lineHeight: 19,
    fontStyle: 'italic',
    marginBottom: SPACING.md,
  },
  revFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  revAuthor: {
    color: COLORS.cream,
    fontSize: 12,
    fontWeight: '600',
  },
  revExternalLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  revExternalText: {
    color: COLORS.brandTurquoise,
    fontSize: 11,
  },

  // VISIT SECTION STYLES
  visitSection: {
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.surfaceElevated,
  },
  visitGrid: {
    flexDirection: 'row',
    gap: SPACING.xl,
  },
  visitGridMobile: {
    flexDirection: 'column',
    gap: SPACING.lg,
  },
  visitTextCol: {
    flex: 1.3,
  },
  visitTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: SPACING.md,
    fontFamily: TYPOGRAPHY.fontFamilySerif,
  },
  visitDetailItem: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  visitIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  visitDetailTitle: {
    color: COLORS.copper,
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  visitDetailText: {
    color: COLORS.cream,
    fontSize: 13,
    lineHeight: 18,
  },
  visitLandmark: {
    color: COLORS.textMuted,
    fontSize: 11.5,
    marginTop: 2,
  },
  visitPlusCode: {
    color: COLORS.gold,
    fontSize: 11.5,
    fontWeight: '600',
    marginTop: 2,
  },
  visitActionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: SPACING.sm,
  },
  visitActionRowMobile: {
    flexDirection: 'column',
  },
  directionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.brandGreen,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.md,
  },
  directionsBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16A34A',
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
    flex: 0.9,
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'space-between',
  },
  diningModesTitle: {
    color: COLORS.cream,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  diningModeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  diningDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.brandTurquoise,
    marginRight: 8,
  },
  diningModeText: {
    color: COLORS.creamMuted,
    fontSize: 13,
  },
  diningBoxCta: {
    marginTop: SPACING.md,
  },
  diningBookBtn: {
    backgroundColor: COLORS.brandHeart,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  diningBookBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
