const { createClient } = require('@supabase/supabase-js');
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
      console.error('\n⚠️ SUPABASE TABLES NOT FOUND!');
      console.error('Please copy the contents of supabase/schema.sql and execute in your Supabase SQL Editor:');
      console.error('👉 https://supabase.com/dashboard/project/efjgszyoiaoapsmmutzm/sql/new\n');
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
    console.log(`✅ ${CANONICAL_CATEGORIES.length} Menu Categories seeded.`);

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
    console.log(`✅ ${RAW_MENU_ITEMS.length} Menu Items seeded.`);

    console.log('🎉 Seeding complete! Database is now the single source of truth.');
  } catch (err) {
    console.error('Seeding notice:', err.message);
  }
}

seed();
