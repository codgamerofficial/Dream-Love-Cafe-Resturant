import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Modal, 
  ScrollView, 
  Platform, 
  useWindowDimensions 
} from 'react-native';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  BookOpen, 
  Sparkles,
  Maximize2
} from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../theme';

export const ORIGINAL_MENU_PAGES = [
  {
    pageNumber: 1,
    title: 'Page 1 — Soups & Starters',
    imageUrl: '/menu-artwork/menu_page_1.jpg',
    description: 'Hot soups, vegetarian & non-vegetarian Chinese starters and appetizers'
  },
  {
    pageNumber: 2,
    title: 'Page 2 — Tandoori, Breads & Rice',
    imageUrl: '/menu-artwork/menu_page_2.jpg',
    description: 'Clay-oven tandoori kebabs, authentic rotis, naans, kulchas and fragrant rice'
  },
  {
    pageNumber: 3,
    title: 'Page 3 — Side Dishes & Noodles',
    imageUrl: '/menu-artwork/menu_page_3.jpg',
    description: 'Vegetarian & non-vegetarian curries, chowmin, chopci and gravies'
  },
  {
    pageNumber: 4,
    title: 'Page 4 — Rolls, Salads & Accompaniments',
    imageUrl: '/menu-artwork/menu_page_4.jpg',
    description: 'Kathi rolls, fresh tossed salads, raitas and traditional lassis'
  },
  {
    pageNumber: 5,
    title: 'Page 5 — Shakes, Juices & Mocktails',
    imageUrl: '/menu-artwork/menu_page_5.jpg',
    description: 'Ice-cream shakes, seasonal fresh juices, coolers and hot drinks'
  },
  {
    pageNumber: 6,
    title: 'Page 6 — Dream Love Chef Specials',
    imageUrl: '/menu-artwork/menu_page_6.jpg',
    description: 'Exclusive house specialty dishes, chicken vorta and seafood delicacies'
  },
];

interface OriginalMenuViewerProps {
  isOpen: boolean;
  onClose: () => void;
  initialPage?: number;
}

export const OriginalMenuViewer: React.FC<OriginalMenuViewerProps> = ({
  isOpen,
  onClose,
  initialPage = 1,
}) => {
  const { width, height } = useWindowDimensions();
  const [currentPageIdx, setCurrentPageIdx] = useState(Math.max(0, initialPage - 1));
  const [zoomLevel, setZoomLevel] = useState(1);
  const [imageError, setImageError] = useState(false);

  const isDesktop = width >= 860;
  const isMobile = width < 600;

  // Reset page when reopened
  useEffect(() => {
    if (isOpen) {
      setCurrentPageIdx(Math.max(0, Math.min(initialPage - 1, ORIGINAL_MENU_PAGES.length - 1)));
      setZoomLevel(1);
      setImageError(false);
    }
  }, [isOpen, initialPage]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowLeft') {
      setCurrentPageIdx((prev) => (prev > 0 ? prev - 1 : ORIGINAL_MENU_PAGES.length - 1));
      setZoomLevel(1);
    } else if (e.key === 'ArrowRight') {
      setCurrentPageIdx((prev) => (prev < ORIGINAL_MENU_PAGES.length - 1 ? prev + 1 : 0));
      setZoomLevel(1);
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown]);

  if (!isOpen) return null;

  const currentPage = ORIGINAL_MENU_PAGES[currentPageIdx];

  const handlePrev = () => {
    setCurrentPageIdx((prev) => (prev > 0 ? prev - 1 : ORIGINAL_MENU_PAGES.length - 1));
    setZoomLevel(1);
    setImageError(false);
  };

  const handleNext = () => {
    setCurrentPageIdx((prev) => (prev < ORIGINAL_MENU_PAGES.length - 1 ? prev + 1 : 0));
    setZoomLevel(1);
    setImageError(false);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.35, 2.8));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.35, 0.75));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        {/* Top Floating Action Bar */}
        <View style={styles.topBar}>
          {/* Left: Branding & Page indicator */}
          <View style={styles.topBarLeft}>
            <BookOpen size={20} color={COLORS.warmGold} style={{ marginRight: 8 }} />
            <View>
              <Text style={styles.topBarTitle}>Original Printed Menu</Text>
              <Text style={styles.topBarSub}>
                Page {currentPage.pageNumber} of {ORIGINAL_MENU_PAGES.length} • {currentPage.title}
              </Text>
            </View>
          </View>

          {/* Center/Right: Zoom Controls */}
          <View style={styles.controlsGroup}>
            <TouchableOpacity
              style={styles.controlBtn}
              onPress={handleZoomOut}
              accessibilityLabel="Zoom out"
              activeOpacity={0.8}
            >
              <ZoomOut size={17} color={COLORS.cream} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlBtn, zoomLevel !== 1 && styles.controlBtnActive]}
              onPress={handleResetZoom}
              accessibilityLabel="Reset zoom to 100%"
              activeOpacity={0.8}
            >
              <Text style={styles.zoomText}>{Math.round(zoomLevel * 100)}%</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlBtn}
              onPress={handleZoomIn}
              accessibilityLabel="Zoom in"
              activeOpacity={0.8}
            >
              <ZoomIn size={17} color={COLORS.cream} />
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              accessibilityLabel="Close original menu viewer"
              activeOpacity={0.8}
            >
              <X size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Viewing Canvas */}
        <View style={styles.canvasArea}>
          {/* Navigation Arrows */}
          <TouchableOpacity
            style={[styles.navArrow, styles.navArrowLeft]}
            onPress={handlePrev}
            accessibilityLabel="Previous page"
            activeOpacity={0.85}
          >
            <ChevronLeft size={28} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navArrow, styles.navArrowRight]}
            onPress={handleNext}
            accessibilityLabel="Next page"
            activeOpacity={0.85}
          >
            <ChevronRight size={28} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Scrollable Zoom Area */}
          <ScrollView
            style={styles.scrollCanvas}
            contentContainerStyle={[
              styles.scrollCanvasContent,
              { transform: [{ scale: zoomLevel }] } as any
            ]}
            maximumZoomScale={3}
            minimumZoomScale={0.8}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            {!imageError ? (
              <Image
                source={{ uri: currentPage.imageUrl }}
                style={[
                  styles.menuArtworkImage,
                  {
                    width: Math.min(width * (isMobile ? 0.96 : 0.85), 780),
                    height: Math.min(height * (isMobile ? 0.72 : 0.76), 1100),
                  }
                ]}
                resizeMode="contain"
                onError={() => setImageError(true)}
              />
            ) : (
              <View style={styles.errorBox}>
                <BookOpen size={48} color={COLORS.warmGold} style={{ marginBottom: 12 }} />
                <Text style={styles.errorTitle}>Printed Menu Page {currentPage.pageNumber}</Text>
                <Text style={styles.errorDesc}>{currentPage.description}</Text>
                <Text style={styles.errorSub}>The full canonical dishes are available in the interactive public menu.</Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/* Bottom Thumbnail Strip */}
        <View style={styles.bottomBar}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailStrip}
          >
            {ORIGINAL_MENU_PAGES.map((page, idx) => {
              const isSelected = idx === currentPageIdx;
              return (
                <TouchableOpacity
                  key={page.pageNumber}
                  style={[
                    styles.thumbnailCard,
                    isSelected && styles.thumbnailCardSelected
                  ]}
                  onPress={() => {
                    setCurrentPageIdx(idx);
                    setZoomLevel(1);
                    setImageError(false);
                  }}
                  activeOpacity={0.85}
                >
                  <Image
                    source={{ uri: page.imageUrl }}
                    style={styles.thumbnailImage}
                    resizeMode="cover"
                  />
                  <View style={[styles.thumbnailBadge, isSelected && styles.thumbnailBadgeSelected]}>
                    <Text style={[styles.thumbnailBadgeText, isSelected && styles.thumbnailBadgeTextSelected]}>
                      P{page.pageNumber}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(11, 9, 9, 0.97)',
    justifyContent: 'space-between',
    zIndex: 10000,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(244, 238, 231, 0.08)',
    backgroundColor: 'rgba(23, 19, 18, 0.85)',
    zIndex: 20,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  topBarTitle: {
    fontFamily: TYPOGRAPHY.fontFamilyDisplay,
    fontSize: 19,
    color: COLORS.cream,
    letterSpacing: -0.2,
  },
  topBarSub: {
    fontFamily: TYPOGRAPHY.fontFamilySans,
    fontSize: 12,
    color: COLORS.mutedText,
    marginTop: 1,
  },
  controlsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlBtn: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlBtnActive: {
    borderColor: COLORS.brandTurquoise,
    backgroundColor: 'rgba(36, 213, 197, 0.15)',
  },
  zoomText: {
    fontFamily: TYPOGRAPHY.fontFamilySans,
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.cream,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.brandHeart,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  canvasArea: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  navArrow: {
    position: 'absolute',
    top: '48%',
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(23, 19, 18, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 15,
  },
  navArrowLeft: {
    left: 18,
  },
  navArrowRight: {
    right: 18,
  },
  scrollCanvas: {
    flex: 1,
    width: '100%',
  },
  scrollCanvasContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
  },
  menuArtworkImage: {
    borderRadius: BORDER_RADIUS.lg,
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.75)',
  } as any,
  errorBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    maxWidth: 500,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    textAlign: 'center',
  },
  errorTitle: {
    fontFamily: TYPOGRAPHY.fontFamilyDisplay,
    fontSize: 22,
    color: COLORS.cream,
    marginBottom: 6,
  },
  errorDesc: {
    fontFamily: TYPOGRAPHY.fontFamilySans,
    fontSize: 14,
    color: COLORS.mutedText,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSub: {
    fontFamily: TYPOGRAPHY.fontFamilySans,
    fontSize: 12,
    color: COLORS.brandTurquoise,
    textAlign: 'center',
  },
  bottomBar: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: 'rgba(23, 19, 18, 0.90)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(244, 238, 231, 0.08)',
    zIndex: 20,
  },
  thumbnailStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: SPACING.md,
  },
  thumbnailCard: {
    width: 60,
    height: 80,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    position: 'relative',
    opacity: 0.65,
  },
  thumbnailCardSelected: {
    borderColor: COLORS.warmGold,
    opacity: 1,
    transform: [{ scale: 1.05 }],
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  thumbnailBadgeSelected: {
    backgroundColor: COLORS.warmGold,
  },
  thumbnailBadgeText: {
    fontFamily: TYPOGRAPHY.fontFamilySans,
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  thumbnailBadgeTextSelected: {
    color: COLORS.nearBlack,
  },
});
