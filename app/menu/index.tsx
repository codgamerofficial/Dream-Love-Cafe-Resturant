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
  const isDesktop = width >= 768;

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
          <Text style={styles.pageTitle}>Complete Digital Menu</Text>
          <Text style={styles.pageSubtitle}>
            Freshly prepared Indian, Tandoori, Chinese, and Biryani specialties. Select items to create your WhatsApp order.
          </Text>

          {/* Live Search Bar */}
          <View style={styles.searchBarContainer}>
            <Search size={18} color={COLORS.textMuted} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search dishes (e.g. Biriyani, Chicken Vorta, Naan, Soup)..."
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
                {onlyFeatured && <Check size={12} color={COLORS.background} />}
              </View>
              <Text style={styles.checkboxLabel}>Chef Specials Only</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkboxItem}
              onPress={() => setOnlyAvailable(!onlyAvailable)}
            >
              <View style={[styles.checkbox, onlyAvailable && styles.checkboxChecked]}>
                {onlyAvailable && <Check size={12} color={COLORS.background} />}
              </View>
              <Text style={styles.checkboxLabel}>In Stock Only</Text>
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
              <Utensils size={48} color={COLORS.textSubtle} style={{ marginBottom: 12 }} />
              <Text style={styles.emptyTitle}>No dishes found</Text>
              <Text style={styles.emptySubtitle}>Try adjusting your search terms or filters to explore more items.</Text>
            </View>
          ) : (
            <View style={[styles.cardGrid, !isDesktop && styles.cardGridMobile]}>
              {filteredItems.map((item) => (
                <View key={item.id} style={[styles.gridColumn, !isDesktop && styles.gridColumnMobile]}>
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
    paddingVertical: SPACING.xxl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerInner: {
    maxWidth: 900,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  preTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.copper,
    letterSpacing: 2.5,
    marginBottom: 6,
  },
  pageTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.cream,
    textAlign: 'center',
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: 16,
    paddingVertical: 10,
    width: '100%',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: COLORS.cream,
    fontSize: 14,
  },
  clearSearchBtn: {
    paddingHorizontal: 8,
  },
  clearSearchText: {
    color: COLORS.copper,
    fontSize: 12,
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
    paddingVertical: 12,
    gap: 10,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryTabActive: {
    backgroundColor: COLORS.copper,
    borderColor: COLORS.copper,
  },
  categoryTabText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  categoryTabTextActive: {
    color: COLORS.background,
    fontWeight: '800',
  },

  // Filter Control Bar
  filterControlBar: {
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 12,
  },
  filterInner: {
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16,
  },
  vegToggleGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
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
    fontSize: 12,
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
    marginRight: 6,
  },
  nonVegDotSmall: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.nonVegRed,
    marginRight: 6,
  },
  checkboxGroup: {
    flexDirection: 'row',
    gap: 16,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  checkboxChecked: {
    backgroundColor: COLORS.copper,
    borderColor: COLORS.copper,
  },
  checkboxLabel: {
    fontSize: 12,
    color: COLORS.creamMuted,
  },

  // Scroll Grid Body
  menuScroll: {
    flex: 1,
  },
  menuScrollContent: {
    paddingVertical: SPACING.xl,
  },
  menuSectionInner: {
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: SPACING.md,
  },
  resultSummaryRow: {
    marginBottom: SPACING.md,
  },
  resultSummaryText: {
    fontSize: 13,
    color: COLORS.textSubtle,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -10,
  },
  cardGridMobile: {
    flexDirection: 'column',
    marginHorizontal: 0,
  },
  gridColumn: {
    width: '33.33%',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  gridColumnMobile: {
    width: '100%',
    paddingHorizontal: 0,
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxxl,
  },
  emptyTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 20,
    color: COLORS.cream,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
