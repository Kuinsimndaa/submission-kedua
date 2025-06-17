// Model untuk Story API
const API_URL = 'https://story-api.dicoding.dev/v1/stories';
const LOGIN_URL = 'https://story-api.dicoding.dev/v1/login';
const REGISTER_URL = 'https://story-api.dicoding.dev/v1/register';

function getToken() {
  return localStorage.getItem('token') || '';
}

export async function getStories() {
  const res = await fetch(API_URL, {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  if (!res.ok) throw new Error('Gagal fetch');
  const data = await res.json();
  return data.listStory;
}

export async function addStory({ description, photo, lat, lon }) {
  const formData = new FormData();
  formData.append('description', description);
  formData.append('photo', photo);
  formData.append('lat', lat);
  formData.append('lon', lon);
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`
    },
    body: formData,
  });
  if (!res.ok) throw new Error('Gagal tambah cerita');
  return res.json();
}

export async function login({ email, password }) {
  const res = await fetch(LOGIN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login gagal');
  // Simpan token ke localStorage di sini (model)
  localStorage.setItem('token', data.loginResult.token);
  return data.loginResult.token;
}

export async function register({ name, email, password }) {
  const res = await fetch(REGISTER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registrasi gagal');
  return data;
}

export async function deleteStory(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  if (!res.ok) throw new Error('Gagal menghapus cerita');
  return res.json();
}

export async function archiveStory(id) {
  // Simulasi arsip: simpan id ke localStorage agar tidak ditampilkan
  const archived = JSON.parse(localStorage.getItem('archivedStories') || '[]');
  if (!archived.includes(id)) {
    archived.push(id);
    localStorage.setItem('archivedStories', JSON.stringify(archived));
  }
}

export function getArchivedStories() {
  return JSON.parse(localStorage.getItem('archivedStories') || '[]');
}
