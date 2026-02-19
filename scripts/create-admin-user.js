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
            env[key.trim()] = values.join('=').trim(); // Handle values with '='
        }
    });

    return env;
}

const env = loadEnv();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials in .env.local');
    console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
    console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'Set' : 'Missing');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const args = process.argv.slice(2);
if (args.length < 2) {
    console.log('Usage: node scripts/create-admin-user.js <email> <password>');
    process.exit(1);
}

const [email, password] = args;

async function createAdmin() {
    console.log(`Setting up admin user: ${email}...`);

    // 1. Check if user exists first to get ID, or create
    // Trying to create - if exists, it will error, then we fetch.
    // Actually, listUsers is cleaner if we have service role.

    let userId;

    try {
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

        if (listError) throw listError;

        const existingUser = users.find(u => u.email === email);

        if (existingUser) {
            console.log('User already exists. Updating role and password...');
            userId = existingUser.id;

            // Force update password
            const { error: updateError } = await supabase.auth.admin.updateUserById(
                userId,
                { password: password, email_confirm: true }
            );

            if (updateError) throw updateError;
        } else {
            console.log('Creating new user...');
            const { data: { user }, error: createError } = await supabase.auth.admin.createUser({
                email,
                password,
                email_confirm: true
            });

            if (createError) throw createError;
            userId = user.id;
            console.log(`User created with ID: ${userId}`);
        }

        // 2. Insert/Update Profile
        console.log(`Ensuring profile exists and has 'admin' role for ID: ${userId}...`);

        // Check if profile exists
        const { data: profile, error: profileFetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (profileFetchError && profileFetchError.code !== 'PGRST116') { // PGRST116 is "Row not found"
            console.error('Error fetching profile:', profileFetchError);
        }

        const updates = {
            id: userId,
            email: email,
            role: 'admin', // Enforcing admin role
            updated_at: new Date()
        };

        const { error: upsertError } = await supabase
            .from('profiles')
            .upsert(updates, { onConflict: 'id' });

        if (upsertError) {
            throw new Error(`Failed to update profile: ${upsertError.message}`);
        }

        console.log('✅ Success! User is now an admin.');
        console.log(`Email: ${email}`);
        console.log(`Role: admin`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

createAdmin();
