// Routing SPA berbasis hash dan View Transition API
import { showStories } from './presenter/storyPresenter.js';
import { showAddStory } from './presenter/addStoryPresenter.js';
import { showLogin } from './presenter/loginPresenter.js';
import { showRegister } from './presenter/registerPresenter.js';
import { showSavedStories } from './presenter/savedStoryPresenter.js';
import * as model from './model/storyModel.js';
import * as view from './view/storyListView.js';
import { addStoryView } from './view/addStoryView.js';
import { loginView } from './view/loginView.js';
import { registerView } from './view/registerView.js';
import { notFoundView } from './view/notFoundView.js';

const routes = {
  '/stories': (main) => showStories(main, {
    getStories: model.getStories,
    archiveStory: model.archiveStory,
    getArchivedStories: model.getArchivedStories,
    storyListView: view.storyListView
  }),
  '/add': (main) => showAddStory(main, {
    addStory: model.addStory,
    addStoryView
  }),
  '/login': (main) => showLogin(main, {
    login: model.login,
    loginView
  }),
  '/register': (main) => showRegister(main, {
    register: model.register,
    registerView
  }),
  '/saved': (main) => showSavedStories(main),
};

export function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

function handleRoute() {
  const hash = location.hash.replace('#', '') || '/stories';
  const main = document.getElementById('main-content');
  if (document.startViewTransition) {
    document.startViewTransition(() => renderRoute(hash, main));
  } else {
    // Fallback: custom fade animation
    main.animate([
      { opacity: 1 },
      { opacity: 0 }
    ], { duration: 150 });
    setTimeout(() => {
      renderRoute(hash, main);
      main.animate([
        { opacity: 0 },
        { opacity: 1 }
      ], { duration: 200 });
    }, 150);
  }
}

function renderRoute(hash, main) {
  const route = routes[hash];
  if (route) {
    route(main);
  } else {
    main.innerHTML = '';
    main.appendChild(notFoundView());
  }
}
