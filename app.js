// --- NAVIGATION ---
const navItems = document.querySelectorAll('.nav-item');
const views = document.querySelectorAll('.view');

navItems.forEach(item => {
  item.addEventListener('click', () => {
    const target = item.getAttribute('data-view');
    navItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    views.forEach(v => {
      v.classList.remove('active');
      if(v.id === target) v.classList.add('active');
    });
  });
});

// --- PWA & UPDATE LOGIC ---
let newWorker;

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(reg => {
    reg.addEventListener('updatefound', () => {
      newWorker = reg.installing;
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // Show the banner
          const banner = document.getElementById('update-banner');
          banner.style.display = 'flex';
          setTimeout(() => banner.classList.add('show'), 100);
        }
      });
    });
  });

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });
}

// FIX: Click event for the Update Button
document.getElementById('update-btn').addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  // Hide immediately so user knows it was clicked
  const banner = document.getElementById('update-banner');
  banner.classList.remove('show');
  
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.ready.then(reg => {
      if (reg.waiting) {
        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
      } else {
        // Fallback if reg.waiting is null
        window.location.reload();
      }
    });
  }
});