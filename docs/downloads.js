const downloads=document.querySelector('#downloads');
const older=document.querySelector('#older-downloads');
function element(tag,text,cls){const node=document.createElement(tag);node.textContent=text;if(cls)node.className=cls;return node;}
fetch('downloads.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(data=>{
 const releases=data.releases.filter(r=>/^downloads\/minerite-companion-[0-9A-Za-z.+-]+\.jar$/.test(r.url)&&/^[a-f0-9]{64}$/.test(r.sha256));
 downloads.replaceChildren();
 for(const channel of ['stable','beta']){
  const release=releases.find(r=>r.channel===channel);if(!release)continue;
  const card=element('section','','download-card');card.append(element('span',channel==='stable'?'RECOMMANDÉE':'PRÉVERSION','eyebrow'),element('h2',channel==='stable'?'Version stable':'Version bêta'),element('p',release.version,'download-version'),element('p',channel==='stable'?'La version conseillée pour jouer au quotidien.':'Pour tester les nouveautés avant leur sortie stable.','intro'));
  const link=element('a','Télécharger le JAR ↓','start-link');link.href=release.url;link.download=release.filename;card.append(link);
  const notes=element('a','Lire les notes de version →','download-notes');notes.href='index.html#'+encodeURIComponent(release.version);card.append(notes);
  const checksum=element('details','');checksum.append(element('summary','Vérifier le fichier · SHA-256'),element('code',release.sha256));card.append(checksum);downloads.append(card);
 }
 for(const release of releases){const li=element('li','');const link=element('a',release.version+' · '+(release.channel==='stable'?'Stable':'Bêta'));link.href=release.url;link.download=release.filename;li.append(link);older.append(li);}
 if(!releases.length)throw Error();
}).catch(()=>downloads.replaceChildren(element('p','Téléchargements indisponibles pour le moment. Réessayez plus tard.')));
