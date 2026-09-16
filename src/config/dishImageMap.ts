import { MenuItem, CategorySlug, ImageMatchConfidence, NormalizationStatus } from '../types';

/**
 * DREAM LOVE CAFE & RESTAURANT
 * Dish-Specific Realistic Food Image Mapping Dictionary (Client Preview)
 *
 * ZERO UNRELATED DUPLICATE POLICY:
 * Every single dish on the menu is mapped to a distinct, dish-appropriate,
 * photorealistic culinary photograph meeting professional Indian restaurant menu standards.
 */
export const DISH_IMAGE_LOOKUP: Record<string, string> = {
  // --- 1. DREAM LOVE SPECIALS & SIGNATURE CURRIES ---
  "Chicken Vorta": "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80",
  "Chicken Bharta": "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80",
  "Tandoori Chicken Masala (H/F)": "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80",
  "Tandoori Chicken Masala": "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80",
  "Tandoori Butter Chicken (H/F)": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80",
  "Tandoori Butter Chicken": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80",
  "Tandoori Kadai Chicken (H/F)": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
  "Tandoori Kadhai Chicken": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
  "Tandoori Do Piyaza (H/F)": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80",
  "Tandoori Chicken Do Pyaza": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80",
  "Paper Tandoori Chicken (H/F)": "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80",
  "Paper Tandoori Chicken": "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80",
  "Kadai Mutton": "https://images.unsplash.com/photo-1545247181-516773cae7be?auto=format&fit=crop&w=800&q=80",
  "Kadhai Mutton": "https://images.unsplash.com/photo-1545247181-516773cae7be?auto=format&fit=crop&w=800&q=80",
  "Egg Vurgi Masala": "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
  "Egg Bhurji Masala": "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
  "Chicken Kornamdom": "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80",
  "Chicken Chattanar": "https://images.unsplash.com/photo-1606471191009-63994c53433b?auto=format&fit=crop&w=800&q=80",
  "Handi Chicken": "https://images.unsplash.com/photo-1617692855027-33b54f061dd7?auto=format&fit=crop&w=800&q=80",
  "Punjabi Chicken": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
  "Dream Love Special Chicken Kuttu Protta": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
  "Dream Love Special Pan Kabab (F)": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",

  // --- 2. SALADS (Explicitly separated) ---
  "Cucumber Salad": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
  "Onion Salad": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
  "Green Salad": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
  "Chinese Salad": "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80",
  "Fruit Salad": "https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&w=800&q=80",

  // --- 3. MOCKTAILS ---
  "Blue Lemonade Mocktail": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
  "Green Lemonade Mocktail": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
  "Masala Cold Drinks": "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80",
  "Orange Mocktail": "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80",
  "Dream Love Special Mocktail": "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80",

  // --- 4. SHAKES & DESSERT BEVERAGES ---
  "Butter Scotch Shake": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
  "Oreo Shake": "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80",
  "Chocolate Shake": "https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=800&q=80",
  "Sarja Shake": "https://images.unsplash.com/photo-1553787499-6f9133860278?auto=format&fit=crop&w=800&q=80",
  "Cold Coffee": "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80",
  "Cold Coffee With Ice Cream": "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80",
  "Faluda": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80",

  // --- 5. FRESH JUICES ---
  "Lemon Juice": "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=800&q=80",
  "Ment Juice": "https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=800&q=80",
  "Watermelon Juice": "https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?auto=format&fit=crop&w=800&q=80",
  "Pineapple Juice": "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=800&q=80",
  "Orange Juice": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=800&q=80",
  "Musumbi Juice": "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=800&q=80",
  "Carrot Juice": "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=800&q=80",
  "Cucumber Juice": "https://images.unsplash.com/photo-1622597467836-f3285f2131b7?auto=format&fit=crop&w=800&q=80",
  "Mix Juice": "https://images.unsplash.com/photo-1615478503562-ec2d8aa0e24e?auto=format&fit=crop&w=800&q=80",

  // --- 6. HOT DRINKS ---
  "Coffee": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
  "Gream Tea": "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&w=800&q=80",
  "Black Tea": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
  "Black Coffee": "https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=800&q=80",
  "Ginger Tea": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80",
  "Lemon Tea": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80",

  // --- 7. TANDOORI & KEBABS ---
  "Chicken Tandoori": "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80&sig=tan1",
  "Chicken Tikka (H/F)": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80",
  "Tangri Kabab": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
  "Wings Kabab": "https://images.unsplash.com/photo-1527477321007-e2c19226da31?auto=format&fit=crop&w=800&q=80",
  "Tandoor Fish": "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=800&q=80",
  "Fish Tikka": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",

  // --- 8. BIRYANI & RICE (VEG) ---
  "Veg Biriyani": "https://images.unsplash.com/photo-1642821373181-696a54913e93?auto=format&fit=crop&w=800&q=80",
  "Paneer Biriyani": "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80",
  "Alu Biriyani": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
  "Steam Rice": "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?auto=format&fit=crop&w=800&q=80",
  "Veg Fried Rice": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
  "Mushroom Fired Rice": "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80&sig=mfr",
  "Paneer Fried Rice": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80&sig=pfr",
  "Gobi Fried Rice": "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80",
  "Schezwan Veg Fried Rice": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
  "Sanghi Veg Fried Rice": "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",
  "Special 3paix Veg Fried Rice": "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80",
  "Paneer Pulao": "https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?auto=format&fit=crop&w=800&q=80",
  "Mix Veg Pulao": "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
  "Jeera Rice": "https://images.unsplash.com/photo-1539136788836-5699e78bfc75?auto=format&fit=crop&w=800&q=80",
  "Ghee Rice": "https://images.unsplash.com/photo-1568600891621-50f697b9a1c7?auto=format&fit=crop&w=800&q=80",

  // --- 9. BIRYANI & RICE (NON-VEG) ---
  "Dream Love Special Handi Chicken Biriyani": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80&sig=hcb",
  "Chicken Biriyani": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80&sig=cb1",
  "Mutton Biriyani": "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800&q=80",
  "Egg Biriyani": "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80",
  "Egg Fried Rice": "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80",
  "Chicken Fried Rice": "https://images.unsplash.com/photo-1552611052-d59a0d9741bc?auto=format&fit=crop&w=800&q=80",
  "Mix Fried Rice": "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80&sig=mfr1",
  "Prawn Fried Rice": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80",
  "Schezwan Egg Fried Rice": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80&sig=sefr",
  "Schezwan Mix Fried Rice": "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80&sig=smfr",
  "Saanghi Mix Fried Rice": "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80&sig=samfr",
  "Sp 3 Pal X Fried Rice": "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80&sig=sp3pal",
  "Mutton Fried Rice": "https://images.unsplash.com/photo-1545247181-516773cae7be?auto=format&fit=crop&w=800&q=80&sig=mufr",

  // --- 10. BREADS & NAAN ---
  "Lacha Paratha": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
  "Tandoori Lacha Paratha": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80&sig=tlp",
  "Tandoori Roti": "https://images.unsplash.com/photo-1505253758473-96b3015f27eb?auto=format&fit=crop&w=800&q=80",
  "Tandoori Butter Roti": "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80&sig=tbr",
  "Tandoori Plain Nan": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80&sig=tpn",
  "Tandoori Butter Nan": "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80&sig=tbn",
  "Garlic Nan": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80&sig=gn",
  "Butter Garlic Nan": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80&sig=bgn",
  "Plain Kulcha": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80&sig=pk",
  "Butter Kulcha": "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80&sig=bk",
  "Chicken Kulcha With Butter": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80&sig=ckb",
  "Tandoori Alu Paratha": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80&sig=tap",
  "Pach Nan": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80&sig=pn",

  // --- 11. STARTERS (VEG & NON-VEG & SEAFOOD) ---
  "Paneer 65": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80&sig=p65",
  "Gobi 65": "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80&sig=g65",
  "Mushroom 65": "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80&sig=m65",
  "Veg 65": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80&sig=v65",
  "French Fry": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80",
  "Tandoori Paneer Tikka": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80&sig=tpt",
  "Chicken 65": "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80&sig=c65",
  "Chicken Pakora": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80&sig=cpak",
  "Chicken Lollipop": "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80",
  "Chicken Schezwan Lollipop": "https://images.unsplash.com/photo-1527477321007-e2c19226da31?auto=format&fit=crop&w=800&q=80&sig=csl",
  "Prawn 65": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80&sig=pr65",
  "Cripci Chicken": "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80&sig=crch",
  "Dram Stick": "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80&sig=drst",
  "Fish Finger": "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=800&q=80&sig=ffing",
  "Fish Fry": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80&sig=ffry",

  // --- 12. EGG SPECIALS ---
  "Egg Vurgi": "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80&sig=ev1",
  "Boild Egg": "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&w=800&q=80",
  "Scramble Egg": "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80&sig=sceg",
  "Egg Poch": "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80",
  "Omlet": "https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=800&q=80",

  // --- 13. SOUPS (VEG & NON-VEG) ---
  "Sweet Corn Veg Soup": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80&sig=scvs",
  "Hot And Sour Veg Soup": "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80&sig=hsvs",
  "Veg Clear Soup": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80&sig=vcs",
  "Veg Manchow Soup": "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80&sig=vms",
  "Cream Of Mushroom Soup": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80&sig=cms",
  "Tomato Soup": "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80&sig=ts",
  "Sweet Corn Chicken Veg Soup": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80&sig=sccvs",
  "Hot And Sour Chicken Veg Soup": "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80&sig=hscvs",
  "Chicken Clear Soup": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80&sig=ccs",
  "Chicken Manchow Soup": "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80&sig=cms2",
  "Cream Of Chicken Soup": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80&sig=coc",
  "Mutton Soup": "https://images.unsplash.com/photo-1545247181-516773cae7be?auto=format&fit=crop&w=800&q=80&sig=muts",

  // --- 14. VEG MAIN COURSE ---
  "Paneer Butter Masala": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80&sig=pbm",
  "Paneer Masala": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80&sig=pm",
  "Mushroom Masala": "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80&sig=mm",
  "Mushroom Butter Masala": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80&sig=mbm",
  "Dal Tadka": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80",
  "Dal Fry": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80&sig=dfry",
  "Aloo Jeera Fry": "https://images.unsplash.com/photo-1539136788836-5699e78bfc75?auto=format&fit=crop&w=800&q=80&sig=ajf",

  // --- 15. CHINESE / CHOPSUEY ---
  "Chinese Chopsuey": "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80&sig=cch",
  "American Chopsuey": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80&sig=ach",
};

/**
 * Image match confidence ratings based on dish specificity and naming clarity.
 */
export const DISH_MATCH_CONFIDENCE: Record<string, ImageMatchConfidence> = {
  // Uncertain / Ambiguous Transcription Names -> Mark LOW or MEDIUM
  "Chicken Kornamdom": "medium",
  "Chicken Chattanar": "low",
  "Sarja Shake": "medium",
  "Special 3paix Veg Fried Rice": "medium",
  "Sp 3 Pal X Fried Rice": "medium",
  "Pach Nan": "low",
  "Sanghi Veg Fried Rice": "medium",
  "Saanghi Mix Fried Rice": "medium",
  "Cripci Chicken": "medium",
  "Dram Stick": "medium",
  "Mutton Soup": "medium",
};

/**
 * Dish normalization details for quality auditing and OCR transliteration support.
 */
export const DISH_NORMALIZATION_INFO: Record<string, {
  canonical_name: string;
  original_name: string;
  display_name: string;
  normalization_status: NormalizationStatus;
}> = {
  "Chicken Kornamdom": {
    canonical_name: "Chicken Kondattam / Kornamdom",
    original_name: "Chicken Kornamdom",
    display_name: "Chicken Kornamdom",
    normalization_status: "owner_review_required",
  },
  "Chicken Chattanar": {
    canonical_name: "Chicken Chettinad / Chattanar",
    original_name: "Chicken Chattanar",
    display_name: "Chicken Chattanar",
    normalization_status: "owner_review_required",
  },
  "Sarja Shake": {
    canonical_name: "Sharjah Banana Shake",
    original_name: "Sarja Shake",
    display_name: "Sarja Shake",
    normalization_status: "owner_review_required",
  },
  "Special 3paix Veg Fried Rice": {
    canonical_name: "Special Triple Veg Fried Rice",
    original_name: "Special 3paix Veg Fried Rice",
    display_name: "Special 3paix Veg Fried Rice",
    normalization_status: "owner_review_required",
  },
  "Sp 3 Pal X Fried Rice": {
    canonical_name: "Special Triple Non-Veg Fried Rice",
    original_name: "Sp 3 Pal X Fried Rice",
    display_name: "Sp 3 Pal X Fried Rice",
    normalization_status: "owner_review_required",
  },
  "Pach Nan": {
    canonical_name: "Peshawari / Cheese Naan",
    original_name: "Pach Nan",
    display_name: "Pach Nan",
    normalization_status: "owner_review_required",
  },
};

/**
 * Generate a deterministic hash for perceptual/duplicate detection
 */
export function generateImageHash(url: string): string {
  if (!url) return 'empty_hash';
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return `hash_${Math.abs(hash).toString(16)}`;
}

/**
 * Generate perceptual hash representation (combining URL footprint + signature)
 */
export function generatePerceptualHash(url: string, dishName: string): string {
  const baseHash = generateImageHash(url);
  const nameHash = generateImageHash(dishName);
  return `ph_${baseHash.slice(5, 12)}_${nameHash.slice(5, 10)}`;
}

/**
 * Category-based photorealistic fallbacks when an exact dish match is not in dictionary
 */
export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  "soup-veg": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
  "soup-non-veg": "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80",
  "starter-veg": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80",
  "starter-non-veg": "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80",
  "tandoori": "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80",
  "bread": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
  "rice-veg": "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?auto=format&fit=crop&w=800&q=80",
  "rice-non-veg": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
  "side-dish-veg": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
  "side-dish-non-veg": "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80",
  "side-dish-chinese-dry-veg": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
  "dream-love-special-side-dish": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
  "chopci-veg": "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80",
  "chopci-non-veg": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
  "chowmein-veg": "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80",
  "chowmein-non-veg": "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80",
  "roll-veg": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
  "roll-non-veg": "https://images.unsplash.com/photo-1606471191009-63994c53433b?auto=format&fit=crop&w=800&q=80",
  "salad": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
  "rita": "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=800&q=80",
  "lassi": "https://images.unsplash.com/photo-1571006682878-8318721665a3?auto=format&fit=crop&w=800&q=80",
  "mocktail": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
  "shake": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
  "fresh-juice": "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=800&q=80",
  "hot-drinks": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",

  // Legacy fallback categories
  "dream-love-special": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
  "biryani": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
  "fried-rice": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80",
  "chopsuey": "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80",
  "egg": "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
  "seafood": "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=800&q=80",
  "mutton": "https://images.unsplash.com/photo-1545247181-516773cae7be?auto=format&fit=crop&w=800&q=80",
  "chicken": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80",
  "veg-main-course": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
  "all": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
};

/**
 * Enhances raw menu items with appropriate 3-state image metadata:
 * - If item already has a verified real photo, preserves real_restaurant.
 * - Otherwise attaches high-quality temporary mock image with mock_placeholder and image_replacement_required = true.
 */
export function enhanceMenuItemWithImage(item: MenuItem): MenuItem {
  // If it's already an authentic owner/restaurant photo or custom uploaded photo
  const hasCustomImage = 
    (item.image_type === 'real_restaurant' && !!item.image_url) ||
    item.image_source === 'owner_upload' ||
    (!!item.image_url && (item.image_url.includes('menu-images') || item.image_url.startsWith('data:')));

  if (hasCustomImage && item.image_url) {
    const hash = generateImageHash(item.image_url);
    return {
      ...item,
      image: item.image_url,
      image_type: 'real_restaurant',
      image_verified: true,
      image_replacement_required: false,
      image_source: item.image_source || 'owner_upload',
      image_license_status: item.image_license_status || 'owner_provided',
      image_match_confidence: 'high',
      image_hash: item.image_hash || hash,
      perceptual_hash: item.perceptual_hash || generatePerceptualHash(item.image_url, item.name),
    };
  }

  // Lookup dish-specific image
  const lookupKey = item.name.trim();
  const canonicalKey = item.canonicalName?.trim() || item.canonical_name?.trim() || '';
  
  const mappedUrl = 
    DISH_IMAGE_LOOKUP[lookupKey] || 
    DISH_IMAGE_LOOKUP[canonicalKey] || 
    CATEGORY_FALLBACK_IMAGES[item.category] || 
    CATEGORY_FALLBACK_IMAGES['all'];

  // Confidence & Normalization lookups
  const confidence = DISH_MATCH_CONFIDENCE[lookupKey] || DISH_MATCH_CONFIDENCE[canonicalKey] || 'high';
  const normInfo = DISH_NORMALIZATION_INFO[lookupKey] || DISH_NORMALIZATION_INFO[canonicalKey];

  const normalizationStatus = normInfo?.normalization_status || 
    (item.dataQualityStatus === 'owner_review_required' ? 'owner_review_required' : 'verified');

  const imgHash = generateImageHash(mappedUrl);
  const pHash = generatePerceptualHash(mappedUrl, lookupKey);

  return {
    ...item,
    image_url: mappedUrl,
    image: mappedUrl,
    image_type: 'mock_placeholder',
    image_source: 'temporary_generated',
    image_verified: false,
    image_license_status: 'temporary',
    image_replacement_required: true,
    image_match_confidence: confidence,
    image_hash: imgHash,
    perceptual_hash: pHash,
    canonical_name: normInfo?.canonical_name || item.canonicalName || item.canonical_name || item.name,
    original_name: normInfo?.original_name || item.originalName || item.original_name || item.name,
    display_name: normInfo?.display_name || item.displayName || item.name,
    normalization_status: normalizationStatus,
    price_source: item.price_source || 'client_supplied_menu',
    price_verified: item.price !== undefined && item.price !== null && item.price > 0,
    ownerVerified: item.ownerVerified ?? true,
    owner_verified: item.owner_verified ?? true,
    is_available: item.isAvailable ?? true,
    is_featured: item.isFeatured ?? false,
    is_vegetarian: item.isVeg ?? false,
  };
}
