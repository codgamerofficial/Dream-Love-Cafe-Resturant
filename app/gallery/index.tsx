import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { Maximize2 } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../src/theme';
import { useSettings } from '../../src/context/SettingsContext';
import { Lightbox } from '../../src/components/ui/Lightbox';

export default function GalleryPage() {
  const { width } = useWindowDimensions();
  const { galleryItems } = useSettings();

  const isMobile = width < 600;
  const isTablet = width >= 600 && width < 900;
  const isDesktop = width >= 900;

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
            Moments, signature dishes, handcrafted drinks, and warm evening dining atmosphere.
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
                <Maximize2 size={15} color={COLORS.cream} />
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
    maxWidth: 580,
    lineHeight: 19,
  },
  subtitleMobile: {
    fontSize: 12.5,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  galleryCard: {
    width: '31.8%',
    height: 260,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceElevated,
    ...SHADOWS.card,
  },
  galleryCardTablet: {
    width: '48.5%',
    height: 240,
  },
  galleryCardMobile: {
    width: '100%',
    height: 210,
  },
  galleryCardFeatured: {
    width: '48.8%',
    height: 280,
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
    backgroundColor: 'rgba(18, 15, 14, 0.40)',
  },
  cardInfo: {
    position: 'absolute',
    bottom: SPACING.md,
    left: SPACING.md,
    right: SPACING.md,
  },
  categoryBadge: {
    color: COLORS.brandTurquoise,
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 2,
  },
  cardCaption: {
    fontSize: 11.5,
    color: COLORS.creamMuted,
    lineHeight: 15,
  },
  expandBtn: {
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
});
