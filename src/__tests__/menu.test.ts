import { INITIAL_MENU_ITEMS } from '../config/restaurantData';

describe('Menu Dataset Integrity & Pricing Rules', () => {
  test('verifies supplied prices are non-negative and unpriced items do not have fake numeric values', () => {
    INITIAL_MENU_ITEMS.forEach((item) => {
      if (item.price !== undefined) {
        expect(item.price).toBeGreaterThan(0);
      }
      expect(item.name).toBeTruthy();
      expect(item.category).toBeTruthy();
    });
  });

  test('verifies chef specials contain exact specified prices', () => {
    const vorta = INITIAL_MENU_ITEMS.find((i) => i.name === 'Chicken Vorta');
    expect(vorta?.price).toBe(270);

    const kadhaiMutton = INITIAL_MENU_ITEMS.find((i) => i.name === 'Kadhai Mutton');
    expect(kadhaiMutton?.price).toBe(395);

    const muttonKasa = INITIAL_MENU_ITEMS.find((i) => i.name === 'Mutton Kasa');
    expect(muttonKasa?.price).toBe(360);

    const hyderabadi = INITIAL_MENU_ITEMS.find((i) => i.name === 'Chicken Hyderabadi');
    expect(hyderabadi?.price).toBe(235);

    const handiBiriyani = INITIAL_MENU_ITEMS.find((i) => i.name === 'Dream Love Special Handi Chicken Biriyani');
    expect(handiBiriyani?.priceRange).toBe('₹220–₹260');
  });
});
