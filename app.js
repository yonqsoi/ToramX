// ==========================================
// PWA REGISTRATION & UPDATE NOTIFICATION
// ==========================================
let newWorker;
const updateBanner = document.getElementById('update-banner');
const updateBtn = document.getElementById('update-btn');

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then(reg => {
            console.log('Service Worker registered!');

            reg.addEventListener('updatefound', () => {
                newWorker = reg.installing;
                newWorker.addEventListener('statechange', () => {
                    // If a new worker is installed and there's a previous one controlling the page
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // Show the premium UI update banner
                        updateBanner.classList.remove('hidden');
                    }
                });
            });
        });
    });

    // Handle the controller change (this fires when the new worker takes over)
    let refreshing;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        window.location.reload();
        refreshing = true;
    });
}

// When user clicks "Update Now", tell the new worker to skip waiting
updateBtn.addEventListener('click', () => {
    if (newWorker) {
        newWorker.postMessage({ type: 'SKIP_WAITING' });
    }
});

// ==========================================
// BOTTOM NAVIGATION LOGIC
// ==========================================
const navItems = document.querySelectorAll('.nav-item');
const views = document.querySelectorAll('.view');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        // 1. Remove active class from all buttons and views
        navItems.forEach(btn => btn.classList.remove('active'));
        views.forEach(view => view.classList.add('hidden'));

        // 2. Add active class to clicked button
        item.classList.add('active');

        // 3. Show the corresponding view
        const targetId = item.getAttribute('data-target');
        document.getElementById(targetId).classList.remove('hidden');
    });
});
