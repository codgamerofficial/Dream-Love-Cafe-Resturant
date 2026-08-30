import { INITIAL_MENU_ITEMS, MENU_CATEGORIES } from '../config/restaurantData';
import * as fs from 'fs';
import * as path from 'path';

describe('Audit Menu Items Full', () => {
  test('write menu audit to file', () => {
    const report: any = {
      total: INITIAL_MENU_ITEMS.length,
      categories: {},
      duplicateGroups: [],
      items: [],
    };

    const imgMap: Record<string, any[]> = {};

    INITIAL_MENU_ITEMS.forEach((item, idx) => {
      report.categories[item.category] = (report.categories[item.category] || 0) + 1;
      const url = item.image_url || item.image || 'NO_IMAGE';
      if (!imgMap[url]) imgMap[url] = [];
      imgMap[url].push({ idx: idx + 1, id: item.id, name: item.name, category: item.category, price: item.price ?? item.portion });

      report.items.push({
        idx: idx + 1,
        id: item.id,
        name: item.name,
        canonicalName: item.canonicalName || item.canonical_name || '',
        category: item.category,
        subcategory: item.subcategory,
        price: item.price,
        portion: item.portion,
        priceType: item.priceType,
        isVeg: item.isVeg,
        imageUrl: url,
      });
    });

    Object.entries(imgMap).forEach(([url, items]) => {
      if (items.length > 1) {
        report.duplicateGroups.push({
          count: items.length,
          url,
          dishes: items.map(i => `${i.name} (${i.category})`),
        });
      }
    });

    report.duplicateGroups.sort((a: any, b: any) => b.count - a.count);

    fs.writeFileSync(
      path.join(__dirname, 'menu_audit_report.json'),
      JSON.stringify(report, null, 2),
      'utf8'
    );
    console.log(`Saved report. Total items: ${report.total}, Duplicate Groups: ${report.duplicateGroups.length}`);
    report.duplicateGroups.forEach((g: any) => {
      console.log(`[${g.count}x] ${g.url.slice(0, 50)}...: ${g.dishes.join(' | ')}`);
    });
  });
});
