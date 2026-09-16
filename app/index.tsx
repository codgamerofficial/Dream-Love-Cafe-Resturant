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
  Check,
  ExternalLink,
  Camera,
  Calendar,
  Flame,
  ArrowRight,
  ShieldCheck,
  Maximize2,
  Play,
  Film,
  BookOpen
} from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, LAYOUT, SHADOWS } from '../src/theme';
import { useSettings } from '../src/context/SettingsContext';
import { MenuCard } from '../src/components/menu/MenuCard';
import { Lightbox } from '../src/components/ui/Lightbox';
import { OriginalMenuViewer } from '../src/components/menu/OriginalMenuViewer';
import { analytics } from '../src/services/analytics';
import { GalleryItem } from '../src/types';
import { CinematicHero } from '../src/components/hero';

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

  // Lightbox State for Real Photography & Video Gallery
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);
  const [originalMenuOpen, setOriginalMenuOpen] = useState(false);

  // Real Atmospheric Videos for "Inside Dream Love"
  const insideVideos: GalleryItem[] = [
    {
      id: 'vid-dining-room',
      title: 'Warm Dining Hall & Private Booths',
      caption: 'Real video walkthrough of our spacious dining room and comfortable booth seating in Contai.',
      image_url: '/videos/restaurant_video_2.mp4',
      poster_url: '/photos/interior_cafe_lounge.jpg',
      category: 'Interior',
      alt_text: 'Spacious dining room and private booth seating video at Dream Love Cafe & Restaurant',
      source: 'Verified Storefront',
      owner_verified: true,
      is_featured: true,
      display_order: 1,
      media_type: 'video',
    },
    {
      id: 'vid-kitchen-prep',
      title: 'Kitchen Craft & Food Counter',
      caption: 'Freshly prepared multi-cuisine service counter, hygienic food preparation, and warm hospitality.',
      image_url: '/videos/restaurant_video_4.mp4',
      poster_url: '/photos/interior_dining_counter.jpg',
      category: 'Dining Area',
      alt_text: 'Fresh multi-cuisine service counter and kitchen at Dream Love Contai',
      source: 'Verified Storefront',
      owner_verified: true,
      is_featured: true,
      display_order: 2,
      media_type: 'video',
    },
    {
      id: 'vid-cafe-ambience',
      title: 'Evening Café Ambience & Lighting',
      caption: 'Charming atmospheric lighting designed for romantic dinners, family meals, and evening coffee.',
      image_url: '/videos/restaurant_video_3.mp4',
      poster_url: '/photos/interior_cafe_lounge.jpg',
      category: 'Ambience',
      alt_text: 'Evening mood lighting and cafe ambience at Dream Love Contai',
      source: 'Verified Storefront',
      owner_verified: true,
      is_featured: true,
      display_order: 3,
      media_type: 'video',
    },
    {
      id: 'vid-storefront-view',
      title: 'Entrance & Contai Bypass View',
      caption: 'Our prime location on Contai Bypass Road opposite Jawed Habib\'s, near the Central Bus Stand.',
      image_url: '/videos/restaurant_video_1.mp4',
      poster_url: '/photos/storefront_signboard.jpg',
      category: 'Storefront',
      alt_text: 'Storefront and Contai Bypass Road entrance video of Dream Love Cafe',
      source: 'Verified Storefront',
      owner_verified: true,
      is_featured: true,
      display_order: 4,
      media_type: 'video',
    },
  ];

  // Real Client Photographs
  const realPhotos: GalleryItem[] = [
    {
      id: 'photo-1',
      title: 'Storefront & Neon Signboard',
      caption: 'Main entrance on Contai Bypass Road opposite Jawed Habib\'s',
      image_url: '/photos/storefront_signboard.jpg',
      poster_url: '/photos/storefront_signboard.jpg',
      alt_text: 'Dream Love Cafe & Restaurant Storefront and Neon Signboard on Contai Bypass Road',
      category: 'Storefront',
      source: 'Verified Storefront',
      owner_verified: true,
      is_featured: true,
      display_order: 5,
      media_type: 'image',
    },
    {
      id: 'photo-2',
      title: 'Cafe Lounge & Seating',
      caption: 'Warm ambiance with comfortable booth seating for family & friends',
      image_url: '/photos/interior_cafe_lounge.jpg',
      poster_url: '/photos/interior_cafe_lounge.jpg',
      alt_text: 'Warm interior booth and table dining area at Dream Love Cafe & Restaurant Contai',
      category: 'Interior',
      source: 'Verified Storefront',
      owner_verified: true,
      is_featured: true,
      display_order: 6,
      media_type: 'image',
    },
    {
      id: 'photo-3',
      title: 'Dining Counter & Kitchen',
      caption: 'Clean service area where fresh multi-cuisine dishes are prepared',
      image_url: '/photos/interior_dining_counter.jpg',
      poster_url: '/photos/interior_dining_counter.jpg',
      alt_text: 'Hygienic dining counter and kitchen at Dream Love Cafe & Restaurant',
      category: 'Dining Area',
      source: 'Verified Storefront',
      owner_verified: true,
      is_featured: false,
      display_order: 7,
      media_type: 'image',
    },
    {
      id: 'photo-4',
      title: 'Street View & Refreshment Kiosk',
      caption: 'Conveniently situated near the Central Bus Stand landmark in Contai',
      image_url: '/photos/exterior_street_view.jpg',
      poster_url: '/photos/exterior_street_view.jpg',
      alt_text: 'Exterior street view and refreshment kiosk near Central Bus Stand Contai',
      category: 'Storefront',
      source: 'Verified Storefront',
      owner_verified: true,
      is_featured: false,
      display_order: 8,
      media_type: 'image',
    },
  ];

  // Combined Media for Lightbox
  const allHomeMedia: GalleryItem[] = [...insideVideos, ...realPhotos];

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

  const openMediaLightbox = (index: number) => {
    setSelectedPhotoIdx(index);
    setLightboxOpen(true);
  };

  // Category count helper
  const getCategoryCount = (slug: string) => {
    if (slug === 'all') return menuItems.length;
    return menuItems.filter((i) => i.category === slug).length;
  };

  // Curate popular categories that actually have items
  const popularCategoryTabs = categories.filter((c) => {
    const count = menuItems.filter((i) => i.category === c.slug).length;
    return count > 0;
  }).slice(0, 8);

  return (
    <View style={styles.container}>
      
      {/* ── 1. CINEMATIC FULL-SCREEN VIDEO HERO ── */}
      <CinematicHero />

      {/* ── 2. QUICK TRUST & CUISINE RIBBON ── */}
      <View style={styles.ribbonSection}>
        <View style={styles.ribbonContent}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.ribbonScrollContent}
          >
            {/* Google Rating Badge */}
            <TouchableOpacity 
              style={styles.ribbonTrustBadge}
              onPress={() => Linking.openURL(settings.googleReviewsUrl || settings.googleMapsUrl)}
              activeOpacity={0.8}
            >
              <Star size={13} color={COLORS.gold} fill={COLORS.gold} style={styles.ribbonBadgeIcon} />
              <Text style={styles.ribbonTrustText}>
                Google <Text style={styles.ribbonTrustHighlight}>4.1★</Text>{' '}
                <Text style={styles.ribbonTrustSub}>({settings.googleReviewsCount}+ Reviews)</Text>
              </Text>
            </TouchableOpacity>

            <View style={styles.ribbonDividerVertical} />

            {/* Landmark Badge */}
            <TouchableOpacity 
              style={styles.ribbonTrustBadge}
              onPress={handleOpenMaps}
              activeOpacity={0.8}
            >
              <MapPin size={13} color={COLORS.brandTurquoise} style={styles.ribbonBadgeIcon} />
              <Text style={styles.ribbonTrustText}>
                Contai Landmark <Text style={styles.ribbonTrustSub}>• Opp. Jawed Habib's</Text>
              </Text>
            </TouchableOpacity>

            <View style={styles.ribbonDividerVertical} />

            {/* Dishes Badge */}
            <TouchableOpacity 
              style={styles.ribbonTrustBadge}
              onPress={() => router.push('/menu')}
              activeOpacity={0.8}
            >
              <Utensils size={13} color={COLORS.copper} style={styles.ribbonBadgeIcon} />
              <Text style={styles.ribbonTrustText}>
                <Text style={styles.ribbonTrustHighlight}>134 Dishes</Text>{' '}
                <Text style={styles.ribbonTrustSub}>• Multi-Cuisine</Text>
              </Text>
            </TouchableOpacity>

            <View style={styles.ribbonDividerVertical} />

            {/* Live Tandoor Badge */}
            <View style={styles.ribbonTrustBadge}>
              <Flame size={13} color={COLORS.brandHeart} style={styles.ribbonBadgeIcon} />
              <Text style={styles.ribbonTrustText}>
                Live Clay-Oven <Text style={styles.ribbonTrustSub}>• Tandoor & Kebabs</Text>
              </Text>
            </View>

            <View style={styles.ribbonDividerVertical} />

            {/* AC Dining Badge */}
            <View style={styles.ribbonTrustBadge}>
              <Users size={13} color={COLORS.brandTurquoise} style={styles.ribbonBadgeIcon} />
              <Text style={styles.ribbonTrustText}>
                AC Family Lounge <Text style={styles.ribbonTrustSub}>• Private Booths</Text>
              </Text>
            </View>

            <View style={styles.ribbonDividerVertical} />

            {/* Hours Badge */}
            <View style={styles.ribbonTrustBadge}>
              <Clock size={13} color={COLORS.gold} style={styles.ribbonBadgeIcon} />
              <Text style={styles.ribbonTrustText}>
                Daily 12 PM – 12 AM <Text style={styles.ribbonTrustSub}>• Dine-In & Delivery</Text>
              </Text>
            </View>

            <View style={styles.ribbonDividerVertical} />

            {/* Service Modes */}
            <View style={styles.ribbonTrustBadge}>
              <CheckCircle2 size={13} color={COLORS.vegGreen} style={styles.ribbonBadgeIcon} />
              <Text style={styles.ribbonTrustText}>
                Dine-In <Text style={styles.ribbonTrustSub}>• Takeaway • Delivery</Text>
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>

      {/* ── 3. OUR STORY SECTION (Editorial Split) ── */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionInner}>
          <View style={[styles.storyGrid, !isDesktop && styles.storyGridMobile]}>
            {/* Left: Large Authentic Photo Showcase */}
            <View style={[styles.storyImageWrapper, !isDesktop && styles.storyImageWrapperMobile]}>
              <Image
                source={{ uri: '/photos/interior_cafe_lounge.jpg' }}
                style={styles.storyImage as any}
                resizeMode="cover"
              />
              <View style={styles.storyOverlayGradient} />
              
              {/* Top Landmark Tag */}
              <View style={styles.storyTopBadge}>
                <MapPin size={12} color={COLORS.brandTurquoise} style={{ marginRight: 5 }} />
                <Text style={styles.storyTopBadgeText}>Landmark Dining in Contai</Text>
              </View>

              {/* Bottom Pull Quote Banner */}
              <View style={styles.storyPullQuote}>
                <Sparkles size={13} color={COLORS.gold} style={{ marginRight: 6, flexShrink: 0 }} />
                <Text style={styles.storyPullQuoteText}>
                  "Where authentic tandoori smoke meets warm Contai hospitality."
                </Text>
              </View>
            </View>

            {/* Right: Narrative & 3 Compact Highlights */}
            <View style={[styles.storyContent, !isDesktop && styles.storyContentMobile]}>
              <Text style={styles.sectionEyebrow}>OUR STORY & PHILOSOPHY</Text>
              <Text style={[styles.sectionTitle, isMobile && styles.sectionTitleMobile, { textAlign: 'left' }]}>
                A place made for{'\n'}good food & warm company.
              </Text>

              <Text style={styles.storyParagraph}>
                Located on Contai Bypass Road opposite Jawed Habib's near the Central Bus Stand, Dream Love Cafe & Restaurant was created with a clear vision: to give Contai a refined, welcoming gathering place where families, friends, and travelers feel at home.
              </Text>
              <Text style={styles.storyParagraph}>
                From aromatic dum biryani and smoky clay-oven tandoori kebabs to sizzling Indo-Chinese wok dishes and handcrafted mocktails, every preparation honors fresh ingredients, bold spices, and generous portions.
              </Text>

              {/* 3 Compact Editorial Highlights */}
              <View style={styles.highlightsGrid}>
                <View style={styles.highlightItem}>
                  <View style={[styles.highlightIconBox, { backgroundColor: 'rgba(36, 213, 197, 0.12)' }]}>
                    <Utensils size={18} color={COLORS.brandTurquoise} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.highlightTitle}>134 Multi-Cuisine Dishes</Text>
                    <Text style={styles.highlightDesc}>Rich North Indian, clay-oven tandoor, Chinese wok favorites, rolls, and beverages.</Text>
                  </View>
                </View>

                <View style={styles.highlightItem}>
                  <View style={[styles.highlightIconBox, { backgroundColor: 'rgba(217, 164, 65, 0.12)' }]}>
                    <Users size={18} color={COLORS.copper} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.highlightTitle}>AC Family Dining & Private Booths</Text>
                    <Text style={styles.highlightDesc}>Relaxed air-conditioned seating designed for family gatherings, couples, and celebrations.</Text>
                  </View>
                </View>

                <View style={styles.highlightItem}>
                  <View style={[styles.highlightIconBox, { backgroundColor: 'rgba(255, 45, 93, 0.12)' }]}>
                    <Clock size={18} color={COLORS.brandHeart} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.highlightTitle}>Open Daily 12 PM – 12 AM</Text>
                    <Text style={styles.highlightDesc}>Opposite Jawed Habib's on Contai Bypass Road with dine-in, takeaway, and delivery.</Text>
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

      {/* ── 4. INSIDE DREAM LOVE (Atmospheric Video Tour) ── */}
      <View style={[styles.sectionContainer, styles.sectionAlt]}>
        <View style={styles.sectionInner}>
          <View style={styles.sectionHeaderCentered}>
            <Text style={styles.sectionEyebrow}>AUTHENTIC RESTAURANT EXPERIENCE</Text>
            <Text style={[styles.sectionTitle, isMobile && styles.sectionTitleMobile]}>
              Inside Dream Love
            </Text>
            <Text style={styles.sectionSubtitle}>
              Experience the real atmosphere: our spacious dining hall, live preparation counter, cozy private booths, and evening storefront in Contai.
            </Text>
          </View>

          {/* 4 Inside Video Cards */}
          <View style={[styles.insideGrid, !isDesktop && styles.insideGridMobile]}>
            {insideVideos.map((item, idx) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.insideCard,
                  isDesktop && styles.insideCardDesktop,
                  !isDesktop && styles.insideCardMobile,
                ]}
                onPress={() => openMediaLightbox(idx)}
                activeOpacity={0.9}
              >
                <Image
                  source={{ uri: item.poster_url || item.image_url }}
                  style={styles.insideImage as any}
                  resizeMode="cover"
                />
                <View style={styles.insideOverlay} />

                {/* Big Glowing Play Badge */}
                <View style={styles.insidePlayBadge}>
                  <Play size={20} color="#FFFFFF" fill="#FFFFFF" style={{ marginLeft: 3 }} />
                </View>

                {/* Top Badge Row */}
                <View style={styles.insideTagRow}>
                  <View style={styles.insideTag}>
                    <Film size={11} color={COLORS.brandTurquoise} style={{ marginRight: 5 }} />
                    <Text style={styles.insideTagText}>REAL VIDEO TOUR</Text>
                  </View>
                  <Text style={styles.insideCategoryText}>{item.category}</Text>
                </View>

                {/* Bottom Info Bar */}
                <View style={styles.insideInfo}>
                  <Text style={styles.insideTitle}>{item.title}</Text>
                  <Text style={styles.insideCaption}>{item.caption}</Text>
                  <View style={styles.insideMetaRow}>
                    <Sparkles size={11} color={COLORS.gold} style={{ marginRight: 4 }} />
                    <Text style={styles.insideMetaText}>Tap to Play Walkthrough (Full HD)</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.insideActionRow}>
            <TouchableOpacity
              style={styles.insideActionBtn}
              onPress={() => router.push('/gallery')}
              activeOpacity={0.85}
            >
              <Film size={16} color={COLORS.brandTurquoise} style={{ marginRight: 8 }} />
              <Text style={styles.insideActionBtnText}>Watch All Restaurant Videos in Gallery</Text>
              <ArrowRight size={14} color={COLORS.brandTurquoise} style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ── 5. REAL RESTAURANT GALLERY (Editorial Masonry) ── */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionInner}>
          <View style={styles.sectionHeaderCentered}>
            <Text style={styles.sectionEyebrow}>VERIFIED STOREFRONT & INTERIOR</Text>
            <Text style={[styles.sectionTitle, isMobile && styles.sectionTitleMobile]}>
              Real Restaurant Gallery
            </Text>
            <Text style={styles.sectionSubtitle}>
              True-to-life photographs captured at our Contai location. What you see is exactly what you experience.
            </Text>
          </View>

          {/* Asymmetrical Editorial Grid */}
          <View style={styles.editorialGalleryContainer}>
            {/* Top Row: Large Featured Showcase Card (Storefront & Neon Signboard) */}
            {realPhotos[0] && (
              <TouchableOpacity
                key={realPhotos[0].id}
                style={[styles.galleryHeroCard, !isDesktop && styles.galleryHeroCardMobile]}
                onPress={() => openMediaLightbox(insideVideos.length)}
                activeOpacity={0.92}
              >
                <Image
                  source={{ uri: realPhotos[0].image_url }}
                  style={styles.photoImage as any}
                  resizeMode="cover"
                />
                <View style={styles.galleryHeroOverlay} />

                <View style={styles.galleryHeroTopBadge}>
                  <Sparkles size={12} color={COLORS.gold} style={{ marginRight: 5 }} />
                  <Text style={styles.galleryHeroBadgeText}>FEATURED STOREFRONT • NIGHT AMBIENCE</Text>
                </View>

                <View style={styles.galleryHeroInfo}>
                  <Text style={styles.galleryHeroTitle}>{realPhotos[0].title}</Text>
                  <Text style={styles.galleryHeroSubtitle}>{realPhotos[0].caption}</Text>
                </View>

                <View style={styles.photoZoomIcon}>
                  <Maximize2 size={15} color={COLORS.cream} />
                </View>
              </TouchableOpacity>
            )}

            {/* Bottom Row: 3 Supporting High-Def Cards */}
            <View style={[styles.gallerySupportingGrid, !isDesktop && styles.gallerySupportingGridMobile]}>
              {realPhotos.slice(1).map((photo, idx) => (
                <TouchableOpacity
                  key={photo.id}
                  style={[
                    styles.supportingPhotoCard,
                    isDesktop && styles.supportingPhotoCardDesktop,
                    !isDesktop && styles.supportingPhotoCardMobile,
                  ]}
                  onPress={() => openMediaLightbox(insideVideos.length + 1 + idx)}
                  activeOpacity={0.9}
                >
                  <Image
                    source={{ uri: photo.image_url }}
                    style={styles.photoImage as any}
                    resizeMode="cover"
                  />
                  <View style={styles.photoOverlay} />
                  
                  <View style={styles.photoInfo}>
                    <Text style={styles.photoCategoryBadge}>{photo.category}</Text>
                    <Text style={styles.photoTitle}>{photo.title}</Text>
                    <Text style={styles.photoSubtitle}>{photo.caption}</Text>
                  </View>

                  <View style={styles.photoZoomIcon}>
                    <Maximize2 size={13} color={COLORS.cream} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.galleryActionRow}>
            <TouchableOpacity
              style={styles.viewFullGalleryBtn}
              onPress={() => router.push('/gallery')}
              activeOpacity={0.85}
            >
              <Camera size={16} color={COLORS.cream} style={{ marginRight: 8 }} />
              <Text style={styles.viewFullGalleryBtnText}>View Complete Photo & Video Gallery (12 Items)</Text>
              <ArrowRight size={14} color={COLORS.cream} style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ── 6. EXPLORE THE MENU SECTION (Discovery) ── */}
      <View style={[styles.sectionContainer, styles.sectionAlt]}>
        <View style={styles.sectionInner}>
          <View style={styles.menuSectionHeaderRow}>
            <View style={{ flex: 1, minWidth: 260 }}>
              <Text style={styles.sectionEyebrow}>CULINARY DISCOVERY</Text>
              <Text style={[styles.sectionTitle, isMobile && styles.sectionTitleMobile, { textAlign: 'left' }]}>
                Explore the Menu
              </Text>
              <Text style={styles.sectionSubtitleLeft}>
                134 authentic recipes prepared fresh to order. From royal dum biryani and smoky tandoor to Chinese wok and iced mocktails.
              </Text>

              {/* Dietary & Freshness Micro-Indicators */}
              <View style={styles.menuDietaryStrip}>
                <View style={styles.menuDietaryItem}>
                  <View style={[styles.menuDietaryDot, { backgroundColor: COLORS.vegGreen }]} />
                  <Text style={styles.menuDietaryText}>Pure Vegetarian Options</Text>
                </View>
                <View style={styles.menuDietaryItem}>
                  <View style={[styles.menuDietaryDot, { backgroundColor: COLORS.brandHeart }]} />
                  <Text style={styles.menuDietaryText}>Non-Veg Specialties</Text>
                </View>
                <View style={styles.menuDietaryItem}>
                  <Flame size={12} color={COLORS.copper} style={{ marginRight: 4 }} />
                  <Text style={styles.menuDietaryText}>Live Clay-Oven Tandoor</Text>
                </View>
              </View>
            </View>

            <View style={styles.menuHeaderActions}>
              <TouchableOpacity
                style={styles.viewPrintedMenuBtn}
                onPress={() => setOriginalMenuOpen(true)}
                activeOpacity={0.85}
              >
                <BookOpen size={15} color={COLORS.gold} style={{ marginRight: 6 }} />
                <Text style={styles.viewPrintedMenuBtnText}>Original Menu (6 Pages)</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.viewAllMenuBtn}
                onPress={() => router.push('/menu')}
                activeOpacity={0.85}
              >
                <Text style={styles.viewAllMenuBtnText}>View Full Menu ({menuItems.length})</Text>
                <ChevronRight size={16} color={COLORS.brandTurquoise} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Category Tabs with Dish Counts */}
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
              <View style={[styles.categoryCountBadge, selectedHomeCat === 'all' && styles.categoryCountBadgeActive]}>
                <Text style={[styles.categoryCountText, selectedHomeCat === 'all' && styles.categoryCountTextActive]}>
                  {menuItems.filter((i) => i.isFeatured || i.image_url || i.image).length}
                </Text>
              </View>
            </TouchableOpacity>

            {popularCategoryTabs.map((cat) => {
              const active = selectedHomeCat === cat.slug;
              const count = getCategoryCount(cat.slug);
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
                  {count > 0 && (
                    <View style={[styles.categoryCountBadge, active && styles.categoryCountBadgeActive]}>
                      <Text style={[styles.categoryCountText, active && styles.categoryCountTextActive]}>
                        {count}
                      </Text>
                    </View>
                  )}
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
          <View style={styles.menuBottomActionRow}>
            <TouchableOpacity
              style={styles.browseAllDishesBtn}
              onPress={() => router.push('/menu')}
              activeOpacity={0.85}
            >
              <Utensils size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.browseAllDishesBtnText}>Browse All {menuItems.length} Dishes & Drinks</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.browsePrintedMenuBtn}
              onPress={() => setOriginalMenuOpen(true)}
              activeOpacity={0.85}
            >
              <BookOpen size={16} color={COLORS.gold} style={{ marginRight: 8 }} />
              <Text style={styles.browsePrintedMenuBtnText}>View Original Printed Menu (6 Pages)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ── 7. FEATURED DISHES ("What People Come For") ── */}
      {heroFeaturedItem && (
        <View style={styles.sectionContainer}>
          <View style={styles.sectionInner}>
            <View style={styles.sectionHeaderCentered}>
              <Text style={styles.sectionEyebrow}>CHEF'S SIGNATURE SELECTION</Text>
              <Text style={[styles.sectionTitle, isMobile && styles.sectionTitleMobile]}>
                What People Come For
              </Text>
              <Text style={styles.sectionSubtitle}>
                Hand-picked dishes loved by our local diners in Contai for their authentic taste, fragrant spices, and generous portions.
              </Text>
            </View>

            <View style={[styles.featuredDishesContainer, !isDesktop && styles.featuredDishesMobile]}>
              {/* Left: 1 Large Hero Dish with Gold Ribbon Banner */}
              <View style={[styles.heroDishCard, isDesktop ? { flex: 1.2 } : { width: '100%' }]}>
                <View style={styles.heroDishBanner}>
                  <Sparkles size={13} color={COLORS.gold} style={{ marginRight: 6 }} />
                  <Text style={styles.heroDishBannerText}>CHEF'S SIGNATURE • MOST POPULAR</Text>
                </View>
                <MenuCard item={heroFeaturedItem} variant={isDesktop ? 'hero' : 'standard'} />
              </View>

              {/* Right: 4 Supporting Cards in 2x2 Grid */}
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

      {/* ── 8. VERIFIED REVIEWS SECTION ── */}
      <View style={[styles.sectionContainer, styles.sectionAlt]}>
        <View style={styles.sectionInner}>
          <View style={styles.sectionHeaderCentered}>
            <Text style={styles.sectionEyebrow}>AUTHENTIC REPUTATION</Text>
            <Text style={[styles.sectionTitle, isMobile && styles.sectionTitleMobile]}>
              Loved by Food Lovers in Contai
            </Text>
            <Text style={styles.sectionSubtitle}>
              Authentic dining feedback from Google Maps, Justdial, and Magicpin. Real reviews from local Contai residents and highway travelers.
            </Text>
          </View>

          {/* Rating Summary Strip */}
          <View style={styles.ratingsSummaryStrip}>
            <TouchableOpacity 
              style={styles.ratingSummaryBadge}
              onPress={() => Linking.openURL(settings.googleReviewsUrl || settings.googleMapsUrl)}
              activeOpacity={0.8}
            >
              <Star size={15} color={COLORS.gold} fill={COLORS.gold} style={{ marginRight: 6 }} />
              <Text style={styles.ratingSummarySource}>Google Maps</Text>
              <Text style={styles.ratingSummaryScore}>★ {settings.googleRating}</Text>
              <Text style={styles.ratingSummaryCount}>({settings.googleReviewsCount}+ Reviews)</Text>
              <ExternalLink size={12} color={COLORS.textSubtle} style={{ marginLeft: 6 }} />
            </TouchableOpacity>

            {settings.justdialUrl && (
              <TouchableOpacity 
                style={styles.ratingSummaryBadge}
                onPress={() => Linking.openURL(settings.justdialUrl)}
                activeOpacity={0.8}
              >
                <ShieldCheck size={15} color={COLORS.brandTurquoise} style={{ marginRight: 6 }} />
                <Text style={styles.ratingSummarySource}>Justdial</Text>
                <Text style={styles.ratingSummaryScore}>★ {settings.justdialRating || '4.0'}</Text>
                <ExternalLink size={12} color={COLORS.textSubtle} style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            )}

            {settings.magicpinUrl && (
              <TouchableOpacity 
                style={styles.ratingSummaryBadge}
                onPress={() => Linking.openURL(settings.magicpinUrl)}
                activeOpacity={0.8}
              >
                <ShieldCheck size={15} color={COLORS.brandTurquoise} style={{ marginRight: 6 }} />
                <Text style={styles.ratingSummarySource}>Magicpin</Text>
                <Text style={styles.ratingSummaryScore}>★ {settings.magicpinRating || '4.1'}</Text>
                <ExternalLink size={12} color={COLORS.textSubtle} style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            )}

            <View style={styles.ratingTrustTag}>
              <CheckCircle2 size={13} color={COLORS.vegGreen} style={{ marginRight: 5 }} />
              <Text style={styles.ratingTrustTagText}>100% Genuine Verified Diners</Text>
            </View>
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
                activeOpacity={0.88}
              >
                {/* Decorative Quotation Mark & Stars */}
                <View style={styles.reviewCardTop}>
                  <Text style={styles.reviewQuoteSymbol}>“</Text>
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

                {/* Author & Verification Row */}
                <View style={styles.reviewCardAuthorRow}>
                  <View style={styles.reviewAuthorGroup}>
                    <View style={styles.reviewAvatarCircle}>
                      <Text style={styles.reviewAvatarInitial}>
                        {rev.reviewerName.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.reviewAuthorName}>{rev.reviewerName}</Text>
                      <Text style={styles.reviewAuthorTag}>Local Contai Diner</Text>
                    </View>
                  </View>
                  <View style={styles.reviewSourceLink}>
                    <ShieldCheck size={13} color={COLORS.brandTurquoise} style={{ marginRight: 4 }} />
                    <Text style={styles.reviewSourceLinkText}>Verified</Text>
                    <ExternalLink size={11} color={COLORS.brandTurquoise} style={{ marginLeft: 3 }} />
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
              <Text style={styles.viewAllReviewsBtnText}>Read All Verified Reviews ({settings.googleReviewsCount}+)</Text>
              <ArrowRight size={14} color={COLORS.brandTurquoise} style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ── 9. VISIT & LOCATION SECTION ── */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionInner}>
          <View style={[styles.visitSplitGrid, !isDesktop && styles.visitSplitGridMobile]}>
            {/* Left: Google Map Embed */}
            <View style={[styles.visitMapWrapper, !isDesktop && styles.visitMapWrapperMobile]}>
              {Platform.OS === 'web' ? (
                <iframe
                  src="https://maps.google.com/maps?q=Dream%20Love%20Cafe%20%26%20Restaurant%2C%20QPHM%2B8QV%2C%20Contai%2C%20West%20Bengal%20721404%2C%20India&t=&z=17&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: 20, minHeight: 340, width: '100%', height: '100%' } as any}
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

            {/* Right: Concierge Information & Live Status */}
            <View style={[styles.visitInfoContent, !isDesktop && styles.visitInfoContentMobile]}>
              {/* Live Status Badge */}
              <View style={styles.liveOpenBadge}>
                <View style={styles.liveOpenDot} />
                <Text style={styles.liveOpenText}>OPEN TODAY • 12:00 PM – 12:00 AM</Text>
              </View>

              <Text style={styles.sectionEyebrow}>LOCATION & DIRECTIONS</Text>
              <Text style={[styles.sectionTitle, isMobile && styles.sectionTitleMobile, { textAlign: 'left' }]}>
                Visit Us in Contai
              </Text>

              {/* Landmark Callout */}
              <View style={styles.visitLandmarkBox}>
                <Sparkles size={14} color={COLORS.copper} style={{ marginRight: 8, marginTop: 2, flexShrink: 0 }} />
                <Text style={styles.visitLandmarkText}>
                  <Text style={{ fontWeight: '700', color: COLORS.cream }}>Prime Landmark:</Text> Directly opposite Jawed Habib's Hair & Beauty Salon, near Central Bus Stand on Contai Bypass Road.
                </Text>
              </View>

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
                    <Text style={styles.visitItemLabel}>Opening Hours</Text>
                    <Text style={styles.visitItemValue}>{settings.openingHours} (Monday – Sunday)</Text>
                    <Text style={styles.visitSubNote}>Dine-in, takeaway counters, and local food delivery</Text>
                  </View>
                </View>

                <View style={styles.visitInfoItem}>
                  <Phone size={18} color={COLORS.gold} style={styles.visitIcon} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.visitItemLabel}>Phone & WhatsApp</Text>
                    <Text style={styles.visitItemValue}>{settings.phone}</Text>
                    <Text style={styles.visitSubNote}>Call ahead for fast takeaway orders or table inquiries</Text>
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
                  <Text style={styles.visitPrimaryBtnText}>Get Directions on Google Maps</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.visitSecondaryBtn}
                  onPress={() => Linking.openURL(`tel:${settings.phone.replace(/[^0-9+]/g, '')}`)}
                  activeOpacity={0.85}
                >
                  <Phone size={14} color={COLORS.cream} style={{ marginRight: 6 }} />
                  <Text style={styles.visitSecondaryBtnText}>Call Now</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.visitWhatsAppBtn}
                  onPress={() => Linking.openURL(`https://wa.me/919734471490?text=${encodeURIComponent('Hello Dream Love Cafe, I would like to inquire about dining.')}`)}
                  activeOpacity={0.85}
                >
                  <MessageSquare size={14} color={COLORS.brandTurquoise} style={{ marginRight: 6 }} />
                  <Text style={styles.visitWhatsAppBtnText}>WhatsApp</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* ── 10. INVITATION RESERVATION BANNER ── */}
      <View style={[styles.sectionContainer, styles.sectionAlt]}>
        <View style={styles.sectionInner}>
          <View style={styles.reserveBannerCard}>
            <View style={styles.reserveBannerIcon}>
              <Heart size={24} color={COLORS.brandHeart} fill={COLORS.brandHeart} />
            </View>

            <Text style={styles.reserveBannerEyebrow}>FAMILY DINING & PRIVATE BOOTHS</Text>
            <Text style={styles.reserveBannerTitle}>
              Reserve Your Table at Dream Love
            </Text>
            <Text style={styles.reserveBannerSub}>
              Planning a family dinner, anniversary celebration, or evening coffee with friends? Reserve your table in advance for seamless hospitality and prompt preparation.
            </Text>

            {/* Reassurance Checklist Strip */}
            <View style={styles.reservePerksRow}>
              <View style={styles.reservePerkItem}>
                <Check size={14} color={COLORS.brandTurquoise} style={{ marginRight: 5 }} />
                <Text style={styles.reservePerkText}>Instant WhatsApp Confirmation</Text>
              </View>
              <View style={styles.reservePerkItem}>
                <Check size={14} color={COLORS.brandTurquoise} style={{ marginRight: 5 }} />
                <Text style={styles.reservePerkText}>Zero Booking Fees</Text>
              </View>
              <View style={styles.reservePerkItem}>
                <Check size={14} color={COLORS.gold} style={{ marginRight: 5 }} />
                <Text style={styles.reservePerkText}>Birthday & Party Decor on Request</Text>
              </View>
              <View style={styles.reservePerkItem}>
                <Check size={14} color={COLORS.brandHeart} style={{ marginRight: 5 }} />
                <Text style={styles.reservePerkText}>Fresh Clay-Oven Cooking</Text>
              </View>
            </View>

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
                <Text style={styles.bannerCallBtnText}>Call: {settings.phone}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Fullscreen Lightbox Modal for Real Photos & Real Videos */}
      <Lightbox
        items={allHomeMedia}
        currentIndex={selectedPhotoIdx}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onSelectIndex={setSelectedPhotoIdx}
      />

      {/* Fullscreen Original Printed Menu (6 Pages) Viewer */}
      <OriginalMenuViewer
        isOpen={originalMenuOpen}
        onClose={() => setOriginalMenuOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: COLORS.background,
  },

  // ── 2. QUICK TRUST & CUISINE RIBBON ──
  ribbonSection: {
    backgroundColor: 'rgba(23, 19, 18, 0.90)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
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
    minWidth: '100%',
    gap: 14,
    paddingVertical: 2,
  },
  ribbonTrustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(33, 27, 25, 0.65)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 6,
  },
  ribbonBadgeIcon: {
    flexShrink: 0,
  },
  ribbonTrustText: {
    color: COLORS.cream,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  ribbonTrustHighlight: {
    color: COLORS.brandTurquoise,
    fontWeight: '700',
  },
  ribbonTrustSub: {
    color: COLORS.creamMuted,
    fontSize: 11.5,
    fontWeight: '400',
  },
  ribbonDividerVertical: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginHorizontal: 2,
  },

  // ── GENERAL SECTION LAYOUT ──
  sectionContainer: {
    width: '100%',
    paddingVertical: 56,
  },
  sectionAlt: {
    backgroundColor: 'rgba(23, 19, 18, 0.55)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  sectionInner: {
    maxWidth: LAYOUT.maxContainerWidth,
    width: '100%',
    marginHorizontal: 'auto',
    paddingHorizontal: SPACING.lg,
  },
  sectionHeaderCentered: {
    alignItems: 'center',
    marginBottom: 36,
    width: '100%',
  },
  sectionEyebrow: {
    color: COLORS.copper,
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 2.2,
    textTransform: 'uppercase',
    marginBottom: 8,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  sectionTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.cream,
    lineHeight: 44,
    letterSpacing: -0.3,
    marginBottom: 10,
    textAlign: 'center',
  },
  sectionTitleMobile: {
    fontSize: 26,
    lineHeight: 34,
  },
  sectionSubtitle: {
    fontSize: 14.5,
    color: COLORS.creamMuted,
    textAlign: 'center',
    maxWidth: 640,
    lineHeight: 22,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  sectionSubtitleLeft: {
    fontSize: 14,
    color: COLORS.creamMuted,
    maxWidth: 540,
    lineHeight: 21,
    marginTop: 4,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },

  // ── 3. STORY SECTION ──
  storyGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 44,
    width: '100%',
  },
  storyGridMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 28,
  },
  storyImageWrapper: {
    flex: 1,
    height: 420,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 8,
  },
  storyImageWrapperMobile: {
    width: '100%',
    height: 260,
  },
  storyImage: {
    width: '100%',
    height: '100%',
  },
  storyOverlayGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(11, 9, 9, 0.25)',
  },
  storyTopBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(18, 15, 14, 0.90)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BORDER_RADIUS.full,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(36, 213, 197, 0.35)',
  },
  storyTopBadgeText: {
    color: COLORS.cream,
    fontSize: 11.5,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  storyPullQuote: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(18, 15, 14, 0.92)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(217, 164, 65, 0.35)',
  },
  storyPullQuoteText: {
    color: COLORS.cream,
    fontSize: 12.5,
    fontWeight: '600',
    fontStyle: 'italic',
    lineHeight: 18,
    fontFamily: TYPOGRAPHY.fontFamilySans,
    flex: 1,
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
    marginBottom: 14,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  highlightsGrid: {
    marginTop: 8,
    marginBottom: 18,
    gap: 12,
    width: '100%',
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    backgroundColor: 'rgba(33, 27, 25, 0.70)',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    width: '100%',
  },
  highlightIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  highlightTitle: {
    color: COLORS.cream,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 3,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  highlightDesc: {
    color: COLORS.creamMuted,
    fontSize: 12.5,
    lineHeight: 18,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  storyReadMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  storyReadMoreText: {
    color: COLORS.brandTurquoise,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },

  // ── 4. INSIDE DREAM LOVE (Video Highlights) ──
  insideGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: 28,
    width: '100%',
  },
  insideGridMobile: {
    flexDirection: 'column',
    gap: 16,
    width: '100%',
  },
  insideCard: {
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    backgroundColor: COLORS.surface,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 5,
  },
  insideCardDesktop: {
    width: '48.5%',
    height: 280,
  },
  insideCardMobile: {
    width: '100%',
    height: 240,
  },
  insideImage: {
    width: '100%',
    height: '100%',
  },
  insideOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(11, 9, 9, 0.42)',
  },
  insidePlayBadge: {
    position: 'absolute',
    top: '38%',
    left: '50%',
    transform: [{ translateX: -26 }, { translateY: -26 }],
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(233, 30, 69, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#FF2D5D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 6,
  },
  insideTagRow: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  insideTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(11, 9, 9, 0.82)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(36, 213, 197, 0.45)',
  },
  insideTagText: {
    color: COLORS.brandTurquoise,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  insideCategoryText: {
    color: COLORS.creamMuted,
    fontSize: 11,
    fontWeight: '700',
    backgroundColor: 'rgba(11, 9, 9, 0.75)',
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: BORDER_RADIUS.sm,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  insideInfo: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    right: 14,
    backgroundColor: 'rgba(18, 15, 14, 0.88)',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  insideTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 3,
  },
  insideCaption: {
    fontSize: 12,
    color: COLORS.creamMuted,
    lineHeight: 16,
    fontFamily: TYPOGRAPHY.fontFamilySans,
    marginBottom: 4,
  },
  insideMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insideMetaText: {
    fontSize: 11,
    color: COLORS.gold,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  insideActionRow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  insideActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: 'rgba(36, 213, 197, 0.35)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: BORDER_RADIUS.md,
  },
  insideActionBtnText: {
    color: COLORS.cream,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },

  // ── 5. REAL PHOTOGRAPHY SECTION ──
  editorialGalleryContainer: {
    width: '100%',
    marginBottom: 24,
    gap: 18,
  },
  galleryHeroCard: {
    width: '100%',
    height: 360,
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    backgroundColor: COLORS.surface,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 6,
  },
  galleryHeroCardMobile: {
    height: 260,
  },
  galleryHeroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(11, 9, 9, 0.32)',
  },
  galleryHeroTopBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(18, 15, 14, 0.90)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BORDER_RADIUS.full,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(217, 164, 65, 0.40)',
  },
  galleryHeroBadgeText: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  galleryHeroInfo: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 60,
    backgroundColor: 'rgba(18, 15, 14, 0.88)',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  galleryHeroTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 4,
  },
  galleryHeroSubtitle: {
    fontSize: 13,
    color: COLORS.creamMuted,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  gallerySupportingGrid: {
    flexDirection: 'row',
    gap: 18,
    width: '100%',
  },
  gallerySupportingGridMobile: {
    flexDirection: 'column',
    gap: 14,
  },
  supportingPhotoCard: {
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: COLORS.surface,
  },
  supportingPhotoCardDesktop: {
    flex: 1,
    height: 240,
  },
  supportingPhotoCardMobile: {
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
    backgroundColor: 'rgba(11, 9, 9, 0.35)',
  },
  photoInfo: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(18, 15, 14, 0.88)',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
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
    fontSize: 15,
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
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(18, 15, 14, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  galleryActionRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  viewFullGalleryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: BORDER_RADIUS.md,
  },
  viewFullGalleryBtnText: {
    color: COLORS.cream,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },

  // ── 6. MENU DISCOVERY SECTION ──
  menuSectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 16,
    width: '100%',
  },
  menuDietaryStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 10,
    flexWrap: 'wrap',
  },
  menuDietaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuDietaryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  menuDietaryText: {
    color: COLORS.creamMuted,
    fontSize: 11.5,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  menuHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
    marginTop: 8,
  },
  viewPrintedMenuBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(217, 164, 65, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(217, 164, 65, 0.45)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: BORDER_RADIUS.md,
  },
  viewPrintedMenuBtnText: {
    color: COLORS.gold,
    fontSize: 13,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  viewAllMenuBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  viewAllMenuBtnText: {
    color: COLORS.brandTurquoise,
    fontSize: 13.5,
    fontWeight: '700',
    marginRight: 4,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  homeCategoryPills: {
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 10,
    marginBottom: 22,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(33, 27, 25, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 6,
  },
  categoryPillActive: {
    backgroundColor: 'rgba(36, 213, 197, 0.18)',
    borderColor: COLORS.brandTurquoise,
  },
  categoryPillText: {
    color: COLORS.creamMuted,
    fontSize: 12.5,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  categoryPillTextActive: {
    color: COLORS.brandTurquoise,
    fontWeight: '700',
  },
  categoryCountBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
  },
  categoryCountBadgeActive: {
    backgroundColor: 'rgba(36, 213, 197, 0.35)',
  },
  categoryCountText: {
    color: COLORS.creamMuted,
    fontSize: 11,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  categoryCountTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  menuGridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
    marginBottom: 24,
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
  menuBottomActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    flexWrap: 'wrap',
    marginTop: 16,
  },
  browseAllDishesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.brandHeart,
    paddingVertical: 13,
    paddingHorizontal: 26,
    borderRadius: BORDER_RADIUS.md,
    shadowColor: COLORS.brandHeart,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  browseAllDishesBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  browsePrintedMenuBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: 'rgba(217, 164, 65, 0.50)',
    paddingVertical: 13,
    paddingHorizontal: 22,
    borderRadius: BORDER_RADIUS.md,
  },
  browsePrintedMenuBtnText: {
    color: COLORS.gold,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },

  // ── 7. FEATURED DISHES ──
  featuredDishesContainer: {
    flexDirection: 'row',
    gap: 24,
    width: '100%',
  },
  featuredDishesMobile: {
    flexDirection: 'column',
    gap: 18,
    width: '100%',
  },
  heroDishCard: {
    width: '100%',
    position: 'relative',
  },
  heroDishBanner: {
    backgroundColor: 'rgba(217, 164, 65, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(217, 164, 65, 0.45)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  heroDishBannerText: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    fontFamily: TYPOGRAPHY.fontFamilySans,
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

  // ── 8. REVIEWS SECTION ──
  ratingsSummaryStrip: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  ratingSummaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(33, 27, 25, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    paddingVertical: 8,
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
    color: COLORS.creamMuted,
    fontSize: 11.5,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  ratingTrustTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 125, 50, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(46, 125, 50, 0.35)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: BORDER_RADIUS.full,
  },
  ratingTrustTagText: {
    color: '#A5D6A7',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  reviewsGridRow: {
    flexDirection: 'row',
    gap: 18,
    marginBottom: 24,
    width: '100%',
  },
  reviewsGridRowMobile: {
    flexDirection: 'column',
    gap: 14,
    width: '100%',
  },
  homeReviewCard: {
    backgroundColor: 'rgba(33, 27, 25, 0.75)',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
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
    marginBottom: 12,
  },
  reviewQuoteSymbol: {
    fontSize: 32,
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    color: 'rgba(217, 164, 65, 0.45)',
    lineHeight: 32,
    marginRight: 8,
  },
  starCluster: {
    flexDirection: 'row',
    flex: 1,
  },
  reviewSourceTag: {
    backgroundColor: 'rgba(36, 213, 197, 0.12)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: BORDER_RADIUS.xs,
    borderWidth: 1,
    borderColor: 'rgba(36, 213, 197, 0.30)',
  },
  reviewSourceTagText: {
    color: COLORS.brandTurquoise,
    fontSize: 10,
    fontWeight: '800',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  reviewQuoteText: {
    fontSize: 13.5,
    color: COLORS.creamMuted,
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: 16,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  reviewCardAuthorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  reviewAuthorGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  reviewAvatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(217, 164, 65, 0.20)',
    borderWidth: 1,
    borderColor: 'rgba(217, 164, 65, 0.40)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewAvatarInitial: {
    color: COLORS.gold,
    fontSize: 13,
    fontWeight: '800',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  reviewAuthorName: {
    color: COLORS.cream,
    fontSize: 13,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  reviewAuthorTag: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  reviewSourceLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewSourceLinkText: {
    color: COLORS.brandTurquoise,
    fontSize: 11.5,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  reviewsActionRow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewAllReviewsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  viewAllReviewsBtnText: {
    color: COLORS.brandTurquoise,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },

  // ── 9. VISIT & LOCATION SECTION ──
  visitSplitGrid: {
    flexDirection: 'row',
    gap: 40,
    alignItems: 'center',
    width: '100%',
  },
  visitSplitGridMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 26,
    width: '100%',
  },
  visitMapWrapper: {
    flex: 1.1,
    height: 380,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    backgroundColor: COLORS.surface,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 6,
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
  liveOpenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 125, 50, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.40)',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: BORDER_RADIUS.full,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  liveOpenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  liveOpenText: {
    color: '#A5D6A7',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  visitLandmarkBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(33, 27, 25, 0.70)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(217, 164, 65, 0.25)',
    marginBottom: 14,
  },
  visitLandmarkText: {
    color: COLORS.creamMuted,
    fontSize: 12.5,
    lineHeight: 18,
    fontFamily: TYPOGRAPHY.fontFamilySans,
    flex: 1,
  },
  visitInfoRows: {
    marginVertical: 10,
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
    color: COLORS.copper,
    fontSize: 10.5,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '700',
    marginBottom: 2,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  visitItemValue: {
    color: COLORS.cream,
    fontSize: 13.5,
    fontWeight: '600',
    lineHeight: 19,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  visitSubNote: {
    color: COLORS.creamMuted,
    fontSize: 11.5,
    marginTop: 2,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  visitPlusCode: {
    color: COLORS.brandTurquoise,
    fontSize: 11.5,
    marginTop: 2,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  visitActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    flexWrap: 'wrap',
  },
  visitPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.copper,
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: BORDER_RADIUS.md,
    shadowColor: COLORS.copper,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
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
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: BORDER_RADIUS.md,
  },
  visitSecondaryBtnText: {
    color: COLORS.cream,
    fontSize: 13,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  visitWhatsAppBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(36, 213, 197, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(36, 213, 197, 0.40)',
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: BORDER_RADIUS.md,
  },
  visitWhatsAppBtnText: {
    color: COLORS.brandTurquoise,
    fontSize: 13,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },

  // ── 10. INVITATION RESERVATION BANNER ──
  reserveBannerCard: {
    backgroundColor: 'rgba(26, 20, 18, 0.90)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(217, 164, 65, 0.40)',
    padding: SPACING.xxl,
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: 880,
    width: '100%',
    marginHorizontal: 'auto',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 8,
  },
  reserveBannerIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 45, 93, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 45, 93, 0.35)',
  },
  reserveBannerEyebrow: {
    color: COLORS.copper,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  reserveBannerTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.cream,
    textAlign: 'center',
    marginBottom: 8,
  },
  reserveBannerSub: {
    fontSize: 14,
    color: COLORS.creamMuted,
    textAlign: 'center',
    maxWidth: 580,
    lineHeight: 22,
    marginBottom: 20,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  reservePerksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 14,
    marginBottom: 24,
    maxWidth: 720,
  },
  reservePerkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(33, 27, 25, 0.65)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  reservePerkText: {
    color: COLORS.cream,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  reserveBannerActions: {
    flexDirection: 'row',
    gap: 14,
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  bannerReserveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.brandHeart,
    paddingVertical: 13,
    paddingHorizontal: 26,
    borderRadius: BORDER_RADIUS.md,
    minWidth: 200,
    shadowColor: COLORS.brandHeart,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
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
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: 'rgba(217, 164, 65, 0.45)',
    paddingVertical: 13,
    paddingHorizontal: 22,
    borderRadius: BORDER_RADIUS.md,
    minWidth: 190,
  },
  bannerCallBtnText: {
    color: COLORS.cream,
    fontSize: 13.5,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
});

