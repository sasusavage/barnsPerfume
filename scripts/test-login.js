const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Function to load env file manually
function loadEnv() {
    const envPath = path.resolve(__dirname, '../.env.local');
    if (!fs.existsSync(envPath)) {
        console.error('.env.local file not found');
        process.exit(1);
    }

    const content = fs.readFileSync(envPath, 'utf8');
    const env = {};

    content.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;

        const [key, ...values] = trimmed.split('=');
        if (key && values.length > 0) {
            env[key.trim()] = values.join('=').trim();
        }
    });

    return env;
}

const env = loadEnv();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const email = process.argv[2] || 'admin@example.com';
const password = process.argv[3] || 'password123';

async function testLogin() {
    console.log(`Attempting login for: ${email}`);

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            console.error('❌ Login Failed:', error.message);
            process.exit(1);
        }

        if (data.session) {
            console.log('✅ Login Successful!');
            console.log('Access Token:', data.session.access_token.substring(0, 20) + '...');
            console.log('User ID:', data.user.id);
            console.log('Role:', data.user.role); // Should be 'authenticated' usually, but custom claim might differ
        } else {
            console.error('❌ No session returned (but no error?)');
        }

    } catch (err) {
        console.error('❌ Unexpected Error:', err.message);
    }
}

testLogin();
