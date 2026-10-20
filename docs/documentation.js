const stableDownload = fetch('downloads.json', { cache: 'no-cache' }).then(response => {
  if (!response.ok) throw new Error('Downloads unavailable');
  return response.json();
}).then(data => data.releases.find(release => release.channel === 'stable' && /^downloads\/minerite-companion-[0-9A-Za-z.+-]+\.jar$/.test(release.url))).catch(() => null);
const guideNav = document.querySelector('#guide-nav');
const guideContent = document.querySelector('#guide-content');
const guideSearch = document.querySelector('#guide-search');
const viewer = document.querySelector('#image-viewer');
const docState = { guides: [], query: '' };
const normalizeGuide = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
function element(tag, cls, text) { const node = document.createElement(tag); if (cls) node.className = cls; if (text) node.textContent = text; return node; }
function activeGuide() { try { return decodeURIComponent(location.hash.slice(1)) || 'installation'; } catch { return 'installation'; } }
function openImage(src, caption) { viewer.querySelector('img').src = src; viewer.querySelector('img').alt = caption; document.querySelector('#image-caption').textContent = caption; viewer.showModal(); }
document.querySelectorAll('[data-image]').forEach(button => button.addEventListener('click', () => openImage(button.dataset.image, button.dataset.caption)));
viewer.querySelector('button').addEventListener('click', () => viewer.close());
viewer.addEventListener('click', event => { if (event.target === viewer) { const bounds = viewer.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) viewer.close(); } });
function drawNavigation() {
  const tokens = normalizeGuide(docState.query).trim().split(/\s+/);
  const matches = docState.guides.filter(guide => tokens.every(token => normalizeGuide(JSON.stringify(guide)).includes(token)));
  guideNav.replaceChildren(); let previous = '';
  for (const guide of matches) { if (previous !== guide.category) { guideNav.append(element('p', 'nav-group', guide.category)); previous = guide.category; } const link = element('a', 'guide-link', guide.title); link.href = `#${guide.id}`; if (guide.id === activeGuide()) link.setAttribute('aria-current', 'page'); guideNav.append(link); }
  document.querySelector('#guide-count').textContent = `${matches.length} guide${matches.length === 1 ? '' : 's'} disponible${matches.length === 1 ? '' : 's'}`;
  if (!matches.length) guideNav.append(element('p', 'empty', 'Aucun résultat. Essayez un autre mot.'));
}
function renderGuide() {
  drawNavigation(); const guide = docState.guides.find(item => item.id === activeGuide()); guideContent.replaceChildren();
  if (!guide) { guideContent.append(element('h2', '', 'Ce guide est introuvable.'), element('p', 'guide-lead', 'Choisissez une rubrique dans la navigation.')); return; }
  document.title = `${guide.title} · Documentation Minerite Companion`;
  guideContent.append(element('p', 'guide-kicker', `${guide.category} · Version 1.42.0`), element('h2', '', guide.title), element('p', 'guide-lead', guide.summary));
  if (guide.id === 'installation') { const download = element('a', 'start-link', 'Télécharger la dernière version stable →'); download.href = 'downloads.html'; guideContent.append(download); stableDownload.then(release => { if (release) { download.href = release.url; download.download = release.filename; download.setAttribute('aria-label', `Télécharger la dernière version stable : ${release.version}`); } }); }
  const gallery = element('div', 'guide-gallery');
  for (const capture of guide.images) { const figure = element('figure', 'guide-figure'); const button = element('button'); button.type = 'button'; button.setAttribute('aria-label', `Agrandir : ${capture.caption}`); const img = element('img'); img.src = `images/${capture.file}.webp`; img.alt = capture.caption; img.width = 1920; img.height = 1080; img.loading = 'lazy'; img.decoding = 'async'; button.append(img); button.addEventListener('click', () => openImage(img.src, capture.caption)); figure.append(button, element('figcaption', '', `${capture.caption} · Capture en jeu, version 1.42.0. Cliquez pour agrandir.`)); gallery.append(figure); }
  if (guide.images.length) guideContent.append(gallery);
  guideContent.append(element('h3', '', 'Pas à pas')); const steps = element('ol', 'guide-steps'); for (const step of guide.steps) steps.append(element('li', '', step)); guideContent.append(steps, element('h3', '', 'Ce que vous pouvez régler et consulter'));
  for (const detail of guide.details) guideContent.append(element('p', 'guide-detail', detail));
  guideContent.append(element('aside', 'guide-note', 'Les captures montrent une configuration réelle. Les couleurs, les positions et les touches peuvent différer selon vos réglages. Les informations propres au serveur dépendent des données reçues par votre client.'));
  const pager = element('nav', 'guide-pager'); pager.setAttribute('aria-label', 'Continuer la lecture'); const index = docState.guides.indexOf(guide); for (const offset of [-1, 1]) { const next = docState.guides[index + offset]; if (next) { const link = element('a', '', offset < 0 ? `← ${next.title}` : `${next.title} →`); link.href = `#${next.id}`; pager.append(link); } } guideContent.append(pager);
}
guideSearch.addEventListener('input', () => { docState.query = guideSearch.value; drawNavigation(); });
window.addEventListener('hashchange', () => { if (location.hash === '#guide-content') return; renderGuide(); guideContent.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); guideContent.focus({ preventScroll: true }); });
fetch('guide.json', { cache: 'no-cache' }).then(response => { if (!response.ok) throw new Error('Unavailable'); return response.json(); }).then(data => { docState.guides = data.guides; renderGuide(); }).catch(() => { guideContent.replaceChildren(element('h2', '', 'Documentation indisponible'), element('p', 'guide-lead', 'Rechargez la page ou consultez FEATURES.md dans le dépôt GitHub.')); });
