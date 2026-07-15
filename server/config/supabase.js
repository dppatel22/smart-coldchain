const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Pull the secure variables from the .env file
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Throw a fatal error if the keys are missing so we don't debug blindly
if (!supabaseUrl || !supabaseKey) {
    throw new Error('MISSING SUPABASE CREDENTIALS! Check your .env file.');
}

// Initialize and export the secure database connection
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;