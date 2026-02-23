// LiveWedding Studio - Auth & Data Simulation Script

document.addEventListener('DOMContentLoaded', () => {

    // --- DATABASE MOCK (LocalStorage) ---
    const MOCK_DB = {
        clients: [
            { id: "aiswarya_rahul", pin: "password", name: "Aiswarya & Rahul", date: "Oct 15, 2025", package: "Premium Cinematic", img: "https://images.unsplash.com/photo-1543165365-d60232e01df7?auto=format&fit=crop&q=80&w=800" },
            { id: "maya_karthik", pin: "123456", name: "Maya & Karthik", date: "Nov 02, 2025", package: "Gold", img: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600" }
        ],
        admins: [
            { username: "superadmin", password: "superpassword", role: "superadmin" },
            { username: "staff", password: "staffpassword", role: "staff" }
        ]
    };

    // Initialize DB if empty
    if (!localStorage.getItem('livewedding_db')) {
        localStorage.setItem('livewedding_db', JSON.stringify(MOCK_DB));
    }

    // --- CLIENT PORTAL AUTH ---
    const clientLoginForm = document.getElementById('portal-login-form');
    if (clientLoginForm) {

        // Remove the inline hardcoded JS first
        clientLoginForm.removeAttribute('onsubmit');

        clientLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const clientId = document.getElementById('clientId').value;
            const pin = document.getElementById('password').value;

            const db = JSON.parse(localStorage.getItem('livewedding_db'));
            const user = db.clients.find(c => c.id === clientId && c.pin === pin);

            if (user) {
                // Success: Save active session
                localStorage.setItem('active_client', JSON.stringify(user));

                // Show dashboard, hide login
                document.getElementById('login-view').style.display = 'none';
                document.getElementById('dashboard-view').style.display = 'block';
                window.scrollTo(0, 0);

                // Populate Dashboard Data
                populateClientDashboard(user);
            } else {
                alert("Invalid Client ID or PIN. Please check your email for access details.");
            }
        });

        // Check active session on load
        if (localStorage.getItem('active_client')) {
            const user = JSON.parse(localStorage.getItem('active_client'));
            document.getElementById('login-view').style.display = 'none';
            document.getElementById('dashboard-view').style.display = 'block';
            populateClientDashboard(user);
        }
    }

    // --- ADMIN AUTH (Simple Mock) ---
    const isAdminPage = window.location.pathname.includes('admin.html');

    if (isAdminPage) {
        if (!localStorage.getItem('admin_logged_in_role')) {
            const promptUser = prompt("Admin Secured Area. Enter Username (superadmin or staff):");
            const promptPass = prompt("Enter Password (superpassword or staffpassword):");

            const db = JSON.parse(localStorage.getItem('livewedding_db'));
            const adminUser = db.admins.find(a => a.username === promptUser && a.password === promptPass);

            if (adminUser) {
                localStorage.setItem('admin_logged_in_role', adminUser.role);
                localStorage.setItem('admin_logged_in_user', adminUser.username);
                alert(`Welcome back, ${adminUser.username} (${adminUser.role})`);
                location.reload(); // Reload to apply UI changes
            } else {
                alert("Unauthorized Access. Redirecting to home.");
                window.location.href = "index.html";
            }
        } else {
            // Apply Role Based UI restrictions
            const currentRole = localStorage.getItem('admin_logged_in_role');
            const currentUser = localStorage.getItem('admin_logged_in_user');

            // Update Header Username
            const headerTitle = document.querySelector('.header-title');
            if (headerTitle) headerTitle.innerText = `Welcome back, ${currentUser}`;

            const profileRoleSpan = document.querySelector('.user-profile span');
            if (profileRoleSpan) profileRoleSpan.innerText = currentRole.charAt(0).toUpperCase() + currentRole.slice(1);

            // Restrict Staff Access
            if (currentRole !== 'superadmin') {
                // Staff cannot see Client Access or Staff Management
                const clientsTab = document.querySelector('.nav-link[data-target="clients"]');
                if (clientsTab) clientsTab.style.display = 'none';

                const staffAdminTab = document.querySelector('.nav-link[data-target="staff"]');
                if (staffAdminTab) staffAdminTab.style.display = 'none';
            }
        }

        // Logout handler
        const logoutBtn = document.getElementById('admin-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('admin_logged_in_role');
                localStorage.removeItem('admin_logged_in_user');
                window.location.href = "index.html";
            });
        }
    }
});

// Helper for Client Dashboard Loading
function populateClientDashboard(user) {
    document.getElementById('client-name-display').innerText = user.name;
    document.getElementById('client-meta-display').innerText = `Event Date: ${user.date} | Package: ${user.package}`;
}

function clientLogout() {
    localStorage.removeItem('active_client');
    location.reload();
}
