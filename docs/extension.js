import { api, node, date, notice } from './portal-api.js';
const params = new URLSearchParams(location.search), status = document.querySelector('#extension-status'), viewer = document.querySelector('#screenshot-viewer');
let target = ['26.2', '26.3'].includes(params.get('minecraft')) ? params.get('minecraft') : '', versions = [], project;
function trusted(path) { try { const url = new URL(path, location.href); const base = new URL('./', location.href).pathname; return url.origin === location.origin && (url.pathname.startsWith(base + 'api/addons/files/') || url.pathname.startsWith(base + 'addons/')) ? url.href : null; } catch { return null; } }
function drawRelease() {
  const item = versions.find(version => version.status === 'approved' && version.minecraft.includes(target));
  document.querySelector('#extension-version').textContent = item ? item.version : 'Aucune version compatible';
  document.querySelector('#extension-release-date').textContent = item ? date(item.approved) : '';
  document.querySelector('#extension-changelog').textContent = item?.changelog || 'Première publication.';
  document.querySelector('#extension-hash').textContent = item?.sha256 || '';
  const requirement = item?.dependencies?.minerite_companion;
  document.querySelector('#extension-compatibility').textContent = `Minecraft ${target} · Companion ${Array.isArray(requirement) ? requirement.join(' ou ') : requirement || 'avec API v1'}.`;
  const link = document.querySelector('#extension-download'), url = item && trusted(item.download); link.hidden = !url;
  if (url) { link.href = url; link.download = ''; link.textContent = item.type === 'java' ? 'Télécharger le JAR ↓' : 'Télécharger le projet Lua ↓'; }
  for (const button of document.querySelectorAll('[data-project-target]')) button.setAttribute('aria-pressed', String(button.dataset.projectTarget === target));
}
async function load() {
  try {
    const id = params.get('id'); if (!id || !/^[a-z][a-z0-9_-]{1,63}$/.test(id)) throw Error('Cette extension est introuvable.');
    if (params.get('type') === 'lua') {
      const response = await fetch('addon-catalogue.json', { cache: 'no-cache' }); if (!response.ok) throw Error('Catalogue indisponible.');
      const data = await response.json(); versions = data.addons.filter(item => item.manifest.id === id).map(item => ({ ...item.manifest, type: 'lua', status: data.revoked?.[item.sha256] ? 'withdrawn' : 'approved', reason: data.revoked?.[item.sha256] || '', download: item.file, sha256: item.sha256, screenshots: [], changelog: 'Projet de démonstration de l’API Lua.' })); project = versions.find(item => item.status === 'approved');
    } else { const data = await api('/projects/' + encodeURIComponent(id)); project = data.project; versions = data.versions; }
    if (!project) throw Error('Aucune version approuvée n’est disponible.');
    document.title = `${project.name} · Extensions Minerite Companion`;
    document.querySelector('#extension-page').hidden = false; status.hidden = true;
    document.querySelector('#extension-name').textContent = project.name; document.querySelector('#extension-author').textContent = `Par ${project.author}`;
    document.querySelector('#extension-kind').textContent = `${{ module: 'MODULE', theme: 'THÈME', hud: 'HUD', layout: 'DISPOSITION' }[project.category] || 'MODULE'} · ${project.type === 'java' ? 'JAVA' : 'LUA'}`;
    document.querySelector('#extension-description').textContent = project.description;
    const icon = project.icon && trusted(project.icon); if (icon) { const img = node('img'); img.src = icon; img.alt = ''; document.querySelector('#extension-icon').replaceChildren(img); }
    const gallery = document.querySelector('#extension-gallery');
    for (const [index, source] of (project.screenshots || []).entries()) { const url = trusted(source); if (!url) continue; const button = node('button'), img = node('img'); button.type = 'button'; img.src = url; img.alt = `Capture ${index + 1} de ${project.name}`; img.loading = 'lazy'; button.setAttribute('aria-label', `Agrandir la capture ${index + 1}`); button.append(img); button.addEventListener('click', () => { const full = document.querySelector('#screenshot-full'); full.src = url; full.alt = img.alt; viewer.showModal(); }); gallery.append(button); }
    const steps = project.type === 'java' ? ['Installez Fabric, Fabric API et une version compatible du Companion pour votre version de Minecraft.', 'Téléchargez le JAR correspondant à votre version de Minecraft.', 'Fermez Minecraft, retirez l’ancienne version de cette extension si elle est déjà présente, puis placez le nouveau JAR dans le dossier mods.', 'Relancez le jeu. L’extension apparaît dans Extensions → Java et ses modules dans le hub du Companion.'] : ['Installez une version du Companion prenant en charge l’API Lua.', 'Ouvrez Extensions dans le jeu et retrouvez ce projet dans le catalogue.', 'Confirmez les permissions demandées. L’extension s’active sans redémarrer le jeu.'];
    const list = document.querySelector('#extension-steps'); for (const step of steps) list.append(node('li', step));
    document.querySelector('#extension-installation').textContent = project.installation || '';
    document.querySelector('#extension-restart').textContent = project.type === 'java' ? 'Java · Redémarrage requis' : 'Lua · Sans redémarrage';
    const targets = [...new Set(versions.filter(item => item.status === 'approved').flatMap(item => item.minecraft))]; if (!targets.includes(target)) target = targets[0] || '26.2';
    for (const version of targets) { const button = node('button', version); button.type = 'button'; button.dataset.projectTarget = version; button.addEventListener('click', () => { target = version; drawRelease(); }); document.querySelector('#extension-targets').append(button); }
    const history = document.querySelector('#extension-versions');
    for (const item of versions) { const entry = node('article', '', 'version-entry'); entry.append(node('h3', `${item.version} · Minecraft ${item.minecraft.join(' / ')}`), node('p', date(item.approved), 'muted'), node('p', item.changelog || 'Première publication.', 'plain-text')); const url = trusted(item.download); if (item.status === 'approved' && url) { const a = node('a', 'Télécharger cette version ↓', 'quiet-link'); a.href = url; a.download = ''; entry.append(a); } else entry.append(node('p', `Version retirée : ${item.reason || 'indisponible au téléchargement'}`, 'decision-reason')); history.append(entry); }
    drawRelease();
  } catch (error) { notice(status, error.message, true); }
}
for (const button of document.querySelectorAll('[data-project-tab]')) button.addEventListener('click', () => { for (const other of document.querySelectorAll('[data-project-tab]')) other.setAttribute('aria-pressed', String(other === button)); for (const panel of document.querySelectorAll('[data-project-panel]')) panel.hidden = panel.dataset.projectPanel !== button.dataset.projectTab; });
viewer.querySelector('button').addEventListener('click', () => viewer.close());
load();
