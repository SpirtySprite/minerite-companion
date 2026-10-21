const form = document.querySelector('#addon-form');
const button = document.querySelector('#submit-button');
const status = document.querySelector('#submit-status');
const api = '/minerite-companion/api/addons';
const names = { module: 'Module', hud: 'HUD', theme: 'Thème', layout: 'Disposition' };
let ready = false, busy = false, previewUrl = null;
function updatePreview() {
  document.querySelector('#preview-name').textContent = form.elements.name.value.trim() || 'Votre extension';
  document.querySelector('#preview-author').textContent = `Par ${form.elements.author.value.trim() || 'vous'}`;
  document.querySelector('#preview-category').textContent = names[form.elements.category.value];
  document.querySelector('#preview-description').textContent = form.elements.description.value.trim() || 'Une description claire aide les joueurs à comprendre ce que votre extension leur apporte.';
  document.querySelector('#description-count').textContent = `${form.elements.description.value.length.toLocaleString('fr-FR')} / 3 000`;
}
form.addEventListener('input', updatePreview);
form.addEventListener('change', event => {
  if (event.target.type !== 'file') return;
  const file = event.target.files[0];
  const label = document.querySelector(`[data-file="${event.target.name}"]`);
  if (label) label.textContent = file ? `${file.name} · ${(file.size / 1024 / 1024).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} Mio` : 'Aucun fichier sélectionné.';
  if (event.target.name === 'icon') {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const box = document.querySelector('#preview-icon'); box.textContent = '{ }';
    if (file && file.type === 'image/png' && file.size <= 512 * 1024) { previewUrl = URL.createObjectURL(file); const img = document.createElement('img'); img.src = previewUrl; img.alt = ''; box.replaceChildren(img); }
  }
});
async function health() {
  try { const response = await fetch(api + '/health', { cache: 'no-store', signal: AbortSignal.timeout(12000) }); const data = response.ok && await response.json(); ready = data?.available === true; } catch { ready = false; }
  button.disabled = !ready || busy;
  status.textContent = ready ? 'Votre projet reste privé jusqu’à sa validation.' : 'Le service de dépôt est momentanément indisponible. Vos champs restent disponibles ; réessayez dans quelques instants.';
}
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!ready || busy || !form.reportValidity()) return;
  const selected = [...form.querySelectorAll('[name=minecraft]:checked')];
  let error = '';
  if (!selected.length) error = 'Sélectionnez au moins une version de Minecraft testée.';
  const limits = { source: 16 * 1024 * 1024, jar: 8 * 1024 * 1024, icon: 512 * 1024 };
  for (const [name, max] of Object.entries(limits)) { const file = form.elements[name].files[0]; if (file && file.size > max) error = `Le fichier ${name} dépasse la taille autorisée.`; }
  if (error) { status.textContent = error; status.classList.add('error-text'); return; }
  busy = true; button.disabled = true; button.textContent = 'Envoi en cours…'; status.classList.remove('error-text'); status.textContent = 'Envoi des fichiers. Gardez cette page ouverte jusqu’à la confirmation.';
  try {
    const response = await fetch(api + '/submissions', { method: 'POST', body: new FormData(form), signal: AbortSignal.timeout(180000) });
    let data; try { data = await response.json(); } catch { throw Error('Le serveur n’a pas confirmé le dépôt. Vos champs sont conservés.'); }
    if (!response.ok || !/^[a-f0-9-]{36}$/.test(data.id || '')) throw Error(data.error || 'Le dépôt n’a pas été confirmé. Réessayez plus tard.');
    document.querySelector('.submission-layout').hidden = true; document.querySelector('.submission-layout').style.display = 'none';
    const success = document.querySelector('#submission-success'); success.hidden = false; document.querySelector('#submission-id').textContent = data.id; success.focus(); success.scrollIntoView({ block: 'center', behavior: 'instant' });
  } catch (error) { status.textContent = error.name === 'TimeoutError' ? 'L’envoi a expiré sans confirmation. Conservez vos fichiers et réessayez plus tard.' : error.message; status.classList.add('error-text'); }
  finally { busy = false; button.disabled = !ready; button.innerHTML = 'Envoyer pour validation <span aria-hidden="true">→</span>'; }
});
health();
setInterval(() => { if (!ready && !busy && !document.hidden) health(); }, 30000);
window.addEventListener('beforeunload', event => { if (busy) { event.preventDefault(); event.returnValue = ''; } });

for (const zone of document.querySelectorAll('.upload-box')) {
  for (const type of ['dragenter', 'dragover']) zone.addEventListener(type, event => { event.preventDefault(); zone.classList.add('dragging'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragging'));
  zone.addEventListener('drop', event => {
    event.preventDefault(); zone.classList.remove('dragging');
    if (busy || event.dataTransfer.files.length !== 1) return;
    const transfer = new DataTransfer(); transfer.items.add(event.dataTransfer.files[0]);
    const input = zone.querySelector('input[type=file]'); input.files = transfer.files; input.dispatchEvent(new Event('change', { bubbles: true }));
  });
}
