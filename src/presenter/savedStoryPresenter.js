// Presenter untuk cerita tersimpan (offline/IndexedDB)
import { getAllStories, deleteStory } from '../utils/idb.js';
import { storyListView } from '../view/storyListView.js';

export function showSavedStories(main) {
  main.innerHTML = '<p>Memuat cerita tersimpan...</p>';
  (async () => {
    const stories = await getAllStories();
    main.innerHTML = '';
    if (!stories.length) {
      main.innerHTML = '<p>Tidak ada cerita tersimpan offline.</p>';
      return;
    }
    main.appendChild(storyListView(stories, {
      onDelete: async (id) => {
        if (confirm('Hapus cerita ini dari penyimpanan offline?')) {
          await deleteStory(id);
          showSavedStories(main);
        }
      },
      offline: true
    }));
  })();
}
