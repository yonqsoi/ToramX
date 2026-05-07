// TAB SWITCHING
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
    
    // Haptic feedback simulation
    if (window.navigator.vibrate) window.navigator.vibrate(5);
  });
});

// PWA UPDATE LOGIC
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(reg => {
    reg.addEventListener('updatefound', () => {
      const newWorker = reg.installing;
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          document.getElementById('update-banner').classList.add('show');
        }
      });
    });
  });

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });
}

document.getElementById('update-btn').addEventListener('click', () => {
  navigator.serviceWorker.ready.then(reg => {
    if (reg.waiting) {
      reg.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  });
});