// LiveWedding Studio - Centralized Cloud Database Client

const supabaseUrl = 'https://lfufrozvaazzspnhyifu.supabase.co';
const supabaseKey = 'sb_publishable_sEYRInbrGlAywbBui49zQw_I4x5NSVG';

// Initialize the Supabase Client (requires @supabase/supabase-js CDN)
let supabase;
if (window.supabase) {
    supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
} else {
    console.error("CRITICAL: Supabase CDN failed to load. Please check your internet connection or the script URL.");
}

// --- CLOUD BOOKING FUNCTIONS ---

// Submit a new booking inquiry to Supabase
async function cloudSubmitBooking(name, email, date, pkgName) {
    if (!supabase) return false;
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
    if (!supabase) return false;
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
    if (!supabase) return [];
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
    if (!supabase) return false;
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

// --- CLOUD QUERY FUNCTIONS ---

// Submit a new support query from Client Portal
async function cloudSubmitQuery(clientId, clientName, subject, message) {
    if (!supabase) return false;
    const { data, error } = await supabase
        .from('queries')
        .insert([{
            client_id: clientId,
            client_name: clientName,
            subject: subject,
            message: message,
            status: 'pending'
        }]);

    if (error) {
        console.error("Supabase Query Error:", error);
        return false;
    }
    return true;
}

// Fetch all queries for Admin CRM
async function cloudGetQueries() {
    if (!supabase) return [];
    const { data, error } = await supabase
        .from('queries')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Supabase Query Fetch Error:", error);
        return [];
    }
    return data;
}

// Fetch queries for a specific client
async function cloudGetClientQueries(clientId) {
    if (!supabase) return [];
    const { data, error } = await supabase
        .from('queries')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Supabase Client Query Fetch Error:", error);
        return [];
    }
    return data;
}

// Update query status from Admin CRM
async function cloudUpdateQueryStatus(id, newStatus) {
    if (!supabase) return false;
    const { data, error } = await supabase
        .from('queries')
        .update({ status: newStatus })
        .eq('id', id);

    if (error) {
        console.error("Supabase Query Update Error:", error);
        return false;
    }
    return true;
}
