// Presenter untuk login

export function showLogin(main, { login, loginView }) {
  main.innerHTML = '';
  main.appendChild(loginView({
    onSubmit: async (data) => {
      try {
        await login(data); // token sudah disimpan di model
        alert('Login berhasil!');
        // Tampilkan tombol skip-link setelah login
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
          skipLink.style.display = 'inline-block';
        }
        location.hash = '/stories';
      } catch (e) {
        alert('Login gagal: ' + e.message);
      }
    }
  }));
}
