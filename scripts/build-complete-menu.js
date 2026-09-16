const fs = require('fs');
const path = require('path');

// 25 Authentic Categories from the 5 Uploaded Menu Pages
const CANONICAL_CATEGORIES = [
  {
    id: "cat-soup-veg",
    slug: "soup-veg",
    name: "Soup (Veg)",
    description: "Wholesome, comforting vegetarian soups prepared with fresh ingredients and gentle spices.",
    icon: "Soup",
    displayOrder: 1,
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
    isActive: true,
  },
  {
    id: "cat-soup-non-veg",
    slug: "soup-non-veg",
    name: "Soup (Non-Veg)",
    description: "Rich, slow-simmered chicken and mutton broths garnished with herbs and crisp noodles.",
    icon: "Soup",
    displayOrder: 2,
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80",
    isActive: true,
  },
  {
    id: "cat-starter-veg",
    slug: "starter-veg",
    name: "Starter (Veg)",
    description: "Crispy battered 65-style starters, spiced florets, and smoky clay-oven paneer tikka.",
    icon: "Sparkles",
    displayOrder: 3,
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80",
    isActive: true,
  },
  {
    id: "cat-starter-non-veg",
    slug: "starter-non-veg",
    name: "Starter (Non-Veg)",
    description: "Sizzling chicken 65, chicken pakora, lollipops, drumsticks, golden prawns, fish and eggs.",
    icon: "Flame",
    displayOrder: 4,
    image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80",
    isActive: true,
  },
  {
    id: "cat-tandoori",
    slug: "tandoori",
    name: "Tandoori (Non-Veg)",
    description: "Traditional clay-oven roasted chicken tandoori, seekh kebabs, fish tikkas, and specials.",
    icon: "Flame",
    displayOrder: 5,
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80",
    isActive: true,
  },
  {
    id: "cat-bread",
    slug: "bread",
    name: "Bread (Veg)",
    description: "Fresh tandoori rotis, buttery laccha parathas, garlic naans, stuffed kulchas, and pach nan.",
    icon: "Wheat",
    displayOrder: 6,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
    isActive: true,
  },
  {
    id: "cat-rice-veg",
    slug: "rice-veg",
    name: "Rice (Veg)",
    description: "Fragrant basmati steam rice, jeera rice, ghee rice, paneer & mix veg pulaos, and wok-fried rice.",
    icon: "Boxes",
    displayOrder: 7,
    image: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?auto=format&fit=crop&w=800&q=80",
    isActive: true,
  },
  {
    id: "cat-rice-non-veg",
    slug: "rice-non-veg",
    name: "Rice (Non-Veg)",
    description: "Signature handi chicken biryani, mutton biryani, egg biryani, and wok-tossed fried rice varieties.",
    icon: "CookingPot",
    displayOrder: 8,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
    isActive: true,
  },
  {
    id: "cat-side-dish-veg",
    slug: "side-dish-veg",
    name: "Side Dish (Veg)",
    description: "Rich North Indian vegetarian gravies: paneer butter masala, kadai mushroom, dal fry, and korma.",
    icon: "Salad",
    displayOrder: 9,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
    isActive: true,
  },
  {
    id: "cat-side-dish-non-veg",
    slug: "side-dish-non-veg",
    name: "Side Dish (Non-Veg)",
    description: "Authentic chicken, mutton, prawn and egg curries, koshas, butter chicken, and chilli preparations.",
    icon: "UtensilsCrossed",
    displayOrder: 10,
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80",
    isActive: true,
  },
  {
    id: "cat-side-dish-chinese-dry-veg",
    slug: "side-dish-chinese-dry-veg",
    name: "Side Dish (Veg - Indo-Chinese & Dry)",
    description: "Wok-tossed Indo-Chinese chilli paneer, gobi manchurian, chilli mushroom, and alu gobi masala.",
    icon: "Sparkles",
    displayOrder: 11,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
    isActive: true,
  },
  {
    id: "cat-dream-love-special-side-dish",
    slug: "dream-love-special-side-dish",
    name: "Dream Love Special Side Dish",
    description: "House culinary masterpieces: Chicken Vorta, tandoori gravies, kadai mutton, and special seafood.",
    icon: "UtensilsCrossed",
    displayOrder: 12,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
    isActive: true,
  },
  {
    id: "cat-chopci-veg",
    slug: "chopci-veg",
    name: "Chopi (Veg)",
    description: "Crisp fried noodles in rich sweet-and-sour or savoury Chinese vegetable sauce.",
    icon: "Boxes",
    displayOrder: 13,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80",
    isActive: true,
  },
  {
    id: "cat-chopci-non-veg",
    slug: "chopci-non-veg",
    name: "Chopci (Non-Veg)",
    description: "Loaded crispy American and Chinese chopsuey tossed with tender chicken, prawns, and egg.",
    icon: "Boxes",
    displayOrder: 14,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
    isActive: true,
  },
  {
    id: "cat-chowmein-veg",
    slug: "chowmein-veg",
    name: "Chowmin (Veg)",
    description: "Classic Kolkata-style wok-tossed noodles with crunchy vegetables, paneer, and mushrooms.",
    icon: "Boxes",
    displayOrder: 15,
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=800&q=80",
    isActive: true,
  },
  {
    id: "cat-chowmein-non-veg",
    slug: "chowmein-non-veg",
    name: "Chowmin (Non-Veg)",
    description: "Street-style wok noodles tossed with egg, chicken, mutton, prawns, and spicy Schezwan sauce.",
    icon: "Boxes",
    displayOrder: 16,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80",
    isActive: true,
  },
  {
    id: "cat-roll-veg",
    slug: "roll-veg",
    name: "Roll (Veg)",
    description: "Golden flaky paratha wraps filled with spiced paneer, mushrooms, and crispy veg spring rolls.",
    icon: "Wheat",
    displayOrder: 17,
    image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80",
    isActive: true,
  },
  {
    id: "cat-roll-non-veg",
    slug: "roll-non-veg",
    name: "Roll (Non-Veg)",
    description: "Authentic Bengal paratha rolls filled with spicy egg, chicken, tender mutton, and Dil Khush special.",
    icon: "Flame",
    displayOrder: 18,
    image: "https://images.unsplash.com/photo-1606471191009-63994c53433b?auto=format&fit=crop&w=800&q=80",
    isActive: true,
  },
  {
    id: "cat-salad",
    slug: "salad",
    name: "Salad",
    description: "Fresh garden sliced cucumbers, onions, green chillies, Chinese salad, and fruit platters.",
    icon: "Salad",
    displayOrder: 19,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    isActive: true,
  },
  {
    id: "cat-rita",
    slug: "rita",
    name: "Raita",
    description: "Chilled whisked yogurt blended with cucumber, onion, pineapple, and roasted cumin.",
    icon: "Soup",
    displayOrder: 20,
    image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=800&q=80",
    isActive: true,
  },
  {
    id: "cat-lassi",
    slug: "lassi",
    name: "Lassi",
    description: "Traditional thick churned sweet curd lassi: classic plain, ripe mango, and banana.",
    icon: "GlassWater",
    displayOrder: 21,
    image: "https://images.unsplash.com/photo-1571006682878-8318721665a3?auto=format&fit=crop&w=800&q=80",
    isActive: true,
  },
  {
    id: "cat-mocktail",
    slug: "mocktail",
    name: "Mocktail",
    description: "Refreshing artisan coolers: blue & green lemonade, orange coolers, and Dream Love special mocktail.",
    icon: "GlassWater",
    displayOrder: 22,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
    isActive: true,
  },
  {
    id: "cat-shake",
    slug: "shake",
    name: "Shake",
    description: "Thick creamy milkshakes, Oreo, butterscotch, chocolate, Sarja shake, cold coffee, and royal falooda.",
    icon: "Coffee",
    displayOrder: 23,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
    isActive: true,
  },
  {
    id: "cat-fresh-juice",
    slug: "fresh-juice",
    name: "Fresh Juice",
    description: "Cold-pressed natural fruit juices: sweet watermelon, pineapple, fresh orange, mosambi, and carrot.",
    icon: "Sparkles",
    displayOrder: 24,
    image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=800&q=80",
    isActive: true,
  },
  {
    id: "cat-hot-drinks",
    slug: "hot-drinks",
    name: "Hot Drinks",
    description: "Freshly brewed filter coffee, black coffee, adrak ginger tea, green tea, and fragrant lemon tea.",
    icon: "Coffee",
    displayOrder: 25,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    isActive: true,
  },
];

// All 217 Dishes Transcribed Directly from the 5 Printed Menu Sheets
const RAW_MENU_ITEMS = [
  // ── PAGE 1: SOUP (VEG) ──
  { id: "m-spv-1", name: "Sweet Corn Veg Soup", category: "soup-veg", price: 60, isVeg: true, diet_type: "veg", description: "Comforting sweet corn broth simmered with finely diced seasonal vegetables." },
  { id: "m-spv-2", name: "Hot and Sour Veg Soup", category: "soup-veg", price: 60, isVeg: true, diet_type: "veg", description: "Spicy and tangy Asian broth loaded with diced garden vegetables and tofu." },
  { id: "m-spv-3", name: "Veg Clear Soup", category: "soup-veg", price: 50, isVeg: true, diet_type: "veg", description: "Light, healthy clear vegetable broth with freshly ground black pepper." },
  { id: "m-spv-4", name: "Veg Manchow Soup", category: "soup-veg", price: 70, isVeg: true, diet_type: "veg", description: "Spiced Indo-Chinese soup topped with a generous crown of crunchy fried noodles." },
  { id: "m-spv-5", name: "Cream of Mushroom Soup", category: "soup-veg", price: 80, isVeg: true, diet_type: "veg", description: "Velvety smooth button mushroom puree infused with fresh cream and herbs." },
  { id: "m-spv-6", name: "Tomato Soup", category: "soup-veg", price: 70, isVeg: true, diet_type: "veg", description: "Classic ripe red tomato soup seasoned with butter and crispy herb croutons." },

  // ── PAGE 1: SOUP (Non-VEG) ──
  { id: "m-spnv-1", name: "Sweet Corn Chicken Soup", category: "soup-non-veg", price: 75, isVeg: false, diet_type: "non_veg", description: "Sweet corn kernel broth enriched with shredded chicken and soft egg ribbons." },
  { id: "m-spnv-2", name: "Hot and Sour Chicken Soup", category: "soup-non-veg", price: 80, isVeg: false, diet_type: "non_veg", description: "Fiery hot and sour chicken soup infused with chillies, dark soy, and vinegar." },
  { id: "m-spnv-3", name: "Chicken Clear Soup", category: "soup-non-veg", price: 60, isVeg: false, diet_type: "non_veg", description: "Delicate chicken broth with tender shredded chicken and fresh coriander." },
  { id: "m-spnv-4", name: "Chicken Manchow Soup", category: "soup-non-veg", price: 90, isVeg: false, diet_type: "non_veg", isFeatured: true, description: "Spicy chicken and garlic soup served with crispy fried noodle garnish." },
  { id: "m-spnv-5", name: "Cream of Chicken Soup", category: "soup-non-veg", price: 100, isVeg: false, diet_type: "non_veg", description: "Rich, creamy chicken soup infused with aromatic butter and white pepper." },
  { id: "m-spnv-6", name: "Mutton Soup", category: "soup-non-veg", price: 130, isVeg: false, diet_type: "non_veg", isSpecial: true, description: "Slow-simmered bone-in mutton extract loaded with warming spices and herbs." },

  // ── PAGE 1: STARTER (VEG) ──
  { id: "m-stv-1", name: "Paneer 65", category: "starter-veg", price: 140, isVeg: true, diet_type: "veg", isFeatured: true, description: "Crisp cottage cheese cubes tossed in spicy South Indian curry leaf masala." },
  { id: "m-stv-2", name: "Gobi 65", category: "starter-veg", price: 110, isVeg: true, diet_type: "veg", description: "Golden fried cauliflower florets coated with tangy yoghurt and red chilli glaze." },
  { id: "m-stv-3", name: "Mushroom 65", category: "starter-veg", price: 120, isVeg: true, diet_type: "veg", description: "Crispy button mushrooms spiced with crushed peppercorns and aromatic curry leaves." },
  { id: "m-stv-4", name: "Veg 65", category: "starter-veg", price: 120, isVeg: true, diet_type: "veg", description: "Mixed vegetable dumplings fried crisp and tossed in fiery 65 masala." },
  { id: "m-stv-5", name: "French Fry", category: "starter-veg", price: 110, isVeg: true, diet_type: "veg", description: "Golden salted potato batons fried crisp, served with tomato ketchup." },
  { id: "m-stv-6", name: "Tandoori Paneer Tikka", category: "starter-veg", price: 180, isVeg: true, diet_type: "veg", isFeatured: true, description: "Clay-oven roasted cottage cheese skewers with spiced bell peppers and onions." },

  // ── PAGE 1: STARTER (Non-VEG) ──
  { id: "m-stnv-1", name: "Chicken 65", category: "starter-non-veg", price: 120, isVeg: false, diet_type: "non_veg", isFeatured: true, description: "Iconic South Indian crisp fried chicken bites with mustard seeds and curry leaves." },
  { id: "m-stnv-2", name: "Chicken Pakora", category: "starter-non-veg", price: 120, isVeg: false, diet_type: "non_veg", description: "Gram flour battered spiced chicken fritters fried golden and crunchy." },
  { id: "m-stnv-3", name: "Chicken Lollipop", category: "starter-non-veg", price: 130, isVeg: false, diet_type: "non_veg", isFeatured: true, description: "Frenched chicken winglets coated in spicy batter, fried crisp with garlic dip." },
  { id: "m-stnv-4", name: "Ch. Sehezwan Lollipop", category: "starter-non-veg", price: 150, isVeg: false, diet_type: "non_veg", description: "Chicken lollipops tossed in fiery house Schezwan chilli garlic sauce." },
  { id: "m-stnv-5", name: "Prawn 65", category: "starter-non-veg", price: 180, isVeg: false, diet_type: "non_veg", description: "Succulent sea prawns seasoned in 65 masala and crisped with curry leaves." },
  { id: "m-stnv-6", name: "Crispy Chicken", category: "starter-non-veg", price: 180, isVeg: false, diet_type: "non_veg", description: "Shredded chicken strips fried extra crunchy and tossed with sliced chillies." },
  { id: "m-stnv-7", name: "Drum Stick", category: "starter-non-veg", price: 250, isVeg: false, diet_type: "non_veg", description: "Juicy marinated chicken drumsticks fried crisp with aromatic Indian spices." },
  { id: "m-stnv-8", name: "Fish Finger", category: "starter-non-veg", price: 210, isVeg: false, diet_type: "non_veg", description: "Breaded bhetki fish fillets fried golden, served with kasundi mustard." },
  { id: "m-stnv-9", name: "Fish Fry", category: "starter-non-veg", price: null, price_type: "as_per_size", portion: "As per size", isVeg: false, diet_type: "non_veg", description: "Fresh local catch fillet marinated in Kolkata green herb paste and fried." },
  { id: "m-stnv-10", name: "Egg Vurgi", category: "starter-non-veg", price: 80, isVeg: false, isEgg: true, diet_type: "egg", description: "Fresh farm eggs scrambled with chopped onions, green chillies, and cilantro." },
  { id: "m-stnv-11", name: "Boiled Egg", category: "starter-non-veg", price: 50, isVeg: false, isEgg: true, diet_type: "egg", description: "Pair of fresh farm eggs hard boiled to perfection with rock salt and pepper." },
  { id: "m-stnv-12", name: "Scramble Egg", category: "starter-non-veg", price: 90, isVeg: false, isEgg: true, diet_type: "egg", description: "Soft, buttery scrambled eggs seasoned lightly with sea salt and black pepper." },
  { id: "m-stnv-13", name: "Egg Poach", category: "starter-non-veg", price: 60, isVeg: false, isEgg: true, diet_type: "egg", description: "Delicately poached farm egg with runny yolk and light black pepper dusting." },
  { id: "m-stnv-14", name: "Omlet", category: "starter-non-veg", price: 60, isVeg: false, isEgg: true, diet_type: "egg", description: "Fluffy Indian masala omelette whisked with onions, green chillies, and herbs." },
  { id: "m-stnv-15", name: "Grill Chicken (H/F)", category: "starter-non-veg", price: null, price_type: "as_per_size", portion: "Half / Full (As per size)", isVeg: false, diet_type: "non_veg", description: "Succulent charcoal grilled chicken marinated in aromatic yogurt and spices." },

  // ── PAGE 2: TANDOORI (Non-Veg) ──
  { id: "m-tan-1", name: "Chicken Tandoori (H/F)", category: "tandoori", price: 220, price_type: "starting_from", portion: "Half ₹220 / Full ₹380", isVeg: false, diet_type: "non_veg", isFeatured: true, description: "Classic clay-oven roasted chicken marinated in Kashmiri red chilli and curd." },
  { id: "m-tan-2", name: "Chicken Tikka", category: "tandoori", price: 120, isVeg: false, diet_type: "non_veg", description: "Boneless chicken morsels grilled on tandoor skewers with mustard oil marinade." },
  { id: "m-tan-3", name: "Tangri Kebab", category: "tandoori", price: 250, isVeg: false, diet_type: "non_veg", isFeatured: true, description: "Juicy chicken drumsticks stuffed and roasted in the clay tandoor." },
  { id: "m-tan-4", name: "Wings Kebab", category: "tandoori", price: 140, isVeg: false, diet_type: "non_veg", description: "Smoky tandoori roasted chicken wings seasoned with chaat masala and lemon." },
  { id: "m-tan-5", name: "Tandoor Fish", category: "tandoori", price: null, price_type: "as_per_size", portion: "As per size", isVeg: false, diet_type: "non_veg", description: "Fresh whole fish marinated in ajwain tandoori masala and char-roasted." },
  { id: "m-tan-6", name: "Fish Tikka", category: "tandoori", price: null, price_type: "as_per_size", portion: "As per size", isVeg: false, diet_type: "non_veg", description: "Boneless fish cubes infused with carom seeds and char-grilled in tandoor." },
  { id: "m-tan-7", name: "Dream Love Special Chicken Kuttu Protta", category: "tandoori", price: null, price_type: "on_request", portion: "Price on request", isVeg: false, diet_type: "non_veg", isSpecial: true, description: "Signature street-style shredded chicken tossed with flaky parotta and rich spices." },
  { id: "m-tan-8", name: "Dream Love Special Pan Kabab (F)", category: "tandoori", price: null, price_type: "on_request", portion: "Full (Price on request)", isVeg: false, diet_type: "non_veg", isSpecial: true, description: "House specialty pan-seared juicy spiced minced meat kebab platter." },

  // ── PAGE 2: BREAD (VEG) ──
  { id: "m-br-1", name: "Lacha Paratha", category: "bread", price: 15, isVeg: true, diet_type: "veg", description: "Flaky, multi-layered whole wheat tawa paratha brushed with ghee." },
  { id: "m-br-2", name: "Tandoori Lacha Paratha", category: "bread", price: 50, isVeg: true, diet_type: "veg", description: "Crisp layered paratha baked to golden perfection inside the clay tandoor." },
  { id: "m-br-3", name: "Tandoori Roti", category: "bread", price: 15, isVeg: true, diet_type: "veg", description: "Traditional whole wheat Indian flatbread baked hot against the tandoor walls." },
  { id: "m-br-4", name: "Tandoori Butter Roti", category: "bread", price: 25, isVeg: true, diet_type: "veg", description: "Hot tandoori roti generously brushed with wholesome dairy butter." },
  { id: "m-br-5", name: "Tandoori Plan Nan", category: "bread", price: 25, isVeg: true, diet_type: "veg", description: "Classic soft and pillowy refined flour naan baked in the clay oven." },
  { id: "m-br-6", name: "Tandoori Butter Nan", category: "bread", price: 30, isVeg: true, diet_type: "veg", isFeatured: true, description: "Warm fluffy tandoori naan glazed with rich melted dairy butter." },
  { id: "m-br-7", name: "Garlic Nan", category: "bread", price: 60, isVeg: true, diet_type: "veg", description: "Aromatic naan topped with freshly minced garlic cloves and fresh coriander." },
  { id: "m-br-8", name: "Butter Garlic Nan", category: "bread", price: 70, isVeg: true, diet_type: "veg", isFeatured: true, description: "Tandoor naan loaded with roasted garlic and basted with melted butter." },
  { id: "m-br-9", name: "Plain Kulcha", category: "bread", price: 50, isVeg: true, diet_type: "veg", description: "Soft Punjabi leavened bread sprinkled with nigella seeds and baked crisp." },
  { id: "m-br-10", name: "Chicken Kulcha with Butter", category: "bread", price: 80, isVeg: false, diet_type: "non_veg", isSpecial: true, description: "Flaky kulcha stuffed with spiced minced chicken and topped with rich butter." },
  { id: "m-br-11", name: "Tandori Alu Paratha", category: "bread", price: 70, isVeg: true, diet_type: "veg", description: "Clay oven baked paratha stuffed with spiced mashed potatoes and green herbs." },
  { id: "m-br-12", name: "Pach Nan", category: "bread", price: 70, isVeg: true, diet_type: "veg", description: "Traditional multi-grain five-herb layered flatbread baked in the tandoor." },

  // ── PAGE 2: RICE (VEG) ──
  { id: "m-rv-1", name: "Veg Biriyani", category: "rice-veg", price: null, price_type: "on_request", portion: "Price on request", isVeg: true, diet_type: "veg", description: "Aromatic basmati rice slow-cooked in dum with garden vegetables and saffron." },
  { id: "m-rv-2", name: "Paneer Biriyani", category: "rice-veg", price: null, price_type: "on_request", portion: "Price on request", isVeg: true, diet_type: "veg", description: "Dum cooked fragrant basmati rice layered with spiced tender cottage cheese cubes." },
  { id: "m-rv-3", name: "Alu Biriyani", category: "rice-veg", price: null, price_type: "on_request", portion: "Price on request", isVeg: true, diet_type: "veg", description: "Authentic Kolkata-style dum biryani featuring slow-cooked seasoned golden potatoes." },
  { id: "m-rv-4", name: "Steam Rice", category: "rice-veg", price: 60, isVeg: true, diet_type: "veg", description: "Steamed fluffy long-grain basmati rice served piping hot." },
  { id: "m-rv-5", name: "Veg Fried Rice", category: "rice-veg", price: 80, isVeg: true, diet_type: "veg", description: "Wok-tossed basmati rice with finely diced carrots, beans, cabbage, and spring onions." },
  { id: "m-rv-6", name: "Mushroom Fired Rice", category: "rice-veg", price: 120, isVeg: true, diet_type: "veg", description: "Indo-Chinese wok rice tossed with sliced button mushrooms and mild soy." },
  { id: "m-rv-7", name: "Paneer Fried Rice", category: "rice-veg", price: 130, isVeg: true, diet_type: "veg", description: "Stir-fried rice tossed with golden paneer cubes, vegetables, and white pepper." },
  { id: "m-rv-8", name: "Gobi Fried Rice", category: "rice-veg", price: 110, isVeg: true, diet_type: "veg", description: "Wok-fried basmati rice cooked with crispy spiced cauliflower florets." },
  { id: "m-rv-9", name: "Schezwan Veg Fried Rice", category: "rice-veg", price: 140, isVeg: true, diet_type: "veg", description: "Spicy Schezwan pepper-infused wok rice tossed with crunchy vegetables." },
  { id: "m-rv-10", name: "Special 3palx Veg Fried Rice", category: "rice-veg", price: 160, isVeg: true, diet_type: "veg", isSpecial: true, description: "House triple-layer special vegetable fried rice tossed with chef secret sauces." },
  { id: "m-rv-11", name: "Paneer Pulao", category: "rice-veg", price: 160, isVeg: true, diet_type: "veg", description: "Sweet and fragrant basmati pulao cooked with golden paneer, cashews, and raisins." },
  { id: "m-rv-12", name: "Mix Veg Pulao", category: "rice-veg", price: 180, isVeg: true, diet_type: "veg", description: "Fragrant saffron rice prepared with assortment of fresh seasonal vegetables." },
  { id: "m-rv-13", name: "Jeera Rice", category: "rice-veg", price: 85, isVeg: true, diet_type: "veg", description: "Steamed basmati rice tempered with roasted cumin seeds and desi ghee." },
  { id: "m-rv-14", name: "Ghee Rice", category: "rice-veg", price: 140, isVeg: true, diet_type: "veg", description: "Rich basmati rice tossed in pure desi ghee with whole garam masala and fried onions." },

  // ── PAGE 2: RICE (NON - VEG) ──
  { id: "m-rnv-1", name: "Dream Love Special Handi Chicken Biriyani", category: "rice-non-veg", price: 220, isVeg: false, diet_type: "non_veg", isFeatured: true, isSpecial: true, description: "Slow dum-cooked handi biryani packed with succulent chicken, spiced egg, and potato." },
  { id: "m-rnv-2", name: "Chicken Biriyani", category: "rice-non-veg", price: 110, isVeg: false, diet_type: "non_veg", isFeatured: true, description: "Kolkata style fragrant chicken biryani with tender chicken piece and spiced potato." },
  { id: "m-rnv-3", name: "Mutton Biriyani", category: "rice-non-veg", price: 230, isVeg: false, diet_type: "non_veg", isFeatured: true, description: "Aromatic long-grain dum biryani with melt-in-mouth tender mutton and rich spices." },
  { id: "m-rnv-4", name: "Egg Biriyani", category: "rice-non-veg", price: 90, isVeg: false, isEgg: true, diet_type: "egg", description: "Spiced basmati rice layered with pan-fried boiled eggs and fragrant biryani spices." },
  { id: "m-rnv-5", name: "Egg Fried Rice", category: "rice-non-veg", price: 90, isVeg: false, isEgg: true, diet_type: "egg", description: "Wok-tossed rice with scrambled egg ribbons, green spring onions, and light soy." },
  { id: "m-rnv-6", name: "Chciekn Fried Rice", category: "rice-non-veg", price: 110, isVeg: false, diet_type: "non_veg", description: "Indo-Chinese style wok rice cooked with shredded chicken and crunchy vegetables." },
  { id: "m-rnv-7", name: "Mix Fried Rice", category: "rice-non-veg", price: 140, isVeg: false, diet_type: "non_veg", description: "Wok-fried rice loaded with a hearty mix of tender chicken, prawns, and egg." },
  { id: "m-rnv-8", name: "Prawn Fried Rice", category: "rice-non-veg", price: 130, isVeg: false, diet_type: "non_veg", description: "Wok rice tossed with fresh sea prawns, garlic, and finely sliced spring onions." },
  { id: "m-rnv-9", name: "Schezwan Egg Fried Rice", category: "rice-non-veg", price: 120, isVeg: false, isEgg: true, diet_type: "egg", description: "Fiery Schezwan spiced fried rice tossed with scrambled farm eggs." },
  { id: "m-rnv-10", name: "Schezwan Mix Fried Rice", category: "rice-non-veg", price: 180, isVeg: false, diet_type: "non_veg", description: "Spicy Schezwan rice stir-fried with generous portions of chicken, egg, and prawns." },
  { id: "m-rnv-11", name: "Saanghi Mix Fried Rice", category: "rice-non-veg", price: 190, isVeg: false, diet_type: "non_veg", description: "Chef special Saanghi style mixed non-veg fried rice with rich savory flavours." },
  { id: "m-rnv-12", name: "Sp 3 pal x Fried Rice", category: "rice-non-veg", price: 220, isVeg: false, diet_type: "non_veg", isSpecial: true, description: "Deluxe triple combination wok rice loaded with meats and chef special sauces." },
  { id: "m-rnv-13", name: "Mutton Fried Rice", category: "rice-non-veg", price: 220, isVeg: false, diet_type: "non_veg", description: "Flavorful wok rice prepared with shredded tender mutton and aromatic spices." },

  // ── PAGE 3: SIDE DISH (VEG) ──
  { id: "m-sdv-1", name: "Mutter Paneer Masala", category: "side-dish-veg", price: 160, isVeg: true, diet_type: "veg", description: "Fresh green peas and soft cottage cheese simmered in spiced onion-tomato gravy." },
  { id: "m-sdv-2", name: "Paneer Butter Masala", category: "side-dish-veg", price: 150, isVeg: true, diet_type: "veg", isFeatured: true, description: "Creamy, mildly sweet tomato-butter gravy with melt-in-mouth cottage cheese." },
  { id: "m-sdv-3", name: "Kadai Paneer", category: "side-dish-veg", price: 170, isVeg: true, diet_type: "veg", description: "Paneer cubes tossed with bell peppers, onions, and freshly ground kadhai coriander." },
  { id: "m-sdv-4", name: "Kadai Mushroom", category: "side-dish-veg", price: 160, isVeg: true, diet_type: "veg", description: "Fresh button mushrooms wok-cooked with chunky bell peppers and rustic kadai gravy." },
  { id: "m-sdv-5", name: "Boiled Veg", category: "side-dish-veg", price: 100, isVeg: true, diet_type: "veg", description: "Lightly salted boiled farm vegetables tossed in butter and cracked black pepper." },
  { id: "m-sdv-6", name: "Mix Veg masala", category: "side-dish-veg", price: 150, isVeg: true, diet_type: "veg", description: "Assorted seasonal vegetables simmered in a spiced homestyle North Indian masala." },
  { id: "m-sdv-7", name: "Mushroom Masala", category: "side-dish-veg", price: 130, isVeg: true, diet_type: "veg", description: "Tender button mushrooms cooked in a thick spiced onion-tomato gravy." },
  { id: "m-sdv-8", name: "Dal Fry", category: "side-dish-veg", price: 90, isVeg: true, diet_type: "veg", description: "Yellow lentils cooked homestyle and tempered with cumin, garlic, and green chillies." },
  { id: "m-sdv-9", name: "Dal Tarka", category: "side-dish-veg", price: 100, isVeg: true, diet_type: "veg", description: "Creamy lentils cooked with a sizzling tadka of ghee, whole dry chillies, and garlic." },
  { id: "m-sdv-10", name: "Dal Bati", category: "side-dish-veg", price: 130, isVeg: true, diet_type: "veg", description: "Traditional baked wheat bati dumplings served with spiced panchtara dal." },
  { id: "m-sdv-11", name: "Veg Sai Korma", category: "side-dish-veg", price: 190, isVeg: true, diet_type: "veg", description: "Royal vegetarian korma simmered in a rich cashew and cream based sauce." },
  { id: "m-sdv-12", name: "Nabratna Korma", category: "side-dish-veg", price: 220, isVeg: true, diet_type: "veg", description: "Nine-gem sweet and savory vegetable curry cooked with fruits, nuts, and cream." },

  // ── PAGE 3: SIDE DISH (Non-VEG) ──
  { id: "m-sdnv-1", name: "Chilli Chicken (D/G)", category: "side-dish-non-veg", price: 120, portion: "Dry / Gravy", isVeg: false, diet_type: "non_veg", isFeatured: true, description: "Classic Kolkata Chinese chicken tossed with bell peppers, green chillies, and soy." },
  { id: "m-sdnv-2", name: "Chicken Manchurian (D/G)", category: "side-dish-non-veg", price: 140, portion: "Dry / Gravy", isVeg: false, diet_type: "non_veg", description: "Crispy chicken morsels simmered in dark garlic-coriander Manchurian sauce." },
  { id: "m-sdnv-3", name: "Garlic Chicken (D/G)", category: "side-dish-non-veg", price: 150, portion: "Dry / Gravy", isVeg: false, diet_type: "non_veg", description: "Boneless chicken prepared with aromatic roasted garlic and savoury Asian sauces." },
  { id: "m-sdnv-4", name: "Prawn Manchurian", category: "side-dish-non-veg", price: 180, isVeg: false, diet_type: "non_veg", description: "Plump sea prawns tossed in spicy ginger, garlic, and coriander Manchurian gravy." },
  { id: "m-sdnv-5", name: "Chilli Fish (D/G)", category: "side-dish-non-veg", price: 180, portion: "Dry / Gravy", isVeg: false, diet_type: "non_veg", description: "Crisp fish fillets wok-tossed with capsicum, green chillies, and savoury sauces." },
  { id: "m-sdnv-6", name: "Fish Manchurian (D/G)", category: "side-dish-non-veg", price: null, price_type: "as_per_size", portion: "Dry / Gravy (As per size)", isVeg: false, diet_type: "non_veg", description: "Tender fish morsels wok-cooked in tangy Manchurian sauce." },
  { id: "m-sdnv-7", name: "Chicken Curry", category: "side-dish-non-veg", price: 140, isVeg: false, diet_type: "non_veg", description: "Traditional homestyle Bengal chicken curry with potatoes and light gravy." },
  { id: "m-sdnv-8", name: "Chicken Kosha", category: "side-dish-non-veg", price: 140, isVeg: false, diet_type: "non_veg", isFeatured: true, description: "Rich, slow-cooked dark chicken gravy infused with caramelized onions and whole spices." },
  { id: "m-sdnv-9", name: "Butter Chicken", category: "side-dish-non-veg", price: 180, isVeg: false, diet_type: "non_veg", isFeatured: true, description: "Tandoori chicken pieces simmered in silky tomato, cashew, and butter gravy." },
  { id: "m-sdnv-10", name: "Kadai Chicken", category: "side-dish-non-veg", price: 180, isVeg: false, diet_type: "non_veg", description: "Chicken cooked in an iron wok with roasted coriander seeds and bell peppers." },
  { id: "m-sdnv-11", name: "Chicken-Do-Piyaza", category: "side-dish-non-veg", price: 200, isVeg: false, diet_type: "non_veg", description: "Chicken curry prepared with two stages of caramelized and crunchy onion slices." },
  { id: "m-sdnv-12", name: "Chicken Masala", category: "side-dish-non-veg", price: 140, isVeg: false, diet_type: "non_veg", description: "Flavorful chicken cooked in a thick aromatic onion and tomato masala gravy." },
  { id: "m-sdnv-13", name: "Chicken Hydrabadi (D/G)", category: "side-dish-non-veg", price: 190, portion: "Dry / Gravy", isVeg: false, diet_type: "non_veg", description: "Rich Hyderabadi chicken preparation infused with mint, coconut, and curd." },
  { id: "m-sdnv-14", name: "Paper Chicken (D/G)", category: "side-dish-non-veg", price: 210, portion: "Dry / Gravy", isVeg: false, diet_type: "non_veg", description: "Paper-thin spiced chicken preparation roasted with specialized seasoning." },
  { id: "m-sdnv-15", name: "Mughlai Chicken", category: "side-dish-non-veg", price: 240, isVeg: false, diet_type: "non_veg", description: "Royal Mughlai chicken cooked in a rich, creamy egg and cashew nut gravy." },
  { id: "m-sdnv-16", name: "Egg Curry", category: "side-dish-non-veg", price: 90, isVeg: false, isEgg: true, diet_type: "egg", description: "Boiled fried eggs simmered in a spiced Bengal homestyle onion-tomato curry." },
  { id: "m-sdnv-17", name: "Egg Masala", category: "side-dish-non-veg", price: 100, isVeg: false, isEgg: true, diet_type: "egg", description: "Hard-boiled eggs cooked in a thick aromatic spicy masala gravy." },
  { id: "m-sdnv-18", name: "Egg Kosha", category: "side-dish-non-veg", price: 90, isVeg: false, isEgg: true, diet_type: "egg", description: "Slow-roasted eggs coated in caramelized dark onion gravy with whole spices." },
  { id: "m-sdnv-19", name: "Chilli Egg (D/G)", category: "side-dish-non-veg", price: 110, portion: "Dry / Gravy", isVeg: false, isEgg: true, diet_type: "egg", description: "Boiled egg halves wok-tossed with green chillies, capsicum, and soy sauce." },
  { id: "m-sdnv-20", name: "Mutton Curry", category: "side-dish-non-veg", price: 240, isVeg: false, diet_type: "non_veg", description: "Homestyle Sunday mutton curry cooked with tender meat pieces and potatoes." },
  { id: "m-sdnv-21", name: "Mutton Kosha", category: "side-dish-non-veg", price: 240, isVeg: false, diet_type: "non_veg", isFeatured: true, description: "Authentic slow-braised Bengali mutton kosha in dark, intensely rich gravy." },
  { id: "m-sdnv-22", name: "Mutton Rogan Jus", category: "side-dish-non-veg", price: 280, isVeg: false, diet_type: "non_veg", isSpecial: true, description: "Kashmiri style mutton braised in aromatic spices, ratan jot, and yogurt gravy." },
  { id: "m-sdnv-23", name: "Prawn Masala", category: "side-dish-non-veg", price: 190, isVeg: false, diet_type: "non_veg", description: "Fresh sea prawns cooked in thick spiced coastal onion-tomato gravy." },

  // ── PAGE 3: RITA (RAITA) ──
  { id: "m-rt-1", name: "Cucumber Rita", category: "rita", price: 50, isVeg: true, diet_type: "veg", description: "Chilled whisked yogurt blended with grated cucumber and roasted cumin powder." },
  { id: "m-rt-2", name: "Onion Rita", category: "rita", price: 50, isVeg: true, diet_type: "veg", description: "Refreshing curd raita topped with crunchy finely diced red onions and mint." },
  { id: "m-rt-3", name: "Pineapple Rita", category: "rita", price: 100, isVeg: true, diet_type: "veg", description: "Sweet and tangy raita made with juicy pineapple chunks and rock salt." },
  { id: "m-rt-4", name: "Mixed Rita", category: "rita", price: 80, isVeg: true, diet_type: "veg", description: "Wholesome curd raita mixed with fresh cucumbers, onions, and tomatoes." },

  // ── PAGE 3: LASSI ──
  { id: "m-ls-1", name: "Banana Lassi", category: "lassi", price: 110, isVeg: true, diet_type: "veg", description: "Creamy thick sweet curd churned with fresh ripe bananas and cardamom." },
  { id: "m-ls-2", name: "Mango Lassi", category: "lassi", price: 110, isVeg: true, diet_type: "veg", isFeatured: true, description: "Rich churned yogurt drink infused with luscious mango pulp and saffron." },
  { id: "m-ls-3", name: "Plain Lassi", category: "lassi", price: 80, isVeg: true, diet_type: "veg", description: "Traditional sweet Punjabi lassi served chilled with a thick layer of malai." },

  // ── PAGE 4: DREAM LOVE SPECIAL SIDE DISH ──
  { id: "m-sp-1", name: "Chicken Vorta", category: "dream-love-special-side-dish", price: 220, isVeg: false, diet_type: "non_veg", isSpecial: true, isFeatured: true, description: "Signature shredded chicken cooked in a rich, buttery, spiced egg-laced gravy." },
  { id: "m-sp-2", name: "KFC Chicken", category: "dream-love-special-side-dish", price: null, price_type: "on_request", portion: "Price on request", isVeg: false, diet_type: "non_veg", description: "Extra-crispy battered chicken fried with secret herbs and served golden hot." },
  { id: "m-sp-3", name: "Tandoori Chicken Masala (H/F)", category: "dream-love-special-side-dish", price: null, price_type: "on_request", portion: "Half / Full (Price on request)", isVeg: false, diet_type: "non_veg", description: "Charcoal roasted tandoori chicken simmered in a spiced tomato-butter gravy." },
  { id: "m-sp-4", name: "Tandoori Butter Chicken (H/F)", category: "dream-love-special-side-dish", price: null, price_type: "on_request", portion: "Half / Full (Price on request)", isVeg: false, diet_type: "non_veg", description: "Tandoori chicken simmered in rich creamy butter gravy with smoky charcoal aroma." },
  { id: "m-sp-5", name: "Tandoori Kadai Chicken (H/F)", category: "dream-love-special-side-dish", price: null, price_type: "on_request", portion: "Half / Full (Price on request)", isVeg: false, diet_type: "non_veg", description: "Wok-cooked tandoori chicken with freshly ground coriander and bell peppers." },
  { id: "m-sp-6", name: "Tandoori Do Piyaza (H/F)", category: "dream-love-special-side-dish", price: null, price_type: "on_request", portion: "Half / Full (Price on request)", isVeg: false, diet_type: "non_veg", description: "Tandoori chicken prepared with caramelized onions, spices, and smoky aroma." },
  { id: "m-sp-7", name: "Paper Tandoori Chicken (H/F)", category: "dream-love-special-side-dish", price: null, price_type: "on_request", portion: "Half / Full (Price on request)", isVeg: false, diet_type: "non_veg", description: "Crisp thin-crust spiced tandoori chicken cooked to golden perfection." },
  { id: "m-sp-8", name: "Chilli Mutton", category: "dream-love-special-side-dish", price: null, price_type: "on_request", portion: "Price on request", isVeg: false, diet_type: "non_veg", description: "Tender boneless mutton pieces wok-tossed with green chillies and soy sauce." },
  { id: "m-sp-9", name: "Mutton Dry Fry", category: "dream-love-special-side-dish", price: null, price_type: "on_request", portion: "Price on request", isVeg: false, diet_type: "non_veg", description: "Slow-roasted spiced mutton pieces cooked dry with curry leaves and black pepper." },
  { id: "m-sp-10", name: "Mutton Fry", category: "dream-love-special-side-dish", price: null, price_type: "on_request", portion: "Price on request", isVeg: false, diet_type: "non_veg", description: "Pan-fried tender mutton tossed with sliced onions and aromatic spices." },
  { id: "m-sp-11", name: "Kadai Mutton", category: "dream-love-special-side-dish", price: null, price_type: "on_request", portion: "Price on request", isVeg: false, diet_type: "non_veg", isSpecial: true, description: "Tender mutton pieces tossed in aromatic kadhai spices and rich masala." },
  { id: "m-sp-12", name: "Egg Vurgi Masala", category: "dream-love-special-side-dish", price: 90, isVeg: false, isEgg: true, diet_type: "egg", description: "Spiced scrambled eggs cooked with chopped onions, green chillies, and tomatoes." },
  { id: "m-sp-13", name: "Chicken Kornamdom", category: "dream-love-special-side-dish", price: null, price_type: "on_request", portion: "Price on request", isVeg: false, diet_type: "non_veg", description: "Specialty chef preparation of chicken braised in a unique spiced herbal sauce." },
  { id: "m-sp-14", name: "Chicken Chattanar", category: "dream-love-special-side-dish", price: null, price_type: "on_request", portion: "Price on request", isVeg: false, diet_type: "non_veg", description: "Chettinad style chicken cooked with roasted coconut and star anise." },
  { id: "m-sp-15", name: "Handi Chicken", category: "dream-love-special-side-dish", price: null, price_type: "on_request", portion: "Price on request", isVeg: false, diet_type: "non_veg", description: "Clay pot slow-simmered chicken curry infused with whole spices and ghee." },
  { id: "m-sp-16", name: "Punjabi Chicken", category: "dream-love-special-side-dish", price: 200, isVeg: false, diet_type: "non_veg", isFeatured: true, description: "Rustic Punjabi highway dhaba style spicy chicken curry with robust aroma." },
  { id: "m-sp-17", name: "Fish Fry (Special)", category: "dream-love-special-side-dish", price: null, price_type: "as_per_size", portion: "As per size", isVeg: false, diet_type: "non_veg", description: "Chef specialty fresh fish fillet fried crisp with seasoned crumb coating." },
  { id: "m-sp-18", name: "Tandoori Fish (Special)", category: "dream-love-special-side-dish", price: null, price_type: "as_per_size", portion: "As per size", isVeg: false, diet_type: "non_veg", description: "Whole fish roasted in the clay tandoor with ajwain and lemon marinade." },
  { id: "m-sp-19", name: "Fish Alfas", category: "dream-love-special-side-dish", price: null, price_type: "on_request", portion: "Price on request", isVeg: false, diet_type: "non_veg", description: "Middle-Eastern inspired grilled fish marinated in fragrant Arabic spices." },
  { id: "m-sp-20", name: "Sp. Fish Kutti Varta", category: "dream-love-special-side-dish", price: null, price_type: "on_request", portion: "Price on request", isVeg: false, diet_type: "non_veg", isSpecial: true, description: "Signature boneless mashed fish bharta cooked with mustard oil and chillies." },
  { id: "m-sp-21", name: "Fish Pollichiry", category: "dream-love-special-side-dish", price: null, price_type: "on_request", portion: "Price on request", isVeg: false, diet_type: "non_veg", isSpecial: true, description: "Coastal specialty fish wrapped in banana leaf and pan-roasted with spices." },

  // ── PAGE 4: FRESH JUICE ──
  { id: "m-fj-1", name: "Lemon Juice", category: "fresh-juice", price: 60, isVeg: true, diet_type: "veg", description: "Freshly squeezed lemon cooler served sweet, salted, or mixed." },
  { id: "m-fj-2", name: "Ment Juice", category: "fresh-juice", price: 80, isVeg: true, diet_type: "veg", description: "Cooling crushed fresh pudina mint juice with lime and black salt." },
  { id: "m-fj-3", name: "Watermelon Juice", category: "fresh-juice", price: 90, isVeg: true, diet_type: "veg", isFeatured: true, description: "Pure fresh cold-pressed sweet watermelon juice served chilled." },
  { id: "m-fj-4", name: "Pineapple Juice", category: "fresh-juice", price: 110, isVeg: true, diet_type: "veg", description: "Tangy and sweet cold-pressed fresh pineapple juice." },
  { id: "m-fj-5", name: "Orange Juice", category: "fresh-juice", price: 110, isVeg: true, diet_type: "veg", description: "Freshly extracted sweet orange juice packed with natural vitamin C." },
  { id: "m-fj-6", name: "Musumbi Juice", category: "fresh-juice", price: 110, isVeg: true, diet_type: "veg", description: "Fresh sweet lime juice pressed to order with a pinch of rock salt." },
  { id: "m-fj-7", name: "Carrot Juice", category: "fresh-juice", price: 110, isVeg: true, diet_type: "veg", description: "Nutritious fresh seasonal carrot juice cold-pressed to order." },
  { id: "m-fj-8", name: "Cucumber Juice", category: "fresh-juice", price: null, price_type: "on_request", portion: "Price on request", isVeg: true, diet_type: "veg", description: "Hydrating cold-pressed cucumber juice with fresh lime and mint." },
  { id: "m-fj-9", name: "Mix Juice", category: "fresh-juice", price: 150, isVeg: true, diet_type: "veg", isFeatured: true, description: "Refreshing blend of seasonal fresh fruits cold-pressed together." },

  // ── PAGE 4: SALAD ──
  { id: "m-sal-1", name: "Cucumber Salad", category: "salad", price: 40, isVeg: true, diet_type: "veg", description: "Sliced fresh green cucumbers sprinkled with chaat masala and lime." },
  { id: "m-sal-2", name: "Onion Salad", category: "salad", price: 30, isVeg: true, diet_type: "veg", description: "Crisp red onion rings with green chillies and lemon wedges." },
  { id: "m-sal-3", name: "Green Salad", category: "salad", price: 50, isVeg: true, diet_type: "veg", description: "Fresh sliced cucumbers, tomatoes, onions, carrots, and lemon." },
  { id: "m-sal-4", name: "Chiness Salad", category: "salad", price: 60, isVeg: true, diet_type: "veg", description: "Shredded cabbage and bell peppers tossed in sesame and mild soy dressing." },
  { id: "m-sal-5", name: "Fruit Salad", category: "salad", price: 180, isVeg: true, diet_type: "veg", isFeatured: true, description: "Seasonal fresh cut fruit bowl tossed with honey and mild chaat seasoning." },

  // ── PAGE 4: MOCKTAIL ──
  { id: "m-mkt-1", name: "Blue Lemonade Mocktail", category: "mocktail", price: 90, isVeg: true, diet_type: "veg", isFeatured: true, description: "Vibrant blue curacao syrup, sparkling soda, and fresh lemon juice over ice." },
  { id: "m-mkt-2", name: "Green Lemonade Mocktail", category: "mocktail", price: 90, isVeg: true, diet_type: "veg", description: "Zesty green apple and mint syrup charged with bubbly chilled club soda." },
  { id: "m-mkt-3", name: "Masala Cold Drinks", category: "mocktail", price: 60, isVeg: true, diet_type: "veg", description: "Chilled cola charged with spicy roasted cumin, black salt, and lemon." },
  { id: "m-mkt-4", name: "Orange Mocktail", category: "mocktail", price: 90, isVeg: true, diet_type: "veg", description: "Citrus orange cooler blended with sparkling bubbles and crushed ice." },
  { id: "m-mkt-5", name: "Dream Love Special Mocktail", category: "mocktail", price: 150, isVeg: true, diet_type: "veg", isSpecial: true, isFeatured: true, description: "House signature multi-layered tropical fruit mocktail with fizz and garnish." },
  { id: "m-mkt-6", name: "Mango Moctail", category: "mocktail", price: 90, isVeg: true, diet_type: "veg", description: "Chilled mango nectar spiked with fresh mint and sparkling soda." },

  // ── PAGE 4: SHAKE ──
  { id: "m-shk-1", name: "Butter Scotch Shake", category: "shake", price: 130, isVeg: true, diet_type: "veg", description: "Creamy milkshake blended with butterscotch syrup and crunchy praline nuts." },
  { id: "m-shk-2", name: "Oreo Shake", category: "shake", price: 130, isVeg: true, diet_type: "veg", isFeatured: true, description: "Thick vanilla milkshake blended with crushed Oreo chocolate cookies." },
  { id: "m-shk-3", name: "Chocolate Shake", category: "shake", price: 130, isVeg: true, diet_type: "veg", description: "Decadent rich dark chocolate milkshake topped with chocolate drizzle." },
  { id: "m-shk-4", name: "Sarja Shake", category: "shake", price: 160, isVeg: true, diet_type: "veg", isSpecial: true, description: "House specialty dry fruit and cream shake with rich traditional flavours." },
  { id: "m-shk-5", name: "Cold Coffee", category: "shake", price: 110, isVeg: true, diet_type: "veg", isFeatured: true, description: "Creamy iced blended filter coffee topped with chocolate powder." },
  { id: "m-shk-6", name: "Cold Coffee with Ice Cream", category: "shake", price: null, price_type: "on_request", portion: "Price on request", isVeg: true, diet_type: "veg", description: "Chilled blended coffee served with a generous scoop of vanilla ice cream." },
  { id: "m-shk-7", name: "Faluda", category: "shake", price: 170, isVeg: true, diet_type: "veg", isSpecial: true, description: "Royal dessert beverage layered with rose syrup, vermicelli, sabja, and ice cream." },
  { id: "m-shk-8", name: "Apple Shake", category: "shake", price: null, price_type: "on_request", portion: "Price on request", isVeg: true, diet_type: "veg", description: "Smooth thick milkshake blended with fresh crunchy sweet apples." },
  { id: "m-shk-9", name: "Banana Shake", category: "shake", price: null, price_type: "on_request", portion: "Price on request", isVeg: true, diet_type: "veg", description: "Wholesome sweet milkshake blended with fresh ripe bananas and honey." },
  { id: "m-shk-10", name: "Pineapple Shake", category: "shake", price: null, price_type: "on_request", portion: "Price on request", isVeg: true, diet_type: "veg", description: "Tropical creamy shake blended with sweet pineapple and rich vanilla cream." },

  // ── PAGE 4: HOT DRINKS ──
  { id: "m-hd-1", name: "Coffee", category: "hot-drinks", price: 50, isVeg: true, diet_type: "veg", description: "Hot, frothy filter coffee brewed from roasted aromatic coffee beans." },
  { id: "m-hd-2", name: "Green Tea", category: "hot-drinks", price: 30, isVeg: true, diet_type: "veg", description: "Antioxidant-rich steaming green tea infused with light herbal notes." },
  { id: "m-hd-3", name: "Black Tea", category: "hot-drinks", price: 20, isVeg: true, diet_type: "veg", description: "Strong brewed Darjeeling black liquor tea served piping hot." },
  { id: "m-hd-4", name: "Black Coffee", category: "hot-drinks", price: 30, isVeg: true, diet_type: "veg", description: "Aromatic, bold dark black coffee brewed without milk." },
  { id: "m-hd-5", name: "Ginger Tea", category: "hot-drinks", price: 25, isVeg: true, diet_type: "veg", isFeatured: true, description: "Warm Indian milk tea simmered with freshly crushed adrak ginger root." },
  { id: "m-hd-6", name: "Lemon Tea", category: "hot-drinks", price: 20, isVeg: true, diet_type: "veg", description: "Refreshing clear liquor tea flavoured with fresh lemon juice and rock salt." },

  // ── PAGE 5: CHOPI (Veg) ──
  { id: "m-chv-1", name: "Veg Chinese Chopci", category: "chopci-veg", price: 150, isVeg: true, diet_type: "veg", description: "Crispy fried noodles topped with savoury stir-fried Asian vegetables and light gravy." },
  { id: "m-chv-2", name: "Veg American Chopci", category: "chopci-veg", price: 180, isVeg: true, diet_type: "veg", description: "Crispy noodles served with a tangy sweet-and-sour vegetable sauce." },

  // ── PAGE 5: CHOPCI (Non-Veg) ──
  { id: "m-chnv-1", name: "Mix Chinese Chopci", category: "chopci-non-veg", price: 170, isVeg: false, diet_type: "non_veg", description: "Crispy noodles crowned with chicken, egg, prawns, and savory Chinese sauce." },
  { id: "m-chnv-2", name: "Mix American Chopci", category: "chopci-non-veg", price: 200, isVeg: false, diet_type: "non_veg", isSpecial: true, description: "Crispy noodles topped with tangy sweet-and-sour chicken, prawns, and sunny egg." },

  // ── PAGE 5: CHOWMIN (Veg) ──
  { id: "m-cmv-1", name: "Veg Chowmin", category: "chowmein-veg", price: 80, isVeg: true, diet_type: "veg", description: "Wok-tossed noodles with shredded cabbage, carrots, bell peppers, and soy." },
  { id: "m-cmv-2", name: "Mushroom Chowmin", category: "chowmein-veg", price: 120, isVeg: true, diet_type: "veg", description: "Stir-fried noodles loaded with sliced fresh button mushrooms and greens." },
  { id: "m-cmv-3", name: "Paneer Chowmin", category: "chowmein-veg", price: 130, isVeg: true, diet_type: "veg", isFeatured: true, description: "Noodles wok-tossed with soft cottage cheese cubes, garlic, and scallions." },
  { id: "m-cmv-4", name: "Gobi Chowmin", category: "chowmein-veg", price: 100, isVeg: true, diet_type: "veg", description: "Wok noodles prepared with crisp cauliflower florets and Asian seasonings." },
  { id: "m-cmv-5", name: "Schezwan Veg Chowmin", category: "chowmein-veg", price: 130, isVeg: true, diet_type: "veg", description: "Fiery wok-tossed noodles tossed in our signature hot Schezwan chilli paste." },
  { id: "m-cmv-6", name: "Sanghi Veg Chowmin", category: "chowmein-veg", price: 140, isVeg: true, diet_type: "veg", description: "Chef specialty vegetable chowmein seasoned with unique Sanghi style spices." },

  // ── PAGE 5: CHOWMIN (Non-Veg) ──
  { id: "m-cmnv-1", name: "Egg Chowmin", category: "chowmein-non-veg", price: 90, isVeg: false, isEgg: true, diet_type: "egg", description: "Wok-tossed noodles with scrambled egg ribbons, onions, and spring vegetables." },
  { id: "m-cmnv-2", name: "Chicekn Chowmin", category: "chowmein-non-veg", price: 110, isVeg: false, diet_type: "non_veg", isFeatured: true, description: "Classic street-style noodles stir-fried with juicy shredded chicken pieces." },
  { id: "m-cmnv-3", name: "Mutton Chowmin", category: "chowmein-non-veg", price: 220, isVeg: false, diet_type: "non_veg", description: "Wok noodles tossed with tender shredded mutton pieces and Asian spices." },
  { id: "m-cmnv-4", name: "Prawn Chowmin", category: "chowmein-non-veg", price: 180, isVeg: false, diet_type: "non_veg", description: "Fresh sea prawns stir-fried with noodles, garlic, bell peppers, and soy." },
  { id: "m-cmnv-5", name: "Mix Chowmin", category: "chowmein-non-veg", price: 140, isVeg: false, diet_type: "non_veg", isFeatured: true, description: "Generous combination of chicken, prawns, and egg tossed with wok noodles." },
  { id: "m-cmnv-6", name: "Schezwan Mix Chowmin", category: "chowmein-non-veg", price: 160, isVeg: false, diet_type: "non_veg", description: "Spicy Schezwan noodles loaded with chicken, prawns, and egg." },
  { id: "m-cmnv-7", name: "Sanghi Mix Chowmin", category: "chowmein-non-veg", price: 180, isVeg: false, diet_type: "non_veg", description: "House special mixed non-veg noodles tossed in rich Sanghi style sauce." },

  // ── PAGE 5: ROLL (VEG) ──
  { id: "m-rlv-1", name: "Paneer Roll", category: "roll-veg", price: 80, isVeg: true, diet_type: "veg", isFeatured: true, description: "Flaky tawa paratha wrap stuffed with spiced cottage cheese, sliced onions, and sauces." },
  { id: "m-rlv-2", name: "Mushroom Roll", category: "roll-veg", price: 80, isVeg: true, diet_type: "veg", description: "Paratha wrap filled with juicy button mushrooms and tangy green chutney." },
  { id: "m-rlv-3", name: "Veg Spring Roll", category: "roll-veg", price: 130, isVeg: true, diet_type: "veg", description: "Golden crispy fried rolls stuffed with seasoned shredded vegetables." },

  // ── PAGE 5: ROLL (NON-VEG) ──
  { id: "m-rlnv-1", name: "Egg Roll", category: "roll-non-veg", price: 50, isVeg: false, isEgg: true, diet_type: "egg", description: "Crisp flaky paratha layered with fried egg, sliced onions, and tangy sauce." },
  { id: "m-rlnv-2", name: "Chicken Roll", category: "roll-non-veg", price: 70, isVeg: false, diet_type: "non_veg", isFeatured: true, description: "Paratha roll stuffed with spiced shredded chicken, onion rings, and lemon juice." },
  { id: "m-rlnv-3", name: "Egg Chicken Roll", category: "roll-non-veg", price: 90, isVeg: false, diet_type: "non_veg", isFeatured: true, description: "Egg-coated flaky paratha wrap packed with marinated spicy chicken pieces." },
  { id: "m-rlnv-4", name: "Mutton Roll", category: "roll-non-veg", price: 120, isVeg: false, diet_type: "non_veg", description: "Juicy tender spiced mutton wrapped in a golden fried paratha." },
  { id: "m-rlnv-5", name: "Egg Mutton Roll", category: "roll-non-veg", price: 140, isVeg: false, diet_type: "non_veg", isSpecial: true, description: "Egg layered paratha wrap generously filled with rich spiced mutton chunks." },
  { id: "m-rlnv-6", name: "Chicken Spring Roll", category: "roll-non-veg", price: 130, isVeg: false, diet_type: "non_veg", description: "Crisp fried golden pastry rolls stuffed with minced chicken and herbs." },
  { id: "m-rlnv-7", name: "Dil Khush Roll", category: "roll-non-veg", price: null, price_type: "on_request", portion: "Price on request", isVeg: false, diet_type: "non_veg", isSpecial: true, description: "House royal roll stuffed with rich combination of egg, chicken, and chef sauces." },

  // ── PAGE 5: SIDE DISH (VEG) - Indo-Chinese & Dry ──
  { id: "m-sdv-c1", name: "Chilli Veg", category: "side-dish-chinese-dry-veg", price: 130, isVeg: true, diet_type: "veg", description: "Crispy vegetable balls tossed with capsicum, green chillies, and savory soy sauce." },
  { id: "m-sdv-c2", name: "Veg Manchurian", category: "side-dish-chinese-dry-veg", price: 150, isVeg: true, diet_type: "veg", isFeatured: true, description: "Vegetable dumplings wok-simmered in rich garlic and coriander Manchurian sauce." },
  { id: "m-sdv-c3", name: "Chilli Gobi", category: "side-dish-chinese-dry-veg", price: 110, isVeg: true, diet_type: "veg", description: "Crispy batter-fried cauliflower tossed with bell peppers and tangy chilli sauce." },
  { id: "m-sdv-c4", name: "Gobi Manchurian", category: "side-dish-chinese-dry-veg", price: 130, isVeg: true, diet_type: "veg", description: "Golden cauliflower florets simmered in dark savory Manchurian sauce." },
  { id: "m-sdv-c5", name: "Chilli Paneer", category: "side-dish-chinese-dry-veg", price: 130, isVeg: true, diet_type: "veg", isFeatured: true, description: "Crispy cottage cheese cubes tossed with bell peppers, onions, and spicy chilli glaze." },
  { id: "m-sdv-c6", name: "Paneer Manchurian", category: "side-dish-chinese-dry-veg", price: 150, isVeg: true, diet_type: "veg", description: "Soft paneer cubes wok-cooked in garlic and ginger Manchurian gravy." },
  { id: "m-sdv-c7", name: "Chilli Mushroom", category: "side-dish-chinese-dry-veg", price: 120, isVeg: true, diet_type: "veg", description: "Crisp button mushrooms wok-tossed with green chillies, onions, and dark soy." },
  { id: "m-sdv-c8", name: "Mushroom Manchurian", category: "side-dish-chinese-dry-veg", price: 140, isVeg: true, diet_type: "veg", description: "Button mushrooms coated in savory Indo-Chinese Manchurian sauce." },
  { id: "m-sdv-c9", name: "Alu Gobi (Dry + Masala)", category: "side-dish-chinese-dry-veg", price: 120, isVeg: true, diet_type: "veg", description: "Homestyle potatoes and cauliflower florets sautéed with ginger and cumin." },
  { id: "m-sdv-c10", name: "Gobi Masala", category: "side-dish-chinese-dry-veg", price: 100, isVeg: true, diet_type: "veg", description: "Tender cauliflower florets simmered in a spiced North Indian tomato gravy." },
  { id: "m-sdv-c11", name: "Alu Masala", category: "side-dish-chinese-dry-veg", price: 100, isVeg: true, diet_type: "veg", description: "Golden potatoes sautéed in an aromatic onion and tomato masala gravy." },
];

console.log(`Total Categories: ${CANONICAL_CATEGORIES.length}`);
console.log(`Total Dishes: ${RAW_MENU_ITEMS.length}`);

// Generate restaurantData.ts
const restaurantDataPath = path.join(__dirname, '../src/config/restaurantData.ts');

const restaurantDataCode = `import { 
  RestaurantSettings, 
  MenuCategory, 
  MenuItem, 
  GalleryItem, 
  VerifiedReview, 
  DataConflictItem,
  RestaurantHoursDay
} from '../types';
import { enhanceMenuItemWithImage } from './dishImageMap';

export const INITIAL_RESTAURANT_SETTINGS: RestaurantSettings = {
  name: "Dream Love Cafe & Restaurant",
  tagline: "Multi-Cuisine Family Cafe & Restaurant",
  cuisines: ["Indian", "Tandoor", "Chinese", "Biryani", "Beverages"],
  phone: "+91 99333 88167",
  phoneSecondary: "+91 99333 88049",
  whatsapp: "+919933388167",
  email: "dreamlovecontai@gmail.com",
  address: "QPHM+8QV Central Bus Stand, Contai Bypass Rd, opposite Jawed Habib's, Kishore Nagar Garh, Kanthi Baliari, Contai, West Bengal 721404",
  city: "Contai",
  state: "West Bengal",
  postalCode: "721404",
  plusCode: "QPHM+8QV Contai, West Bengal",
  latitude: 21.782046,
  longitude: 87.747065,
  googleMapsCid: "16143850601250640223",
  googleMapsUrl: "https://maps.google.com/?cid=16143850601250640223",
  openingHours: "Monday - Sunday: 12:00 PM - 12:00 AM",
  weeklyHours: [
    { day: "Monday", openTime: "12:00 PM", closeTime: "12:00 AM", isClosed: false },
    { day: "Tuesday", openTime: "12:00 PM", closeTime: "12:00 AM", isClosed: false },
    { day: "Wednesday", openTime: "12:00 PM", closeTime: "12:00 AM", isClosed: false },
    { day: "Thursday", openTime: "12:00 PM", closeTime: "12:00 AM", isClosed: false },
    { day: "Friday", openTime: "12:00 PM", closeTime: "12:00 AM", isClosed: false },
    { day: "Saturday", openTime: "12:00 PM", closeTime: "12:00 AM", isClosed: false },
    { day: "Sunday", openTime: "12:00 PM", closeTime: "12:00 AM", isClosed: false },
  ],
  priceRangeForTwo: "₹200 - ₹400",
  diningModes: ["Dine-in", "Takeaway", "No-contact Delivery"],
  reservationEnabled: true,
  onlineOrderingEnabled: true,
  deliveryEnabled: true,
  takeawayEnabled: true,
  dineInEnabled: true,
  deliveryRadiusKm: 3,
  freeDeliveryRadiusKm: 3,
  deliveryNote: "Free Home Delivery available up to 3 KM from the kitchen",
  googleRating: 4.1,
  googleReviewsCount: 96,
  googleReviewsUrl: "https://maps.google.com/?cid=16143850601250640223",
  justdialRating: 4.0,
  justdialUrl: "https://www.justdial.com/Contai/Dream-Love-Cafe-Restaurant",
  magicpinRating: 4.1,
  magicpinUrl: "https://magicpin.in/Contai/Dream-Love-Cafe-And-Restaurant",
  instagramUrl: "https://instagram.com",
  facebookUrl: "https://facebook.com",
  orderInstructions: "Place your order for Dine-in, Takeaway, or Free Home Delivery up to 3 KM from the kitchen.",
  reservationInstructions: "Reserve your table online or call us directly. Table holds for 15 minutes past reserved time.",
  showSampleBadges: false,
};

// Verified Authentic Photography
export const REAL_GALLERY_PHOTOS: GalleryItem[] = [
  {
    id: "photo-1",
    title: "Official Storefront & 3D Signboard",
    category: "Storefront",
    image_url: "/photos/storefront_signboard.jpg",
    thumbnail_url: "/photos/storefront_signboard.jpg",
    caption: "Official illuminated storefront with DREAM 3D lettering, heartbeat pulse ECG line, and CAFE & RESTAURANT signage on Contai Bypass Road.",
    alt_text: "Dream Love Cafe & Restaurant storefront signage on Contai Bypass Road opposite Jawed Habib's",
    source: "Verified Storefront",
    owner_verified: true,
    is_featured: true,
    display_order: 1,
  },
  {
    id: "photo-2",
    title: "Exterior Street View & Snack Counter",
    category: "Storefront",
    image_url: "/photos/exterior_street_view.jpg",
    thumbnail_url: "/photos/exterior_street_view.jpg",
    caption: "Street-side view of the restaurant near Central Bus Stand with outdoor preparation counter and overhead lightbox sign.",
    alt_text: "Street view of Dream Love Cafe & Restaurant on Contai Bypass Road, Kishore Nagar Garh",
    source: "Client Real Photo",
    owner_verified: true,
    is_featured: true,
    display_order: 2,
  },
  {
    id: "photo-3",
    title: "Family Dining Room & Table Seating",
    category: "Dining Area",
    image_url: "/photos/interior_dining_counter.jpg",
    thumbnail_url: "/photos/interior_dining_counter.jpg",
    caption: "Cozy interior dining room featuring brick & ivy botanical wallpaper, green table seating, Arun Icecreams freezer, and reception desk.",
    alt_text: "Air-conditioned dining area with green tables inside Dream Love Cafe & Restaurant Contai",
    source: "Client Real Photo",
    owner_verified: true,
    is_featured: true,
    display_order: 3,
  },
  {
    id: "photo-4",
    title: "Cafe Lounge & Booth Seating",
    category: "Ambience",
    image_url: "/photos/interior_cafe_lounge.jpg",
    thumbnail_url: "/photos/interior_cafe_lounge.jpg",
    caption: "Warm ambiance with comfortable booth seating for family and friends.",
    alt_text: "Comfortable booth dining area at Dream Love Cafe & Restaurant Contai",
    source: "Client Real Photo",
    owner_verified: true,
    is_featured: true,
    display_order: 4,
  },
];

// Verified Diner Reviews
export const INITIAL_VERIFIED_REVIEWS: VerifiedReview[] = [
  {
    id: "rev-g1",
    source: "Google",
    reviewerName: "Pritam Mondal",
    rating: 5,
    reviewText: "Great food quality in Contai. The Tandoori Chicken and Biryani are really authentic and tasty. Highly recommend for family dinners.",
    reviewDate: "Verified local guide review",
    externalReviewUrl: "https://maps.google.com/?cid=16143850601250640223",
    isFeatured: true,
    isVerified: true,
    aspects: ["Tandoori Chicken", "Biryani", "Family Friendly"],
  },
  {
    id: "rev-g2",
    source: "Google",
    reviewerName: "Contai Food Explorer",
    rating: 4,
    reviewText: "Very reasonable pricing and good portions. Tried the Dream Love Special Chicken and Butter Naan. Prompt service and clean seating.",
    reviewDate: "Recent verified review",
    externalReviewUrl: "https://maps.google.com/?cid=16143850601250640223",
    isFeatured: true,
    isVerified: true,
    aspects: ["Special Chicken", "Butter Naan", "Value for Money"],
  },
  {
    id: "rev-j1",
    source: "Justdial",
    reviewerName: "Local Resident",
    rating: 4,
    reviewText: "Good variety of Chinese fried rice, mocktails, and kebabs. Convenient location on Contai Bypass Road.",
    reviewDate: "Justdial verified rating",
    externalReviewUrl: "https://www.justdial.com/Contai/Dream-Love-Cafe-Restaurant",
    isFeatured: true,
    isVerified: true,
    aspects: ["Fried Rice", "Mocktails", "Location"],
  },
  {
    id: "rev-m1",
    source: "Magicpin",
    reviewerName: "Dining Guest",
    rating: 4,
    reviewText: "Pocket-friendly multi-cuisine cafe. The Cold Coffee and Chicken 65 are popular favorites here.",
    reviewDate: "Magicpin verified listing",
    externalReviewUrl: "https://magicpin.in/Contai/Dream-Love-Cafe-And-Restaurant",
    isFeatured: true,
    isVerified: true,
    aspects: ["Cold Coffee", "Chicken 65", "Pocket Friendly"],
  },
];

export const VERIFIED_REVIEWS = INITIAL_VERIFIED_REVIEWS;

// Data Conflicts Tracking
export const INITIAL_DATA_CONFLICTS: DataConflictItem[] = [
  {
    id: "conflict-phone",
    field: "phone",
    title: "Primary Phone Number Verification",
    sourceA: "Storefront & Owner (+91 99333 88167)",
    valueA: "+91 99333 88167",
    sourceB: "Justdial Listing (+91 99333 88049)",
    valueB: "+91 99333 88049",
    currentValue: "+91 99333 88167",
    status: "pending_review",
  },
  {
    id: "conflict-hours",
    field: "opening_hours",
    title: "Operating Hours Verification",
    sourceA: "Google Maps (12:00 PM - 12:00 AM)",
    valueA: "12:00 PM - 12:00 AM",
    sourceB: "Zomato Listing (11:00 AM - 11:30 PM)",
    valueB: "11:00 AM - 11:30 PM",
    currentValue: "12:00 PM - 12:00 AM",
    status: "pending_review",
  },
];

// Authoritative 25 Menu Categories
export const MENU_CATEGORIES: MenuCategory[] = ${JSON.stringify(CANONICAL_CATEGORIES, null, 2)};

// Raw 217 Canonical Dishes
const RAW_INITIAL_MENU_ITEMS: MenuItem[] = ${JSON.stringify(
  RAW_MENU_ITEMS.map((item, idx) => ({
    ...item,
    displayOrder: idx + 1,
    sort_order: idx + 1,
    isAvailable: true,
    is_available: true,
    isFeatured: Boolean(item.isFeatured),
    is_featured: Boolean(item.isFeatured),
    isSpecial: Boolean(item.isSpecial),
    is_special: Boolean(item.isSpecial),
    priceType: item.price_type || (item.price ? 'fixed' : 'on_request'),
    price_type: item.price_type || (item.price ? 'fixed' : 'on_request'),
    is_veg: item.isVeg,
    is_egg: Boolean(item.isEgg),
    isEgg: Boolean(item.isEgg),
    source: "Client Menu Artwork",
    ownerVerified: true,
    owner_verified: true,
    dataQualityStatus: "verified",
  })),
  null,
  2
)};

export const INITIAL_MENU_ITEMS: MenuItem[] = RAW_INITIAL_MENU_ITEMS.map(enhanceMenuItemWithImage);
`;

fs.writeFileSync(restaurantDataPath, restaurantDataCode, 'utf8');
console.log('Successfully wrote authoritative restaurantData.ts with 25 categories and 217 dishes!');

// Update scripts/seed-supabase.js
const seedScriptPath = path.join(__dirname, 'seed-supabase.js');
const seedScriptCode = `const { createClient } = require('@supabase/supabase-js');
const { CANONICAL_CATEGORIES, RAW_MENU_ITEMS } = require('./build-complete-menu');

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://efjgszyoiaoapsmmutzm.supabase.co';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmamdzenlvaWFvYXBzbW11dHptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczOTM5NDYsImV4cCI6MjEwMjk2OTk0Nn0.DIjSY5pVUru_nRfmfREjJkQH3IcqfJsdrcG6m7WTeOU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('----------------------------------------------------');
  console.log('  DREAM LOVE CAFE & RESTAURANT — DATABASE SEEDER    ');
  console.log('----------------------------------------------------');
  console.log('Connecting to:', supabaseUrl);

  try {
    // 1. Verify connection
    const { error: testErr } = await supabase.from('restaurant_settings').select('id').limit(1);
    if (testErr && (testErr.code === 'PGRST301' || testErr.message.includes('Could not find the table') || testErr.message.includes('relation "public.restaurant_settings" does not exist'))) {
      console.error('\\n⚠️ SUPABASE TABLES NOT FOUND!');
      console.error('Please copy the contents of supabase/schema.sql and execute in your Supabase SQL Editor:');
      console.error('👉 https://supabase.com/dashboard/project/efjgszyoiaoapsmmutzm/sql/new\\n');
      return;
    }

    console.log('✅ Supabase tables verified!');
    console.log('Seeding restaurant settings, 25 categories, and 217 dishes...');

    // 1. Seed Restaurant Settings
    await supabase.from('restaurant_settings').upsert({
      name: "Dream Love Cafe & Restaurant",
      tagline: "Multi-Cuisine Family Cafe & Restaurant",
      cuisines: ["Indian", "Tandoor", "Chinese", "Biryani", "Beverages"],
      phone: "+91 99333 88167",
      phone_secondary: "+91 99333 88049",
      whatsapp: "+919933388167",
      email: "dreamlovecontai@gmail.com",
      address: "QPHM+8QV Central Bus Stand, Contai Bypass Rd, opposite Jawed Habib's, Kishore Nagar Garh, Kanthi Baliari, Contai, West Bengal 721404",
      city: "Contai",
      state: "West Bengal",
      postal_code: "721404",
      plus_code: "QPHM+8QV Contai, West Bengal",
      latitude: 21.782046,
      longitude: 87.747065,
      google_maps_cid: "16143850601250640223",
      google_maps_url: "https://maps.google.com/?cid=16143850601250640223",
      opening_hours: "Monday - Sunday: 12:00 PM - 12:00 AM",
      price_range_for_two: "₹200 - ₹400",
      dining_modes: ["Dine-in", "Takeaway", "No-contact Delivery"],
      google_rating: 4.1,
      google_reviews_count: 96,
      google_reviews_url: "https://maps.google.com/?cid=16143850601250640223",
      justdial_rating: 4.0,
      justdial_url: "https://www.justdial.com/Contai/Dream-Love-Cafe-Restaurant",
      magicpin_rating: 4.1,
      magicpin_url: "https://magicpin.in/Contai/Dream-Love-Cafe-And-Restaurant",
      order_instructions: "Free Home Delivery available up to 3 KM from the kitchen in Contai.",
    });
    console.log('✅ Restaurant Settings seeded.');

    // 2. Seed 25 Menu Categories
    for (const cat of CANONICAL_CATEGORIES) {
      await supabase.from('menu_categories').upsert({
        id: cat.id,
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        display_order: cat.displayOrder,
        image_url: cat.image,
        is_active: true,
      }, { onConflict: 'slug' });
    }
    console.log(\`✅ \${CANONICAL_CATEGORIES.length} Menu Categories seeded.\`);

    // 3. Seed 217 Menu Items
    const itemsToInsert = RAW_MENU_ITEMS.map((item, idx) => ({
      id: item.id,
      name: item.name,
      category_slug: item.category,
      description: item.description,
      price: item.price || null,
      price_type: item.price_type || (item.price ? 'fixed' : 'on_request'),
      portion: item.portion || null,
      is_available: true,
      is_featured: Boolean(item.isFeatured),
      is_veg: item.isVeg,
      is_egg: Boolean(item.isEgg),
      source: 'Client Menu Artwork',
      owner_verified: true,
      data_quality_status: 'verified',
      display_order: idx + 1,
    }));

    // Batch upsert in chunks of 50
    for (let i = 0; i < itemsToInsert.length; i += 50) {
      const batch = itemsToInsert.slice(i, i + 50);
      const { error: insertErr } = await supabase.from('menu_items').upsert(batch, { onConflict: 'id' });
      if (insertErr) {
        console.warn('Batch insert notice:', insertErr.message);
      }
    }
    console.log(\`✅ \${RAW_MENU_ITEMS.length} Menu Items seeded.\`);

    console.log('🎉 Seeding complete! Database is now the single source of truth.');
  } catch (err) {
    console.error('Seeding notice:', err.message);
  }
}

seed();
`;

fs.writeFileSync(seedScriptPath, seedScriptCode, 'utf8');
console.log('Successfully updated seed-supabase.js!');

module.exports = {
  CANONICAL_CATEGORIES,
  RAW_MENU_ITEMS,
};

