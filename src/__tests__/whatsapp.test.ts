import { formatWhatsAppOrderMessage } from '../utils/whatsapp';
import { CartItem } from '../types';

describe('WhatsApp Order Message Generator', () => {
  const items: CartItem[] = [
    {
      menuItem: {
        id: 'm-6',
        name: 'Chicken Biriyani',
        category: 'chef-specials',
        price: 160,
        isAvailable: true,
        isFeatured: true,
        isVeg: false,
        displayOrder: 6,
      },
      quantity: 2,
    },
    {
      menuItem: {
        id: 'm-1',
        name: 'Chicken Vorta',
        category: 'chef-specials',
        price: 270,
        isAvailable: true,
        isFeatured: true,
        isVeg: false,
        displayOrder: 1,
      },
      quantity: 1,
    },
  ];

  test('formats WhatsApp message text and encodes URL target correctly', () => {
    const { text, link } = formatWhatsAppOrderMessage(
      items,
      {
        name: 'Test Guest',
        phone: '+91 99333 88167',
        orderType: 'dine-in',
        tableNumber: 'Table 4',
      },
      590,
      '+919933388167'
    );

    expect(text).toContain('Hello Dream Love Cafe & Restaurant');
    expect(text).toContain('Chicken Biriyani × 2 (₹320)');
    expect(text).toContain('Chicken Vorta × 1 (₹270)');
    expect(text).toContain('Estimated total: ₹590');
    expect(text).toContain('Name: Test Guest');
    expect(link).toContain('https://wa.me/919933388167?text=');
  });
});
