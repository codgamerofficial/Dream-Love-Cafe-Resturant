import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { Plus, Minus, Sparkles, UtensilsCrossed, CookingPot, Flame, Fish, Wheat, Salad, GlassWater, Coffee, Check } from 'lucide-react-native';
import { MenuItem } from '../../types';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../theme';
import { useCart } from '../../context/CartContext';

interface MenuCardProps {
  item: MenuItem;
  variant?: 'standard' | 'hero';
}

export const MenuCard: React.FC<MenuCardProps> = ({ item, variant = 'standard' }) => {
  const { items, addItem, incrementQuantity, decrementQuantity } = useCart();
  const [imageError, setImageError] = useState(false);

  const cartEntry = items.find((i) => i.menuItem.id === item.id);
  const quantity = cartEntry ? cartEntry.quantity : 0;
  const isHero = variant === 'hero';

  // Format authentic price according to specifications
  const renderPriceText = () => {
    if (item.price !== undefined && item.price !== null && item.price > 0) {
      return `₹${item.price}`;
    }
    if (item.price_type === 'size_based' || item.priceType === 'size_based' || (item.portion && item.portion.toLowerCase().includes('size'))) {
      return 'As per size';
    }
    if (item.priceRange) {
      return item.priceRange;
    }
    return 'Price on request';
  };

  // Get category illustration when image is unavailable
  const getCategoryIcon = () => {
    const cat = ((item.category || '') as string).toLowerCase();
    if (cat.includes('biryani')) {
      return <CookingPot size={36} color={COLORS.gold} />;
    }
    if (cat.includes('tandoor') || cat.includes('kebab')) {
      return <Flame size={36} color={COLORS.brandHeart} />;
    }
    if (cat.includes('fish') || cat.includes('seafood') || cat.includes('prawn')) {
      return <Fish size={36} color={COLORS.brandTurquoise} />;
    }
    if (cat.includes('bread') || cat.includes('roti') || cat.includes('naan')) {
      return <Wheat size={36} color={COLORS.copper} />;
    }
    if (cat.includes('salad') || cat.includes('soup') || cat.includes('veg')) {
      return <Salad size={36} color={COLORS.vegGreen} />;
    }
    if (cat.includes('mocktail') || cat.includes('shake') || cat.includes('juice') || cat.includes('beverage')) {
      return <GlassWater size={36} color={COLORS.brandTurquoise} />;
    }
    if (cat.includes('tea') || cat.includes('coffee') || cat.includes('hot-drink')) {
      return <Coffee size={36} color={COLORS.copperLight} />;
    }
    return <UtensilsCrossed size={36} color={COLORS.copper} />;
  };

  const rawImageUrl = item.image_url || item.image;
  const imageUrl = imageError ? null : rawImageUrl;

  return (
    <View style={[
      styles.cardContainer, 
      isHero && styles.heroCardContainer,
      !item.isAvailable && styles.cardUnavailable
    ]}>
      {/* 1. VISUAL FOOD HEADER */}
      {imageUrl ? (
        <View style={[styles.imageContainer, isHero && styles.heroImageContainer]}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
          <View style={styles.imageOverlay} />

          {/* Dietary Indicator Badge */}
          <View style={styles.badgeTopLeft}>
            <View style={[
              styles.vegBadge, 
              item.isVeg ? styles.vegBadgeVeg : item.isEgg ? styles.vegBadgeEgg : styles.vegBadgeNonVeg
            ]}>
              <View style={[
                styles.vegDot, 
                item.isVeg ? styles.vegDotVeg : item.isEgg ? styles.vegDotEgg : styles.vegDotNonVeg
              ]} />
            </View>
          </View>

          {/* Featured / Chef Special Tag */}
          {item.isFeatured && (
            <View style={styles.featuredBadge}>
              <Sparkles size={9} color="#FFFFFF" style={{ marginRight: 3 }} />
              <Text style={styles.featuredBadgeText}>SPECIAL</Text>
            </View>
          )}

          {/* Spicy Indicator */}
          {item.isSpicy && (
            <View style={styles.spicyBadge}>
              <Text style={styles.spicyBadgeText}>🌶️ SPICY</Text>
            </View>
          )}

          {/* Portion Tag if present */}
          {item.portion && (
            <View style={styles.portionBadge}>
              <Text style={styles.portionBadgeText}>{item.portion}</Text>
            </View>
          )}
        </View>
      ) : (
        /* Neutral Category Visual placeholder when no photo exists */
        <View style={[styles.placeholderContainer, isHero && styles.heroPlaceholderContainer]}>
          <View style={styles.placeholderPattern}>
            {getCategoryIcon()}
          </View>

          {/* Dietary Indicator Badge */}
          <View style={styles.badgeTopLeft}>
            <View style={[
              styles.vegBadge, 
              item.isVeg ? styles.vegBadgeVeg : item.isEgg ? styles.vegBadgeEgg : styles.vegBadgeNonVeg
            ]}>
              <View style={[
                styles.vegDot, 
                item.isVeg ? styles.vegDotVeg : item.isEgg ? styles.vegDotEgg : styles.vegDotNonVeg
              ]} />
            </View>
          </View>

          {/* Subcategory Tag */}
          {item.subcategory && (
            <View style={styles.subcategoryBadge}>
              <Text style={styles.subcategoryBadgeText}>{item.subcategory}</Text>
            </View>
          )}

          {/* Portion Tag */}
          {item.portion && (
            <View style={styles.portionBadge}>
              <Text style={styles.portionBadgeText}>{item.portion}</Text>
            </View>
          )}
        </View>
      )}

      {/* 2. CARD CONTENT DETAILS */}
      <View style={[styles.contentContainer, isHero && styles.heroContentContainer]}>
        {/* Top Content Body: Title, Subtitle, Description */}
        <View style={styles.cardBody}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, isHero && styles.heroTitle]} numberOfLines={2}>
              {item.name}
            </Text>
            {item.canonical_name && item.canonical_name !== item.name && (
              <Text style={styles.canonicalSubtitle} numberOfLines={1}>
                ({item.canonical_name})
              </Text>
            )}
          </View>

          {item.description ? (
            <Text style={[styles.description, isHero && styles.heroDescription]} numberOfLines={isHero ? 3 : 2}>
              {item.description}
            </Text>
          ) : null}
        </View>

        {/* 3. PRICE & ACTION FOOTER */}
        <View style={[styles.footerRow, isHero && styles.heroFooterRow]}>
          <View style={styles.priceContainer}>
            <Text style={[
              styles.priceText, 
              isHero && styles.heroPriceText,
              (!item.price || item.price === 0) && styles.askPriceText
            ]}>
              {renderPriceText()}
            </Text>
          </View>

          {/* Add to Order / Quantity Counter */}
          {!item.isAvailable ? (
            <View style={styles.unavailableBadge}>
              <Text style={styles.unavailableText}>Sold Out</Text>
            </View>
          ) : quantity === 0 ? (
            <TouchableOpacity
              style={[styles.addButton, isHero && styles.heroAddButton]}
              onPress={() => addItem(item)}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={`Add ${item.name} to order`}
            >
              <Plus size={isHero ? 14 : 13} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={[styles.addButtonText, isHero && styles.heroAddButtonText]}>Add</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.quantityControl}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => decrementQuantity(item.id)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Decrease quantity"
              >
                <Minus size={12} color={COLORS.cream} />
              </TouchableOpacity>

              <Text style={styles.qtyText}>{quantity}</Text>

              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => incrementQuantity(item.id)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Increase quantity"
              >
                <Plus size={12} color={COLORS.cream} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    width: '100%',
    ...SHADOWS.card,
  },
  heroCardContainer: {
    borderColor: COLORS.borderLight,
  },
  cardUnavailable: {
    opacity: 0.6,
  },
  imageContainer: {
    height: 175,
    width: '100%',
    position: 'relative',
    backgroundColor: COLORS.surface,
  },
  heroImageContainer: {
    height: 300,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(18, 15, 14, 0.15)',
  },
  placeholderContainer: {
    height: 110,
    width: '100%',
    position: 'relative',
    backgroundColor: COLORS.surfaceMuted,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroPlaceholderContainer: {
    height: 220,
  },
  placeholderPattern: {
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.85,
  },
  badgeTopLeft: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 2,
  },
  vegBadge: {
    width: 17,
    height: 17,
    borderRadius: 3,
    borderWidth: 1.5,
    backgroundColor: 'rgba(26, 22, 21, 0.90)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vegBadgeVeg: {
    borderColor: COLORS.vegGreen,
  },
  vegBadgeNonVeg: {
    borderColor: COLORS.nonVegRed,
  },
  vegBadgeEgg: {
    borderColor: COLORS.eggYellow,
  },
  vegDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  vegDotVeg: {
    backgroundColor: COLORS.vegGreen,
  },
  vegDotNonVeg: {
    backgroundColor: COLORS.nonVegRed,
  },
  vegDotEgg: {
    backgroundColor: COLORS.eggYellow,
  },
  featuredBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: COLORS.brandHeart,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.xs,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  featuredBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  spicyBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(18, 15, 14, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.xs,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  spicyBadgeText: {
    color: '#FF7043',
    fontSize: 9,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  portionBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(18, 15, 14, 0.85)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  portionBadgeText: {
    color: COLORS.creamMuted,
    fontSize: 10,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  subcategoryBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.xs,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  subcategoryBadgeText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  contentContainer: {
    padding: SPACING.md,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  heroContentContainer: {
    padding: SPACING.lg,
  },
  cardBody: {
    flexDirection: 'column',
  },
  titleRow: {
    marginBottom: 5,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.cream,
    lineHeight: 20,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  heroTitle: {
    fontSize: 19,
    lineHeight: 25,
    fontWeight: '800',
  },
  canonicalSubtitle: {
    fontSize: 11.5,
    color: COLORS.textSubtle,
    marginTop: 2,
    fontStyle: 'italic',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  description: {
    fontSize: 12.5,
    color: COLORS.textMuted,
    lineHeight: 17,
    marginBottom: 8,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  heroDescription: {
    fontSize: 13.5,
    lineHeight: 20,
    color: COLORS.creamMuted,
    marginBottom: 10,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  heroFooterRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopColor: COLORS.borderSubtle,
  },
  priceContainer: {
    flex: 1,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.copperLight,
    letterSpacing: 0.2,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  heroPriceText: {
    fontSize: 18,
    color: COLORS.gold,
  },
  askPriceText: {
    fontSize: 12,
    color: COLORS.textSubtle,
    fontWeight: '500',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.brandHeart,
    paddingVertical: 6,
    paddingHorizontal: 13,
    borderRadius: BORDER_RADIUS.sm,
    shadowColor: COLORS.brandHeart,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  heroAddButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: BORDER_RADIUS.md,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  heroAddButtonText: {
    fontSize: 13.5,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingHorizontal: 3,
    paddingVertical: 2,
    gap: 6,
  },
  qtyBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    color: COLORS.cream,
    fontSize: 12.5,
    fontWeight: '700',
    minWidth: 14,
    textAlign: 'center',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  unavailableBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: BORDER_RADIUS.xs,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  unavailableText: {
    color: COLORS.textSubtle,
    fontSize: 11,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
});
