const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();


const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('MISSING SUPABASE CREDENTIALS! Check your .env file.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
module.exports = supabase; 