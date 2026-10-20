const state = { releases: [], downloads: [], channel: 'all', query: '', version: decodeURIComponent(location.hash.slice(1)) };
const list = document.querySelector('#versions');
const article = document.querySelector('#release');
const date = value => new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T12:00:00Z`));
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
function node(tag, cls, text) { const item = document.createElement(tag); if (cls) item.className = cls; if (text) item.textContent = text; return item; }
function badge(release) { return node('span', `badge ${release.channel === 'beta' ? 'beta' : ''}`, release.channel === 'beta' ? 'Bêta' : 'Stable'); }
function render() {
  const releases = state.releases.filter(release => (state.channel === 'all' || release.channel === state.channel) && normalize(JSON.stringify(release)).includes(normalize(state.query)));
  document.querySelector('#count').textContent = `${releases.length} version${releases.length === 1 ? '' : 's'}`;
  document.querySelectorAll('[data-channel]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.channel === state.channel)));
  if (!releases.some(release => release.version === state.version)) state.version = releases[0]?.version ?? '';
  list.replaceChildren();
  for (const release of releases) {
    const button = node('button', 'version'); button.type = 'button'; button.setAttribute('aria-current', String(release.version === state.version));
    const top = node('span', 'version-top'); top.append(node('span', '', release.version), badge(release));
    button.append(top, node('span', 'version-date', date(release.date))); button.addEventListener('click', () => { state.version = release.version; history.replaceState(null, '', `#${encodeURIComponent(release.version)}`); render(); }); list.append(button);
  }
  if (!releases.length) list.append(node('p', 'empty', state.channel === 'stable' ? 'Aucune version stable publiée pour le moment.' : 'Aucune version ne correspond à cette recherche.'));
  article.replaceChildren(); const release = releases.find(release => release.version === state.version);
  if (!release) { article.append(node('p', 'empty', state.channel === 'stable' ? 'Les versions stables apparaîtront ici dès leur publication. Les versions de test restent disponibles dans l’onglet Bêtas.' : 'Choisissez une autre catégorie ou modifiez votre recherche.')); return; }
  const meta = node('div', 'release-meta'); meta.append(node('span', 'version-number', `Version ${release.version}`), badge(release), node('time', '', date(release.date))); meta.lastChild.dateTime = release.date;
  article.append(meta, node('h2', '', release.title), node('p', 'release-summary', release.summary));
  const actions = node('div', 'release-actions');
  const file = state.downloads.find(file => file.version === release.version);
  if (file) {
    const download = node('a', 'start-link', `Télécharger la version ${release.version} ↓`);
    download.href = file.url; download.download = file.filename; actions.append(download);
  }
  const copy = node('button', 'copy-link', 'Copier le lien'); copy.type = 'button'; copy.addEventListener('click', async () => { try { await navigator.clipboard.writeText(`${location.origin}${location.pathname}#${encodeURIComponent(release.version)}`); copy.textContent = 'Lien copié ✓'; } catch { copy.textContent = 'Copiez l’adresse de cette page'; } setTimeout(() => { copy.textContent = 'Copier le lien'; }, 2200); }); actions.append(copy); article.append(actions);
  const sections = node('div', 'release-sections');
  for (const section of release.sections) { const part = node('section', 'note-section'); part.append(node('h3', '', section.title)); const items = node('ul'); for (const item of section.items) items.append(node('li', '', item)); part.append(items); sections.append(part); }
  article.append(sections); const footer = node('p', 'release-footer'); footer.append(node('strong', '', release.channel === 'beta' ? 'Version de test. ' : 'Version stable. '), document.createTextNode(release.channel === 'beta' ? 'Pour recevoir aussi les prochaines bêtas dans le client, activez le Mode développeur. Chaque téléchargement demande votre accord.' : 'Cette version est proposée à tous les utilisateurs. L’installation s’effectue après la fermeture du jeu, avec votre accord.')); article.append(footer);
}
document.querySelectorAll('[data-channel]').forEach(button => button.addEventListener('click', () => { state.channel = button.dataset.channel; render(); }));
document.querySelector('#search').addEventListener('input', event => { state.query = event.target.value; render(); });
window.addEventListener('hashchange', () => { state.version = decodeURIComponent(location.hash.slice(1)); render(); });
fetch('patch-notes.json', { cache: 'no-cache' }).then(response => { if (!response.ok) throw new Error('Unavailable'); return response.json(); }).then(data => { state.releases = data.releases; render(); }).catch(() => { article.replaceChildren(node('p', 'empty', 'Le journal est momentanément indisponible. Vous pouvez consulter les notes dans les versions GitHub.')); });

fetch('downloads.json', { cache: 'no-cache' }).then(response => {
  if (!response.ok) throw new Error('Downloads unavailable');
  return response.json();
}).then(data => {
  state.downloads = data.releases.filter(release => /^downloads\/minerite-companion-[0-9A-Za-z.+-]+\.jar$/.test(release.url));
  if (state.releases.length) render();
}).catch(() => {
  const message = node('p', 'empty', 'Les liens de téléchargement sont momentanément indisponibles. Rechargez la page pour réessayer.');
  article.after(message);
});
