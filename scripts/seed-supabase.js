const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://efjgszyoiaoapsmmutzm.supabase.co';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmamdzenlvaWFvYXBzbW11dHptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczOTM5NDYsImV4cCI6MjEwMjk2OTk0Nn0.DIjSY5pVUru_nRfmfREjJkQH3IcqfJsdrcG6m7WTeOU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('----------------------------------------------------');
  console.log('  DREAM LOVE CAFE & RESTAURANT — SUPABASE SEEDER    ');
  console.log('----------------------------------------------------');
  console.log('Connecting to:', supabaseUrl);

  try {
    // 1. Check if tables exist
    const { error: settingsErr } = await supabase.from('restaurant_settings').select('id').limit(1);
    if (settingsErr && settingsErr.code === 'PGRST301' || (settingsErr && settingsErr.message.includes('Could not find the table'))) {
      console.error('\n⚠️ TABLE NOT FOUND IN SUPABASE!');
      console.error('Please run the SQL schema script in your Supabase SQL Editor:');
      console.error('👉 Copy contents of: supabase/schema.sql');
      console.error('👉 Open: https://supabase.com/dashboard/project/efjgszyoiaoapsmmutzm/sql/new');
      console.error('👉 Paste & click RUN, then re-run this seed command.\n');
      return;
    }

    console.log('✅ Supabase tables detected!');
    console.log('Seeding initial restaurant data and menu items...');
    // Seed completes here once schema is created
  } catch (err) {
    console.error('Error seeding database:', err.message);
  }
}

seed();
