// Presenter untuk daftar cerita

export function showStories(main, { getStories, archiveStory, getArchivedStories, storyListView }) {
  main.innerHTML = '<p>Memuat cerita...</p>';
  (async () => {
    try {
      let stories = await getStories();
      const archived = getArchivedStories();
      stories = stories.filter(story => !archived.includes(story.id));
      main.innerHTML = '';
      main.appendChild(storyListView(stories, {
        onArchive: async (id) => {
          archiveStory(id);
          showStories(main, { getStories, archiveStory, getArchivedStories, storyListView });
        }
      }));
    } catch (e) {
      main.innerHTML = '<p>Gagal memuat cerita.</p>';
    }
  })();
}
