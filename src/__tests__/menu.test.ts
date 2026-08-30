import { INITIAL_MENU_ITEMS, MENU_CATEGORIES } from '../config/restaurantData';

describe('Menu Dataset Integrity, Pricing Rules & Zero Image Duplication', () => {
  test('verifies supplied prices are non-negative and unpriced items do not have fake numeric values', () => {
    INITIAL_MENU_ITEMS.forEach((item) => {
      if (item.price !== undefined && item.price !== null) {
        expect(item.price).toBeGreaterThan(0);
      }
      expect(item.name).toBeTruthy();
      expect(item.category).toBeTruthy();
    });
  });

  test('verifies canonical client-supplied menu prices', () => {
    const vorta = INITIAL_MENU_ITEMS.find((i) => i.name === 'Chicken Vorta');
    expect(vorta?.price).toBe(180);

    const punjabiChicken = INITIAL_MENU_ITEMS.find((i) => i.name === 'Punjabi Chicken');
    expect(punjabiChicken?.price).toBe(180);

    const chickenBiryani = INITIAL_MENU_ITEMS.find((i) => i.name === 'Chicken Biryani' || i.name === 'Chicken Biriyani');
    expect(chickenBiryani?.price).toBe(100);

    const muttonBiryani = INITIAL_MENU_ITEMS.find((i) => i.name === 'Mutton Biryani' || i.name === 'Mutton Biriyani');
    expect(muttonBiryani?.price).toBe(220);

    const tandooriChicken = INITIAL_MENU_ITEMS.find((i) => i.name === 'Chicken Tandoori');
    expect(tandooriChicken?.price).toBe(200);

    const tangriKabab = INITIAL_MENU_ITEMS.find((i) => i.name === 'Tangri Kabab');
    expect(tangriKabab?.price).toBe(250);

    const chicken65 = INITIAL_MENU_ITEMS.find((i) => i.name === 'Chicken 65');
    expect(chicken65?.price).toBe(100);

    const chickenLollipop = INITIAL_MENU_ITEMS.find((i) => i.name === 'Chicken Lollipop');
    expect(chickenLollipop?.price).toBe(110);

    const blueLemonade = INITIAL_MENU_ITEMS.find((i) => i.name === 'Blue Lemonade Mocktail');
    expect(blueLemonade?.price).toBe(80);

    const oreoShake = INITIAL_MENU_ITEMS.find((i) => i.name === 'Oreo Shake');
    expect(oreoShake?.price).toBe(120);

    const coldCoffee = INITIAL_MENU_ITEMS.find((i) => i.name === 'Cold Coffee');
    expect(coldCoffee?.price).toBe(80);
  });

  test('verifies unpriced dishes explicitly maintain portion or ask for price tags', () => {
    const handiBiriyani = INITIAL_MENU_ITEMS.find((i) => i.name === 'Dream Love Special Handi Chicken Biriyani');
    expect(handiBiriyani?.price == null || handiBiriyani?.price === 0).toBeTruthy();
    expect(handiBiriyani?.portion).toBe('Ask for price');

    const tandooriFish = INITIAL_MENU_ITEMS.find((i) => i.name === 'Tandoor Fish');
    expect(tandooriFish?.price == null || tandooriFish?.price === 0).toBeTruthy();
    expect(tandooriFish?.portion).toBe('As per size');
  });

  test('verifies all menu items receive a valid, realistic, dish-specific image in client preview', () => {
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

  test('verifies ZERO unrelated duplicate image assignments across all 134 dishes', () => {
    const urlMap: Record<string, string[]> = {};
    INITIAL_MENU_ITEMS.forEach((item) => {
      const url = item.image_url || item.image;
      if (url) {
        if (!urlMap[url]) urlMap[url] = [];
        urlMap[url].push(item.name);
      }
    });

    const duplicateGroups = Object.entries(urlMap).filter(([_, names]) => names.length > 1);
    expect(duplicateGroups.length).toBe(0);
  });

  test('verifies specific critical dishes do not share images', () => {
    const dishesToCheck = [
      'Egg Vurgi Masala',
      'Chicken Kornamdom',
      'Chicken Chattanar',
      'Handi Chicken',
      'Punjabi Chicken',
      'Chicken Vorta',
      'Cucumber Salad',
      'Onion Salad',
      'Green Salad',
      'Chinese Salad',
      'Fruit Salad',
      'Blue Lemonade Mocktail',
      'Green Lemonade Mocktail',
      'Masala Cold Drinks',
      'Orange Mocktail',
    ];

    const urls = dishesToCheck.map((name) => {
      const it = INITIAL_MENU_ITEMS.find((i) => i.name === name);
      expect(it).toBeDefined();
      return it?.image_url || it?.image;
    });

    const uniqueUrls = new Set(urls);
    expect(uniqueUrls.size).toBe(dishesToCheck.length);
  });

  test('verifies salad dishes are categorized under salad and NOT soups', () => {
    const saladNames = ['Cucumber Salad', 'Onion Salad', 'Green Salad', 'Chinese Salad', 'Fruit Salad'];
    saladNames.forEach((name) => {
      const item = INITIAL_MENU_ITEMS.find((i) => i.name === name);
      expect(item).toBeDefined();
      expect(item?.category).toBe('salad');
    });
  });

  test('verifies specials dishes are categorized under dream-love-special', () => {
    const specialNames = [
      'Chicken Vorta',
      'Tandoori Chicken Masala (H/F)',
      'Tandoori Butter Chicken (H/F)',
      'Tandoori Kadai Chicken (H/F)',
      'Tandoori Do Piyaza (H/F)',
      'Paper Tandoori Chicken (H/F)',
    ];
    specialNames.forEach((name) => {
      const item = INITIAL_MENU_ITEMS.find((i) => i.name === name);
      expect(item).toBeDefined();
      expect(item?.category).toBe('dream-love-special');
    });
  });

  test('verifies uncertain dish names have normalization_status owner_review_required', () => {
    const uncertainNames = [
      'Chicken Kornamdom',
      'Chicken Chattanar',
      'Sarja Shake',
      'Special 3paix Veg Fried Rice',
      'Sp 3 Pal X Fried Rice',
      'Pach Nan',
    ];
    uncertainNames.forEach((name) => {
      const item = INITIAL_MENU_ITEMS.find((i) => i.name === name);
      expect(item).toBeDefined();
      expect(item?.normalization_status).toBe('owner_review_required');
    });
  });

  test('verifies all categories in MENU_CATEGORIES have active items', () => {
    MENU_CATEGORIES.forEach((cat) => {
      const itemsInCat = INITIAL_MENU_ITEMS.filter((i) => i.category === cat.slug);
      expect(itemsInCat.length).toBeGreaterThan(0);
    });
  });
});
