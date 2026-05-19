/* ============================================================
   site-data.js - Chargement et application des contenus
   Charge les données depuis localStorage (modifs admin) ou
   data/site.json (contenu publié). Applique logo, photo et
   actualités sur toutes les pages.
   ============================================================ */

(function () {
  const STORAGE_KEY = 'mrc_site_data';
  const DATA_URL = 'data/site.json';

  async function loadData() {
    // Priorité : modifications locales (admin) > JSON publié
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      try { return JSON.parse(local); } catch (e) { /* ignore */ }
    }
    try {
      const res = await fetch(DATA_URL, { cache: 'no-store' });
      if (res.ok) return await res.json();
    } catch (e) { /* fichier optionnel */ }
    return null;
  }

  function applyMedia(media) {
    if (!media) return;

    if (media.logo) {
      document.querySelectorAll('img[data-media="logo"], .brand img, .hero-card img, .footer-brand img, .profile-photo img')
        .forEach(img => { img.src = media.logo; });
    }
    if (media.candidatePhoto) {
      document.querySelectorAll('img[data-media="candidate"]')
        .forEach(img => { img.src = media.candidatePhoto; });
    }
    if (media.heroBg) {
      const hero = document.querySelector('.hero');
      if (hero) {
        hero.style.backgroundImage =
          `linear-gradient(135deg, rgba(10,77,140,.92) 0%, rgba(30,138,60,.88) 100%), url('${media.heroBg}')`;
      }
    }
  }

  function formatDate(iso) {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch (e) { return iso; }
  }

  function categoryStyle(cat) {
    const c = (cat || '').toLowerCase();
    if (c.includes('annonce')) return 'background:rgba(30,138,60,.1);color:var(--vert-fonce);border-color:rgba(30,138,60,.3);';
    if (c.includes('terrain')) return 'background:rgba(252,209,22,.18);color:#7a5c00;border-color:rgba(252,209,22,.4);';
    if (c.includes('initiative')) return 'background:rgba(207,32,39,.1);color:var(--rouge);border-color:rgba(207,32,39,.3);';
    return 'background:rgba(10,77,140,.1);color:var(--bleu);border-color:rgba(10,77,140,.3);';
  }

  function renderNews(news) {
    const container = document.querySelector('[data-news-list]');
    if (!container || !Array.isArray(news)) return;

    if (news.length === 0) {
      container.innerHTML = '<p style="text-align:center;color:var(--gris);grid-column:1/-1;">Aucune actualité publiée pour le moment.</p>';
      return;
    }

    const sorted = [...news].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    container.innerHTML = sorted.map(item => `
      <article class="pillar">
        ${item.image ? `<img src="${item.image}" alt="" style="width:100%;height:160px;object-fit:cover;border-radius:10px;margin-bottom:.75rem;">` : ''}
        <span class="hero-badge" style="${categoryStyle(item.category)}">${item.category || 'Actualité'}</span>
        <h3 style="margin-top:.8rem;">${escapeHtml(item.title || '')}</h3>
        <p style="color:var(--gris);font-size:.85rem;margin-bottom:.4rem;">${formatDate(item.date)}</p>
        <p>${escapeHtml(item.excerpt || '')}</p>
      </article>
    `).join('');
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c =>
      ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  }

  document.addEventListener('DOMContentLoaded', async () => {
    const data = await loadData();
    if (!data) return;
    applyMedia(data.media);
    renderNews(data.news);
  });
})();
