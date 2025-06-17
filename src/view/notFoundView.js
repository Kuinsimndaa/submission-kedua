// View untuk halaman Not Found
export function notFoundView() {
  const section = document.createElement('section');
  section.innerHTML = `
    <h2 style="color:#e57373"><i class="fa-solid fa-triangle-exclamation"></i> Halaman Tidak Ditemukan</h2>
    <p>Maaf, halaman yang Anda tuju tidak tersedia.</p>
    <a href="#/stories" style="color:#1976d2;font-weight:bold">Kembali ke Beranda</a>
  `;
  return section;
}
