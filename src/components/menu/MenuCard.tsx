import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Plus, Minus, Sparkles, UtensilsCrossed, CookingPot, Flame, Fish, Wheat, Salad, GlassWater, Coffee } from 'lucide-react-native';
import { MenuItem } from '../../types';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../theme';
import { useCart } from '../../context/CartContext';

interface MenuCardProps {
  item: MenuItem;
}

export const MenuCard: React.FC<MenuCardProps> = ({ item }) => {
  const { items, addItem, incrementQuantity, decrementQuantity } = useCart();

  const cartEntry = items.find((i) => i.menuItem.id === item.id);
  const quantity = cartEntry ? cartEntry.quantity : 0;

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

  // Get appropriate category icon when no image exists
  const getCategoryIcon = () => {
    switch ((item.category || '') as string) {
      case 'biryani':
      case 'biryani-rice':
        return <CookingPot size={32} color={COLORS.gold} />;
      case 'tandoori':
      case 'tandoori-kebabs':
        return <Flame size={32} color={COLORS.brandHeart} />;
      case 'seafood':
      case 'seafood-fish':
        return <Fish size={32} color={COLORS.brandTurquoise} />;
      case 'bread':
      case 'breads-kulchas':
        return <Wheat size={32} color={COLORS.copper} />;
      case 'salad':
      case 'soup':
      case 'veg':
      case 'main-course-veg':
        return <Salad size={32} color={COLORS.vegGreen} />;
      case 'mocktail':
      case 'shake':
      case 'fresh-juice':
      case 'beverages-shakes-mocktails':
        return <GlassWater size={32} color={COLORS.brandTurquoise} />;
      case 'hot-drinks':
        return <Coffee size={32} color={COLORS.copperLight} />;
      default:
        return <UtensilsCrossed size={32} color={COLORS.copper} />;
    }
  };

  const [imageError, setImageError] = React.useState(false);
  const rawImageUrl = item.image_url || item.image;
  const imageUrl = imageError ? null : rawImageUrl;

  return (
    <View style={[styles.cardContainer, !item.isAvailable && styles.cardUnavailable]}>
      {/* 1. VISUAL FOOD HEADER */}
      {imageUrl ? (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
          <View style={styles.imageOverlay} />

          {/* Veg / Non-Veg / Egg Indicator Badge */}
          <View style={styles.badgeTopLeft}>
            <View style={[styles.vegBadge, item.isVeg ? styles.vegBadgeVeg : item.isEgg ? styles.vegBadgeEgg : styles.vegBadgeNonVeg]}>
              <View style={[styles.vegDot, item.isVeg ? styles.vegDotVeg : item.isEgg ? styles.vegDotEgg : styles.vegDotNonVeg]} />
            </View>
          </View>

          {/* Featured / Special Tag */}
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

          {/* Portion Tag if exists */}
          {item.portion && (
            <View style={styles.portionBadge}>
              <Text style={styles.portionBadgeText}>{item.portion}</Text>
            </View>
          )}
        </View>
      ) : (
        /* Neutral Category Visual when no image exists */
        <View style={styles.placeholderContainer}>
          <View style={styles.placeholderPattern}>
            {getCategoryIcon()}
          </View>

          {/* Dietary Indicator Badge */}
          <View style={styles.badgeTopLeft}>
            <View style={[styles.vegBadge, item.isVeg ? styles.vegBadgeVeg : item.isEgg ? styles.vegBadgeEgg : styles.vegBadgeNonVeg]}>
              <View style={[styles.vegDot, item.isVeg ? styles.vegDotVeg : item.isEgg ? styles.vegDotEgg : styles.vegDotNonVeg]} />
            </View>
          </View>

          {/* Subcategory Pill */}
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
      <View style={styles.contentContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={2}>
            {item.name}
          </Text>
          {item.canonical_name && item.canonical_name !== item.name && (
            <Text style={styles.canonicalSubtitle} numberOfLines={1}>
              ({item.canonical_name})
            </Text>
          )}
        </View>

        {item.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}

        {/* 3. PRICE & ACTION FOOTER */}
        <View style={styles.footerRow}>
          <View style={styles.priceContainer}>
            <Text style={[styles.priceText, (!item.price || item.price === 0) && styles.askPriceText]}>
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
              style={styles.addButton}
              onPress={() => addItem(item)}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={`Add ${item.name} to order`}
            >
              <Plus size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.addButtonText}>Add</Text>
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
    ...SHADOWS.card,
  },
  cardUnavailable: {
    opacity: 0.6,
  },
  imageContainer: {
    height: 170,
    width: '100%',
    position: 'relative',
    backgroundColor: COLORS.surface,
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
    backgroundColor: 'rgba(18, 15, 14, 0.12)',
  },
  placeholderContainer: {
    height: 95,
    width: '100%',
    position: 'relative',
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  placeholderPattern: {
    opacity: 0.35,
  },
  badgeTopLeft: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 5,
  },
  vegBadge: {
    width: 17,
    height: 17,
    borderWidth: 1.5,
    borderRadius: 3,
    backgroundColor: 'rgba(26, 22, 21, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vegBadgeVeg: {
    borderColor: COLORS.vegGreen,
  },
  vegBadgeNonVeg: {
    borderColor: COLORS.nonVegRed,
  },
  vegBadgeEgg: {
    borderColor: COLORS.gold,
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
    backgroundColor: COLORS.gold,
  },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.brandHeart,
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: BORDER_RADIUS.sm,
    zIndex: 5,
  },
  featuredBadgeText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  spicyBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(18, 15, 14, 0.88)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.nonVegRed + '60',
  },
  spicyBadgeText: {
    color: '#FFAAAA',
    fontSize: 9.5,
    fontWeight: '700',
  },
  subcategoryBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.surfaceElevated,
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  subcategoryBadgeText: {
    color: COLORS.brandTurquoise,
    fontSize: 10,
    fontWeight: '600',
  },
  portionBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(18, 15, 14, 0.88)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  portionBadgeText: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '600',
  },
  contentContainer: {
    padding: SPACING.md,
    flex: 1,
    justifyContent: 'space-between',
  },
  titleRow: {
    marginBottom: 4,
  },
  title: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.cream,
    lineHeight: 20,
  },
  canonicalSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  description: {
    fontSize: 12,
    color: COLORS.creamMuted,
    lineHeight: 17,
    marginBottom: SPACING.sm,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: 'auto',
  },
  priceContainer: {
    flexDirection: 'column',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.gold,
    letterSpacing: 0.3,
  },
  askPriceText: {
    fontSize: 12.5,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.brandHeart,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.md,
    minHeight: 32,
    shadowColor: COLORS.brandHeart,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.brandHeart,
    overflow: 'hidden',
  },
  qtyBtn: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: COLORS.brandHeart + '25',
  },
  qtyText: {
    color: COLORS.cream,
    fontSize: 12.5,
    fontWeight: '800',
    paddingHorizontal: 8,
  },
  unavailableBadge: {
    backgroundColor: COLORS.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  unavailableText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
});
