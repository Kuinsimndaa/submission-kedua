// Presenter untuk register

export function showRegister(main, { register, registerView }) {
  main.innerHTML = '';
  main.appendChild(registerView({
    onSubmit: async (data) => {
      try {
        await register(data);
        alert('Registrasi berhasil! Silakan login.');
        location.hash = '/login';
      } catch (e) {
        alert('Registrasi gagal: ' + e.message);
      }
    }
  }));
}
