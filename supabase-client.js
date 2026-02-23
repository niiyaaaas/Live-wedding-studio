// LiveWedding Studio - Centralized Cloud Database Client

const supabaseUrl = 'https://lfufrozvaazzspnhyifu.supabase.co';
const supabaseKey = 'sb_publishable_sEYRInbrGlAywbBui49zQw_I4x5NSVG';

// Initialize the Supabase Client (requires @supabase/supabase-js CDN)
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// --- CLOUD BOOKING FUNCTIONS ---

// Submit a new booking inquiry to Supabase
async function cloudSubmitBooking(name, email, date, pkgName) {
    const { data, error } = await supabase
        .from('bookings')
        .insert([{ name: name, email: email, date: date, package: pkgName, status: 'pending' }]);

    if (error) {
        console.error("Supabase Insert Error:", error);
        alert("Database connection error. Have you executed the SQL setup script yet? Check console.");
        return false;
    }
    return true;
}

// Check if a specific date is already marked as 'confirmed'
async function cloudCheckDateBooked(dateStr) {
    const { data, error } = await supabase
        .from('bookings')
        .select('id')
        .eq('date', dateStr)
        .eq('status', 'confirmed');

    if (error) {
        console.error("Supabase Select Error:", error);
        return false;
    }
    return data.length > 0;
}

// Fetch all bookings for the Admin CRM
async function cloudGetBookings() {
    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Supabase Fetch Error:", error);
        return [];
    }
    return data;
}

// Update booking status from Admin CRM
async function cloudUpdateBookingStatus(id, newStatus) {
    const { data, error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', id);

    if (error) {
        console.error("Supabase Update Error:", error);
        return false;
    }
    return true;
}
