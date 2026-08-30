import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Linking, 
  useWindowDimensions, 
  Platform,
  ScrollView 
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
  Camera,
  Calendar,
  Flame,
  Coffee,
  CookingPot,
  ArrowRight,
  ShieldCheck,
  Compass
} from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../src/theme';
import { useSettings } from '../src/context/SettingsContext';
import { MenuCard } from '../src/components/menu/MenuCard';
import { BrandLogo } from '../src/components/ui/BrandLogo';
import { analytics } from '../src/services/analytics';

export default function HomePage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { settings, categories, menuItems, verifiedReviews } = useSettings();

  // Responsive Breakpoints
  const isSmallMobile = width < 380;
  const isMobile = width < 600;
  const isTablet = width >= 600 && width < 920;
  const isDesktop = width >= 920;

  // Curated featured dishes
  const featuredItems = menuItems.filter((i) => i.isFeatured && (i.image_url || i.image)).slice(0, 6);

  // Real Client Photographs
  const realPhotos = [
    {
      title: 'Storefront & Neon Signboard',
      subtitle: 'Contai Bypass Road Entrance',
      image: '/photos/storefront_signboard.jpg',
    },
    {
      title: 'Cafe Lounge & Seating',
      subtitle: 'Comfortable Family Dining',
      image: '/photos/interior_cafe_lounge.jpg',
    },
    {
      title: 'Dining Counter & Kitchen',
      subtitle: 'Hygienic Service Area',
      image: '/photos/interior_dining_counter.jpg',
    },
    {
      title: 'Street View & Refreshment Kiosk',
      subtitle: 'Central Bus Stand Landmark',
      image: '/photos/exterior_street_view.jpg',
    },
  ];

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
      
      {/* ── 1. CINEMATIC FULL-WIDTH HERO ── */}
      <View style={[styles.heroSection, isMobile && styles.heroSectionMobile]}>
        <Image
          source={{ uri: '/photos/storefront_signboard.jpg' }}
          style={styles.heroBackgroundImage}
          resizeMode="cover"
        />
        <View style={styles.heroOverlay} />

        <View style={styles.heroContent}>
          {/* Brand Eyebrow */}
          <View style={styles.heroEyebrowRow}>
            <View style={styles.pulseLineLeft} />
            <Text style={styles.heroEyebrow}>DREAM LOVE CAFÉ & RESTAURANT</Text>
            <View style={styles.pulseLineRight} />
          </View>

          {/* Large Editorial Headline */}
          <Text style={[
            styles.heroTitle, 
            isSmallMobile && styles.heroTitleSmallMobile, 
            isMobile && !isSmallMobile && styles.heroTitleMobile,
            isTablet && styles.heroTitleTablet
          ]}>
            Good Food.{'\n'}Warm Moments.{'\n'}Made with Love.
          </Text>

          {/* Supporting Line */}
          <Text style={[styles.heroSubtitle, isMobile && styles.heroSubtitleMobile]}>
            An intimate multi-cuisine dining destination in Contai, West Bengal. Serving comforting Indian classics, tandoor favorites, authentic biryani, Chinese delicacies, and refreshing mocktails.
          </Text>

          {/* Primary Action Buttons */}
          <View style={[styles.heroCtaContainer, isMobile && styles.heroCtaContainerMobile]}>
            <TouchableOpacity
              style={[styles.heroBtn, styles.heroPrimaryBtn, isMobile && styles.heroBtnFullWidth]}
              onPress={() => router.push('/menu')}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Explore our complete menu"
            >
              <Utensils size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.heroPrimaryBtnText}>Explore Menu</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.heroBtn, styles.heroSecondaryBtn, isMobile && styles.heroBtnFullWidth]}
              onPress={() => router.push('/book')}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Reserve a table"
            >
              <Calendar size={16} color={COLORS.brandTurquoise} style={{ marginRight: 8 }} />
              <Text style={styles.heroSecondaryBtnText}>Reserve a Table</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.heroTextLink}
              onPress={handleOpenMaps}
              activeOpacity={0.8}
            >
              <Text style={styles.heroTextLinkContent}>Get Directions</Text>
              <ArrowRight size={14} color={COLORS.copperLight} style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>

          {/* Compact Trust Information Strip */}
          <View style={styles.heroTrustStrip}>
            <View style={styles.trustItem}>
              <MapPin size={13} color={COLORS.copper} style={{ marginRight: 5 }} />
              <Text style={styles.trustItemText}>Central Bus Stand, Contai</Text>
            </View>
            <Text style={styles.trustDivider}>•</Text>
            <View style={styles.trustItem}>
              <Clock size={13} color={COLORS.brandTurquoise} style={{ marginRight: 5 }} />
              <Text style={styles.trustItemText}>12:00 PM – 12:00 AM Daily</Text>
            </View>
            <Text style={styles.trustDivider}>•</Text>
            <View style={styles.trustItem}>
              <Star size={13} color={COLORS.gold} fill={COLORS.gold} style={{ marginRight: 5 }} />
              <Text style={styles.trustItemText}>Google {settings.googleRating} ★ ({settings.googleReviewsCount}+ Reviews)</Text>
            </View>
          </View>
        </View>
      </View>

      {/* ── 2. QUICK TRUST & CUISINE RIBBON ── */}
      <View style={styles.ribbonSection}>
        <View style={styles.ribbonContent}>
          <View style={styles.ribbonRow}>
            <Text style={styles.ribbonHighlight}>MULTI-CUISINE</Text>
            <Text style={styles.ribbonDot}>•</Text>
            <Text style={styles.ribbonItem}>INDIAN</Text>
            <Text style={styles.ribbonDot}>•</Text>
            <Text style={styles.ribbonItem}>TANDOOR</Text>
            <Text style={styles.ribbonDot}>•</Text>
            <Text style={styles.ribbonItem}>CHINESE</Text>
            <Text style={styles.ribbonDot}>•</Text>
            <Text style={styles.ribbonItem}>BIRYANI</Text>
            <Text style={styles.ribbonDot}>•</Text>
            <Text style={styles.ribbonItem}>BEVERAGES</Text>
          </View>
          <View style={styles.ribbonDiningModes}>
            <Text style={styles.ribbonModeText}>DINE-IN</Text>
            <Text style={styles.ribbonDot}>•</Text>
            <Text style={styles.ribbonModeText}>TAKEAWAY</Text>
            <Text style={styles.ribbonDot}>•</Text>
            <Text style={styles.ribbonModeText}>DELIVERY</Text>
          </View>
        </View>
      </View>

      {/* ── 3. OUR STORY SECTION ── */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionInner}>
          <View style={[styles.storyGrid, !isDesktop && styles.storyGridMobile]}>
            {/* Left: Large Authentic Photo */}
            <View style={styles.storyImageWrapper}>
              <Image
                source={{ uri: '/photos/interior_cafe_lounge.jpg' }}
                style={styles.storyImage}
                resizeMode="cover"
              />
              <View style={styles.storyImageBadge}>
                <Text style={styles.storyImageBadgeText}>Authentic Ambiance</Text>
              </View>
            </View>

            {/* Right: Narrative & Highlights */}
            <View style={styles.storyContent}>
              <Text style={styles.sectionEyebrow}>OUR STORY</Text>
              <Text style={styles.sectionTitle}>
                A place made for{'\n'}good food & good company.
              </Text>

              <Text style={styles.storyParagraph}>
                Located on Contai Bypass Road opposite Jawed Habib's, Dream Love Cafe & Restaurant was created to give local families, friends, and food lovers a warm, welcoming space to enjoy delicious meals.
              </Text>
              <Text style={styles.storyParagraph}>
                From aromatic dum biryanis and clay-oven tandoori kebabs to sizzling Chinese noodles and signature iced mocktails, our kitchen prepares every dish fresh to order with authentic spices and care.
              </Text>

              {/* 3 Compact Highlights */}
              <View style={styles.highlightsGrid}>
                <View style={styles.highlightItem}>
                  <View style={styles.highlightIconBox}>
                    <Users size={18} color={COLORS.brandTurquoise} />
                  </View>
                  <View>
                    <Text style={styles.highlightTitle}>Family Friendly</Text>
                    <Text style={styles.highlightDesc}>Comfortable seating for all occasions</Text>
                  </View>
                </View>

                <View style={styles.highlightItem}>
                  <View style={styles.highlightIconBox}>
                    <Flame size={18} color={COLORS.brandHeart} />
                  </View>
                  <View>
                    <Text style={styles.highlightTitle}>Freshly Prepared</Text>
                    <Text style={styles.highlightDesc}>Authentic recipes cooked to order</Text>
                  </View>
                </View>

                <View style={styles.highlightItem}>
                  <View style={styles.highlightIconBox}>
                    <Utensils size={18} color={COLORS.copper} />
                  </View>
                  <View>
                    <Text style={styles.highlightTitle}>Multi-Cuisine</Text>
                    <Text style={styles.highlightDesc}>Indian, Tandoor, Chinese & Beverages</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* ── 4. REAL PHOTOGRAPHY SHOWCASE ── */}
      <View style={[styles.sectionContainer, styles.sectionDarker]}>
        <View style={styles.sectionInner}>
          <View style={styles.sectionHeaderCenter}>
            <Text style={styles.sectionEyebrow}>A GLIMPSE INSIDE</Text>
            <Text style={styles.sectionTitle}>The Place, As It Is.</Text>
            <Text style={styles.sectionSubtitle}>
              Real photographs of our storefront, cafe lounge, and dining spaces in Contai.
            </Text>
          </View>

          <View style={[styles.galleryGrid, !isDesktop && styles.galleryGridMobile]}>
            {realPhotos.map((photo, idx) => (
              <View 
                key={idx} 
                style={[
                  styles.galleryCard, 
                  idx === 0 && isDesktop && styles.galleryCardLarge
                ]}
              >
                <Image
                  source={{ uri: photo.image }}
                  style={styles.galleryImage}
                  resizeMode="cover"
                />
                <View style={styles.galleryOverlay}>
                  <Text style={styles.galleryTitle}>{photo.title}</Text>
                  <Text style={styles.gallerySubtitle}>{photo.subtitle}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.viewGalleryLinkRow}>
            <TouchableOpacity 
              style={styles.viewMoreBtn}
              onPress={() => router.push('/gallery')}
              activeOpacity={0.8}
            >
              <Camera size={15} color={COLORS.brandTurquoise} style={{ marginRight: 6 }} />
              <Text style={styles.viewMoreBtnText}>View Full Photo Gallery</Text>
              <ChevronRight size={15} color={COLORS.brandTurquoise} style={{ marginLeft: 2 }} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ── 5. EXPLORE THE MENU & CATEGORY NAVIGATOR ── */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionInner}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionEyebrow}>CULINARY DISCOVERY</Text>
              <Text style={styles.sectionTitle}>Explore the Menu</Text>
              <Text style={styles.sectionSubtitle}>
                From tandoor-fired favourites to biryani, Chinese classics, refreshing mocktails and café beverages.
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.viewMenuBtn}
              onPress={() => router.push('/menu')}
              activeOpacity={0.8}
            >
              <Text style={styles.viewMenuBtnText}>Full Menu (134 Items)</Text>
              <ArrowRight size={14} color={COLORS.cream} style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>

          {/* Compact Category Navigation Pills */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryPillsScroll}
          >
            {categories.slice(0, 12).map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryPill}
                onPress={() => router.push(`/menu?category=${cat.slug}` as any)}
                activeOpacity={0.8}
              >
                <Text style={styles.categoryPillText}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* ── 6. FEATURED DISHES ("WHAT PEOPLE COME FOR") ── */}
      <View style={[styles.sectionContainer, styles.sectionDarker]}>
        <View style={styles.sectionInner}>
          <View style={styles.sectionHeaderCenter}>
            <Text style={styles.sectionEyebrow}>SIGNATURE SELECTIONS</Text>
            <Text style={styles.sectionTitle}>What People Come For</Text>
            <Text style={styles.sectionSubtitle}>
              Guest favorites freshly prepared by our kitchen team in Contai.
            </Text>
          </View>

          <View style={[styles.dishesGrid, !isDesktop && styles.dishesGridMobile]}>
            {featuredItems.map((item) => (
              <View 
                key={item.id} 
                style={[
                  styles.dishCardWrapper, 
                  isDesktop && styles.dishCardWrapperDesktop,
                  isTablet && styles.dishCardWrapperTablet,
                  isMobile && styles.dishCardWrapperMobile
                ]}
              >
                <MenuCard item={item} />
              </View>
            ))}
          </View>

          <View style={styles.centerActionRow}>
            <TouchableOpacity
              style={styles.primaryMenuCta}
              onPress={() => router.push('/menu')}
              activeOpacity={0.85}
            >
              <Utensils size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.primaryMenuCtaText}>Browse Complete Menu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ── 7. GUEST REVIEWS ("LOVED BY OUR GUESTS") ── */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionInner}>
          <View style={styles.sectionHeaderCenter}>
            <Text style={styles.sectionEyebrow}>VERIFIED EXPERIENCES</Text>
            <Text style={styles.sectionTitle}>Loved by Our Guests</Text>
            <Text style={styles.sectionSubtitle}>
              Authentic reviews and ratings from local dining guests in Contai.
            </Text>
          </View>

          <View style={[styles.reviewsGrid, !isDesktop && styles.reviewsGridMobile]}>
            {verifiedReviews.slice(0, 3).map((rev) => (
              <View key={rev.id} style={styles.reviewCard}>
                {/* 5 Golden Stars */}
                <View style={styles.starRow}>
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      color={i < rev.rating ? COLORS.gold : COLORS.textSubtle} 
                      fill={i < rev.rating ? COLORS.gold : 'transparent'} 
                    />
                  ))}
                </View>

                {/* Review Excerpt */}
                <Text style={styles.reviewQuote}>
                  "{rev.reviewText}"
                </Text>

                {/* Reviewer & Source Meta */}
                <View style={styles.reviewMetaRow}>
                  <View>
                    <Text style={styles.reviewerName}>{rev.reviewerName}</Text>
                    <Text style={styles.reviewDate}>{rev.reviewDate}</Text>
                  </View>
                  <View style={styles.reviewSourceBadge}>
                    <Text style={styles.reviewSourceText}>{rev.source}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.centerActionRow}>
            <TouchableOpacity
              style={styles.reviewsLinkBtn}
              onPress={() => router.push('/reviews')}
              activeOpacity={0.8}
            >
              <Text style={styles.reviewsLinkText}>Read All Verified Guest Reviews</Text>
              <ArrowRight size={14} color={COLORS.brandTurquoise} style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ── 8. VISIT DREAM LOVE & LOCATION ── */}
      <View style={[styles.sectionContainer, styles.sectionDarker]}>
        <View style={styles.sectionInner}>
          <View style={[styles.visitGrid, !isDesktop && styles.visitGridMobile]}>
            {/* Left: Location Visual & Google Maps Action */}
            <View style={styles.visitMapCard}>
              <Image
                source={{ uri: '/photos/exterior_street_view.jpg' }}
                style={styles.visitMapImage}
                resizeMode="cover"
              />
              <View style={styles.visitMapOverlay}>
                <View style={styles.mapPinBadge}>
                  <MapPin size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.mapCardTitle}>Central Bus Stand, Contai</Text>
                <Text style={styles.mapCardSub}>Contai Bypass Road • Opposite Jawed Habib's</Text>
                <TouchableOpacity
                  style={styles.openMapsBtn}
                  onPress={handleOpenMaps}
                  activeOpacity={0.85}
                >
                  <Compass size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.openMapsBtnText}>Open in Google Maps</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Right: Verified Contact & Operating Hours */}
            <View style={styles.visitInfoCard}>
              <Text style={styles.sectionEyebrow}>VISIT US</Text>
              <Text style={styles.sectionTitle}>
                We'd love to host you.
              </Text>

              <View style={styles.visitDetailGroup}>
                <View style={styles.visitDetailItem}>
                  <MapPin size={18} color={COLORS.copper} style={{ marginRight: 12, marginTop: 2 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.visitDetailHeading}>Address & Landmark</Text>
                    <Text style={styles.visitDetailText}>
                      QPHM+8QV Central Bus Stand, Contai Bypass Rd, opposite Jawed Habib's, Kishore Nagar Garh, Contai, West Bengal 721404
                    </Text>
                    <Text style={styles.visitPlusCode}>Plus Code: {settings.plusCode}</Text>
                  </View>
                </View>

                <View style={styles.visitDetailItem}>
                  <Clock size={18} color={COLORS.brandTurquoise} style={{ marginRight: 12, marginTop: 2 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.visitDetailHeading}>Opening Hours</Text>
                    <Text style={styles.visitDetailText}>Monday – Sunday</Text>
                    <Text style={styles.visitHoursHighlight}>12:00 PM – 12:00 AM Daily</Text>
                  </View>
                </View>

                <View style={styles.visitDetailItem}>
                  <Phone size={18} color={COLORS.brandHeartLight} style={{ marginRight: 12, marginTop: 2 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.visitDetailHeading}>Phone & Inquiries</Text>
                    <Text style={styles.visitDetailText}>{settings.phone}</Text>
                  </View>
                </View>
              </View>

              {/* Direct Buttons */}
              <View style={styles.visitButtonsRow}>
                <TouchableOpacity
                  style={styles.visitPrimaryBtn}
                  onPress={handleOpenMaps}
                  activeOpacity={0.85}
                >
                  <MapPin size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.visitPrimaryBtnText}>Get Directions</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.visitSecondaryBtn}
                  onPress={handleCall}
                  activeOpacity={0.8}
                >
                  <Phone size={15} color={COLORS.brandTurquoise} style={{ marginRight: 6 }} />
                  <Text style={styles.visitSecondaryBtnText}>Call</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.visitSecondaryBtn}
                  onPress={handleWhatsApp}
                  activeOpacity={0.8}
                >
                  <MessageSquare size={15} color={COLORS.brandGreen} style={{ marginRight: 6 }} />
                  <Text style={styles.visitSecondaryBtnText}>WhatsApp</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* ── 9. PRE-FOOTER CTA SECTION ("GOOD FOOD IS WAITING.") ── */}
      <View style={styles.preFooterSection}>
        <View style={styles.preFooterCard}>
          <Text style={styles.preFooterEyebrow}>JOIN US TODAY</Text>
          <Text style={styles.preFooterTitle}>Good food is waiting.</Text>
          <Text style={styles.preFooterSubtitle}>
            Explore our multi-cuisine menu, reserve your table in advance, or drop in anytime at Central Bus Stand, Contai.
          </Text>

          <View style={styles.preFooterButtonsRow}>
            <TouchableOpacity
              style={styles.preFooterPrimaryBtn}
              onPress={() => router.push('/menu')}
              activeOpacity={0.85}
            >
              <Utensils size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.preFooterPrimaryBtnText}>Explore Menu</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.preFooterSecondaryBtn}
              onPress={() => router.push('/book')}
              activeOpacity={0.85}
            >
              <Calendar size={16} color={COLORS.brandTurquoise} style={{ marginRight: 8 }} />
              <Text style={styles.preFooterSecondaryBtnText}>Reserve a Table</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.preFooterTertiaryBtn}
              onPress={handleOpenMaps}
              activeOpacity={0.8}
            >
              <Compass size={16} color={COLORS.cream} style={{ marginRight: 8 }} />
              <Text style={styles.preFooterTertiaryBtnText}>Get Directions</Text>
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
  },

  // ── 1. Hero Styles ──
  heroSection: {
    position: 'relative',
    minHeight: 640,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxxl,
    paddingHorizontal: SPACING.lg,
    overflow: 'hidden',
  },
  heroSectionMobile: {
    minHeight: 560,
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.md,
  },
  heroBackgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 12, 11, 0.82)',
  },
  heroContent: {
    maxWidth: 860,
    width: '100%',
    alignItems: 'center',
    zIndex: 2,
  },
  heroEyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: SPACING.md,
  },
  pulseLineLeft: {
    width: 32,
    height: 1.5,
    backgroundColor: COLORS.brandTurquoise + '80',
  },
  pulseLineRight: {
    width: 32,
    height: 1.5,
    backgroundColor: COLORS.brandTurquoise + '80',
  },
  heroEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.copperLight,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 52,
    fontWeight: '800',
    color: COLORS.cream,
    textAlign: 'center',
    lineHeight: 60,
    letterSpacing: -0.8,
    marginBottom: SPACING.md,
  },
  heroTitleTablet: {
    fontSize: 44,
    lineHeight: 52,
  },
  heroTitleMobile: {
    fontSize: 34,
    lineHeight: 42,
  },
  heroTitleSmallMobile: {
    fontSize: 28,
    lineHeight: 36,
  },
  heroSubtitle: {
    fontSize: 16,
    color: COLORS.creamMuted,
    textAlign: 'center',
    maxWidth: 680,
    lineHeight: 25,
    marginBottom: SPACING.xl,
  },
  heroSubtitleMobile: {
    fontSize: 14.5,
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  heroCtaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: SPACING.xxl,
    flexWrap: 'wrap',
  },
  heroCtaContainerMobile: {
    flexDirection: 'column',
    width: '100%',
    gap: 12,
    marginBottom: SPACING.xl,
  },
  heroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: BORDER_RADIUS.md,
    minHeight: 48,
  },
  heroBtnFullWidth: {
    width: '100%',
  },
  heroPrimaryBtn: {
    backgroundColor: COLORS.brandHeart,
    shadowColor: COLORS.brandHeart,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  heroPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  heroSecondaryBtn: {
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.brandTurquoise + '60',
  },
  heroSecondaryBtnText: {
    color: COLORS.cream,
    fontSize: 15,
    fontWeight: '600',
  },
  heroTextLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  heroTextLinkContent: {
    color: COLORS.copperLight,
    fontSize: 14,
    fontWeight: '600',
  },
  heroTrustStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trustItemText: {
    color: COLORS.textMuted,
    fontSize: 12.5,
    fontWeight: '500',
  },
  trustDivider: {
    color: COLORS.textSubtle,
    fontSize: 12,
  },

  // ── 2. Ribbon Section ──
  ribbonSection: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 14,
    paddingHorizontal: SPACING.lg,
  },
  ribbonContent: {
    maxWidth: 1240,
    width: '100%',
    marginHorizontal: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  ribbonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  ribbonHighlight: {
    color: COLORS.brandTurquoise,
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  ribbonItem: {
    color: COLORS.creamMuted,
    fontSize: 11.5,
    fontWeight: '600',
    letterSpacing: 1,
  },
  ribbonDot: {
    color: COLORS.textSubtle,
    fontSize: 11,
  },
  ribbonDiningModes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ribbonModeText: {
    color: COLORS.copperLight,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },

  // ── Common Section Structure ──
  sectionContainer: {
    paddingVertical: SPACING.section,
    paddingHorizontal: SPACING.lg,
    width: '100%',
  },
  sectionDarker: {
    backgroundColor: COLORS.surfaceMuted,
  },
  sectionInner: {
    maxWidth: 1240,
    width: '100%',
    marginHorizontal: 'auto',
  },
  sectionEyebrow: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.copper,
    letterSpacing: 2,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 34,
    fontWeight: '800',
    color: COLORS.cream,
    letterSpacing: -0.5,
    lineHeight: 42,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14.5,
    color: COLORS.textMuted,
    lineHeight: 22,
    maxWidth: 580,
  },
  sectionHeaderCenter: {
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: SPACING.xxl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: SPACING.xl,
  },

  // ── 3. Our Story Section ──
  storyGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 48,
  },
  storyGridMobile: {
    flexDirection: 'column',
    gap: 32,
  },
  storyImageWrapper: {
    flex: 1,
    height: 420,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    ...SHADOWS.card,
  },
  storyImage: {
    width: '100%',
    height: '100%',
  },
  storyImageBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(18, 15, 14, 0.88)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  storyImageBadgeText: {
    color: COLORS.copperLight,
    fontSize: 12,
    fontWeight: '600',
  },
  storyContent: {
    flex: 1.15,
  },
  storyParagraph: {
    fontSize: 15,
    color: COLORS.creamMuted,
    lineHeight: 24,
    marginBottom: 14,
  },
  highlightsGrid: {
    gap: 14,
    marginTop: SPACING.md,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 14,
  },
  highlightIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 2,
  },
  highlightDesc: {
    fontSize: 12.5,
    color: COLORS.textMuted,
  },

  // ── 4. Real Photography Showcase ──
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: SPACING.xl,
  },
  galleryGridMobile: {
    flexDirection: 'column',
    gap: 16,
  },
  galleryCard: {
    flex: 1,
    minWidth: 260,
    height: 240,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    ...SHADOWS.card,
  },
  galleryCardLarge: {
    flexBasis: '100%',
    height: 320,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  galleryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'linear-gradient(to top, rgba(18, 15, 14, 0.95), transparent)',
  },
  galleryTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 2,
  },
  gallerySubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  viewGalleryLinkRow: {
    alignItems: 'center',
  },
  viewMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  viewMoreBtnText: {
    color: COLORS.brandTurquoise,
    fontSize: 13.5,
    fontWeight: '600',
  },

  // ── 5. Category Pills ──
  categoryPillsScroll: {
    gap: 10,
    paddingVertical: 4,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  categoryPillText: {
    color: COLORS.cream,
    fontSize: 13,
    fontWeight: '600',
  },
  viewMenuBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: BORDER_RADIUS.md,
  },
  viewMenuBtnText: {
    color: COLORS.cream,
    fontSize: 13,
    fontWeight: '600',
  },

  // ── 6. Featured Dishes Grid ──
  dishesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: SPACING.xxl,
  },
  dishesGridMobile: {
    flexDirection: 'column',
    gap: 16,
  },
  dishCardWrapper: {
    flex: 1,
  },
  dishCardWrapperDesktop: {
    flexBasis: 'calc(33.333% - 14px)' as any,
    minWidth: 280,
  },
  dishCardWrapperTablet: {
    flexBasis: 'calc(50% - 10px)' as any,
    minWidth: 260,
  },
  dishCardWrapperMobile: {
    width: '100%',
  },
  centerActionRow: {
    alignItems: 'center',
  },
  primaryMenuCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.brandHeart,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: BORDER_RADIUS.md,
    shadowColor: COLORS.brandHeart,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryMenuCtaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  // ── 7. Guest Reviews ──
  reviewsGrid: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: SPACING.xxl,
  },
  reviewsGridMobile: {
    flexDirection: 'column',
    gap: 16,
  },
  reviewCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'space-between',
    ...SHADOWS.card,
  },
  starRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 14,
  },
  reviewQuote: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 15,
    color: COLORS.cream,
    lineHeight: 23,
    fontStyle: 'italic',
    marginBottom: 20,
  },
  reviewMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  reviewerName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: 11.5,
    color: COLORS.textSubtle,
  },
  reviewSourceBadge: {
    backgroundColor: COLORS.surfaceElevated,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  reviewSourceText: {
    color: COLORS.gold,
    fontSize: 10.5,
    fontWeight: '700',
  },
  reviewsLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  reviewsLinkText: {
    color: COLORS.brandTurquoise,
    fontSize: 14,
    fontWeight: '600',
  },

  // ── 8. Visit & Location ──
  visitGrid: {
    flexDirection: 'row',
    gap: 36,
    alignItems: 'stretch',
  },
  visitGridMobile: {
    flexDirection: 'column',
    gap: 24,
  },
  visitMapCard: {
    flex: 1,
    minHeight: 340,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    ...SHADOWS.card,
  },
  visitMapImage: {
    width: '100%',
    height: '100%',
  },
  visitMapOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: 'linear-gradient(to top, rgba(18, 15, 14, 0.95), transparent)',
  },
  mapPinBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.brandHeart,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  mapCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.cream,
    marginBottom: 2,
  },
  mapCardSub: {
    fontSize: 12.5,
    color: COLORS.creamMuted,
    marginBottom: 14,
  },
  openMapsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.brandGreen,
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: BORDER_RADIUS.md,
    alignSelf: 'flex-start',
  },
  openMapsBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  visitInfoCard: {
    flex: 1.15,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'space-between',
  },
  visitDetailGroup: {
    gap: 18,
    marginVertical: SPACING.md,
  },
  visitDetailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  visitDetailHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 2,
  },
  visitDetailText: {
    fontSize: 13.5,
    color: COLORS.creamMuted,
    lineHeight: 19,
  },
  visitPlusCode: {
    fontSize: 11.5,
    color: COLORS.copperLight,
    marginTop: 3,
    fontWeight: '500',
  },
  visitHoursHighlight: {
    fontSize: 13,
    color: COLORS.brandTurquoise,
    fontWeight: '700',
    marginTop: 2,
  },
  visitButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: SPACING.md,
    flexWrap: 'wrap',
  },
  visitPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.brandHeart,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: BORDER_RADIUS.md,
    minHeight: 42,
  },
  visitPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  visitSecondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: BORDER_RADIUS.md,
    minHeight: 42,
  },
  visitSecondaryBtnText: {
    color: COLORS.cream,
    fontSize: 13,
    fontWeight: '600',
  },

  // ── 9. Pre-Footer CTA ──
  preFooterSection: {
    paddingVertical: SPACING.xxxl,
    paddingHorizontal: SPACING.lg,
    width: '100%',
  },
  preFooterCard: {
    maxWidth: 1240,
    width: '100%',
    marginHorizontal: 'auto',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 24,
    paddingVertical: 48,
    paddingHorizontal: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    textAlign: 'center',
    ...SHADOWS.card,
  },
  preFooterEyebrow: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.copperLight,
    letterSpacing: 2,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  preFooterTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 38,
    fontWeight: '800',
    color: COLORS.cream,
    letterSpacing: -0.5,
    marginBottom: 10,
    textAlign: 'center',
  },
  preFooterSubtitle: {
    fontSize: 15,
    color: COLORS.textMuted,
    maxWidth: 620,
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: SPACING.xxl,
  },
  preFooterButtonsRow: {
    flexDirection: 'row',
    gap: 14,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  preFooterPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.brandHeart,
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: BORDER_RADIUS.md,
  },
  preFooterPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700',
  },
  preFooterSecondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.brandTurquoise + '60',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: BORDER_RADIUS.md,
  },
  preFooterSecondaryBtnText: {
    color: COLORS.brandTurquoise,
    fontSize: 14.5,
    fontWeight: '600',
  },
  preFooterTertiaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: BORDER_RADIUS.md,
  },
  preFooterTertiaryBtnText: {
    color: COLORS.cream,
    fontSize: 14,
    fontWeight: '600',
  },
});
