const status = document.querySelector('#status');
const list = document.querySelector('#rules');
const names = {addons:'Extensions',session:'Session de minage',objectives:'Objectifs d’évolution',crafting:'Calculateur de fabrication',alerts:'Alertes de minerais',counters:'Compteurs du serveur',fps:'FPS',coordinates:'Coordonnées',inventory:'Aperçu de l’inventaire',playerstatus:'État du joueur',nameplates:'Noms des joueurs',studio:'Atelier de pioches',textures:'Textures des minerais',cosmetics:'Garde-robe',rarity:'Bordures de rareté',overlay:'Surbrillance des blocs',crosshair:'Viseur',zoom:'Zoom',chat:'Tchat',inventoryStyle:'Inventaire',hotbar:'Barre d’accès rapide',tab:'Liste des joueurs',servermenus:'Menus du serveur',frontmenus:'Accueil et serveurs',wheel:'Roue de commandes',angles:'Angles enregistrés',auto:'Minage automatique'};
fetch('https://raw.githubusercontent.com/SpirtySprite/minerite-companion/main/docs/module-policy.json?refresh=' + Date.now(), {cache:'no-store'})
  .then(response => {if (!response.ok) throw Error('Unavailable'); return response.json();})
  .then(policy => {
    if (policy.schema !== 1 || !policy.disabled) throw Error('Invalid policy');
    const entries = Object.entries(policy.disabled);
    status.textContent = entries.length ? `${entries.length} module(s) suspendu(s).` : 'Tous les modules sont disponibles.';
    for (const [id, rule] of entries) {
      const item = document.createElement('li');
      const range = rule.minimum || rule.maximum ? `Versions : ${rule.minimum || 'sans limite basse'} → ${rule.maximum || 'sans limite haute'}` : 'Toutes les versions compatibles';
      item.textContent = `${names[id] || id} · ${rule.reason} (${range})`;
      list.append(item);
    }
  })
  .catch(() => {status.textContent = 'État indisponible pour le moment. Réessayez plus tard.';});
