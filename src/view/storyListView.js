// View daftar cerita dengan peta dan marker
export function storyListView(stories, { onArchive, offline, onDelete } = {}) {
  const section = document.createElement('section');
  section.className = 'story-list';
  section.setAttribute('aria-label', 'Daftar Cerita');

  stories.forEach(story => {
    const card = document.createElement('article');
    card.className = 'story-card';
    card.innerHTML = `
      <img src="${story.photoUrl}" alt="Foto cerita oleh ${story.name || ''}" loading="lazy">
      <h2><i class="fa-solid fa-user"></i> ${story.name || ''}</h2>
      <p>${story.description}</p>
      <p><i class="fa-solid fa-calendar"></i> <strong>Tanggal:</strong> ${story.createdAt ? new Date(story.createdAt).toLocaleString() : ''}</p>
      <div><i class="fa-solid fa-map-marker-alt"></i> Lokasi:</div>
      <div class="story-map" id="map-${story.id}" style="height:220px;"></div>
      ${onArchive ? '<button class="archive-btn" aria-label="Arsipkan cerita" style="margin-top:8px"><i class="fa-solid fa-box-archive"></i> Arsipkan</button>' : ''}
      ${offline ? '<button class="delete-btn" aria-label="Hapus cerita offline" style="margin-top:8px"><i class="fa-solid fa-trash"></i> Hapus</button>' : '<button class="save-btn" aria-label="Simpan offline" style="margin-top:8px"><i class="fa-solid fa-download"></i> Simpan Offline</button>'}
    `;
    section.appendChild(card);
    setTimeout(() => renderMap(`map-${story.id}`, story.lat, story.lon, story.name, story.description), 0);
    if (onArchive) {
      card.querySelector('.archive-btn').onclick = () => {
        if (confirm('Arsipkan cerita ini? Cerita akan disembunyikan dari daftar.')) {
          onArchive(story.id);
        }
      };
    }
    if (offline && onDelete) {
      card.querySelector('.delete-btn').onclick = () => onDelete(story.id);
    }
    if (!offline && window.saveStory) {
      card.querySelector('.save-btn').onclick = () => window.saveStory(story);
    }
  });
  return section;
}

function renderMap(id, lat, lon, name, desc) {
  if (!lat || !lon) return;
  // Dua tile layer: OSM & MapTiler
  const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OSM' });
  const maptiler = L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=GetYourOwnKey', { maxZoom: 19, attribution: '© MapTiler' });
  const map = L.map(id, { zoomControl: false, attributionControl: false, layers: [osm] }).setView([lat, lon], 13);
  const baseMaps = { 'OpenStreetMap': osm, 'MapTiler': maptiler };
  L.control.layers(baseMaps).addTo(map);
  const marker = L.marker([lat, lon]).addTo(map);
  marker.bindPopup(`<b>${name}</b><br>${desc}`);
  setTimeout(() => map.invalidateSize(), 200); // Pastikan map tampil penuh
}
