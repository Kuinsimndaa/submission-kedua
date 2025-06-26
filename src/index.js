// Entry point untuk SPA berbagi cerita
import '../style.css';
import { initRouter } from './router.js';
import { saveStory } from './utils/idb.js';
import { registerSW } from 'virtual:pwa-register';

const VAPID_PUBLIC_KEY = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk'; // Ganti dengan VAPID key dari API Story

async function subscribePushNotification(token, btn) {
  if (!('serviceWorker' in navigator)) {
    alert('Service Worker tidak didukung di browser ini.');
    return;
  }
  console.log('Token yang dikirim ke subscribe:', token); // DEBUG
  const registration = await navigator.serviceWorker.ready;
  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    try {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });
    } catch (err) {
      alert('Gagal subscribe push notification: ' + err.message);
      return;
    }
  }
  // Kirim subscription ke API Dicoding
  try {
    // Remove expirationTime if present
    const subObj = subscription.toJSON();
    delete subObj.expirationTime;

    const res = await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subObj)
    });
    if (!res.ok) {
      if (res.status === 401) {
        alert('Token tidak valid atau sudah kadaluarsa. Silakan login ulang.');
        localStorage.removeItem('token');
        location.reload();
        return;
      } else {
        const errText = await res.text();
        alert('Gagal mengirim subscription ke API Dicoding: ' + errText);
        return;
      }
    }
    alert('Push notification berhasil diaktifkan!');
    if (btn) updatePushButtonLabel(btn);
  } catch (err) {
    alert('Gagal mengirim subscription ke API Dicoding: ' + err.message);
  }
}

async function unsubscribePushNotification(btn) {
  if (!('serviceWorker' in navigator)) return;
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (subscription) {
    await subscription.unsubscribe();
    alert('Push notification dinonaktifkan!');
    if (btn) updatePushButtonLabel(btn);
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
  // Skip to content fix for SPA
  const mainContent = document.querySelector('#main-content');
  const skipLink = document.querySelector('.skip-link');
  if (mainContent && skipLink) {
    skipLink.addEventListener('click', function (event) {
      event.preventDefault();
      skipLink.blur();
      mainContent.focus();
      mainContent.scrollIntoView();
    });
  }

  initRouter();
  // Login/Register/Logout button logic
  const nav = document.querySelector('nav ul');
  if (nav) {
    const token = localStorage.getItem('token');
    const loginLi = nav.querySelector('li:has(a[href="#/login"])');
    const registerLi = nav.querySelector('li:has(a[href="#/register"])');
    let logoutLi = nav.querySelector('li.logout-li');
    if (token) {
      if (loginLi) loginLi.style.display = 'none';
      if (registerLi) registerLi.style.display = 'none';
      if (!logoutLi) {
        logoutLi = document.createElement('li');
        logoutLi.className = 'logout-li';
        const logoutBtn = document.createElement('button');
        logoutBtn.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i> Logout';
        logoutBtn.onclick = () => {
          localStorage.removeItem('token');
          location.reload();
        };
        logoutLi.appendChild(logoutBtn);
        nav.appendChild(logoutLi);
      }
    } else {
      if (loginLi) loginLi.style.display = '';
      if (registerLi) registerLi.style.display = '';
      if (logoutLi) logoutLi.remove();
    }
  }

  // Push notification button dynamic label
  const btn = document.getElementById('enable-push');
  if (btn) {
    updatePushButtonLabel(btn);
    btn.onclick = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Silakan login terlebih dahulu untuk mengaktifkan push notification.');
        return;
      }
      if (btn.dataset.active === 'true') {
        unsubscribePushNotification(btn);
      } else {
        subscribePushNotification(token, btn);
      }
    };
  }
});

async function updatePushButtonLabel(btn) {
  if (!('serviceWorker' in navigator)) return;
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (subscription) {
    btn.textContent = '🔕 Nonaktifkan Notifikasi';
    btn.dataset.active = 'true';
    btn.classList.add('active');
  } else {
    btn.textContent = '🔔 Aktifkan Notifikasi';
    btn.dataset.active = 'false';
    btn.classList.remove('active');
  }
}

window.saveStory = async (story) => {
  await saveStory(story);
  alert('Cerita disimpan untuk offline!');
};

// PWA: Register service worker (VitePWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    registerSW({ immediate: true });
  });
}
