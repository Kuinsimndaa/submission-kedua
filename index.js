// Entry point untuk SPA berbagi cerita
// (Pindahkan ke src/index.js untuk Vite)
import './style.css';
import { initRouter } from './src/router.js';

window.addEventListener('DOMContentLoaded', () => {
  initRouter();
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
});
