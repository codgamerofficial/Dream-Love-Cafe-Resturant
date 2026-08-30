import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  useWindowDimensions, 
  Platform 
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Search, Sparkles, Utensils, X, Check } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../src/theme';
import { useSettings } from '../../src/context/SettingsContext';
import { MenuCard } from '../../src/components/menu/MenuCard';
import { analytics } from '../../src/services/analytics';

export default function MenuPage() {
  const { category: urlCategory } = useLocalSearchParams<{ category?: string }>();
  const { width } = useWindowDimensions();
  const { categories, menuItems } = useSettings();

  const isSmallMobile = width < 380;
  const isMobile = width < 600;
  const isTablet = width >= 600 && width < 920;
  const isDesktop = width >= 920;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory || 'all');
  const [vegFilter, setVegFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [onlyFeatured, setOnlyFeatured] = useState(false);

  // Sync category if URL parameter changes
  React.useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(urlCategory);
      analytics.track('menu_view', { category: urlCategory });
    } else {
      analytics.track('menu_view', { category: 'all' });
    }
  }, [urlCategory]);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // 1. Search Query Filter (Dish name, category, or description)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesCategory = item.category?.toLowerCase().includes(query) || false;
        const matchesDesc = item.description?.toLowerCase().includes(query) || false;
        if (!matchesName && !matchesCategory && !matchesDesc) return false;
      }

      // 2. Category Filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // 3. Veg / Non-Veg Filter
      if (vegFilter === 'veg' && !item.isVeg) return false;
      if (vegFilter === 'non-veg' && item.isVeg) return false;

      // 4. Featured Filter
      if (onlyFeatured && !item.isFeatured) return false;

      return true;
    });
  }, [menuItems, searchQuery, selectedCategory, vegFilter, onlyFeatured]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setVegFilter('all');
    setOnlyFeatured(false);
  };

  return (
    <View style={styles.container}>
      {/* 1. EDITORIAL HEADER & SEARCH */}
      <View style={styles.pageHeader}>
        <View style={styles.headerInner}>
          <Text style={styles.preTitle}>DREAM LOVE CAFÉ & RESTAURANT</Text>
          <Text style={[styles.pageTitle, isMobile && styles.pageTitleMobile]}>Explore the Menu</Text>
          <Text style={[styles.pageSubtitle, isMobile && styles.pageSubtitleMobile]}>
            From tandoor-fired favourites to biryani, Chinese classics, refreshing mocktails and café beverages.
          </Text>

          {/* Search Bar */}
          <View style={styles.searchBarContainer}>
            <Search size={17} color={COLORS.copperLight} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search dishes..."
              placeholderTextColor={COLORS.textSubtle}
              value={searchQuery}
              onChangeText={setSearchQuery}
              accessibilityLabel="Search dishes"
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchBtn}>
                <X size={15} color={COLORS.textMuted} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>

      {/* 2. STICKY HORIZONTAL CATEGORY NAVIGATION */}
      <View style={styles.categoryBarWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.categoryBarContent}
        >
          <TouchableOpacity
            style={[styles.categoryTab, selectedCategory === 'all' && styles.categoryTabActive]}
            onPress={() => setSelectedCategory('all')}
            activeOpacity={0.8}
          >
            <Text style={[styles.categoryTabText, selectedCategory === 'all' && styles.categoryTabTextActive]}>
              All Categories ({menuItems.length})
            </Text>
          </TouchableOpacity>

          {categories.map((cat) => {
            const count = menuItems.filter((i) => i.category === cat.slug).length;
            const active = selectedCategory === cat.slug;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryTab, active && styles.categoryTabActive]}
                onPress={() => setSelectedCategory(cat.slug)}
                activeOpacity={0.8}
              >
                <Text style={[styles.categoryTabText, active && styles.categoryTabTextActive]}>
                  {cat.name} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 3. DIETARY & SPECIALS FILTER STRIP */}
      <View style={styles.filterControlBar}>
        <View style={styles.filterInner}>
          <View style={styles.vegToggleGroup}>
            <TouchableOpacity
              style={[styles.filterChip, vegFilter === 'all' && styles.filterChipActive]}
              onPress={() => setVegFilter('all')}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterChipText, vegFilter === 'all' && styles.filterChipTextActive]}>All</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterChip, vegFilter === 'veg' && styles.filterChipActiveVeg]}
              onPress={() => setVegFilter('veg')}
              activeOpacity={0.8}
            >
              <View style={[styles.filterDot, { backgroundColor: COLORS.vegGreen }]} />
              <Text style={[styles.filterChipText, vegFilter === 'veg' && styles.filterChipTextActive]}>Pure Veg</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterChip, vegFilter === 'non-veg' && styles.filterChipActiveNonVeg]}
              onPress={() => setVegFilter('non-veg')}
              activeOpacity={0.8}
            >
              <View style={[styles.filterDot, { backgroundColor: COLORS.nonVegRed }]} />
              <Text style={[styles.filterChipText, vegFilter === 'non-veg' && styles.filterChipTextActive]}>Non-Veg</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterChip, onlyFeatured && styles.filterChipActiveSpecial]}
              onPress={() => setOnlyFeatured(!onlyFeatured)}
              activeOpacity={0.8}
            >
              <Sparkles size={12} color={onlyFeatured ? '#FFFFFF' : COLORS.copperLight} style={{ marginRight: 4 }} />
              <Text style={[styles.filterChipText, onlyFeatured && styles.filterChipTextActive]}>Chef Specials</Text>
            </TouchableOpacity>
          </View>

          {/* Results Count */}
          <Text style={styles.resultsCountText}>
            Showing <Text style={{ color: COLORS.cream, fontWeight: '700' }}>{filteredItems.length}</Text> of {menuItems.length} dishes
          </Text>
        </View>
      </View>

      {/* 4. DISHES GRID & EMPTY STATE */}
      <View style={styles.menuGridContainer}>
        {filteredItems.length > 0 ? (
          <View style={[styles.gridRow, !isDesktop && styles.gridRowMobile]}>
            {filteredItems.map((item) => (
              <View 
                key={item.id} 
                style={[
                  styles.cardWrapper,
                  isDesktop && styles.cardWrapperDesktop,
                  isTablet && styles.cardWrapperTablet,
                  isMobile && styles.cardWrapperMobile
                ]}
              >
                <MenuCard item={item} />
              </View>
            ))}
          </View>
        ) : (
          /* Empty Search / Filter State */
          <View style={styles.emptyState}>
            <Utensils size={40} color={COLORS.textSubtle} style={{ marginBottom: 14 }} />
            <Text style={styles.emptyTitle}>No dishes found</Text>
            <Text style={styles.emptySubtitle}>
              Try another dish name or browse by category.
            </Text>
            <TouchableOpacity 
              style={styles.resetBtn} 
              onPress={handleResetFilters}
              activeOpacity={0.8}
            >
              <Text style={styles.resetBtnText}>Clear Filters & Show All</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: COLORS.background,
    minHeight: '100%',
    paddingBottom: SPACING.xxxl,
  },
  pageHeader: {
    backgroundColor: COLORS.surfaceMuted,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  headerInner: {
    maxWidth: 820,
    width: '100%',
    marginHorizontal: 'auto',
    alignItems: 'center',
    textAlign: 'center',
  },
  preTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.copper,
    letterSpacing: 2,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  pageTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 40,
    fontWeight: '800',
    color: COLORS.cream,
    letterSpacing: -0.5,
    marginBottom: 10,
    textAlign: 'center',
  },
  pageTitleMobile: {
    fontSize: 30,
  },
  pageSubtitle: {
    fontSize: 15,
    color: COLORS.textMuted,
    lineHeight: 23,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    maxWidth: 620,
  },
  pageSubtitleMobile: {
    fontSize: 13.5,
    lineHeight: 20,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: 14,
    width: '100%',
    maxWidth: 540,
    height: 48,
    ...SHADOWS.card,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: COLORS.cream,
    fontSize: 14.5,
    height: '100%',
    outlineStyle: 'none' as any,
  },
  clearSearchBtn: {
    padding: 6,
  },

  // ── Category Tabs ──
  categoryBarWrapper: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    position: Platform.OS === 'web' ? ('sticky' as any) : 'relative',
    top: 64, // below sticky header
    zIndex: 10,
  },
  categoryBarContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: 10,
    gap: 8,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryTabActive: {
    backgroundColor: COLORS.brandTurquoise + '18',
    borderColor: COLORS.brandTurquoise,
  },
  categoryTabText: {
    color: COLORS.creamMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  categoryTabTextActive: {
    color: COLORS.brandTurquoise,
    fontWeight: '700',
  },

  // ── Dietary Filters ──
  filterControlBar: {
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 12,
    paddingHorizontal: SPACING.lg,
  },
  filterInner: {
    maxWidth: 1240,
    width: '100%',
    marginHorizontal: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  vegToggleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  filterChipActive: {
    backgroundColor: COLORS.surfaceElevated,
    borderColor: COLORS.creamMuted,
  },
  filterChipActiveVeg: {
    backgroundColor: COLORS.vegGreen + '20',
    borderColor: COLORS.vegGreen,
  },
  filterChipActiveNonVeg: {
    backgroundColor: COLORS.nonVegRed + '20',
    borderColor: COLORS.nonVegRed,
  },
  filterChipActiveSpecial: {
    backgroundColor: COLORS.brandHeart + '25',
    borderColor: COLORS.brandHeart,
  },
  filterDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 6,
  },
  filterChipText: {
    color: COLORS.textMuted,
    fontSize: 12.5,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: COLORS.cream,
    fontWeight: '700',
  },
  resultsCountText: {
    fontSize: 12.5,
    color: COLORS.textSubtle,
  },

  // ── Menu Grid ──
  menuGridContainer: {
    maxWidth: 1240,
    width: '100%',
    marginHorizontal: 'auto',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  gridRowMobile: {
    flexDirection: 'column',
    gap: 16,
  },
  cardWrapper: {
    flex: 1,
  },
  cardWrapperDesktop: {
    flexBasis: 'calc(33.333% - 14px)' as any,
    minWidth: 280,
  },
  cardWrapperTablet: {
    flexBasis: 'calc(50% - 10px)' as any,
    minWidth: 260,
  },
  cardWrapperMobile: {
    width: '100%',
  },

  // ── Empty State ──
  emptyState: {
    paddingVertical: SPACING.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  emptyTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: SPACING.lg,
  },
  resetBtn: {
    backgroundColor: COLORS.brandHeart,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: BORDER_RADIUS.md,
  },
  resetBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
  },
});
