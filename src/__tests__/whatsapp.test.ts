import { formatWhatsAppOrderMessage } from '../utils/whatsapp';
import { CartItem } from '../types';

describe('WhatsApp Order Message Generator', () => {
  const items: CartItem[] = [
    {
      menuItem: {
        id: 'm-rnv-2',
        name: 'Chicken Biriyani',
        category: 'biryani-rice',
        price: 100,
        isAvailable: true,
        isFeatured: true,
        isVeg: false,
        ownerVerified: true,
        dataQualityStatus: 'verified',
        displayOrder: 69,
      },
      quantity: 2,
    },
    {
      menuItem: {
        id: 'm-sp-1',
        name: 'Chicken Vorta',
        category: 'chef-specials',
        price: 180,
        isAvailable: true,
        isFeatured: true,
        isVeg: false,
        ownerVerified: true,
        dataQualityStatus: 'verified',
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
      380,
      '+919933388167'
    );

    expect(text).toContain('Hello Dream Love Cafe & Restaurant');
    expect(text).toContain('Chicken Biriyani × 2 (₹200)');
    expect(text).toContain('Chicken Vorta × 1 (₹180)');
    expect(text).toContain('Estimated total: ₹380');
    expect(text).toContain('Name: Test Guest');
    expect(link).toContain('https://wa.me/919933388167?text=');
  });
});
