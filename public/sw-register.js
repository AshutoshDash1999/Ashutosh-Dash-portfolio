// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    console.log('Attempting to register service worker...');

    // Check if manifest is accessible
    fetch('/manifest.json')
      .then(response => {
        console.log('Manifest response status:', response.status);
        console.log('Manifest content-type:', response.headers.get('content-type'));
        return response.json();
      })
      .then(manifest => {
        console.log('Manifest loaded successfully:', manifest);
      })
      .catch(err => {
        console.error('Error loading manifest:', err);
      });

    navigator.serviceWorker
      .register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, show update notification
              if (confirm('New version available! Reload to update?')) {
                window.location.reload();
              }
            }
          });
        });
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Handle offline/online status
window.addEventListener('online', () => {
  document.body.classList.remove('offline');
  console.log('App is online');
});

window.addEventListener('offline', () => {
  document.body.classList.add('offline');
  console.log('App is offline');
});
