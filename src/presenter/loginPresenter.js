// Presenter untuk login

export function showLogin(main, { login, loginView }) {
  main.innerHTML = '';
  main.appendChild(loginView({
    onSubmit: async (data) => {
      try {
        await login(data); // token sudah disimpan di model
        alert('Login berhasil!');
        location.hash = '/stories';
      } catch (e) {
        alert('Login gagal: ' + e.message);
      }
    }
  }));
}
