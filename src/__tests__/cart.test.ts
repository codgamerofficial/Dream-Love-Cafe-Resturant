import { CartItem, MenuItem } from '../types';

describe('Cart Calculations', () => {
  const sampleItem1: MenuItem = {
    id: 'm-1',
    name: 'Chicken Vorta',
    category: 'chef-specials',
    price: 270,
    isAvailable: true,
    isFeatured: true,
    isVeg: false,
    displayOrder: 1,
  };

  const sampleItem2: MenuItem = {
    id: 'm-2',
    name: 'Kadhai Mutton',
    category: 'chef-specials',
    price: 395,
    isAvailable: true,
    isFeatured: true,
    isVeg: false,
    displayOrder: 2,
  };

  test('calculates subtotal correctly for single and multiple quantities', () => {
    const items: CartItem[] = [
      { menuItem: sampleItem1, quantity: 2 }, // 270 * 2 = 540
      { menuItem: sampleItem2, quantity: 1 }, // 395 * 1 = 395
    ];

    const subtotal = items.reduce((sum, item) => {
      const price = item.menuItem.price || 0;
      return sum + price * item.quantity;
    }, 0);

    expect(subtotal).toBe(935);
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
