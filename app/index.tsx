import React, { useState } from 'react';
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
  ArrowRight,
  ShieldCheck,
  Maximize2
} from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, LAYOUT, SHADOWS } from '../src/theme';
import { useSettings } from '../src/context/SettingsContext';
import { MenuCard } from '../src/components/menu/MenuCard';
import { Lightbox } from '../src/components/ui/Lightbox';
import { analytics } from '../src/services/analytics';
import { GalleryItem } from '../src/types';

export default function HomePage() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { settings, categories, menuItems, verifiedReviews } = useSettings();

  // Responsive Breakpoints
  const isSmallMobile = width < 380;
  const isMobile = width < 600;
  const isTablet = width >= 600 && width < 920;
  const isDesktop = width >= 920;

  // Selected Category filter on home
  const [selectedHomeCat, setSelectedHomeCat] = useState<string>('all');

  // Lightbox State for Real Photography Gallery
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);

  // Real Client Photographs
  const realPhotos: GalleryItem[] = [
    {
      id: 'photo-1',
      title: 'Storefront & Neon Signboard',
      caption: 'Main entrance on Contai Bypass Road opposite Jawed Habib\'s',
      image_url: '/photos/storefront_signboard.jpg',
      alt_text: 'Dream Love Cafe & Restaurant Storefront and Neon Signboard on Contai Bypass Road',
      category: 'Storefront',
      source: 'Verified Storefront',
      owner_verified: true,
      is_featured: true,
      display_order: 1,
    },
    {
      id: 'photo-2',
      title: 'Cafe Lounge & Seating',
      caption: 'Warm ambiance with comfortable booth seating for family & friends',
      image_url: '/photos/interior_cafe_lounge.jpg',
      alt_text: 'Warm interior booth and table dining area at Dream Love Cafe & Restaurant Contai',
      category: 'Interior',
      source: 'Verified Storefront',
      owner_verified: true,
      is_featured: true,
      display_order: 2,
    },
    {
      id: 'photo-3',
      title: 'Dining Counter & Kitchen',
      caption: 'Clean service area where fresh multi-cuisine dishes are prepared',
      image_url: '/photos/interior_dining_counter.jpg',
      alt_text: 'Hygienic dining counter and kitchen at Dream Love Cafe & Restaurant',
      category: 'Dining Area',
      source: 'Verified Storefront',
      owner_verified: true,
      is_featured: false,
      display_order: 3,
    },
    {
      id: 'photo-4',
      title: 'Street View & Refreshment Kiosk',
      caption: 'Conveniently situated near the Central Bus Stand landmark in Contai',
      image_url: '/photos/exterior_street_view.jpg',
      alt_text: 'Exterior street view and refreshment kiosk near Central Bus Stand Contai',
      category: 'Storefront',
      source: 'Verified Storefront',
      owner_verified: true,
      is_featured: false,
      display_order: 4,
    },
  ];

  // Curated featured dishes
  const featuredItems = menuItems.filter((i) => i.isFeatured && (i.image_url || i.image)).slice(0, 5);
  const heroFeaturedItem = featuredItems[0];
  const supportingFeaturedItems = featuredItems.slice(1, 5);

  // Home preview items based on selected category
  const homeMenuItems = (selectedHomeCat === 'all' 
    ? menuItems.filter(i => i.isFeatured || i.image_url || i.image)
    : menuItems.filter(i => i.category === selectedHomeCat)
  ).slice(0, 6);

  const handleOpenMaps = () => {
    analytics.track('directions_click');
    Linking.openURL(settings.googleMapsUrl);
  };

  const openPhotoLightbox = (index: number) => {
    setSelectedPhotoIdx(index);
    setLightboxOpen(true);
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
          {/* Brand Eyebrow with ECG heartbeat line accent */}
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
            An intimate multi-cuisine dining destination in Contai, West Bengal. Serving comforting North Indian classics, clay-oven tandoor, authentic dum biryani, Chinese dishes, and handcrafted café beverages.
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
              <Text style={styles.trustItemText}>Contai, West Bengal</Text>
            </View>
            <Text style={styles.trustDivider}>•</Text>
            <View style={styles.trustItem}>
              <Clock size={13} color={COLORS.brandTurquoise} style={{ marginRight: 5 }} />
              <Text style={styles.trustItemText}>Open 12:00 PM – 12:00 AM</Text>
            </View>
            <Text style={styles.trustDivider}>•</Text>
            <View style={styles.trustItem}>
              <Star size={13} color={COLORS.gold} fill={COLORS.gold} style={{ marginRight: 5 }} />
              <Text style={styles.trustItemText}>Google ★ {settings.googleRating} ({settings.googleReviewsCount}+ Reviews)</Text>
            </View>
          </View>
        </View>
      </View>

      {/* ── 2. QUICK TRUST & CUISINE RIBBON ── */}
      <View style={styles.ribbonSection}>
        <View style={styles.ribbonContent}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.ribbonScrollContent}
          >
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

            <View style={styles.ribbonDividerVertical} />

            <View style={styles.ribbonDiningModes}>
              <Text style={styles.ribbonModeText}>DINE-IN</Text>
              <Text style={styles.ribbonDot}>•</Text>
              <Text style={styles.ribbonModeText}>TAKEAWAY</Text>
              <Text style={styles.ribbonDot}>•</Text>
              <Text style={styles.ribbonModeText}>DELIVERY</Text>
            </View>
          </ScrollView>
        </View>
      </View>

      {/* ── 3. OUR STORY SECTION (Editorial Split) ── */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionInner}>
          <View style={[styles.storyGrid, !isDesktop && styles.storyGridMobile]}>
            {/* Left: Large Authentic Photo */}
            <View style={[styles.storyImageWrapper, !isDesktop && styles.storyImageWrapperMobile]}>
              <Image
                source={{ uri: '/photos/interior_cafe_lounge.jpg' }}
                style={styles.storyImage}
                resizeMode="cover"
              />
              <View style={styles.storyImageBadge}>
                <Sparkles size={13} color={COLORS.brandTurquoise} style={{ marginRight: 5 }} />
                <Text style={styles.storyImageBadgeText}>Authentic Ambiance</Text>
              </View>
            </View>

            {/* Right: Narrative & 3 Compact Highlights */}
            <View style={[styles.storyContent, !isDesktop && styles.storyContentMobile]}>
              <Text style={styles.sectionEyebrow}>OUR STORY</Text>
              <Text style={[styles.sectionTitle, isMobile && styles.sectionTitleMobile]}>
                A place made for{'\n'}good food & good company.
              </Text>

              <Text style={styles.storyParagraph}>
                Located on Contai Bypass Road opposite Jawed Habib's near the Central Bus Stand, Dream Love Cafe & Restaurant was created to provide Contai with a warm, welcoming gathering spot.
              </Text>
              <Text style={styles.storyParagraph}>
                From slow-cooked dum biryani and smoky clay-oven tandoori kebabs to sizzling Chinese wok favorites and refreshing iced mocktails, every dish is prepared fresh to order.
              </Text>

              {/* 3 Compact Editorial Highlights */}
              <View style={styles.highlightsGrid}>
                <View style={styles.highlightItem}>
                  <View style={styles.highlightIconBox}>
                    <Utensils size={18} color={COLORS.brandTurquoise} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.highlightTitle}>Multi-Cuisine Menu</Text>
                    <Text style={styles.highlightDesc}>134 curated dishes spanning Indian, Chinese & café specials</Text>
                  </View>
                </View>

                <View style={styles.highlightItem}>
                  <View style={styles.highlightIconBox}>
                    <Users size={18} color={COLORS.copper} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.highlightTitle}>Family & Friends</Text>
                    <Text style={styles.highlightDesc}>Comfortable booth and table seating for all gatherings</Text>
                  </View>
                </View>

                <View style={styles.highlightItem}>
                  <View style={styles.highlightIconBox}>
                    <MapPin size={18} color={COLORS.brandHeartLight} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.highlightTitle}>Local Dining in Contai</Text>
                    <Text style={styles.highlightDesc}>Opposite Jawed Habib's, open daily 12 PM to 12 AM</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.storyReadMoreBtn}
                onPress={() => router.push('/about')}
                activeOpacity={0.8}
              >
                <Text style={styles.storyReadMoreText}>Learn More About Our Story</Text>
                <ArrowRight size={14} color={COLORS.brandTurquoise} style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* ── 4. REAL RESTAURANT PHOTOGRAPHY (Editorial Gallery) ── */}
      <View style={[styles.sectionContainer, styles.sectionAlt]}>
        <View style={styles.sectionInner}>
          <View style={styles.sectionHeaderCentered}>
            <Text style={styles.sectionEyebrow}>REAL RESTAURANT PHOTOGRAPHY</Text>
            <Text style={[styles.sectionTitle, isMobile && styles.sectionTitleMobile]}>
              Step Inside Dream Love
            </Text>
            <Text style={styles.sectionSubtitle}>
              Explore real photographs of our storefront, dining room, kitchen counter, and location in Contai.
            </Text>
          </View>

          {/* Editorial Masonry Grid */}
          <View style={[styles.photoGrid, !isDesktop && styles.photoGridMobile]}>
            {realPhotos.map((photo, idx) => (
              <TouchableOpacity
                key={photo.id}
                style={[
                  styles.photoCard,
                  isDesktop && styles.photoCardDesktop,
                  !isDesktop && styles.photoCardMobileFull,
                ]}
                onPress={() => openPhotoLightbox(idx)}
                activeOpacity={0.9}
              >
                <Image
                  source={{ uri: photo.image_url }}
                  style={styles.photoImage}
                  resizeMode="cover"
                />
                <View style={styles.photoOverlay} />
                
                <View style={styles.photoInfo}>
                  <Text style={styles.photoCategoryBadge}>{photo.category}</Text>
                  <Text style={styles.photoTitle}>{photo.title}</Text>
                  <Text style={styles.photoSubtitle}>{photo.caption}</Text>
                </View>

                <View style={styles.photoZoomIcon}>
                  <Maximize2 size={14} color={COLORS.cream} />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.galleryActionRow}>
            <TouchableOpacity
              style={styles.viewFullGalleryBtn}
              onPress={() => router.push('/gallery')}
              activeOpacity={0.85}
            >
              <Camera size={16} color={COLORS.cream} style={{ marginRight: 8 }} />
              <Text style={styles.viewFullGalleryBtnText}>View Complete Photo Gallery</Text>
              <ArrowRight size={14} color={COLORS.cream} style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ── 5. EXPLORE THE MENU SECTION (Discovery) ── */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionInner}>
          <View style={styles.menuSectionHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionEyebrow}>CULINARY VARIETY</Text>
              <Text style={[styles.sectionTitle, isMobile && styles.sectionTitleMobile]}>
                Explore the Menu
              </Text>
              <Text style={styles.sectionSubtitleLeft}>
                From tandoor favourites and biryani to Chinese dishes, mocktails, shakes, and café beverages.
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.viewAllMenuBtn}
              onPress={() => router.push('/menu')}
              activeOpacity={0.85}
            >
              <Text style={styles.viewAllMenuBtnText}>View Full Menu ({menuItems.length})</Text>
              <ChevronRight size={16} color={COLORS.brandTurquoise} />
            </TouchableOpacity>
          </View>

          {/* Category Tabs */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.homeCategoryPills}
          >
            <TouchableOpacity
              style={[styles.categoryPill, selectedHomeCat === 'all' && styles.categoryPillActive]}
              onPress={() => setSelectedHomeCat('all')}
              activeOpacity={0.8}
            >
              <Text style={[styles.categoryPillText, selectedHomeCat === 'all' && styles.categoryPillTextActive]}>
                Featured & Popular
              </Text>
            </TouchableOpacity>

            {categories.slice(0, 7).map((cat) => {
              const active = selectedHomeCat === cat.slug;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryPill, active && styles.categoryPillActive]}
                  onPress={() => setSelectedHomeCat(cat.slug)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.categoryPillText, active && styles.categoryPillTextActive]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Dishes Grid */}
          <View style={[styles.menuGridRow, !isDesktop && styles.menuGridRowMobile]}>
            {homeMenuItems.map((item) => (
              <View 
                key={item.id} 
                style={[
                  styles.menuCardCol,
                  isDesktop && styles.menuCardColDesktop,
                  isTablet && styles.menuCardColTablet,
                  isMobile && styles.menuCardColMobile
                ]}
              >
                <MenuCard item={item} />
              </View>
            ))}
          </View>

          {/* Bottom Explore CTA */}
          <View style={styles.menuBottomAction}>
            <TouchableOpacity
              style={styles.browseAllDishesBtn}
              onPress={() => router.push('/menu')}
              activeOpacity={0.85}
            >
              <Utensils size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.browseAllDishesBtnText}>Browse All {menuItems.length} Dishes & Drinks</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ── 6. FEATURED DISHES ("What People Come For") ── */}
      {heroFeaturedItem && (
        <View style={[styles.sectionContainer, styles.sectionAlt]}>
          <View style={styles.sectionInner}>
            <View style={styles.sectionHeaderCentered}>
              <Text style={styles.sectionEyebrow}>CHEF'S SIGNATURE SELECTION</Text>
              <Text style={[styles.sectionTitle, isMobile && styles.sectionTitleMobile]}>
                What People Come For
              </Text>
              <Text style={styles.sectionSubtitle}>
                Hand-picked dishes loved by our local diners in Contai for their authentic taste and generous portions.
              </Text>
            </View>

            <View style={[styles.featuredDishesContainer, !isDesktop && styles.featuredDishesMobile]}>
              {/* Left: 1 Large Hero Dish */}
              <View style={[styles.heroDishCard, isDesktop ? { flex: 1.2 } : { width: '100%' }]}>
                <MenuCard item={heroFeaturedItem} variant={isDesktop ? 'hero' : 'standard'} />
              </View>

              {/* Right: 4 Supporting Cards in Grid */}
              <View style={[styles.supportingGrid, isDesktop ? { flex: 1.8 } : { width: '100%' }]}>
                {supportingFeaturedItems.map((item) => (
                  <View 
                    key={item.id} 
                    style={[
                      styles.supportingCardCol,
                      isDesktop && styles.supportingCardColDesktop,
                      !isDesktop && styles.supportingCardColMobile
                    ]}
                  >
                    <MenuCard item={item} />
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>
      )}

      {/* ── 7. VERIFIED REVIEWS SECTION ── */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionInner}>
          <View style={styles.sectionHeaderCentered}>
            <Text style={styles.sectionEyebrow}>VERIFIED GUEST FEEDBACK</Text>
            <Text style={[styles.sectionTitle, isMobile && styles.sectionTitleMobile]}>
              Loved by Food Lovers in Contai
            </Text>
            <Text style={styles.sectionSubtitle}>
              Authentic dining reviews directly linked to official Google, Justdial, and Magicpin listings.
            </Text>
          </View>

          {/* Rating Summary Strip */}
          <View style={styles.ratingsSummaryStrip}>
            <View style={styles.ratingSummaryBadge}>
              <Star size={16} color={COLORS.gold} fill={COLORS.gold} style={{ marginRight: 6 }} />
              <Text style={styles.ratingSummarySource}>Google Maps</Text>
              <Text style={styles.ratingSummaryScore}>★ {settings.googleRating}</Text>
              <Text style={styles.ratingSummaryCount}>({settings.googleReviewsCount}+ Reviews)</Text>
            </View>

            {settings.justdialUrl && (
              <View style={styles.ratingSummaryBadge}>
                <ShieldCheck size={16} color={COLORS.brandTurquoise} style={{ marginRight: 6 }} />
                <Text style={styles.ratingSummarySource}>Justdial</Text>
                <Text style={styles.ratingSummaryScore}>★ {settings.justdialRating || '4.0'}</Text>
              </View>
            )}

            {settings.magicpinUrl && (
              <View style={styles.ratingSummaryBadge}>
                <ShieldCheck size={16} color={COLORS.brandTurquoise} style={{ marginRight: 6 }} />
                <Text style={styles.ratingSummarySource}>Magicpin</Text>
                <Text style={styles.ratingSummaryScore}>★ {settings.magicpinRating || '4.1'}</Text>
              </View>
            )}
          </View>

          {/* 3 Review Cards */}
          <View style={[styles.reviewsGridRow, !isDesktop && styles.reviewsGridRowMobile]}>
            {verifiedReviews.slice(0, 3).map((rev) => (
              <TouchableOpacity
                key={rev.id}
                style={[
                  styles.homeReviewCard,
                  isDesktop && styles.homeReviewCardDesktop,
                  !isDesktop && styles.homeReviewCardMobile
                ]}
                onPress={() => Linking.openURL(rev.externalReviewUrl)}
                activeOpacity={0.85}
              >
                <View style={styles.reviewCardTop}>
                  <View style={styles.starCluster}>
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} size={14} color={COLORS.gold} fill={COLORS.gold} style={{ marginRight: 2 }} />
                    ))}
                  </View>
                  <View style={styles.reviewSourceTag}>
                    <Text style={styles.reviewSourceTagText}>{rev.source}</Text>
                  </View>
                </View>

                <Text style={styles.reviewQuoteText}>"{rev.reviewText}"</Text>

                <View style={styles.reviewCardAuthorRow}>
                  <Text style={styles.reviewAuthorName}>{rev.reviewerName}</Text>
                  <View style={styles.reviewSourceLink}>
                    <Text style={styles.reviewSourceLinkText}>Verified</Text>
                    <ExternalLink size={11} color={COLORS.brandTurquoise} style={{ marginLeft: 4 }} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.reviewsActionRow}>
            <TouchableOpacity
              style={styles.viewAllReviewsBtn}
              onPress={() => router.push('/reviews')}
              activeOpacity={0.8}
            >
              <Text style={styles.viewAllReviewsBtnText}>Read All Verified Reviews</Text>
              <ArrowRight size={14} color={COLORS.brandTurquoise} style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ── 8. VISIT & LOCATION SECTION ── */}
      <View style={[styles.sectionContainer, styles.sectionAlt]}>
        <View style={styles.sectionInner}>
          <View style={[styles.visitSplitGrid, !isDesktop && styles.visitSplitGridMobile]}>
            {/* Left: Google Map Embed */}
            <View style={[styles.visitMapWrapper, !isDesktop && styles.visitMapWrapperMobile]}>
              {Platform.OS === 'web' ? (
                <iframe
                  src="https://maps.google.com/maps?q=Dream%20Love%20Cafe%20%26%20Restaurant%2C%20QPHM%2B8QV%2C%20Contai%2C%20West%20Bengal%20721404%2C%20India&t=&z=17&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: 20, minHeight: 320 } as any}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Dream Love Cafe Google Maps Location"
                />
              ) : (
                <TouchableOpacity style={styles.mapFallback} onPress={handleOpenMaps}>
                  <MapPin size={36} color={COLORS.brandTurquoise} />
                  <Text style={styles.mapFallbackTitle}>View Restaurant Location</Text>
                  <Text style={styles.mapFallbackSub}>Tap to open in Google Maps</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Right: Location Details & Quick Actions */}
            <View style={[styles.visitInfoContent, !isDesktop && styles.visitInfoContentMobile]}>
              <Text style={styles.sectionEyebrow}>LOCATION & DIRECTIONS</Text>
              <Text style={[styles.sectionTitle, isMobile && styles.sectionTitleMobile]}>
                Visit Us in Contai
              </Text>

              <View style={styles.visitInfoRows}>
                <View style={styles.visitInfoItem}>
                  <MapPin size={18} color={COLORS.copper} style={styles.visitIcon} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.visitItemLabel}>Address</Text>
                    <Text style={styles.visitItemValue}>
                      {settings.address}
                    </Text>
                    <Text style={styles.visitPlusCode}>Plus Code: {settings.plusCode}</Text>
                  </View>
                </View>

                <View style={styles.visitInfoItem}>
                  <Clock size={18} color={COLORS.brandTurquoise} style={styles.visitIcon} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.visitItemLabel}>Hours</Text>
                    <Text style={styles.visitItemValue}>{settings.openingHours}</Text>
                  </View>
                </View>

                <View style={styles.visitInfoItem}>
                  <Phone size={18} color={COLORS.gold} style={styles.visitIcon} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.visitItemLabel}>Phone & WhatsApp</Text>
                    <Text style={styles.visitItemValue}>{settings.phone}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.visitActionsRow}>
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
                  onPress={() => router.push('/visit')}
                  activeOpacity={0.85}
                >
                  <Text style={styles.visitSecondaryBtnText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* ── 9. INVITATION RESERVATION BANNER ── */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionInner}>
          <View style={styles.reserveBannerCard}>
            <View style={styles.reserveBannerIcon}>
              <Heart size={24} color={COLORS.brandHeart} fill={COLORS.brandHeart} />
            </View>

            <Text style={styles.reserveBannerTitle}>
              Reserve Your Table at Dream Love
            </Text>
            <Text style={styles.reserveBannerSub}>
              Planning a family meal, evening coffee, or birthday gathering? Reserve your table in advance for instant preparation.
            </Text>

            <View style={styles.reserveBannerActions}>
              <TouchableOpacity
                style={styles.bannerReserveBtn}
                onPress={() => router.push('/book')}
                activeOpacity={0.85}
              >
                <Calendar size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.bannerReserveBtnText}>Reserve a Table Now</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.bannerCallBtn}
                onPress={() => Linking.openURL(`tel:${settings.phone.replace(/[^0-9+]/g, '')}`)}
                activeOpacity={0.8}
              >
                <Phone size={15} color={COLORS.cream} style={{ marginRight: 6 }} />
                <Text style={styles.bannerCallBtnText}>Call {settings.phone}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Fullscreen Lightbox Modal for Real Photos */}
      <Lightbox
        items={realPhotos}
        currentIndex={selectedPhotoIdx}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onSelectIndex={setSelectedPhotoIdx}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: COLORS.background,
  },

  // ── 1. CINEMATIC HERO ──
  heroSection: {
    position: 'relative',
    minHeight: 580,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
    overflow: 'hidden',
    backgroundColor: COLORS.backgroundDeep,
  },
  heroSectionMobile: {
    minHeight: 480,
    paddingVertical: SPACING.xl,
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
    backgroundColor: 'rgba(14, 11, 10, 0.78)',
  },
  heroContent: {
    maxWidth: 880,
    width: '100%',
    alignItems: 'center',
    textAlign: 'center',
    zIndex: 2,
  },
  heroEyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: 12,
  },
  pulseLineLeft: {
    width: 28,
    height: 2,
    backgroundColor: COLORS.brandTurquoise,
    borderRadius: 1,
  },
  pulseLineRight: {
    width: 28,
    height: 2,
    backgroundColor: COLORS.brandTurquoise,
    borderRadius: 1,
  },
  heroEyebrow: {
    color: COLORS.brandTurquoise,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 3,
    textTransform: 'uppercase',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  heroTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 56,
    fontWeight: '800',
    color: COLORS.cream,
    textAlign: 'center',
    lineHeight: 66,
    letterSpacing: -0.5,
    marginBottom: SPACING.lg,
  },
  heroTitleTablet: {
    fontSize: 46,
    lineHeight: 54,
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
    fontSize: 15.5,
    color: COLORS.creamMuted,
    textAlign: 'center',
    maxWidth: 680,
    lineHeight: 24,
    marginBottom: SPACING.xl,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  heroSubtitleMobile: {
    fontSize: 13.5,
    lineHeight: 21,
    marginBottom: SPACING.lg,
  },
  heroCtaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    marginBottom: SPACING.xl,
    flexWrap: 'wrap',
  },
  heroCtaContainerMobile: {
    flexDirection: 'column',
    width: '100%',
    gap: 10,
  },
  heroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    paddingHorizontal: 24,
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
    shadowOpacity: 0.40,
    shadowRadius: 10,
    elevation: 4,
  },
  heroPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  heroSecondaryBtn: {
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.brandTurquoise,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.30,
    shadowRadius: 8,
    elevation: 3,
  },
  heroSecondaryBtnText: {
    color: COLORS.cream,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
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
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  heroTrustStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(26, 22, 21, 0.88)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    flexWrap: 'wrap',
    gap: 10,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trustItemText: {
    color: COLORS.creamMuted,
    fontSize: 12.5,
    fontWeight: '500',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  trustDivider: {
    color: COLORS.textSubtle,
    fontSize: 12,
  },

  // ── 2. QUICK TRUST & CUISINE RIBBON ──
  ribbonSection: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 12,
    width: '100%',
  },
  ribbonContent: {
    maxWidth: LAYOUT.maxContainerWidth,
    width: '100%',
    marginHorizontal: 'auto',
    paddingHorizontal: SPACING.lg,
  },
  ribbonScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '100%',
    gap: 16,
  },
  ribbonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ribbonHighlight: {
    color: COLORS.brandTurquoise,
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 1.5,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  ribbonDot: {
    color: COLORS.borderLight,
    fontSize: 12,
  },
  ribbonItem: {
    color: COLORS.creamMuted,
    fontSize: 11.5,
    fontWeight: '600',
    letterSpacing: 0.8,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  ribbonDividerVertical: {
    width: 1,
    height: 16,
    backgroundColor: COLORS.border,
    marginHorizontal: 4,
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
    letterSpacing: 0.8,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },

  // ── GENERAL SECTION LAYOUT ──
  sectionContainer: {
    width: '100%',
    paddingVertical: SPACING.xxl,
  },
  sectionAlt: {
    backgroundColor: COLORS.surfaceMuted,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  sectionInner: {
    maxWidth: LAYOUT.maxContainerWidth,
    width: '100%',
    marginHorizontal: 'auto',
    paddingHorizontal: SPACING.lg,
  },
  sectionHeaderCentered: {
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  sectionEyebrow: {
    color: COLORS.copper,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginBottom: 6,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  sectionTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.cream,
    lineHeight: 44,
    letterSpacing: -0.3,
    marginBottom: 8,
    textAlign: 'left',
  },
  sectionTitleMobile: {
    fontSize: 26,
    lineHeight: 34,
  },
  sectionSubtitle: {
    fontSize: 14.5,
    color: COLORS.textMuted,
    textAlign: 'center',
    maxWidth: 620,
    lineHeight: 22,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  sectionSubtitleLeft: {
    fontSize: 14,
    color: COLORS.textMuted,
    maxWidth: 540,
    lineHeight: 21,
    marginTop: 4,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },

  // ── 3. STORY SECTION ──
  storyGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 40,
    width: '100%',
  },
  storyGridMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 24,
  },
  storyImageWrapper: {
    flex: 1,
    height: 400,
    borderRadius: BORDER_RADIUS.hero,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    position: 'relative',
    ...SHADOWS.card,
  },
  storyImageWrapperMobile: {
    width: '100%',
    height: 250,
  },
  storyImage: {
    width: '100%',
    height: '100%',
  },
  storyImageBadge: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    backgroundColor: 'rgba(18, 15, 14, 0.88)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: BORDER_RADIUS.sm,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  storyImageBadgeText: {
    color: COLORS.cream,
    fontSize: 11.5,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  storyContent: {
    flex: 1.15,
  },
  storyContentMobile: {
    width: '100%',
  },
  storyParagraph: {
    fontSize: 14.5,
    color: COLORS.creamMuted,
    lineHeight: 23,
    marginBottom: 12,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  highlightsGrid: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
    gap: 10,
    width: '100%',
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    width: '100%',
  },
  highlightIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  highlightTitle: {
    color: COLORS.cream,
    fontSize: 13.5,
    fontWeight: '700',
    marginBottom: 2,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  highlightDesc: {
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 17,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  storyReadMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  storyReadMoreText: {
    color: COLORS.brandTurquoise,
    fontSize: 13.5,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },

  // ── 4. REAL PHOTOGRAPHY SECTION ──
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
    marginBottom: SPACING.lg,
    width: '100%',
  },
  photoGridMobile: {
    flexDirection: 'column',
    gap: 14,
    width: '100%',
  },
  photoCard: {
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    ...SHADOWS.card,
  },
  photoCardDesktop: {
    width: '48.5%',
    height: 250,
  },
  photoCardMobileFull: {
    width: '100%',
    height: 220,
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(18, 15, 14, 0.40)',
  },
  photoInfo: {
    position: 'absolute',
    bottom: SPACING.md,
    left: SPACING.md,
    right: SPACING.md,
  },
  photoCategoryBadge: {
    color: COLORS.brandTurquoise,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  photoTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 2,
  },
  photoSubtitle: {
    fontSize: 11.5,
    color: COLORS.creamMuted,
    lineHeight: 15,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  photoZoomIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(18, 15, 14, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryActionRow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewFullGalleryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingVertical: 11,
    paddingHorizontal: 20,
    borderRadius: BORDER_RADIUS.md,
  },
  viewFullGalleryBtnText: {
    color: COLORS.cream,
    fontSize: 13.5,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },

  // ── 5. MENU DISCOVERY SECTION ──
  menuSectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: SPACING.md,
    flexWrap: 'wrap',
    gap: 14,
    width: '100%',
  },
  viewAllMenuBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  viewAllMenuBtnText: {
    color: COLORS.brandTurquoise,
    fontSize: 13.5,
    fontWeight: '600',
    marginRight: 4,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  homeCategoryPills: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  categoryPill: {
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryPillActive: {
    backgroundColor: COLORS.brandTurquoise + '25',
    borderColor: COLORS.brandTurquoise,
  },
  categoryPillText: {
    color: COLORS.textMuted,
    fontSize: 12.5,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  categoryPillTextActive: {
    color: COLORS.brandTurquoise,
    fontWeight: '700',
  },
  menuGridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
    marginBottom: SPACING.lg,
    width: '100%',
  },
  menuGridRowMobile: {
    flexDirection: 'column',
    gap: 14,
    width: '100%',
  },
  menuCardCol: {
    width: '31.8%',
  },
  menuCardColDesktop: {
    width: '31.8%',
  },
  menuCardColTablet: {
    width: '48%',
  },
  menuCardColMobile: {
    width: '100%',
  },
  menuBottomAction: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  browseAllDishesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.brandHeart,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.card,
  },
  browseAllDishesBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },

  // ── 6. FEATURED DISHES ──
  featuredDishesContainer: {
    flexDirection: 'row',
    gap: 20,
    width: '100%',
  },
  featuredDishesMobile: {
    flexDirection: 'column',
    gap: 16,
    width: '100%',
  },
  heroDishCard: {
    width: '100%',
  },
  supportingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    width: '100%',
  },
  supportingCardCol: {
    width: '48%',
  },
  supportingCardColDesktop: {
    width: '48%',
  },
  supportingCardColMobile: {
    width: '100%',
  },

  // ── 7. REVIEWS SECTION ──
  ratingsSummaryStrip: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: SPACING.lg,
  },
  ratingSummaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: BORDER_RADIUS.full,
  },
  ratingSummarySource: {
    color: COLORS.cream,
    fontSize: 12.5,
    fontWeight: '600',
    marginRight: 6,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  ratingSummaryScore: {
    color: COLORS.gold,
    fontSize: 12.5,
    fontWeight: '700',
    marginRight: 6,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  ratingSummaryCount: {
    color: COLORS.textMuted,
    fontSize: 11.5,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  reviewsGridRow: {
    flexDirection: 'row',
    gap: 18,
    marginBottom: SPACING.lg,
    width: '100%',
  },
  reviewsGridRowMobile: {
    flexDirection: 'column',
    gap: 14,
    width: '100%',
  },
  homeReviewCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'space-between',
    ...SHADOWS.card,
  },
  homeReviewCardDesktop: {
    flex: 1,
  },
  homeReviewCardMobile: {
    width: '100%',
  },
  reviewCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  starCluster: {
    flexDirection: 'row',
  },
  reviewSourceTag: {
    backgroundColor: COLORS.surfaceElevated,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: BORDER_RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  reviewSourceTagText: {
    color: COLORS.brandTurquoise,
    fontSize: 10,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  reviewQuoteText: {
    fontSize: 13.5,
    color: COLORS.creamMuted,
    lineHeight: 21,
    fontStyle: 'italic',
    marginBottom: 14,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  reviewCardAuthorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  reviewAuthorName: {
    color: COLORS.cream,
    fontSize: 12.5,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  reviewSourceLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewSourceLinkText: {
    color: COLORS.brandTurquoise,
    fontSize: 11,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  reviewsActionRow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewAllReviewsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  viewAllReviewsBtnText: {
    color: COLORS.brandTurquoise,
    fontSize: 13.5,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },

  // ── 8. VISIT & LOCATION SECTION ──
  visitSplitGrid: {
    flexDirection: 'row',
    gap: 36,
    alignItems: 'center',
    width: '100%',
  },
  visitSplitGridMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 24,
    width: '100%',
  },
  visitMapWrapper: {
    flex: 1.1,
    height: 360,
    borderRadius: BORDER_RADIUS.hero,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  visitMapWrapperMobile: {
    width: '100%',
    height: 280,
  },
  mapFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
  },
  mapFallbackTitle: {
    color: COLORS.cream,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 8,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  mapFallbackSub: {
    color: COLORS.textMuted,
    fontSize: 12.5,
    marginTop: 4,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  visitInfoContent: {
    flex: 1,
  },
  visitInfoContentMobile: {
    width: '100%',
  },
  visitInfoRows: {
    marginVertical: SPACING.md,
    gap: 14,
  },
  visitInfoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  visitIcon: {
    marginTop: 2,
    flexShrink: 0,
  },
  visitItemLabel: {
    color: COLORS.textSubtle,
    fontSize: 10.5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  visitItemValue: {
    color: COLORS.cream,
    fontSize: 13.5,
    fontWeight: '500',
    lineHeight: 19,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  visitPlusCode: {
    color: COLORS.copperLight,
    fontSize: 11,
    marginTop: 2,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  visitActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: SPACING.sm,
    flexWrap: 'wrap',
  },
  visitPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.copper,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: BORDER_RADIUS.md,
  },
  visitPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  visitSecondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: BORDER_RADIUS.md,
  },
  visitSecondaryBtnText: {
    color: COLORS.cream,
    fontSize: 13,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },

  // ── 9. INVITATION RESERVATION BANNER ──
  reserveBannerCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.xxl,
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: 840,
    width: '100%',
    marginHorizontal: 'auto',
    ...SHADOWS.card,
  },
  reserveBannerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(225, 29, 72, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(225, 29, 72, 0.3)',
  },
  reserveBannerTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.cream,
    textAlign: 'center',
    marginBottom: 8,
  },
  reserveBannerSub: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    maxWidth: 540,
    lineHeight: 21,
    marginBottom: SPACING.xl,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  reserveBannerActions: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  bannerReserveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.brandHeart,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: BORDER_RADIUS.md,
    minWidth: 200,
    ...SHADOWS.card,
  },
  bannerReserveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  bannerCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: BORDER_RADIUS.md,
    minWidth: 180,
  },
  bannerCallBtnText: {
    color: COLORS.cream,
    fontSize: 13.5,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
});
