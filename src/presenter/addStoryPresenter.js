// Presenter untuk tambah cerita

export function showAddStory(main, { addStory, addStoryView }) {
  main.innerHTML = '';
  main.appendChild(addStoryView({
    onSubmit: async (data) => {
      try {
        await addStory(data);
        // Tampilkan notifikasi jika izin sudah diberikan
        if (window.Notification && Notification.permission === 'granted') {
          new Notification('Cerita baru berhasil disimpan!', {
            body: 'Cerita Anda sudah masuk ke daftar.',
            icon: '/icons/icon-192.png'
          });
        }
        // Kirim push notification ke user sendiri via server lokal (agar notifikasi muncul walau web ditutup)
        try {
          await fetch('http://localhost:3000/push', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              title: 'Cerita baru berhasil disimpan!',
              body: 'Cerita Anda sudah masuk ke daftar.',
              url: '/stories'
            })
          });
        } catch (err) {
          // Optional: log error push
        }
        location.hash = '/stories';
      } catch (e) {
        if (e.message && e.message.toLowerCase().includes('unauthorized')) {
          alert('Sesi login Anda habis atau tidak valid. Silakan login ulang.');
          location.hash = '/login';
        } else {
          alert('Gagal menambah cerita. ' + (e.message || ''));
        }
      }
    }
  }));
}
