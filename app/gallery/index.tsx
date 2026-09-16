import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  useWindowDimensions, 
  Platform,
  ScrollView 
} from 'react-native';
import { Maximize2, Camera, Play, Sparkles, Film, Image as ImageIcon } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, LAYOUT, SHADOWS } from '../../src/theme';
import { useSettings } from '../../src/context/SettingsContext';
import { Lightbox } from '../../src/components/ui/Lightbox';
import { GalleryItem } from '../../src/types';

export type GalleryCategoryFilter = 'All' | 'Exterior' | 'Interior' | 'Dining' | 'Food' | 'Ambience';

const GALLERY_CATEGORIES: GalleryCategoryFilter[] = [
  'All',
  'Exterior',
  'Interior',
  'Dining',
  'Food',
  'Ambience',
];

export const REAL_MEDIA_GALLERY: (GalleryItem & { media_type?: 'image' | 'video'; poster_url?: string })[] = [
  // ── Real Videos ──
  {
    id: 'vid-interior-1',
    title: 'Warm Interior & Booth Dining',
    caption: 'Cinematic walk-through of the main dining room, lighting and private booth seating in Contai.',
    image_url: '/videos/restaurant_video_2.mp4',
    poster_url: '/photos/interior_cafe_lounge.jpg',
    category: 'Interior',
    alt_text: 'Interior dining room walk-through at Dream Love Cafe & Restaurant',
    source: 'Verified Real Video',
    owner_verified: true,
    is_featured: true,
    display_order: 1,
    media_type: 'video',
  },
  {
    id: 'vid-dining-counter',
    title: 'Dining Area & Food Counter Atmosphere',
    caption: 'Freshly prepared multi-cuisine service counter and evening restaurant ambiance.',
    image_url: '/videos/restaurant_video_4.mp4',
    poster_url: '/photos/interior_dining_counter.jpg',
    category: 'Dining',
    alt_text: 'Dining area and kitchen counter video at Dream Love Restaurant',
    source: 'Verified Real Video',
    owner_verified: true,
    is_featured: true,
    display_order: 2,
    media_type: 'video',
  },
  {
    id: 'vid-storefront',
    title: 'Entrance & Street Presence',
    caption: 'Location on Contai Bypass Road opposite Jawed Habib\'s near Central Bus Stand.',
    image_url: '/videos/restaurant_video_1.mp4',
    poster_url: '/photos/storefront_signboard.jpg',
    category: 'Exterior',
    alt_text: 'Entrance and storefront exterior video of Dream Love Cafe & Restaurant',
    source: 'Verified Real Video',
    owner_verified: true,
    is_featured: false,
    display_order: 3,
    media_type: 'video',
  },
  {
    id: 'vid-ambience',
    title: 'Evening Café Lighting & Mood',
    caption: 'Relaxed hospitality atmosphere designed for romantic dinners, family meals and casual coffee.',
    image_url: '/videos/restaurant_video_3.mp4',
    poster_url: '/photos/interior_cafe_lounge.jpg',
    category: 'Ambience',
    alt_text: 'Evening warm cafe lighting video at Dream Love Cafe',
    source: 'Verified Real Video',
    owner_verified: true,
    is_featured: false,
    display_order: 4,
    media_type: 'video',
  },

  // ── Real Photographs ──
  {
    id: 'photo-storefront',
    title: 'Storefront & Neon Signboard',
    caption: 'Main entrance on Contai Bypass Road opposite Jawed Habib\'s.',
    image_url: '/photos/storefront_signboard.jpg',
    poster_url: '/photos/storefront_signboard.jpg',
    category: 'Exterior',
    alt_text: 'Dream Love Cafe & Restaurant Storefront and Neon Signboard on Contai Bypass Road',
    source: 'Verified Real Photo',
    owner_verified: true,
    is_featured: true,
    display_order: 5,
    media_type: 'image',
  },
  {
    id: 'photo-cafe-lounge',
    title: 'Café Lounge & Booth Seating',
    caption: 'Warm ambiance with comfortable booth seating for family & friends.',
    image_url: '/photos/interior_cafe_lounge.jpg',
    poster_url: '/photos/interior_cafe_lounge.jpg',
    category: 'Interior',
    alt_text: 'Warm interior booth and table dining area at Dream Love Cafe & Restaurant Contai',
    source: 'Verified Real Photo',
    owner_verified: true,
    is_featured: true,
    display_order: 6,
    media_type: 'image',
  },
  {
    id: 'photo-dining-counter',
    title: 'Dining Counter & Kitchen',
    caption: 'Clean service area where fresh multi-cuisine dishes are prepared to order.',
    image_url: '/photos/interior_dining_counter.jpg',
    poster_url: '/photos/interior_dining_counter.jpg',
    category: 'Dining',
    alt_text: 'Hygienic dining counter and kitchen at Dream Love Cafe & Restaurant',
    source: 'Verified Real Photo',
    owner_verified: true,
    is_featured: false,
    display_order: 7,
    media_type: 'image',
  },
  {
    id: 'photo-street-view',
    title: 'Street View & Refreshment Kiosk',
    caption: 'Outdoor view showing the accessible roadside restaurant location in Contai.',
    image_url: '/photos/exterior_street_view.jpg',
    poster_url: '/photos/exterior_street_view.jpg',
    category: 'Exterior',
    alt_text: 'Street view and refreshment kiosk of Dream Love Cafe & Restaurant Contai',
    source: 'Verified Real Photo',
    owner_verified: true,
    is_featured: false,
    display_order: 8,
    media_type: 'image',
  },

  // ── Food & Culinary Highlights ──
  {
    id: 'photo-tandoori',
    title: 'Smoky Tandoori Chicken & Kebabs',
    caption: 'Marinated in yogurt, roasted whole spices and fired in clay oven.',
    image_url: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=1000&q=80',
    poster_url: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=1000&q=80',
    category: 'Food',
    alt_text: 'Clay oven tandoori chicken cooked at Dream Love Cafe & Restaurant',
    source: 'Culinary Selection',
    owner_verified: true,
    is_featured: false,
    display_order: 9,
    media_type: 'image',
  },
  {
    id: 'photo-biryani',
    title: 'Dum Biryani with Fragrant Basmati',
    caption: 'Slow cooked with saffron, tender chicken pieces and aromatic herbs.',
    image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1000&q=80',
    poster_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1000&q=80',
    category: 'Food',
    alt_text: 'Aromatic Dum Biryani at Dream Love Cafe & Restaurant',
    source: 'Culinary Selection',
    owner_verified: true,
    is_featured: false,
    display_order: 10,
    media_type: 'image',
  },
  {
    id: 'photo-mocktail',
    title: 'Handcrafted Mocktails & Coolers',
    caption: 'Chilled Blue Lemonade, fresh citrus infusions and seasonal fruit coolers.',
    image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1000&q=80',
    poster_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1000&q=80',
    category: 'Food',
    alt_text: 'Chilled mocktail cooler at Dream Love Cafe & Restaurant',
    source: 'Beverage Selection',
    owner_verified: true,
    is_featured: false,
    display_order: 11,
    media_type: 'image',
  },
  {
    id: 'photo-menu-page-1',
    title: 'Original Printed Menu Artwork — Soups & Starters',
    caption: 'Authentic 6-page physical menu artwork from the restaurant counter.',
    image_url: '/menu-artwork/menu_page_1.jpg',
    poster_url: '/menu-artwork/menu_page_1.jpg',
    category: 'Food',
    alt_text: 'Physical printed menu artwork of Dream Love Cafe & Restaurant',
    source: 'Original Menu Artwork',
    owner_verified: true,
    is_featured: false,
    display_order: 12,
    media_type: 'image',
  },
];

export default function GalleryPage() {
  const { width } = useWindowDimensions();
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategoryFilter>('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const isMobile = width < 600;
  const isTablet = width >= 600 && width < 960;
  const isDesktop = width >= 960;

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'All') return REAL_MEDIA_GALLERY;
    return REAL_MEDIA_GALLERY.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  const handleOpenLightbox = (index: number) => {
    setSelectedIdx(index);
    setLightboxOpen(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Header Box */}
        <View style={styles.headerBox}>
          <Text style={styles.preTitle}>REAL RESTAURANT FOOTAGE & PHOTOGRAPHY</Text>
          <Text style={[styles.title, isMobile && styles.titleMobile]}>The Dream Love Experience</Text>
          <Text style={[styles.subtitle, isMobile && styles.subtitleMobile]}>
            Real video tours, storefront photography, dining area atmosphere, and multi-cuisine culinary highlights from our Contai restaurant.
          </Text>
        </View>

        {/* Category Filter Pills */}
        <View style={styles.categoryFilterWrapper}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryFilterScroll}
          >
            {GALLERY_CATEGORIES.map((cat) => {
              const count = cat === 'All' 
                ? REAL_MEDIA_GALLERY.length 
                : REAL_MEDIA_GALLERY.filter((i) => i.category === cat).length;
              const isActive = selectedCategory === cat;

              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.filterPill, isActive && styles.filterPillActive]}
                  onPress={() => setSelectedCategory(cat)}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel={`Filter by ${cat}`}
                >
                  <Text style={[styles.filterPillText, isActive && styles.filterPillTextActive]}>
                    {cat} ({count})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Responsive Gallery Grid */}
        <View style={styles.galleryGrid}>
          {filteredItems.map((item, index) => {
            const isVideo = item.media_type === 'video' || item.image_url.endsWith('.mp4');

            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.galleryCard,
                  isMobile && styles.galleryCardMobile,
                  isTablet && styles.galleryCardTablet,
                  isDesktop && item.is_featured && styles.galleryCardFeatured,
                ]}
                onPress={() => handleOpenLightbox(index)}
                activeOpacity={0.9}
                accessibilityRole="button"
                accessibilityLabel={`Open ${item.title}`}
              >
                {/* Media Image / Video Poster */}
                <Image
                  source={{ uri: item.poster_url || item.image_url }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={styles.cardOverlay} />

                {/* Video Play Badge Indicator */}
                {isVideo && (
                  <View style={styles.videoBadgeIndicator}>
                    <Play size={18} color="#FFFFFF" fill="#FFFFFF" style={{ marginLeft: 2 }} />
                  </View>
                )}

                {/* Card Information */}
                <View style={styles.cardInfo}>
                  <View style={styles.badgeRow}>
                    <Text style={styles.categoryBadge}>{item.category}</Text>
                    {isVideo && (
                      <View style={styles.videoPill}>
                        <Film size={11} color={COLORS.brandTurquoise} style={{ marginRight: 4 }} />
                        <Text style={styles.videoPillText}>VIDEO</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  {item.caption && (
                    <Text style={styles.cardCaption} numberOfLines={2}>
                      {item.caption}
                    </Text>
                  )}
                </View>

                {/* Expand / Play Action Icon */}
                <View style={styles.expandBtn}>
                  {isVideo ? (
                    <Play size={14} color={COLORS.cream} fill={COLORS.cream} />
                  ) : (
                    <Maximize2 size={14} color={COLORS.cream} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Fullscreen Lightbox Modal */}
        <Lightbox
          items={filteredItems}
          currentIndex={selectedIdx}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          onSelectIndex={setSelectedIdx}
        />
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
    marginBottom: SPACING.xl,
  },
  preTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySans,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.brandTurquoise,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: SPACING.xs,
  },
  title: {
    fontFamily: TYPOGRAPHY.fontFamilyDisplay,
    fontSize: 48,
    color: COLORS.cream,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: SPACING.sm,
  },
  titleMobile: {
    fontSize: 34,
  },
  subtitle: {
    fontFamily: TYPOGRAPHY.fontFamilySans,
    fontSize: 16,
    color: COLORS.textMuted,
    textAlign: 'center',
    maxWidth: 680,
    lineHeight: 24,
  },
  subtitleMobile: {
    fontSize: 14,
    lineHeight: 20,
  },
  categoryFilterWrapper: {
    marginBottom: SPACING.xxl,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(244, 238, 231, 0.08)',
    paddingBottom: SPACING.md,
  },
  categoryFilterScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: SPACING.sm,
  },
  filterPill: {
    paddingVertical: 8,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
  },
  filterPillActive: {
    backgroundColor: 'rgba(36, 213, 197, 0.15)',
    borderColor: COLORS.brandTurquoise,
  },
  filterPillText: {
    fontFamily: TYPOGRAPHY.fontFamilySans,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.mutedText,
  },
  filterPillTextActive: {
    color: COLORS.brandTurquoise,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.lg,
  },
  galleryCard: {
    width: '31.5%',
    height: 310,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.40)',
  } as any,
  galleryCardTablet: {
    width: '47.8%',
    height: 290,
  },
  galleryCardMobile: {
    width: '100%',
    height: 270,
  },
  galleryCardFeatured: {
    borderColor: 'rgba(217, 164, 65, 0.45)',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(11, 9, 9, 0.45)',
    ...(Platform.OS === 'web'
      ? ({
          backgroundImage:
            'linear-gradient(180deg, rgba(11,9,9,0.1) 0%, rgba(11,9,9,0.4) 50%, rgba(11,9,9,0.92) 100%)',
        } as any)
      : {}),
  } as any,
  videoBadgeIndicator: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: [{ translateX: -24 }, { translateY: -24 }],
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 45, 93, 0.90)',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 24px rgba(255, 45, 93, 0.50)',
    zIndex: 5,
  } as any,
  cardInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.lg,
    zIndex: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  categoryBadge: {
    fontFamily: TYPOGRAPHY.fontFamilySans,
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.brandTurquoise,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  videoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(36, 213, 197, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  videoPillText: {
    fontFamily: TYPOGRAPHY.fontFamilySans,
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.brandTurquoise,
    letterSpacing: 0.8,
  },
  cardTitle: {
    fontFamily: TYPOGRAPHY.fontFamilyDisplay,
    fontSize: 20,
    color: COLORS.cream,
    marginBottom: 4,
  },
  cardCaption: {
    fontFamily: TYPOGRAPHY.fontFamilySans,
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 17,
  },
  expandBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(23, 19, 18, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    zIndex: 5,
  },
});
