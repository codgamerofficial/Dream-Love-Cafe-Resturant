const { createClient } = require('@supabase/supabase-js');

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
    const { data, error } = await supabase.from('restaurant_settings').select('id').limit(1);
    if (error && (error.code === 'PGRST301' || error.message.includes('Could not find the table') || error.message.includes('relation "public.restaurant_settings" does not exist'))) {
      console.error('\n⚠️ SUPABASE TABLES NOT FOUND!');
      console.error('Please copy the contents of supabase/schema.sql and execute in your Supabase SQL Editor:');
      console.error('👉 https://supabase.com/dashboard/project/efjgszyoiaoapsmmutzm/sql/new\n');
      return;
    }

    console.log('✅ Supabase tables verified!');
    console.log('Seeding initial restaurant settings and canonical menu items...');

    // Seed Restaurant Settings
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
    });

    console.log('✅ Seeding complete!');
  } catch (err) {
    console.error('Seeding notice:', err.message);
  }
}

seed();
