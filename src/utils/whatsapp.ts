import { CartItem, OrderCustomerDetails } from '../types';

export function formatWhatsAppOrderMessage(
  cartItems: CartItem[],
  customerDetails: OrderCustomerDetails,
  estimatedTotal: number,
  targetPhone: string = '919933388167'
): { text: string; link: string } {
  const cleanPhone = targetPhone.replace(/[^0-9]/g, '');

  const itemsList = cartItems
    .map((item) => {
      const priceText = item.menuItem.price
        ? ` (₹${item.menuItem.price * item.quantity})`
        : item.menuItem.priceRange
        ? ` (${item.menuItem.priceRange})`
        : ' (Ask for price)';
      return `• ${item.menuItem.name} × ${item.quantity}${priceText}`;
    })
    .join('\n');

  const orderTypeDisplay = 
    customerDetails.orderType === 'dine-in' 
      ? 'Dine-in' 
      : customerDetails.orderType === 'takeaway' 
      ? 'Takeaway' 
      : 'No-contact Delivery';

  let message = `Hello Dream Love Cafe & Restaurant,\n\nI would like to place an order:\n\n${itemsList}\n\nEstimated total: ₹${estimatedTotal}\n\nName: ${customerDetails.name}\nPhone: ${customerDetails.phone}\nOrder type: ${orderTypeDisplay}`;

  if (customerDetails.deliveryAddress && customerDetails.orderType === 'delivery') {
    message += `\nDelivery Address: ${customerDetails.deliveryAddress}`;
  }

  if (customerDetails.tableNumber && customerDetails.orderType === 'dine-in') {
    message += `\nTable Preference: ${customerDetails.tableNumber}`;
  }

  if (customerDetails.specialInstructions) {
    message += `\nSpecial Request: ${customerDetails.specialInstructions}`;
  }

  message += `\n\nPlease confirm availability.`;

  const encodedText = encodeURIComponent(message);
  const link = `https://wa.me/${cleanPhone}?text=${encodedText}`;

  return { text: message, link };
}
