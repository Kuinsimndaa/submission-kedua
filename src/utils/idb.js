// Utility IndexedDB sederhana untuk simpan/tampil/hapus data offline
export const IDB_NAME = 'cerita-app-db';
export const IDB_STORE = 'stories';

function getDB() {
  return new Promise((resolve, reject) => {
    const open = indexedDB.open(IDB_NAME, 1);
    open.onupgradeneeded = () => {
      open.result.createObjectStore(IDB_STORE, { keyPath: 'id' });
    };
    open.onsuccess = () => resolve(open.result);
    open.onerror = () => reject(open.error);
  });
}

export async function saveStory(story) {
  const db = await getDB();
  const tx = db.transaction(IDB_STORE, 'readwrite');
  tx.objectStore(IDB_STORE).put(story);
  return tx.complete || tx.done || new Promise(r => tx.oncomplete = r);
}

export async function getAllStories() {
  const db = await getDB();
  const tx = db.transaction(IDB_STORE, 'readonly');
  return new Promise((resolve, reject) => {
    const req = tx.objectStore(IDB_STORE).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteStory(id) {
  const db = await getDB();
  const tx = db.transaction(IDB_STORE, 'readwrite');
  tx.objectStore(IDB_STORE).delete(id);
  return tx.complete || tx.done || new Promise(r => tx.oncomplete = r);
}
