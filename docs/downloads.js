const downloads = document.querySelector('#downloads');
const older = document.querySelector('#older-downloads');
const game = document.querySelector('#minecraft-version');
let published = [];
function element(tag, text, cls) { const node = document.createElement(tag); node.textContent = text; if (cls) node.className = cls; return node; }
function renderDownloads() {
  const releases = published.filter(release => (release.minecraft || '26.2') === game.value);
  downloads.replaceChildren(); older.replaceChildren();
  for (const channel of ['stable', 'beta']) {
    const release = releases.find(release => release.channel === channel); if (!release) continue;
    const card = element('section', '', 'download-card');
    card.append(element('span', channel === 'stable' ? 'RECOMMANDÉE' : 'PRÉVERSION', 'eyebrow'), element('h2', channel === 'stable' ? 'Version stable' : 'Version bêta'), element('p', release.version + ' · Minecraft ' + game.value, 'download-version'), element('p', channel === 'stable' ? 'La version conseillée pour jouer au quotidien.' : 'Pour tester les nouveautés avant leur sortie stable.', 'intro'));
    const link = element('a', 'Télécharger le JAR ↓', 'start-link'); link.href = release.url; link.download = release.filename; card.append(link);
    const notes = element('a', 'Lire les notes de version →', 'download-notes'); notes.href = 'index.html#' + encodeURIComponent(release.version); card.append(notes);
    if (game.value === '26.3') card.append(element('p', 'Cosmetica est proposé séparément sur 26.3 lorsqu’une version compatible est disponible.', 'intro'));
    const checksum = element('details', ''); checksum.append(element('summary', 'Vérifier le fichier · SHA-256'), element('code', release.sha256)); card.append(checksum); downloads.append(card);
  }
  for (const release of releases) {
    const li = element('li', ''); const link = element('a', release.version + ' · ' + (release.channel === 'stable' ? 'Stable' : 'Bêta') + ' · Minecraft ' + game.value);
    link.href = release.url; link.download = release.filename; li.append(link); older.append(li);
  }
  if (!releases.length) downloads.append(element('p', 'Aucune version publiée pour cette version de Minecraft.'));
}
game.addEventListener('change', () => { const url = new URL(location.href); url.searchParams.set('minecraft', game.value); history.replaceState(null, '', url); renderDownloads(); });
fetch('downloads.json', { cache: 'no-cache' }).then(response => { if (!response.ok) throw Error(); return response.json(); }).then(data => {
  published = data.releases.filter(release => /^downloads\/minerite-companion-[0-9A-Za-z.+-]+\.jar$/.test(release.url) && /^[a-f0-9]{64}$/.test(release.sha256) && ['26.2', '26.3'].includes(release.minecraft || '26.2'));
  for (const option of game.options) option.disabled = !published.some(release => (release.minecraft || '26.2') === option.value);
  const requested = new URL(location.href).searchParams.get('minecraft');
  if (published.some(release => (release.minecraft || '26.2') === requested)) game.value = requested;
  if (!published.length) throw Error(); renderDownloads();
}).catch(() => downloads.replaceChildren(element('p', 'Téléchargements indisponibles pour le moment. Réessayez plus tard.')));
