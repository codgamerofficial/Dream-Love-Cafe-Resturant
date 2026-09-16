import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, Modal, TouchableOpacity, Platform } from 'react-native';
import { X, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { GalleryItem } from '../../types';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../theme';

interface LightboxProps {
  items: GalleryItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  items,
  currentIndex,
  isOpen,
  onClose,
  onSelectIndex,
}) => {
  const handlePrev = useCallback(() => {
    if (!items || items.length === 0) return;
    const prev = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
    onSelectIndex(prev);
  }, [currentIndex, items, onSelectIndex]);

  const handleNext = useCallback(() => {
    if (!items || items.length === 0) return;
    const next = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
    onSelectIndex(next);
  }, [currentIndex, items, onSelectIndex]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!isOpen || !items || items.length === 0) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === 'ArrowRight') handleNext();
    };
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKey);
      return () => window.removeEventListener('keydown', handleKey);
    }
  }, [isOpen, items, onClose, handlePrev, handleNext]);

  if (!isOpen || !items || items.length === 0) return null;

  const currentItem = items[currentIndex] || items[0];
  const isVideo = currentItem?.image_url?.endsWith('.mp4') || (currentItem as any)?.media_type === 'video';

  return (
    <Modal visible={isOpen} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.lightboxContainer}>
        {/* Top Control Bar */}
        <View style={styles.topBar}>
          <Text style={styles.counterText}>
            {currentIndex + 1} / {items.length}
          </Text>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} accessibilityLabel="Close lightbox">
            <X size={26} color={COLORS.cream} />
          </TouchableOpacity>
        </View>

        {/* Main Image/Video Stage */}
        <View style={styles.imageStage}>
          <TouchableOpacity style={styles.navBtnLeft} onPress={handlePrev} accessibilityLabel="Previous media">
            <ChevronLeft size={36} color={COLORS.cream} />
          </TouchableOpacity>

          {isVideo && Platform.OS === 'web' ? (
            <video
              src={currentItem.image_url}
              controls
              autoPlay
              playsInline
              style={{
                maxWidth: '92%',
                maxHeight: '75vh',
                borderRadius: 14,
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.85)',
                outline: 'none',
              } as any}
            />
          ) : (
            <Image
              source={{ uri: currentItem.image_url }}
              style={styles.lightboxImage}
              resizeMode="contain"
            />
          )}

          <TouchableOpacity style={styles.navBtnRight} onPress={handleNext} accessibilityLabel="Next media">
            <ChevronRight size={36} color={COLORS.cream} />
          </TouchableOpacity>
        </View>

        {/* Caption Bar */}
        <View style={styles.bottomBar}>
          <Text style={styles.itemTitle}>{currentItem.title}</Text>
          {currentItem.caption && (
            <Text style={styles.itemCaption}>{currentItem.caption}</Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  lightboxContainer: {
    flex: 1,
    backgroundColor: 'rgba(12, 10, 9, 0.95)',
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: Platform.OS === 'ios' ? 44 : SPACING.md,
    paddingBottom: SPACING.md,
  },
  counterText: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  closeBtn: {
    padding: 8,
  },
  imageStage: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
  },
  navBtnLeft: {
    padding: 12,
    backgroundColor: 'rgba(26, 22, 21, 0.6)',
    borderRadius: BORDER_RADIUS.full,
    zIndex: 10,
  },
  navBtnRight: {
    padding: 12,
    backgroundColor: 'rgba(26, 22, 21, 0.6)',
    borderRadius: BORDER_RADIUS.full,
    zIndex: 10,
  },
  lightboxImage: {
    flex: 1,
    height: '80%',
    marginHorizontal: SPACING.md,
  },
  bottomBar: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: Platform.OS === 'ios' ? 36 : SPACING.xl,
    paddingTop: SPACING.md,
    backgroundColor: 'rgba(18, 15, 14, 0.8)',
    alignItems: 'center',
  },
  itemTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 4,
    textAlign: 'center',
  },
  itemCaption: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
