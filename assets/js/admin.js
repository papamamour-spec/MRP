/* ============================================================
   admin.js - Backoffice MRC
   Authentification simple (mot de passe haché localement),
   gestion des actualités, des médias (logo, photos) et
   export/import JSON pour synchroniser avec le dépôt.
   ============================================================ */

const STORAGE_KEY = 'mrc_site_data';
const AUTH_KEY = 'mrc_admin_auth';
const PASS_KEY = 'mrc_admin_pass_hash';
const SESSION_KEY = 'mrc_admin_session';
const DATA_URL = '../data/site.json';

const DEFAULT_DATA = {
  version: 1,
  updatedAt: null,
  media: { logo: null, candidatePhoto: null, heroBg: null },
  news: []
};

// ---------- Utilitaires ----------
async function sha256(text) {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function uid() { return 'n-' + Math.random().toString(36).slice(2, 9); }

function $(sel, root = document) { return root.querySelector(sel); }
function $$(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

function toast(msg, ok = true) {
  const t = $('#toast');
  t.textContent = msg;
  t.className = 'toast ' + (ok ? 'ok' : 'err') + ' show';
  setTimeout(() => t.classList.remove('show'), 3000);
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    if (file.size > 2 * 1024 * 1024) {
      return reject(new Error('Image trop volumineuse (max 2 Mo).'));
    }
    const r = new FileReader();
    r.onload = e => resolve(e.target.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

// ---------- Données ----------
async function loadData() {
  const local = localStorage.getItem(STORAGE_KEY);
  if (local) {
    try { return JSON.parse(local); } catch (e) { /* */ }
  }
  try {
    const res = await fetch(DATA_URL, { cache: 'no-store' });
    if (res.ok) return await res.json();
  } catch (e) { /* */ }
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

function saveData(data) {
  data.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ---------- Authentification ----------
async function setupOrLogin() {
  const hash = localStorage.getItem(PASS_KEY);
  if (!hash) {
    $('#auth-title').textContent = 'Première utilisation';
    $('#auth-sub').textContent = 'Définissez le mot de passe administrateur. Conservez-le précieusement.';
    $('#auth-submit').textContent = 'Définir le mot de passe';
    $('#auth-confirm-row').style.display = 'block';
  } else {
    $('#auth-title').textContent = 'Espace d\'administration';
    $('#auth-sub').textContent = 'Entrez votre mot de passe pour accéder au backoffice.';
    $('#auth-submit').textContent = 'Se connecter';
    $('#auth-confirm-row').style.display = 'none';
  }
}

async function handleAuth(e) {
  e.preventDefault();
  const pwd = $('#auth-password').value;
  const conf = $('#auth-confirm').value;
  const stored = localStorage.getItem(PASS_KEY);

  if (!stored) {
    if (pwd.length < 6) return toast('Mot de passe trop court (6 caractères minimum).', false);
    if (pwd !== conf) return toast('Les deux mots de passe ne correspondent pas.', false);
    const h = await sha256(pwd);
    localStorage.setItem(PASS_KEY, h);
    sessionStorage.setItem(SESSION_KEY, '1');
    toast('Mot de passe défini. Bienvenue.');
    showAdmin();
  } else {
    const h = await sha256(pwd);
    if (h !== stored) return toast('Mot de passe incorrect.', false);
    sessionStorage.setItem(SESSION_KEY, '1');
    showAdmin();
  }
}

function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  $('#auth-section').style.display = 'flex';
  $('#admin-section').style.display = 'none';
  $('#auth-password').value = '';
  $('#auth-confirm').value = '';
}

// ---------- Affichage admin ----------
let state = null;

async function showAdmin() {
  $('#auth-section').style.display = 'none';
  $('#admin-section').style.display = 'block';
  state = await loadData();
  renderAll();
}

function renderAll() {
  renderMedia();
  renderNewsList();
  renderMeta();
}

function renderMeta() {
  $('#updated-at').textContent = state.updatedAt
    ? new Date(state.updatedAt).toLocaleString('fr-FR')
    : '- (non sauvegardé)';
  $('#news-count').textContent = (state.news || []).length;
}

// ---------- Médias ----------
function renderMedia() {
  const logo = state.media?.logo;
  const cand = state.media?.candidatePhoto;
  const hero = state.media?.heroBg;
  $('#logo-preview').src = logo || '../assets/img/logo.svg';
  $('#candidate-preview').src = cand || '../assets/img/logo.svg';
  $('#hero-preview').src = hero || '../assets/img/hero-bg.svg';
  $('#logo-reset').disabled = !logo;
  $('#candidate-reset').disabled = !cand;
  $('#hero-reset').disabled = !hero;
}

async function handleMediaUpload(field, input) {
  try {
    const file = input.files[0];
    if (!file) return;
    const dataUrl = await readFileAsDataURL(file);
    state.media[field] = dataUrl;
    saveData(state);
    renderMedia();
    toast('Image mise à jour.');
    input.value = '';
  } catch (err) {
    toast(err.message || 'Erreur lors de l\'import.', false);
  }
}

function resetMedia(field) {
  state.media[field] = null;
  saveData(state);
  renderMedia();
  toast('Image réinitialisée.');
}

// ---------- Actualités ----------
function renderNewsList() {
  const list = $('#news-list');
  const news = state.news || [];
  renderMeta();

  if (news.length === 0) {
    list.innerHTML = '<p class="empty">Aucune actualité. Cliquez sur « Ajouter une actualité ».</p>';
    return;
  }

  const sorted = [...news].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  list.innerHTML = sorted.map(n => `
    <div class="news-item">
      ${n.image ? `<img src="${n.image}" alt="">` : '<div class="news-thumb-empty">Aucune image</div>'}
      <div class="news-meta">
        <span class="badge">${escapeHtml(n.category || 'Actualité')}</span>
        <strong>${escapeHtml(n.title || '(sans titre)')}</strong>
        <span class="date">${escapeHtml(n.date || '')}</span>
        <p>${escapeHtml(n.excerpt || '')}</p>
      </div>
      <div class="news-actions">
        <button class="btn-mini" data-edit="${n.id}">Modifier</button>
        <button class="btn-mini danger" data-del="${n.id}">Supprimer</button>
      </div>
    </div>
  `).join('');

  $$('[data-edit]', list).forEach(b => b.addEventListener('click', () => openNewsModal(b.dataset.edit)));
  $$('[data-del]', list).forEach(b => b.addEventListener('click', () => deleteNews(b.dataset.del)));
}

function openNewsModal(id) {
  const modal = $('#news-modal');
  const form = $('#news-form');
  form.reset();
  $('#news-image-preview').src = '';
  $('#news-image-preview').style.display = 'none';
  $('#news-image-current').value = '';

  if (id) {
    const item = state.news.find(n => n.id === id);
    if (!item) return;
    $('#news-id').value = item.id;
    $('#news-title').value = item.title || '';
    $('#news-date').value = item.date || '';
    $('#news-category').value = item.category || 'Annonce officielle';
    $('#news-excerpt').value = item.excerpt || '';
    $('#news-content').value = item.content || '';
    if (item.image) {
      $('#news-image-preview').src = item.image;
      $('#news-image-preview').style.display = 'block';
      $('#news-image-current').value = item.image;
    }
    $('#news-modal-title').textContent = 'Modifier l\'actualité';
  } else {
    $('#news-id').value = '';
    $('#news-date').value = new Date().toISOString().slice(0, 10);
    $('#news-modal-title').textContent = 'Nouvelle actualité';
  }
  modal.classList.add('open');
}

function closeNewsModal() { $('#news-modal').classList.remove('open'); }

async function saveNews(e) {
  e.preventDefault();
  const id = $('#news-id').value || uid();
  let image = $('#news-image-current').value || null;
  const file = $('#news-image').files[0];
  if (file) {
    try { image = await readFileAsDataURL(file); }
    catch (err) { return toast(err.message, false); }
  }

  const item = {
    id,
    date: $('#news-date').value,
    category: $('#news-category').value,
    title: $('#news-title').value.trim(),
    excerpt: $('#news-excerpt').value.trim(),
    content: $('#news-content').value.trim(),
    image
  };

  if (!item.title || !item.date) return toast('Titre et date requis.', false);

  const idx = state.news.findIndex(n => n.id === id);
  if (idx >= 0) state.news[idx] = item; else state.news.push(item);
  saveData(state);
  renderNewsList();
  closeNewsModal();
  toast('Actualité enregistrée.');
}

function deleteNews(id) {
  if (!confirm('Supprimer cette actualité ?')) return;
  state.news = state.news.filter(n => n.id !== id);
  saveData(state);
  renderNewsList();
  toast('Actualité supprimée.');
}

// ---------- Export / Import ----------
function exportJSON() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'site.json';
  a.click();
  URL.revokeObjectURL(url);
  toast('Fichier site.json téléchargé. Déposez-le dans data/ et committez.');
}

async function importJSON(file) {
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    if (!data || typeof data !== 'object') throw new Error('Fichier invalide.');
    state = Object.assign({}, DEFAULT_DATA, data);
    saveData(state);
    renderAll();
    toast('Données importées avec succès.');
  } catch (err) {
    toast('Import impossible : ' + err.message, false);
  }
}

function clearLocal() {
  if (!confirm('Effacer toutes les modifications locales et recharger les données publiées ?')) return;
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}

function changePassword() {
  const old = prompt('Mot de passe actuel :');
  if (old === null) return;
  (async () => {
    const stored = localStorage.getItem(PASS_KEY);
    const h = await sha256(old);
    if (h !== stored) return toast('Mot de passe actuel incorrect.', false);
    const np = prompt('Nouveau mot de passe (6 caractères min.) :');
    if (!np || np.length < 6) return toast('Mot de passe trop court.', false);
    const conf = prompt('Confirmer le nouveau mot de passe :');
    if (np !== conf) return toast('Les mots de passe ne correspondent pas.', false);
    localStorage.setItem(PASS_KEY, await sha256(np));
    toast('Mot de passe modifié.');
  })();
}

// ---------- Onglets ----------
function switchTab(name) {
  $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
  $$('.tab-panel').forEach(p => p.classList.toggle('active', p.id === 'tab-' + name));
}

// ---------- Échappement ----------
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
}

// ---------- Initialisation ----------
document.addEventListener('DOMContentLoaded', () => {
  setupOrLogin();
  if (sessionStorage.getItem(SESSION_KEY)) showAdmin();

  $('#auth-form').addEventListener('submit', handleAuth);
  $('#logout').addEventListener('click', logout);
  $('#change-pass').addEventListener('click', changePassword);

  $$('.tab').forEach(t => t.addEventListener('click', () => switchTab(t.dataset.tab)));

  $('#logo-input').addEventListener('change', e => handleMediaUpload('logo', e.target));
  $('#candidate-input').addEventListener('change', e => handleMediaUpload('candidatePhoto', e.target));
  $('#hero-input').addEventListener('change', e => handleMediaUpload('heroBg', e.target));
  $('#logo-reset').addEventListener('click', () => resetMedia('logo'));
  $('#candidate-reset').addEventListener('click', () => resetMedia('candidatePhoto'));
  $('#hero-reset').addEventListener('click', () => resetMedia('heroBg'));

  $('#add-news').addEventListener('click', () => openNewsModal());
  $('#news-form').addEventListener('submit', saveNews);
  $('#news-cancel').addEventListener('click', closeNewsModal);
  $('#news-modal').addEventListener('click', e => { if (e.target.id === 'news-modal') closeNewsModal(); });

  $('#news-image').addEventListener('change', async e => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const url = await readFileAsDataURL(file);
      $('#news-image-preview').src = url;
      $('#news-image-preview').style.display = 'block';
    } catch (err) { toast(err.message, false); }
  });

  $('#export-json').addEventListener('click', exportJSON);
  $('#import-input').addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) importJSON(file);
    e.target.value = '';
  });
  $('#clear-local').addEventListener('click', clearLocal);
});
