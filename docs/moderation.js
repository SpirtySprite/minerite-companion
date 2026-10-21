import { api, node, labels, date, notice, fileUrl } from './portal-api.js';
const status = document.querySelector('#review-status'), list = document.querySelector('#review-list'), detail = document.querySelector('#review-detail');
let filter = 'pending', records = [], cursor = null, selected = null, busy = false;
async function initialize() {
  try {
    const token = new URLSearchParams(location.hash.slice(1)).get('login');
    if (token) { history.replaceState(null, '', location.pathname); await api('/auth/owner-link', { method: 'POST', body: JSON.stringify({ token }) }); window.dispatchEvent(new Event('companion-auth-changed')); }
    const { user } = await api('/auth/session');
    if (user?.role !== 'admin') { document.querySelector('#review-denied').hidden = false; notice(status, 'Accès réservé au propriétaire.'); return; }
    document.querySelector('#review-workspace').hidden = false; document.querySelector('#review-refresh').hidden = false; await load();
  } catch (error) { notice(status, error.message, true); document.querySelector('#review-denied').hidden = false; }
}
async function load(more = false) {
  try { const data = await api('/admin/submissions?status=' + filter + (more && cursor ? '&cursor=' + encodeURIComponent(cursor) : '')); records = more ? [...records, ...data.submissions] : data.submissions; cursor = data.cursor; document.querySelector('#review-more').hidden = !cursor; draw(); notice(status, `${records.length} dossier${records.length > 1 ? 's' : ''} affiché${records.length > 1 ? 's' : ''}.`); }
  catch (error) { notice(status, error.message, true); }
}
function draw() {
  list.replaceChildren();
  if (!records.length) list.append(node('p', 'Aucun dossier dans cette catégorie.', 'muted'));
  for (const item of records) { const button = node('button', '', 'review-card'); button.type = 'button'; button.setAttribute('aria-pressed', String(item.id === selected)); button.append(node('strong', item.name), node('span', `${item.version} · ${item.minecraft.join(' / ')}`), node('small', `${item.author} · ${labels[item.status]}`)); button.addEventListener('click', () => { selected = item.id; draw(); }); list.append(button); }
  const item = records.find(value => value.id === selected);
  if (!item) { selected = null; detail.replaceChildren(node('p', 'Choisissez un dossier.', 'muted')); return; }
  detail.replaceChildren(node('span', labels[item.status], 'badge'), node('h2', item.name), node('p', `${item.author} · ${item.version} · Minecraft ${item.minecraft.join(' / ')}`, 'muted'), node('p', item.description, 'plain-text'));
  detail.append(node('p', `Identifiant Fabric : ${item.modId}`, 'muted'), node('p', `Dépôt du ${date(item.created)} · ${item.id}`, 'muted'));
  detail.append(node('h3', 'Dépendances déclarées'), node('pre', JSON.stringify(item.dependencies || {}, null, 2), 'review-dependencies'));
  if (item.contact) detail.append(node('p', `Contact privé : ${item.contact}`, 'muted'));
  detail.append(node('h3', 'Notes de version'), node('p', item.changelog || 'Non renseignées.', 'plain-text'), node('h3', 'Installation'), node('p', item.installation || 'Installation standard dans le dossier mods.', 'plain-text'));
  const images = node('div', '', 'project-gallery');
  for (let i = 0; i < (item.screenshots || []).length; i++) { const img = node('img'); img.src = fileUrl(item.id, `screenshot-${i}.webp`, 'admin'); img.alt = `Capture ${i + 1} de ${item.name}`; images.append(img); }
  if (item.icon) { const img = node('img'); img.src = fileUrl(item.id, 'icon.png', 'admin'); img.alt = `Icône de ${item.name}`; img.className = 'review-icon'; detail.append(img); }
  detail.append(images);
  const files = node('div', '', 'portal-actions');
  for (const [filename, label] of [['source.zip', 'Télécharger les sources ZIP'], ['addon.jar', 'Télécharger le JAR']]) { const a = node('a', label, 'portal-button'); a.href = fileUrl(item.id, filename, 'admin'); a.download = ''; files.append(a); }
  detail.append(files, node('p', `JAR · ${item.jarSize.toLocaleString('fr-FR')} octets`, 'muted'), node('code', 'SHA-256 : ' + item.sha256, 'file-hash'), node('code', 'Sources : ' + item.sourceSha256, 'file-hash'));
  if (item.reason) detail.append(node('p', item.reason, 'decision-reason'));
  if (item.projectWithdrawn) detail.append(node('p', `Projet suspendu : ${item.projectReason}`, 'decision-reason'));
  const reasonLabel = node('label', 'Raison de la décision', 'portal-label'), reason = node('textarea'); reason.rows = 3; reason.maxLength = 1000; reason.placeholder = 'Expliquez clairement le refus, le retrait ou la suspension.'; reasonLabel.append(reason); detail.append(reasonLabel);
  const actions = node('div', '', 'portal-actions');
  function decision(label, route, payload, needsReason) {
    const button = node('button', label, 'portal-button'); button.type = 'button';
    button.addEventListener('click', async () => {
      if (busy) return;
      if (needsReason && reason.value.trim().length < 5) { notice(status, 'Précisez la raison de votre décision.', true); reason.focus(); return; }
      if (payload.status === 'approved' && !detail.querySelector('[data-reviewed]')?.checked) { notice(status, 'Confirmez que vous avez examiné les sources et le JAR.', true); return; }
      busy = true; for (const b of detail.querySelectorAll('button')) b.disabled = true;
      try { await api(route, { method: 'PATCH', body: JSON.stringify({ ...payload, reason: reason.value.trim() }) }); await load(); notice(status, 'Décision enregistrée.'); }
      catch (error) { notice(status, error.message, true); } finally { busy = false; for (const b of detail.querySelectorAll('button')) b.disabled = false; }
    }); actions.append(button);
  }
  if (item.status === 'pending') {
    const label = node('label', '', 'consent review-consent'), checkbox = node('input'); checkbox.type = 'checkbox'; checkbox.dataset.reviewed = '';
    label.append(checkbox, node('span', 'J’ai examiné les sources, le JAR, les dépendances et les droits de publication.')); detail.append(label);
    if (!item.projectWithdrawn) decision('Approuver cette version', '/admin/submissions/' + item.id, { status: 'approved', reviewed: true }, false);
    decision('Refuser cette version', '/admin/submissions/' + item.id, { status: 'rejected' }, true);
  }
  if (item.status === 'approved') decision('Retirer cette version', '/admin/submissions/' + item.id, { status: 'withdrawn' }, true);
  decision(item.projectWithdrawn ? 'Rétablir le projet' : 'Suspendre tout le projet', '/admin/projects/' + item.modId, { withdrawn: !item.projectWithdrawn }, true);
  detail.append(actions);
}
for (const button of document.querySelectorAll('[data-review-filter]')) button.addEventListener('click', () => { if (busy) return; filter = button.dataset.reviewFilter; selected = null; for (const other of document.querySelectorAll('[data-review-filter]')) other.setAttribute('aria-pressed', String(other === button)); load(); });
document.querySelector('#review-refresh').addEventListener('click', () => { if (!busy) load(); });
document.querySelector('#review-more').addEventListener('click', () => load(true));
initialize();
