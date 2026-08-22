import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { Maximize2 } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../src/theme';
import { useSettings } from '../../src/context/SettingsContext';
import { Lightbox } from '../../src/components/ui/Lightbox';

export default function GalleryPage() {
  const { width } = useWindowDimensions();
  const { galleryItems } = useSettings();
  const isDesktop = width >= 768;

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
          <Text style={styles.title}>The Dream Love Experience</Text>
          <Text style={styles.subtitle}>
            Moments, signature dishes, handcrafted drinks, and warm evening dining atmosphere.
          </Text>
        </View>

        {/* Desktop Masonry / Mobile Responsive Grid */}
        <View style={[styles.galleryGrid, !isDesktop && styles.galleryGridMobile]}>
          {galleryItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.galleryCard,
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
                {item.caption && <Text style={styles.cardCaption}>{item.caption}</Text>}
              </View>

              <View style={styles.expandBtn}>
                <Maximize2 size={16} color={COLORS.cream} />
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
  scrollContent: {
    paddingVertical: SPACING.xxl,
  },
  innerContainer: {
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: SPACING.md,
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  preTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.copper,
    letterSpacing: 2.5,
    marginBottom: 6,
  },
  title: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.cream,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    maxWidth: 600,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  galleryGridMobile: {
    flexDirection: 'column',
    gap: 16,
  },
  galleryCard: {
    width: Platform.OS === 'web' ? 'calc(33.33% - 14px)' as any : '100%',
    height: 280,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceElevated,
    ...SHADOWS.card,
  },
  galleryCardFeatured: {
    width: Platform.OS === 'web' ? 'calc(50% - 10px)' as any : '100%',
    height: 340,
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
    backgroundColor: 'rgba(18, 15, 14, 0.45)',
  },
  cardInfo: {
    position: 'absolute',
    bottom: SPACING.md,
    left: SPACING.md,
    right: SPACING.md,
  },
  categoryBadge: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  cardTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 2,
  },
  cardCaption: {
    fontSize: 12,
    color: COLORS.creamMuted,
  },
  expandBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(18, 15, 14, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
