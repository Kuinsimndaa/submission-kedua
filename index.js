// Entry point untuk SPA berbagi cerita
// (Pindahkan ke src/index.js untuk Vite)
import './style.css';
import { initRouter } from './src/router.js';

window.addEventListener('DOMContentLoaded', () => {
  initRouter();
});
