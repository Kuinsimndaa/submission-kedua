// Entry point untuk SPA berbagi cerita
import '../style.css';
import { initRouter } from './router.js';
import { saveStory } from './utils/idb.js';

const VAPID_PUBLIC_KEY = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk'; // Ganti dengan VAPID key dari API Story

async function subscribePushNotification() {
  if (!('serviceWorker' in navigator)) {
    alert('Service Worker tidak didukung di browser ini.');
    return;
  }
  const registration = await navigator.serviceWorker.ready;
  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    try {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });
      // Kirim subscription ke server lokal push notification
      await fetch('http://localhost:3000/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription)
      });
      alert('Push notification diaktifkan!');
    } catch (err) {
      alert('Gagal subscribe push notification: ' + err.message);
    }
  } else {
    alert('Push notification sudah aktif.');
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

window.addEventListener('DOMContentLoaded', () => {
  initRouter();
  const btn = document.getElementById('enable-push');
  if (btn) {
    btn.onclick = subscribePushNotification;
  }
});

window.saveStory = async (story) => {
  await saveStory(story);
  alert('Cerita disimpan untuk offline!');
};

// Daftarkan hanya sw-push.js untuk push notification (biarkan Vite PWA yang handle service worker utama)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // navigator.serviceWorker.register('/service-worker.js').catch(() => {}); // Dihapus agar tidak bentrok dengan Vite PWA
    navigator.serviceWorker.register('/sw-push.js').catch(() => {});
  });
}
