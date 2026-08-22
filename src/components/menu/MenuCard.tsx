import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { Plus, Minus, Check, Sparkles } from 'lucide-react-native';
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

  // Render price display text according to prompt specification
  const renderPriceText = () => {
    if (item.price !== undefined && item.price > 0) {
      return `₹${item.price}`;
    }
    if (item.priceRange) {
      return item.priceRange;
    }
    return 'Ask for price';
  };

  return (
    <View style={[styles.cardContainer, !item.isAvailable && styles.cardUnavailable]}>
      {/* Visual Image Header */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80' }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.imageOverlay} />

        {/* Veg / Non-Veg Indicator Badge */}
        <View style={styles.badgeTopLeft}>
          <View style={[styles.vegBadge, item.isVeg ? styles.vegBadgeVeg : styles.vegBadgeNonVeg]}>
            <View style={[styles.vegDot, item.isVeg ? styles.vegDotVeg : styles.vegDotNonVeg]} />
          </View>
        </View>

        {/* Featured Tag */}
        {item.isFeatured && (
          <View style={styles.featuredBadge}>
            <Sparkles size={10} color={COLORS.background} style={{ marginRight: 3 }} />
            <Text style={styles.featuredBadgeText}>CHEF SPECIAL</Text>
          </View>
        )}

        {/* Portion Tag if exists */}
        {item.portion && (
          <View style={styles.portionBadge}>
            <Text style={styles.portionBadgeText}>{item.portion}</Text>
          </View>
        )}
      </View>

      {/* Card Content Details */}
      <View style={styles.contentContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={2}>
            {item.name}
          </Text>
        </View>

        {item.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}

        {/* Price & Action Row */}
        <View style={styles.footerRow}>
          <View style={styles.priceContainer}>
            <Text style={[styles.priceText, !item.price && !item.priceRange && styles.askPriceText]}>
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
              activeOpacity={0.8}
              accessibilityLabel={`Add ${item.name} to order`}
            >
              <Plus size={14} color={COLORS.background} style={{ marginRight: 4 }} />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.quantityControl}>
              <TouchableOpacity
                style={styles.quantityBtn}
                onPress={() => decrementQuantity(item.id)}
              >
                <Minus size={12} color={COLORS.cream} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityBtn}
                onPress={() => incrementQuantity(item.id)}
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
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  cardUnavailable: {
    opacity: 0.65,
  },
  imageContainer: {
    height: 150,
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
    backgroundColor: 'rgba(18, 15, 14, 0.25)',
  },
  badgeTopLeft: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  vegBadge: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(18, 15, 14, 0.85)',
  },
  vegBadgeVeg: {
    borderColor: COLORS.vegGreen,
  },
  vegBadgeNonVeg: {
    borderColor: COLORS.nonVegRed,
  },
  vegDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  vegDotVeg: {
    backgroundColor: COLORS.vegGreen,
  },
  vegDotNonVeg: {
    backgroundColor: COLORS.nonVegRed,
  },
  featuredBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: COLORS.copper,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BORDER_RADIUS.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredBadgeText: {
    color: COLORS.background,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  portionBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(18, 15, 14, 0.85)',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  portionBadgeText: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '600',
  },
  contentContainer: {
    padding: SPACING.md,
    justifyContent: 'space-between',
    flex: 1,
  },
  titleRow: {
    marginBottom: 4,
  },
  title: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.cream,
    lineHeight: 20,
  },
  description: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 16,
    marginBottom: SPACING.md,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  priceContainer: {
    flex: 1,
  },
  priceText: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.gold,
    letterSpacing: 0.5,
  },
  askPriceText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.copperLight,
    fontStyle: 'italic',
  },
  addButton: {
    backgroundColor: COLORS.copper,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.md,
  },
  addButtonText: {
    color: COLORS.background,
    fontSize: 13,
    fontWeight: '700',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.copper,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  quantityBtn: {
    padding: 6,
  },
  quantityText: {
    color: COLORS.cream,
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: 8,
  },
  unavailableBadge: {
    backgroundColor: COLORS.border,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
  },
  unavailableText: {
    color: COLORS.textSubtle,
    fontSize: 11,
    fontWeight: '600',
  },
});
