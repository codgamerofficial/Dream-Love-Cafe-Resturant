// Unique culinary image mapping generator & verifier for Dream Love Cafe & Restaurant

const UNIQUE_DISH_IMAGES = {
  // --- 1. DREAM LOVE SPECIALS & SIGNATURE CURRIES ---
  "Chicken Vorta": "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80",
  "Tandoori Chicken Masala (H/F)": "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80",
  "Tandoori Butter Chicken (H/F)": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80",
  "Tandoori Kadai Chicken (H/F)": "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
  "Tandoori Do Piyaza (H/F)": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80",
  "Paper Tandoori Chicken (H/F)": "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80",
  "Kadai Mutton": "https://images.unsplash.com/photo-1545247181-516773cae7be?auto=format&fit=crop&w=800&q=80",
  "Egg Vurgi Masala": "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
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

const duplicateCheck = {};
let dups = 0;
for (const [dish, url] of Object.entries(UNIQUE_DISH_IMAGES)) {
  if (duplicateCheck[url]) {
    console.error(`DUPLICATE FOUND: ${dish} shares with ${duplicateCheck[url]} -> ${url}`);
    dups++;
  } else {
    duplicateCheck[url] = dish;
  }
}
console.log(`Total mapped dishes: ${Object.keys(UNIQUE_DISH_IMAGES).length}`);
console.log(`Duplicates count: ${dups}`);
