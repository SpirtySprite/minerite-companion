const downloads = document.querySelector('#downloads');
const older = document.querySelector('#older-downloads');
const game = document.querySelector('#minecraft-version');
const picker = document.querySelector('.version-picker');
const options = document.querySelector('#minecraft-options');
const selected = document.querySelector('#minecraft-selected');
const choices = [...options.querySelectorAll('[role="option"]')];
let version = '26.2';
let published = [];
function closePicker(restoreFocus = false) {
  options.hidden = true; game.setAttribute('aria-expanded', 'false');
  if (restoreFocus) game.focus();
}
function openPicker() {
  if (game.disabled) return;
  options.hidden = false; game.setAttribute('aria-expanded', 'true');
  (choices.find(choice => choice.dataset.version === version && !choice.disabled) || choices.find(choice => !choice.disabled))?.focus();
}
function selectVersion(value, updateUrl = false) {
  version = value; selected.textContent = 'Minecraft ' + version;
  for (const choice of choices) choice.setAttribute('aria-selected', String(choice.dataset.version === version));
  if (updateUrl) {
    const url = new URL(location.href); url.searchParams.set('minecraft', version); history.replaceState(null, '', url);
  }
  renderDownloads();
}
game.addEventListener('click', () => options.hidden ? openPicker() : closePicker());
game.addEventListener('keydown', event => {
  if (['ArrowDown', 'ArrowUp'].includes(event.key)) { event.preventDefault(); event.stopPropagation(); openPicker(); }
});
for (const choice of choices) choice.addEventListener('click', () => { selectVersion(choice.dataset.version, true); closePicker(true); });
picker.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !options.hidden) { event.preventDefault(); closePicker(true); }
  if (event.key === 'Tab' && !options.hidden) { game.focus(); closePicker(); }
  if (options.hidden || !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const enabled = choices.filter(choice => !choice.disabled);
  const index = enabled.indexOf(document.activeElement);
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? enabled.length - 1 : (index + (event.key === 'ArrowUp' ? -1 : 1) + enabled.length) % enabled.length;
  enabled[next]?.focus();
});
document.addEventListener('pointerdown', event => { if (!picker.contains(event.target)) closePicker(); });
picker.addEventListener('focusout', event => { if (!picker.contains(event.relatedTarget)) closePicker(); });
function element(tag, text, cls) { const node = document.createElement(tag); node.textContent = text; if (cls) node.className = cls; return node; }
function renderDownloads() {
  const releases = published.filter(release => (release.minecraft || '26.2') === version);
  downloads.replaceChildren(); older.replaceChildren();
  for (const channel of ['stable', 'beta']) {
    const release = releases.find(release => release.channel === channel); if (!release) continue;
    const card = element('section', '', 'download-card');
    card.append(element('span', channel === 'stable' ? 'RECOMMANDÉE' : 'PRÉVERSION', 'eyebrow'), element('h2', channel === 'stable' ? 'Version stable' : 'Version bêta'), element('p', release.version + ' · Minecraft ' + version, 'download-version'), element('p', channel === 'stable' ? 'La version conseillée pour jouer au quotidien.' : 'Pour tester les nouveautés avant leur sortie stable.', 'intro'));
    const link = element('a', 'Télécharger le JAR ↓', 'start-link'); link.href = release.url; link.download = release.filename; card.append(link);
    const notes = element('a', 'Lire les notes de version →', 'download-notes'); notes.href = './#' + encodeURIComponent(release.version); card.append(notes);
    if (version === '26.3') card.append(element('p', 'Cosmetica est proposé séparément sur 26.3 lorsqu’une version compatible est disponible.', 'intro'));
    const checksum = element('details', ''); checksum.append(element('summary', 'Vérifier le fichier · SHA-256'), element('code', release.sha256)); card.append(checksum); downloads.append(card);
  }
  for (const release of releases) {
    const li = element('li', ''); const link = element('a', release.version + ' · ' + (release.channel === 'stable' ? 'Stable' : 'Bêta') + ' · Minecraft ' + version);
    link.href = release.url; link.download = release.filename; li.append(link); older.append(li);
  }
  if (!releases.length) downloads.append(element('p', 'Aucune version publiée pour cette version de Minecraft.'));
}
fetch('downloads.json', { cache: 'no-cache' }).then(response => { if (!response.ok) throw Error(); return response.json(); }).then(data => {
  published = data.releases.filter(release => /^downloads\/minerite-companion-[0-9A-Za-z.+-]+\.jar$/.test(release.url) && /^[a-f0-9]{64}$/.test(release.sha256) && ['26.2', '26.3'].includes(release.minecraft || '26.2'));
  for (const choice of choices) { choice.disabled = !published.some(release => (release.minecraft || '26.2') === choice.dataset.version); choice.setAttribute('aria-disabled', String(choice.disabled)); }
  const requested = new URL(location.href).searchParams.get('minecraft');
  if (published.some(release => (release.minecraft || '26.2') === requested)) version = requested;
  if (!published.length) throw Error();
  if (!published.some(release => (release.minecraft || '26.2') === version)) version = published[0].minecraft || '26.2';
  game.disabled = false; selectVersion(version);
}).catch(() => downloads.replaceChildren(element('p', 'Téléchargements indisponibles pour le moment. Réessayez plus tard.')));
