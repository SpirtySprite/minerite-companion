export const ROOT = '/minerite-companion/api/addons';
export async function api(route, options = {}) {
  const response = await fetch(ROOT + route, { credentials: 'same-origin', cache: 'no-store', ...options, headers: { ...(options.body instanceof FormData ? {} : options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers } });
  const data = await response.json().catch(() => ({ error: 'Le service n’a pas répondu correctement. Réessayez dans quelques instants.' }));
  if (!response.ok) { const error = new Error(data.error || 'La demande a échoué.'); error.status = response.status; throw error; }
  return data;
}
export function node(tag, text = '', cls = '') { const el = document.createElement(tag); el.textContent = text; if (cls) el.className = cls; return el; }
export const labels = { pending: 'En attente', approved: 'Approuvée', rejected: 'Refusée', withdrawn: 'Retirée', cancelled: 'Annulée' };
export function fileUrl(id, filename, scope = 'creator') { return `${ROOT}/${scope}/files/${encodeURIComponent(id)}/${filename}`; }
export function date(value) { return value ? new Date(value).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''; }
export function notice(el, message, error = false) { el.textContent = message; el.classList.toggle('error-text', error); }
