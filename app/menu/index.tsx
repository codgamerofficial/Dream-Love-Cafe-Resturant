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
import { Search, Filter, Sparkles, Utensils, Check } from 'lucide-react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../src/theme';
import { useSettings } from '../../src/context/SettingsContext';
import { MenuCard } from '../../src/components/menu/MenuCard';
import { CategorySlug } from '../../src/types';
import { analytics } from '../../src/services/analytics';

export default function MenuPage() {
  const { category: urlCategory } = useLocalSearchParams<{ category?: string }>();
  const { width } = useWindowDimensions();
  const { categories, menuItems } = useSettings();

  const isSmallMobile = width < 380;
  const isMobile = width < 600;
  const isTablet = width >= 600 && width < 900;
  const isDesktop = width >= 900;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory || 'all');
  const [vegFilter, setVegFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [onlyAvailable, setOnlyAvailable] = useState(false);

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
      // 1. Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query) || false;
        if (!matchesName && !matchesDesc) return false;
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

      // 5. Available Filter
      if (onlyAvailable && !item.isAvailable) return false;

      return true;
    });
  }, [menuItems, searchQuery, selectedCategory, vegFilter, onlyFeatured, onlyAvailable]);

  return (
    <View style={styles.container}>
      {/* Page Header */}
      <View style={styles.pageHeader}>
        <View style={styles.headerInner}>
          <Text style={styles.preTitle}>DREAM LOVE CAFE & RESTAURANT</Text>
          <Text style={[styles.pageTitle, isMobile && styles.pageTitleMobile]}>Digital Menu</Text>
          <Text style={[styles.pageSubtitle, isMobile && styles.pageSubtitleMobile]}>
            Explore our authentic selection of Indian curries, tandoori kebabs, slow-cooked biryanis, Chinese wok specialties, and refreshing drinks.
          </Text>

          {/* Live Search Bar */}
          <View style={styles.searchBarContainer}>
            <Search size={16} color={COLORS.textMuted} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search dishes (e.g. Biriyani, Chicken Vorta)..."
              placeholderTextColor={COLORS.textSubtle}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchBtn}>
                <Text style={styles.clearSearchText}>Clear</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>

      {/* Sticky Horizontal Category Bar */}
      <View style={styles.categoryBarWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.categoryBarContent}
        >
          <TouchableOpacity
            style={[styles.categoryTab, selectedCategory === 'all' && styles.categoryTabActive]}
            onPress={() => setSelectedCategory('all')}
          >
            <Text style={[styles.categoryTabText, selectedCategory === 'all' && styles.categoryTabTextActive]}>
              All Dishes ({menuItems.length})
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
              >
                <Text style={[styles.categoryTabText, active && styles.categoryTabTextActive]}>
                  {cat.name} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Filter Control Bar */}
      <View style={styles.filterControlBar}>
        <View style={styles.filterInner}>
          {/* Veg / Non-Veg Toggle Buttons */}
          <View style={styles.vegToggleGroup}>
            <TouchableOpacity
              style={[styles.filterChip, vegFilter === 'all' && styles.filterChipActive]}
              onPress={() => setVegFilter('all')}
            >
              <Text style={[styles.filterChipText, vegFilter === 'all' && styles.filterChipTextActive]}>All</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterChip, vegFilter === 'veg' && styles.filterChipVegActive]}
              onPress={() => setVegFilter('veg')}
            >
              <View style={styles.vegDotSmall} />
              <Text style={[styles.filterChipText, vegFilter === 'veg' && styles.filterChipTextVeg]}>Pure Veg</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterChip, vegFilter === 'non-veg' && styles.filterChipNonVegActive]}
              onPress={() => setVegFilter('non-veg')}
            >
              <View style={styles.nonVegDotSmall} />
              <Text style={[styles.filterChipText, vegFilter === 'non-veg' && styles.filterChipTextNonVeg]}>Non-Veg</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Checkboxes */}
          <View style={styles.checkboxGroup}>
            <TouchableOpacity
              style={styles.checkboxItem}
              onPress={() => setOnlyFeatured(!onlyFeatured)}
            >
              <View style={[styles.checkbox, onlyFeatured && styles.checkboxChecked]}>
                {onlyFeatured && <Check size={11} color="#FFFFFF" />}
              </View>
              <Text style={styles.checkboxLabel}>Specials Only</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkboxItem}
              onPress={() => setOnlyAvailable(!onlyAvailable)}
            >
              <View style={[styles.checkbox, onlyAvailable && styles.checkboxChecked]}>
                {onlyAvailable && <Check size={11} color="#FFFFFF" />}
              </View>
              <Text style={styles.checkboxLabel}>In Stock</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Menu Grid Body */}
      <View style={styles.menuScroll}>
        <View style={styles.menuSectionInner}>
          <View style={styles.resultSummaryRow}>
            <Text style={styles.resultSummaryText}>
              Showing {filteredItems.length} {filteredItems.length === 1 ? 'dish' : 'dishes'}
            </Text>
          </View>

          {filteredItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Utensils size={40} color={COLORS.textSubtle} style={{ marginBottom: 10 }} />
              <Text style={styles.emptyTitle}>No dishes found</Text>
              <Text style={styles.emptySubtitle}>Try adjusting your search terms or filters to explore more items.</Text>
            </View>
          ) : (
            <View style={styles.cardGrid}>
              {filteredItems.map((item) => (
                <View 
                  key={item.id} 
                  style={[
                    styles.gridColumn,
                    isMobile && styles.gridColumnMobile,
                    isTablet && styles.gridColumnTablet
                  ]}
                >
                  <MenuCard item={item} />
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  pageHeader: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerInner: {
    maxWidth: 820,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  preTitle: {
    fontSize: 10.5,
    fontWeight: '700',
    color: COLORS.brandTurquoise,
    letterSpacing: 2,
    marginBottom: 4,
  },
  pageTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.cream,
    textAlign: 'center',
    marginBottom: 6,
  },
  pageTitleMobile: {
    fontSize: 24,
  },
  pageSubtitle: {
    fontSize: 13.5,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: SPACING.md,
  },
  pageSubtitleMobile: {
    fontSize: 12.5,
    lineHeight: 17,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
    width: '100%',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: COLORS.cream,
    fontSize: 13.5,
  },
  clearSearchBtn: {
    paddingHorizontal: 6,
  },
  clearSearchText: {
    color: COLORS.brandTurquoise,
    fontSize: 11.5,
    fontWeight: '600',
  },

  // Category Bar
  categoryBarWrapper: {
    backgroundColor: COLORS.surfaceElevated,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    zIndex: 10,
  },
  categoryBarContent: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    gap: 8,
  },
  categoryTab: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryTabActive: {
    backgroundColor: COLORS.brandGreen,
    borderColor: COLORS.brandGreen,
  },
  categoryTabText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  categoryTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Filter Control Bar
  filterControlBar: {
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 10,
  },
  filterInner: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
  vegToggleGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.borderLight,
  },
  filterChipVegActive: {
    backgroundColor: 'rgba(56, 142, 60, 0.2)',
    borderColor: COLORS.vegGreen,
  },
  filterChipNonVegActive: {
    backgroundColor: 'rgba(211, 47, 47, 0.2)',
    borderColor: COLORS.nonVegRed,
  },
  filterChipText: {
    fontSize: 11.5,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: COLORS.cream,
  },
  filterChipTextVeg: {
    color: COLORS.vegGreen,
  },
  filterChipTextNonVeg: {
    color: COLORS.nonVegRed,
  },
  vegDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.vegGreen,
    marginRight: 5,
  },
  nonVegDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.nonVegRed,
    marginRight: 5,
  },
  checkboxGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 15,
    height: 15,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  checkboxChecked: {
    backgroundColor: COLORS.brandHeart,
    borderColor: COLORS.brandHeart,
  },
  checkboxLabel: {
    fontSize: 11.5,
    color: COLORS.creamMuted,
  },

  // Grid Body
  menuScroll: {
    flex: 1,
    paddingVertical: SPACING.lg,
  },
  menuSectionInner: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: SPACING.md,
  },
  resultSummaryRow: {
    marginBottom: SPACING.sm,
  },
  resultSummaryText: {
    fontSize: 12,
    color: COLORS.textSubtle,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridColumn: {
    width: '32%',
  },
  gridColumnTablet: {
    width: '48.5%',
  },
  gridColumnMobile: {
    width: '100%',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 18,
    color: COLORS.cream,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12.5,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
