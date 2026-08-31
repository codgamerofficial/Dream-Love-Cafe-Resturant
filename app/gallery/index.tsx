import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { Maximize2, Camera } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, LAYOUT, SHADOWS } from '../../src/theme';
import { useSettings } from '../../src/context/SettingsContext';
import { Lightbox } from '../../src/components/ui/Lightbox';

export default function GalleryPage() {
  const { width } = useWindowDimensions();
  const { galleryItems } = useSettings();

  const isMobile = width < 600;
  const isTablet = width >= 600 && width < 920;
  const isDesktop = width >= 920;

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const handleOpenLightbox = (index: number) => {
    setSelectedIdx(index);
    setLightboxOpen(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Header */}
        <View style={styles.headerBox}>
          <Text style={styles.preTitle}>EDITORIAL VISUAL GALLERY</Text>
          <Text style={[styles.title, isMobile && styles.titleMobile]}>The Dream Love Experience</Text>
          <Text style={[styles.subtitle, isMobile && styles.subtitleMobile]}>
            Moments, signature dishes, handcrafted drinks, and warm evening dining atmosphere in Contai.
          </Text>
        </View>

        {/* Responsive Grid */}
        <View style={styles.galleryGrid}>
          {galleryItems.map((item, index) => (
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
            >
              <Image
                source={{ uri: item.image_url }}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.cardOverlay} />

              <View style={styles.cardInfo}>
                <Text style={styles.categoryBadge}>{item.category}</Text>
                <Text style={styles.cardTitle}>{item.title}</Text>
                {item.caption && <Text style={styles.cardCaption} numberOfLines={2}>{item.caption}</Text>}
              </View>

              <View style={styles.expandBtn}>
                <Maximize2 size={14} color={COLORS.cream} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Fullscreen Lightbox Modal */}
        <Lightbox
          items={galleryItems}
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
    maxWidth: 600,
    lineHeight: 23,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  subtitleMobile: {
    fontSize: 13.5,
    lineHeight: 20,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
  },
  galleryCard: {
    width: '31.8%',
    height: 270,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceElevated,
    ...SHADOWS.card,
  },
  galleryCardTablet: {
    width: '48%',
    height: 250,
  },
  galleryCardMobile: {
    width: '100%',
    height: 220,
  },
  galleryCardFeatured: {
    width: '48.8%',
    height: 290,
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
    backgroundColor: 'rgba(18, 15, 14, 0.42)',
  },
  cardInfo: {
    position: 'absolute',
    bottom: SPACING.md,
    left: SPACING.md,
    right: SPACING.md,
  },
  categoryBadge: {
    color: COLORS.brandTurquoise,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 2,
    textTransform: 'uppercase',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  cardTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 2,
  },
  cardCaption: {
    fontSize: 12,
    color: COLORS.creamMuted,
    lineHeight: 16,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  expandBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(18, 15, 14, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
