// --- TAB NAVIGATION LOGIC ---
const navItems = document.querySelectorAll('.nav-item');
const views = document.querySelectorAll('.view');

navItems.forEach(item => {
  item.addEventListener('click', () => {
    const target = item.getAttribute('data-view');
    
    // Update Nav UI
    navItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    
    // Switch View
    views.forEach(v => v.classList.remove('active'));
    document.getElementById(target).classList.add('active');
  });
});

// --- PWA UPDATE LOGIC ---
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(reg => {
    
    // Check for updates
    reg.addEventListener('updatefound', () => {
      const newWorker = reg.installing;
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New version found & installed! Show the banner
          document.getElementById('update-banner').classList.add('show');
        }
      });
    });
  });

  // Reload page when the new worker takes control
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      window.location.reload();
      refreshing = true;
    }
  });
}

// Update Button Action
document.getElementById('update-btn').addEventListener('click', () => {
  navigator.serviceWorker.ready.then(reg => {
    if (reg.waiting) {
      reg.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  });
});