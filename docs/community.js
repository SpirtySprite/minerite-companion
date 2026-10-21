const api = '/minerite-companion/api/addons';
const grid = document.querySelector('#addon-grid');
const status = document.querySelector('#catalogue-status');
const count = document.querySelector('#addon-count');
const search = document.querySelector('#addon-search');
const labels = { module: 'Module', hud: 'HUD', theme: 'Thème', layout: 'Disposition' };
let addons = [], category = 'all';
const normalize = value => String(value || '').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
function element(tag, cls, text) { const node = document.createElement(tag); if (cls) node.className = cls; if (text) node.textContent = text; return node; }
function safeFile(path) {
  try { const url = new URL(path, location.href); return url.origin === location.origin && (url.pathname.startsWith(api + '/files/') || url.pathname.startsWith(new URL('addons/', location.href).pathname)) ? url.href : null; } catch { return null; }
}
function icon(item) {
  const box = element('div', 'addon-icon', '{ }'); box.setAttribute('aria-hidden', 'true');
  const url = item.icon && safeFile(item.icon);
  if (url) { const img = document.createElement('img'); img.src = url; img.alt = ''; img.loading = 'lazy'; img.addEventListener('error', () => { box.textContent = '{ }'; }); box.replaceChildren(img); }
  return box;
}
function render() {
  grid.replaceChildren();
  const query = normalize(search.value.trim());
  const matches = addons.filter(item => (category === 'all' || category === item.category) && normalize(`${item.name} ${item.author} ${item.description}`).includes(query));
  count.textContent = `${matches.length} création${matches.length > 1 ? 's' : ''}`;
  if (!matches.length) {
    const empty = element('div', 'catalogue-empty');
    empty.append(element('h3', '', query || category !== 'all' ? 'Aucune création ne correspond.' : 'Les premières créations arrivent.'), element('p', '', query || category !== 'all' ? 'Essayez un autre mot ou une autre catégorie.' : 'Les projets approuvés apparaîtront ici. Vous pouvez déjà préparer et proposer le vôtre.'));
    const link = element('a', 'quiet-link', 'Proposer un projet →'); link.href = 'submit-addon'; empty.append(link); grid.append(empty); return;
  }
  for (const item of matches) {
    const card = element('article', 'addon-card'), top = element('div', 'addon-card-top');
    top.append(icon(item), element('span', 'badge', item.example ? 'EXEMPLE OFFICIEL' : labels[item.category] || 'Module'));
    const bottom = element('div', 'addon-card-bottom'); bottom.append(element('span', '', `${item.type === 'java' ? 'Java' : 'Lua'} · ${item.minecraft.join(' / ')}`));
    const button = element('button', '', 'Découvrir →'); button.type = 'button'; button.setAttribute('aria-label', `Découvrir ${item.name}`); button.addEventListener('click', () => location.assign('extension?id=' + encodeURIComponent(item.modId || item.id) + (item.type === 'lua' ? '&type=lua' : ''))); bottom.append(button);
    const summary = item.description.length > 180 ? item.description.slice(0, 177) + '…' : item.description;
    card.append(top, element('h3', '', item.name), element('p', 'addon-author', `Par ${item.author}`), element('p', '', summary), bottom); grid.append(card);
  }
}
for (const button of document.querySelectorAll('[data-category]')) button.addEventListener('click', () => { category = button.dataset.category; for (const other of document.querySelectorAll('[data-category]')) other.setAttribute('aria-pressed', String(other === button)); render(); });
search.addEventListener('input', render);
async function load() {
  let unavailable = false;
  const results = await Promise.allSettled([fetch(api + '/catalogue', { cache: 'no-store' }), fetch('addon-catalogue.json', { cache: 'no-cache' })]);
  for (let index = 0; index < results.length; index++) {
    try {
      const result = results[index]; if (result.status !== 'fulfilled' || !result.value.ok) throw Error('Unavailable');
      const data = await result.value.json(); if (data.schema !== 1 || !Array.isArray(data.addons)) throw Error('Invalid');
      if (index === 0) {
        const projects = [...data.addons]; let cursor = data.cursor;
        while (cursor) {
          const response = await fetch(api + '/catalogue?cursor=' + encodeURIComponent(cursor), { cache: 'no-store' });
          if (!response.ok) throw Error('Unavailable');
          const next = await response.json();
          if (next.schema !== 1 || !Array.isArray(next.addons) || next.cursor === cursor) throw Error('Invalid');
          projects.push(...next.addons); cursor = next.cursor;
        }
        const latest = new Map();
        for (const item of projects.sort((a, b) => String(b.approved).localeCompare(String(a.approved)))) {
          if (typeof item.name === 'string' && typeof item.description === 'string' && Array.isArray(item.minecraft) && item.type === 'java' && !latest.has(item.modId)) latest.set(item.modId, item);
        }
        addons.push(...latest.values());
      }
      else {
        const latest = new Map();
        for (const item of data.addons) if (item.manifest && !data.revoked?.[item.sha256] && !latest.has(item.manifest.id)) latest.set(item.manifest.id, item);
        for (const item of latest.values()) addons.push({ ...item.manifest, type: 'lua', example: true, category: 'module', download: item.file, sha256: item.sha256 });
      }
    } catch { if (index === 0) unavailable = true; }
  }
  status.textContent = unavailable ? 'Le catalogue communautaire est momentanément indisponible. Les projets de démonstration restent consultables.' : '';
  status.hidden = !unavailable;
  render();
}
load();
