import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  Linking, 
  Image, 
  Modal, 
  Platform,
  useWindowDimensions 
} from 'react-native';
import { X, Trash2, Plus, Minus, MessageSquare, ShoppingBag, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react-native';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../theme';
import { OrderType } from '../../types';
import { formatWhatsAppOrderMessage } from '../../utils/whatsapp';
import { analytics } from '../../services/analytics';
import { supabase, isSupabaseConfigured } from '../../services/supabase';

export const CartDrawer: React.FC = () => {
  const { width } = useWindowDimensions();
  const { items, subtotal, itemCount, isCartOpen, closeCart, incrementQuantity, decrementQuantity, removeItem, clearCart } = useCart();
  const { settings } = useSettings();

  const isDesktop = width >= 768;

  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);

  if (!isCartOpen) return null;

  const handleWhatsAppCheckout = async () => {
    setErrorMessage('');

    if (!customerName.trim()) {
      setErrorMessage('Please enter your name');
      return;
    }

    if (!customerPhone.trim() || customerPhone.length < 8) {
      setErrorMessage('Please enter a valid phone number');
      return;
    }

    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      setErrorMessage('Please enter your delivery address');
      return;
    }

    analytics.track('order_click', {
      orderType,
      itemCount,
      subtotal,
    });

    const { text, link } = formatWhatsAppOrderMessage(
      items,
      {
        name: customerName.trim(),
        phone: customerPhone.trim(),
        orderType,
        tableNumber: tableNumber.trim() || undefined,
        deliveryAddress: deliveryAddress.trim() || undefined,
        specialInstructions: specialInstructions.trim() || undefined,
      },
      subtotal,
      settings.whatsapp
    );

    // Record order in Supabase Database if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: orderData } = await supabase
          .from('orders')
          .insert([
            {
              customer_name: customerName.trim(),
              customer_phone: customerPhone.trim(),
              order_type: orderType,
              status: 'new',
              total_amount: subtotal,
              notes: specialInstructions.trim() || undefined,
            },
          ])
          .select()
          .single();

        if (orderData && orderData.id) {
          const orderItemsPayload = items.map((i) => ({
            order_id: orderData.id,
            menu_item_name: i.menuItem.name,
            quantity: i.quantity,
            price: i.menuItem.price || 0,
            portion: i.menuItem.portion || undefined,
          }));
          await supabase.from('order_items').insert(orderItemsPayload);
        }
      } catch (err) {
        console.log('Order logged locally, DB write fallback:', err);
      }
    }

    // Open WhatsApp URL
    Linking.openURL(link).catch(() => {
      setErrorMessage('Could not open WhatsApp. Please ensure WhatsApp is installed or available.');
    });

    setIsOrderSubmitted(true);
  };

  const handleResetOrder = () => {
    clearCart();
    setIsOrderSubmitted(false);
    closeCart();
  };

  return (
    <Modal
      visible={isCartOpen}
      animationType="fade"
      transparent={true}
      onRequestClose={closeCart}
    >
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.backdropTouchable} onPress={closeCart} activeOpacity={1} />
        
        <View style={[styles.drawerContainer, isDesktop ? styles.drawerContainerDesktop : styles.drawerContainerMobile]}>
          {/* Header */}
          <View style={styles.drawerHeader}>
            <View style={styles.headerTitleRow}>
              <ShoppingBag size={20} color={COLORS.gold} style={{ marginRight: 8 }} />
              <Text style={styles.headerTitle}>Your Order</Text>
              {itemCount > 0 && (
                <View style={styles.headerCountBadge}>
                  <Text style={styles.headerCountText}>{itemCount} {itemCount === 1 ? 'item' : 'items'}</Text>
                </View>
              )}
            </View>

            <TouchableOpacity 
              style={styles.closeBtn} 
              onPress={closeCart}
              accessibilityRole="button"
              accessibilityLabel="Close cart"
            >
              <X size={20} color={COLORS.cream} />
            </TouchableOpacity>
          </View>

          {/* Content Body */}
          {isOrderSubmitted ? (
            <View style={styles.successContainer}>
              <CheckCircle2 size={56} color={COLORS.copper} style={{ marginBottom: 16 }} />
              <Text style={styles.successTitle}>Order Sent to WhatsApp!</Text>
              <Text style={styles.successDescription}>
                Thank you, {customerName}! We have created your order message and launched WhatsApp to confirm preparation time with our kitchen.
              </Text>
              <TouchableOpacity style={styles.primaryBtn} onPress={handleResetOrder}>
                <Text style={styles.primaryBtnText}>Done</Text>
              </TouchableOpacity>
            </View>
          ) : items.length === 0 ? (
            <View style={styles.emptyContainer}>
              <ShoppingBag size={48} color={COLORS.textSubtle} style={{ marginBottom: 14 }} />
              <Text style={styles.emptyTitle}>Your cart is empty</Text>
              <Text style={styles.emptySub}>Explore our delicious menu items and add them to your order.</Text>
            </View>
          ) : (
            <React.Fragment>
              <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Item List */}
                <View style={styles.itemsSection}>
                  {items.map((item) => (
                    <View key={item.menuItem.id} style={styles.cartItemRow}>
                      <Image
                        source={{ uri: item.menuItem.image_url || item.menuItem.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=300&q=80' }}
                        style={styles.itemImage}
                      />

                      <View style={styles.itemMeta}>
                        <Text style={styles.itemName} numberOfLines={1}>
                          {item.menuItem.name}
                        </Text>
                        <Text style={styles.itemPrice}>
                          {item.menuItem.price ? `₹${item.menuItem.price} each` : item.menuItem.priceRange || 'Price on request'}
                        </Text>
                      </View>

                      {/* Quantity controls */}
                      <View style={styles.qtyContainer}>
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() => decrementQuantity(item.menuItem.id)}
                          accessibilityRole="button"
                          accessibilityLabel="Decrease quantity"
                        >
                          <Minus size={12} color={COLORS.cream} />
                        </TouchableOpacity>

                        <Text style={styles.qtyValue}>{item.quantity}</Text>

                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() => incrementQuantity(item.menuItem.id)}
                          accessibilityRole="button"
                          accessibilityLabel="Increase quantity"
                        >
                          <Plus size={12} color={COLORS.cream} />
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => removeItem(item.menuItem.id)}
                        accessibilityRole="button"
                        accessibilityLabel={`Remove ${item.menuItem.name}`}
                      >
                        <Trash2 size={16} color={COLORS.errorLight} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>

                {/* Order Type Toggle */}
                <View style={styles.sectionCard}>
                  <Text style={styles.sectionTitle}>Dining Mode</Text>
                  <View style={styles.typeSelectorRow}>
                    {(['dine-in', 'takeaway', 'delivery'] as OrderType[]).map((t) => (
                      <TouchableOpacity
                        key={t}
                        style={[styles.typeOption, orderType === t && styles.typeOptionActive]}
                        onPress={() => setOrderType(t)}
                        activeOpacity={0.8}
                      >
                        <Text style={[styles.typeOptionText, orderType === t && styles.typeOptionTextActive]}>
                          {t === 'dine-in' ? 'Dine-In' : t === 'takeaway' ? 'Takeaway' : 'Delivery'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Customer Info Form */}
                <View style={styles.sectionCard}>
                  <Text style={styles.sectionTitle}>Contact & Details</Text>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Your Full Name *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. Rahul Sen"
                      placeholderTextColor={COLORS.textSubtle}
                      value={customerName}
                      onChangeText={setCustomerName}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Phone Number (10 digits) *</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. 9876543210"
                      placeholderTextColor={COLORS.textSubtle}
                      value={customerPhone}
                      onChangeText={setCustomerPhone}
                      keyboardType="phone-pad"
                    />
                  </View>

                  {orderType === 'dine-in' && (
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Table Number (if seated)</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="e.g. Table 4"
                        placeholderTextColor={COLORS.textSubtle}
                        value={tableNumber}
                        onChangeText={setTableNumber}
                      />
                    </View>
                  )}

                  {orderType === 'delivery' && (
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Delivery Address in Contai *</Text>
                      <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="House / Street / Landmark in Contai"
                        placeholderTextColor={COLORS.textSubtle}
                        value={deliveryAddress}
                        onChangeText={setDeliveryAddress}
                        multiline
                        numberOfLines={3}
                      />
                    </View>
                  )}

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Special Instructions (optional)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. Less spicy, extra onions, cold glass"
                      placeholderTextColor={COLORS.textSubtle}
                      value={specialInstructions}
                      onChangeText={setSpecialInstructions}
                    />
                  </View>
                </View>

                {errorMessage ? (
                  <View style={styles.errorBox}>
                    <AlertCircle size={15} color={COLORS.errorLight} style={{ marginRight: 6 }} />
                    <Text style={styles.errorText}>{errorMessage}</Text>
                  </View>
                ) : null}
              </ScrollView>

              {/* Sticky Checkout Footer */}
              <View style={styles.drawerFooter}>
                <View style={styles.subtotalRow}>
                  <Text style={styles.subtotalLabel}>Estimated Subtotal:</Text>
                  <Text style={styles.subtotalValue}>₹{subtotal}</Text>
                </View>

                <TouchableOpacity
                  style={styles.checkoutBtn}
                  onPress={handleWhatsAppCheckout}
                  activeOpacity={0.85}
                >
                  <MessageSquare size={17} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.checkoutBtnText}>Send Order via WhatsApp</Text>
                </TouchableOpacity>

                <Text style={styles.disclaimerText}>
                  Your order message will be sent directly to Dream Love's WhatsApp for instant confirmation.
                </Text>
              </View>
            </React.Fragment>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.70)',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  backdropTouchable: {
    flex: 1,
  },
  drawerContainer: {
    backgroundColor: COLORS.surfaceElevated,
    flexDirection: 'column',
    justifyContent: 'space-between',
    ...SHADOWS.cardHover,
  },
  drawerContainerDesktop: {
    width: 440,
    height: '100%',
    borderLeftWidth: 1,
    borderLeftColor: COLORS.border,
  },
  drawerContainerMobile: {
    width: '100%',
    height: '92%',
    alignSelf: 'flex-end',
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.cream,
  },
  headerCountBadge: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  headerCountText: {
    color: COLORS.copperLight,
    fontSize: 11.5,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    gap: 16,
  },
  itemsSection: {
    gap: 10,
  },
  cartItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 10,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: 10,
  },
  itemImage: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surfaceElevated,
  },
  itemMeta: {
    flex: 1,
  },
  itemName: {
    color: COLORS.cream,
    fontSize: 13.5,
    fontWeight: '600',
    marginBottom: 2,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  itemPrice: {
    color: COLORS.copperLight,
    fontSize: 12,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.xs,
    paddingHorizontal: 2,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  qtyBtn: {
    width: 24,
    height: 24,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: {
    color: COLORS.cream,
    fontSize: 12,
    fontWeight: '700',
    marginHorizontal: 6,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  deleteBtn: {
    padding: 6,
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    padding: 14,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.creamMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeOption: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  typeOptionActive: {
    backgroundColor: COLORS.brandTurquoise + '25',
    borderColor: COLORS.brandTurquoise,
  },
  typeOptionText: {
    color: COLORS.textMuted,
    fontSize: 12.5,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  typeOptionTextActive: {
    color: COLORS.brandTurquoise,
    fontWeight: '700',
  },
  inputGroup: {
    gap: 4,
  },
  label: {
    fontSize: 11.5,
    color: COLORS.textMuted,
    fontWeight: '600',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  input: {
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: 12,
    paddingVertical: 9,
    color: COLORS.cream,
    fontSize: 13.5,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  textArea: {
    height: 60,
    textAlignVertical: 'top',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 83, 80, 0.15)',
    padding: 10,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.errorLight,
  },
  errorText: {
    color: COLORS.errorLight,
    fontSize: 12.5,
    fontWeight: '500',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  drawerFooter: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.surface,
    gap: 12,
  },
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtotalLabel: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  subtotalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.copperLight,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  checkoutBtn: {
    flexDirection: 'row',
    backgroundColor: '#15803D',
    paddingVertical: 13,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.card,
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  disclaimerText: {
    fontSize: 11,
    color: COLORS.textSubtle,
    textAlign: 'center',
    lineHeight: 15,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  emptyTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 13.5,
    color: COLORS.textMuted,
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 18,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  successTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 8,
    textAlign: 'center',
  },
  successDescription: {
    fontSize: 13.5,
    color: COLORS.creamMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.xl,
    maxWidth: 320,
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
  primaryBtn: {
    backgroundColor: COLORS.brandHeart,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: BORDER_RADIUS.md,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: TYPOGRAPHY.fontFamilySans,
  },
});
