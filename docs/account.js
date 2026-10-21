import { api, node, labels, date, notice } from './portal-api.js';

let current = null;
async function header() {
  const link = document.querySelector('[data-account-link]');
  try { current = (await api('/auth/session')).user; } catch { current = null; }
  if (link) { link.textContent = current ? current.name : 'Connexion'; link.href = 'account'; }
  return current;
}
window.addEventListener('companion-auth-changed', header);
const page = document.querySelector('#account-page');
if (page) {
  const auth = document.querySelector('#account-auth'), dashboard = document.querySelector('#creator-dashboard');
  const message = document.querySelector('#account-message'), recovery = document.querySelector('#recovery-panel');
  function showRecovery(code) { if (!code) return; document.querySelector('#recovery-code').textContent = code; recovery.hidden = false; recovery.focus(); }
  document.querySelector('#recovery-acknowledge').addEventListener('click', () => { recovery.hidden = true; document.querySelector('#recovery-code').textContent = ''; });
  document.querySelector('#recovery-download').addEventListener('click', () => { const blob = new Blob([`Minerite Companion\nPseudo : ${current?.username || ''}\nCode de récupération : ${document.querySelector('#recovery-code').textContent}\nConservez ce fichier dans un endroit privé. Ce code permet de réinitialiser votre mot de passe.\n`], { type: 'text/plain;charset=utf-8' }); const url = URL.createObjectURL(blob); const link = node('a'); link.href = url; link.download = 'recuperation-minerite-companion.txt'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); });
  for (const button of document.querySelectorAll('[data-auth-tab]')) button.addEventListener('click', () => {
    for (const other of document.querySelectorAll('[data-auth-tab]')) other.setAttribute('aria-pressed', String(other === button));
    for (const panel of document.querySelectorAll('[data-auth-panel]')) panel.hidden = panel.dataset.authPanel !== button.dataset.authTab;
    notice(message, '');
  });
  const destination = new URLSearchParams(location.search).get('return');
  function safeDestination() {
    if (!destination) return null;
    const url = new URL(destination, location.href);
    return url.origin === location.origin && /\/(submit-addon|moderation)(?:\.html)?$/.test(url.pathname) ? url.href : null;
  }
  for (const form of document.querySelectorAll('[data-auth-form]')) form.addEventListener('submit', async event => {
    event.preventDefault(); const button = form.querySelector('[type=submit]'); button.disabled = true;
    try {
      const data = Object.fromEntries(new FormData(form));
      if (data.confirmPassword !== undefined && data.password !== data.confirmPassword) throw Error('Les deux mots de passe ne correspondent pas.');
      const result = await api('/auth/' + form.dataset.authForm, { method: 'POST', body: JSON.stringify(data) });
      current = result.user; form.reset(); await render(); showRecovery(result.recoveryCode);
      if (!result.recoveryCode && safeDestination()) location.assign(safeDestination());
      else notice(message, result.recoveryCode ? 'Compte prêt. Conservez votre code de récupération avant de continuer.' : 'Vous êtes connecté.');
    } catch (error) { notice(message, error.message, true); }
    finally { button.disabled = false; }
  });
  document.querySelector('#account-logout').addEventListener('click', async () => { try { await api('/auth/logout', { method: 'POST', body: '{}' }); current = null; await render(); } catch (error) { notice(message, error.message, true); } });
  document.querySelector('#password-form').addEventListener('submit', async event => {
    event.preventDefault(); const form = event.currentTarget, button = form.querySelector('button'); button.disabled = true;
    try { const data = Object.fromEntries(new FormData(form)); if (data.password !== data.confirmPassword) throw Error('Les deux mots de passe ne correspondent pas.'); const result = await api('/auth/password', { method: 'POST', body: JSON.stringify(data) }); form.reset(); await render(); showRecovery(result.recoveryCode); notice(message, 'Mot de passe modifié. Le nouveau code remplace l’ancien et les autres sessions ont été fermées.'); }
    catch (error) { notice(message, error.message, true); } finally { button.disabled = false; }
  });
  async function render() {
    await header(); auth.hidden = Boolean(current); dashboard.hidden = !current;
    if (!current) return;
    document.querySelector('#creator-name').textContent = current.name;
    document.querySelector('#owner-dashboard-link').hidden = current.role !== 'admin';
    document.querySelector('#current-password-label').hidden = !current.passwordSet;
    document.querySelector('#current-password').required = current.passwordSet;
    const next = document.querySelector('#return-link'); next.hidden = !safeDestination(); if (!next.hidden) next.href = safeDestination();
    const container = document.querySelector('#creator-projects'); container.replaceChildren(node('p', 'Chargement de vos projets…', 'muted'));
    try {
      const data = await api('/creator/projects'), grouped = new Map(); container.replaceChildren();
      for (const release of data.projects) { if (!grouped.has(release.projectId)) grouped.set(release.projectId, []); grouped.get(release.projectId).push(release); }
      if (!grouped.size) container.append(node('p', 'Votre premier projet commence ici. Préparez vos sources et votre JAR, puis proposez une extension.', 'muted'));
      for (const [id, versions] of grouped) {
        const latest = versions[0], card = node('article', '', 'creator-project');
        const title = node('div', '', 'project-heading'); title.append(node('h3', latest.name), node('span', latest.projectWithdrawn ? 'Projet suspendu' : labels[latest.status], 'badge')); card.append(title, node('p', latest.description, 'muted'));
        const actions = node('div', '', 'portal-actions'); const update = node('a', 'Proposer une mise à jour →', 'start-link'); update.href = 'submit-addon?project=' + encodeURIComponent(id); actions.append(update);
        if (versions.some(value => value.status === 'approved')) { const link = node('a', 'Voir la page publique', 'quiet-link'); link.href = 'extension?id=' + encodeURIComponent(id); actions.append(link); }
        card.append(actions);
        const history = node('details'), summary = node('summary', `${versions.length} version${versions.length > 1 ? 's' : ''} proposée${versions.length > 1 ? 's' : ''}`); history.append(summary);
        for (const item of versions) { const entry = node('div', '', 'version-entry'); entry.append(node('h4', `${item.version} · ${labels[item.status]} · Minecraft ${item.minecraft.join(' / ')}`), node('p', date(item.created), 'muted')); if (item.reason) entry.append(node('p', item.reason, 'decision-reason')); if (item.changelog) entry.append(node('p', item.changelog, 'plain-text')); history.append(entry); }
        card.append(history); container.append(card);
      }
    } catch (error) { container.replaceChildren(node('p', error.message, 'error-text')); }
  }
  render();
} else header();
