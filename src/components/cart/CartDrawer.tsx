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
import { X, Trash2, Plus, Minus, MessageSquare, ShoppingBag, CheckCircle2 } from 'lucide-react-native';
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
      setErrorMessage('Please enter delivery address');
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

    // Optionally record order in Supabase Database (Section 35)
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
      setErrorMessage('Could not open WhatsApp. Make sure WhatsApp is installed.');
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
      animationType="slide"
      transparent={true}
      onRequestClose={closeCart}
    >
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.backdropTouchable} onPress={closeCart} activeOpacity={1} />
        
        <View style={[styles.drawerContainer, width >= 768 && styles.drawerContainerDesktop]}>
          {/* Header */}
          <View style={styles.drawerHeader}>
            <View style={styles.headerTitleRow}>
              <ShoppingBag size={22} color={COLORS.gold} style={{ marginRight: 8 }} />
              <Text style={styles.headerTitle}>Your Order</Text>
              {itemCount > 0 && (
                <View style={styles.headerCountBadge}>
                  <Text style={styles.headerCountText}>{itemCount} items</Text>
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={closeCart}>
              <X size={22} color={COLORS.cream} />
            </TouchableOpacity>
          </View>

          {/* Content Body */}
          {isOrderSubmitted ? (
            <View style={styles.successContainer}>
              <CheckCircle2 size={64} color={COLORS.copper} style={{ marginBottom: 16 }} />
              <Text style={styles.successTitle}>Order Sent to WhatsApp!</Text>
              <Text style={styles.successDescription}>
                Thank you, {customerName}! We have generated your order message and launched WhatsApp to confirm availability.
              </Text>
              <TouchableOpacity style={styles.primaryBtn} onPress={handleResetOrder}>
                <Text style={styles.primaryBtnText}>Done</Text>
              </TouchableOpacity>
            </View>
          ) : items.length === 0 ? (
            <View style={styles.emptyContainer}>
              <ShoppingBag size={48} color={COLORS.textSubtle} style={{ marginBottom: 12 }} />
              <Text style={styles.emptyTitle}>Your cart is empty</Text>
              <Text style={styles.emptySub}>Explore our delicious menu items and add them to your order.</Text>
            </View>
          ) : (
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
              {/* Item List */}
              <View style={styles.itemsSection}>
                {items.map((item) => (
                  <View key={item.menuItem.id} style={styles.cartItemRow}>
                    <Image
                      source={{ uri: item.menuItem.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=300&q=80' }}
                      style={styles.itemImage}
                    />

                    <View style={styles.itemMeta}>
                      <Text style={styles.itemName} numberOfLines={1}>
                        {item.menuItem.name}
                      </Text>
                      <Text style={styles.itemPrice}>
                        {item.menuItem.price ? `₹${item.menuItem.price} each` : item.menuItem.priceRange || 'Ask for price'}
                      </Text>
                    </View>

                    {/* Quantity controls */}
                    <View style={styles.qtyContainer}>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => decrementQuantity(item.menuItem.id)}
                      >
                        <Minus size={12} color={COLORS.cream} />
                      </TouchableOpacity>

                      <Text style={styles.qtyValue}>{item.quantity}</Text>

                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => incrementQuantity(item.menuItem.id)}
                      >
                        <Plus size={12} color={COLORS.cream} />
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => removeItem(item.menuItem.id)}
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
                    >
                      <Text style={[styles.typeOptionText, orderType === t && styles.typeOptionTextActive]}>
                        {t === 'dine-in' ? 'Dine-in' : t === 'takeaway' ? 'Takeaway' : 'Delivery'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Customer Info Form */}
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Contact & Preferences</Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Your Name *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    placeholderTextColor={COLORS.textSubtle}
                    value={customerName}
                    onChangeText={setCustomerName}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Phone Number *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. +91 98765 43210"
                    placeholderTextColor={COLORS.textSubtle}
                    keyboardType="phone-pad"
                    value={customerPhone}
                    onChangeText={setCustomerPhone}
                  />
                </View>

                {orderType === 'dine-in' && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Table Number / Preference (Optional)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. Table 4 or Corner seating"
                      placeholderTextColor={COLORS.textSubtle}
                      value={tableNumber}
                      onChangeText={setTableNumber}
                    />
                  </View>
                )}

                {orderType === 'delivery' && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Delivery Address *</Text>
                    <TextInput
                      style={[styles.input, { height: 70 }]}
                      placeholder="Enter detailed delivery address in Contai"
                      placeholderTextColor={COLORS.textSubtle}
                      multiline={true}
                      value={deliveryAddress}
                      onChangeText={setDeliveryAddress}
                    />
                  </View>
                )}

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Special Request (Optional)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Extra spicy, less oil, separate sauce"
                    placeholderTextColor={COLORS.textSubtle}
                    value={specialInstructions}
                    onChangeText={setSpecialInstructions}
                  />
                </View>

                {errorMessage ? (
                  <Text style={styles.errorText}>{errorMessage}</Text>
                ) : null}
              </View>
            </ScrollView>
          )}

          {/* Footer Checkout Bar */}
          {!isOrderSubmitted && items.length > 0 && (
            <View style={styles.drawerFooter}>
              <View style={styles.subtotalRow}>
                <Text style={styles.subtotalLabel}>Estimated Subtotal</Text>
                <Text style={styles.subtotalValue}>₹{subtotal}</Text>
              </View>

              <TouchableOpacity style={styles.whatsappCheckoutBtn} onPress={handleWhatsAppCheckout}>
                <MessageSquare size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.whatsappCheckoutText}>Order on WhatsApp</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(18, 15, 14, 0.85)',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  backdropTouchable: {
    flex: 1,
  },
  drawerContainer: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: COLORS.surface,
    height: '100%',
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 16,
  },
  drawerContainerDesktop: {
    borderLeftWidth: 1,
    borderLeftColor: COLORS.border,
  },
  drawerHeader: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surfaceElevated,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.cream,
  },
  headerCountBadge: {
    backgroundColor: COLORS.copper + '30',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginLeft: 10,
  },
  headerCountText: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '600',
  },
  closeBtn: {
    padding: 6,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
  },
  emptyTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 20,
    color: COLORS.cream,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  itemsSection: {
    marginBottom: SPACING.md,
  },
  cartItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  itemImage: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: 10,
  },
  itemMeta: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.cream,
  },
  itemPrice: {
    fontSize: 12,
    color: COLORS.gold,
    fontWeight: '700',
    marginTop: 2,
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingHorizontal: 2,
  },
  qtyBtn: {
    padding: 6,
  },
  qtyValue: {
    color: COLORS.cream,
    fontSize: 13,
    fontWeight: '700',
    paddingHorizontal: 6,
  },
  deleteBtn: {
    padding: 8,
    marginLeft: 6,
  },
  sectionCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: SPACING.sm,
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeOption: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  typeOptionActive: {
    backgroundColor: COLORS.copper + '30',
    borderColor: COLORS.copper,
  },
  typeOptionText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  typeOptionTextActive: {
    color: COLORS.gold,
    fontWeight: '700',
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: COLORS.creamMuted,
    marginBottom: 4,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: COLORS.cream,
    fontSize: 13,
  },
  errorText: {
    color: COLORS.errorLight,
    fontSize: 12,
    marginTop: 6,
  },
  drawerFooter: {
    padding: SPACING.md,
    backgroundColor: COLORS.surfaceElevated,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subtotalLabel: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  subtotalValue: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.gold,
  },
  whatsappCheckoutBtn: {
    backgroundColor: '#25D366',
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  whatsappCheckoutText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
  },
  successTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySerif,
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.cream,
    marginBottom: 8,
    textAlign: 'center',
  },
  successDescription: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.xl,
  },
  primaryBtn: {
    backgroundColor: COLORS.copper,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
  },
  primaryBtnText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: '700',
  },
});
