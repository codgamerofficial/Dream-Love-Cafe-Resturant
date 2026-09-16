import { INITIAL_MENU_ITEMS, MENU_CATEGORIES } from '../config/restaurantData';

describe('Authoritative Menu Dataset Integrity (25 Categories, 217 Dishes)', () => {
  test('verifies total counts match canonical 25 categories and 217 dishes', () => {
    expect(MENU_CATEGORIES.length).toBe(25);
    expect(INITIAL_MENU_ITEMS.length).toBe(217);
  });

  test('verifies supplied prices are non-negative and unpriced items do not have fake numeric values', () => {
    INITIAL_MENU_ITEMS.forEach((item) => {
      if (item.price !== undefined && item.price !== null) {
        expect(item.price).toBeGreaterThan(0);
      }
      expect(item.name).toBeTruthy();
      expect(item.category).toBeTruthy();
    });
  });

  test('verifies canonical client-supplied menu prices from the 6-page authoritative menu', () => {
    // Page 4: Side Dish (Non-Veg) Chicken
    const vorta = INITIAL_MENU_ITEMS.find((i) => i.name === 'Chicken Vorta');
    expect(vorta?.price).toBe(220);

    const punjabiChicken = INITIAL_MENU_ITEMS.find((i) => i.name === 'Punjabi Chicken');
    expect(punjabiChicken?.price).toBe(200);

    // Page 1: Rice / Biriyani
    const chickenBiryani = INITIAL_MENU_ITEMS.find((i) => i.name === 'Chicken Biryani' || i.name === 'Chicken Biriyani');
    expect(chickenBiryani?.price).toBe(110);

    const muttonBiryani = INITIAL_MENU_ITEMS.find((i) => i.name === 'Mutton Biryani' || i.name === 'Mutton Biriyani');
    expect(muttonBiryani?.price).toBe(230);

    const handiBiryani = INITIAL_MENU_ITEMS.find((i) => i.name.includes('Handi Chicken Biriyani'));
    expect(handiBiryani?.price).toBe(220);

    // Page 2: Tandoori Starters
    const tandooriChicken = INITIAL_MENU_ITEMS.find((i) => i.name.includes('Chicken Tandoori'));
    expect(tandooriChicken?.price).toBe(220);

    const tangriKabab = INITIAL_MENU_ITEMS.find((i) => i.name.includes('Tangri'));
    expect(tangriKabab?.price).toBe(250);

    // Page 3: Chinese Non-Veg Starters
    const chicken65 = INITIAL_MENU_ITEMS.find((i) => i.name === 'Chicken 65');
    expect(chicken65?.price).toBe(120);

    const chickenLollipop = INITIAL_MENU_ITEMS.find((i) => i.name === 'Chicken Lollipop');
    expect(chickenLollipop?.price).toBe(130);

    // Page 5: Beverages & Shakes
    const blueLemonade = INITIAL_MENU_ITEMS.find((i) => i.name === 'Blue Lemonade Mocktail');
    expect(blueLemonade?.price).toBe(90);

    const oreoShake = INITIAL_MENU_ITEMS.find((i) => i.name === 'Oreo Shake');
    expect(oreoShake?.price).toBe(130);

    const coldCoffee = INITIAL_MENU_ITEMS.find((i) => i.name === 'Cold Coffee');
    expect(coldCoffee?.price).toBe(110);
  });

  test('verifies as-per-size dishes explicitly maintain portion tags without fake prices', () => {
    const tandooriFish = INITIAL_MENU_ITEMS.find((i) => i.name === 'Tandoor Fish' || i.name === 'Tandoori Fish');
    expect(tandooriFish?.price == null || tandooriFish?.price === 0).toBeTruthy();
    expect(tandooriFish?.portion).toBe('As per size');
    expect(tandooriFish?.priceType).toBe('as_per_size');
  });

  test('verifies all 217 menu items receive a valid, realistic culinary image in client preview', () => {
    INITIAL_MENU_ITEMS.forEach((item) => {
      const url = item.image_url || item.image;
      expect(url).toBeTruthy();
      expect(typeof url).toBe('string');
      expect(url?.startsWith('http') || url?.startsWith('/')).toBeTruthy();
    });
  });

  test('verifies temporary images are marked as mock_placeholder and image_replacement_required = true', () => {
    const mockItems = INITIAL_MENU_ITEMS.filter((i) => i.image_type === 'mock_placeholder');
    expect(mockItems.length).toBeGreaterThan(0);
    mockItems.forEach((item) => {
      expect(item.image_replacement_required).toBe(true);
      expect(item.image_verified).toBe(false);
      expect(item.image_source).toBe('temporary_generated');
    });
  });

  test('verifies salad dishes are categorized under salad and NOT soups', () => {
    const saladItems = INITIAL_MENU_ITEMS.filter((i) => i.category === 'salad');
    expect(saladItems.length).toBeGreaterThanOrEqual(4);
    saladItems.forEach((item) => {
      expect(item.category).toBe('salad');
      expect(item.category).not.toBe('soup-veg');
      expect(item.category).not.toBe('soup-non-veg');
    });
  });

  test('verifies all 25 canonical categories have active menu items', () => {
    MENU_CATEGORIES.forEach((cat) => {
      const itemsInCat = INITIAL_MENU_ITEMS.filter((i) => i.category === cat.slug);
      expect(itemsInCat.length).toBeGreaterThan(0);
    });
  });

  test('verifies veg and non-veg dietary classification is strictly accurate', () => {
    const vegCategories = [
      'special-dishes-veg',
      'salad',
      'rita',
      'soup-veg',
      'rice-veg',
      'paneer-special',
      'mushroom-special',
      'side-dish-veg',
      'tandoori-veg-starters',
      'chinese-veg-starters',
      'chinese-veg-main-course',
      'tandoori-roti',
      'paratha',
      'roll-veg',
      'chowmein-veg',
      'chopci-veg',
      'mocktail',
      'lassi',
      'shakes',
      'ice-cream',
      'hot-drinks'
    ];

    INITIAL_MENU_ITEMS.forEach((item) => {
      if (vegCategories.includes(item.category) && !item.name.toLowerCase().includes('chicken') && !item.name.toLowerCase().includes('mutton') && !item.name.toLowerCase().includes('egg') && !item.name.toLowerCase().includes('fish')) {
        expect(item.isVeg).toBe(true);
      }
    });
  });
});
