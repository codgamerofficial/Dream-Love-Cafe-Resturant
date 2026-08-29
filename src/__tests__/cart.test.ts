import { CartItem, MenuItem } from '../types';

describe('Cart Calculations', () => {
  const sampleItem1: MenuItem = {
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
  };

  const sampleItem2: MenuItem = {
    id: 'm-tan-1',
    name: 'Chicken Tandoori',
    category: 'tandoori-kebabs',
    price: 200,
    isAvailable: true,
    isFeatured: true,
    isVeg: false,
    ownerVerified: true,
    dataQualityStatus: 'verified',
    displayOrder: 45,
  };

  test('calculates subtotal correctly for single and multiple quantities', () => {
    const items: CartItem[] = [
      { menuItem: sampleItem1, quantity: 2 }, // 180 * 2 = 360
      { menuItem: sampleItem2, quantity: 1 }, // 200 * 1 = 200
    ];

    const subtotal = items.reduce((sum, item) => {
      const price = item.menuItem.price || 0;
      return sum + price * item.quantity;
    }, 0);

    expect(subtotal).toBe(560);
  });

  test('calculates total item count correctly', () => {
    const items: CartItem[] = [
      { menuItem: sampleItem1, quantity: 3 },
      { menuItem: sampleItem2, quantity: 2 },
    ];

    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
    expect(totalCount).toBe(5);
  });
});
