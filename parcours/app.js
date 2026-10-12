
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const fmt=n=>n.toLocaleString('fr-FR').replace(/ /g,' ')+' F CFA';
function toast(t){let d=$('.toast');if(!d){d=document.createElement('div');d.className='toast';document.body.appendChild(d)}d.textContent=t;d.classList.add('on');clearTimeout(d._t);d._t=setTimeout(()=>d.classList.remove('on'),2200)}
const S={get:k=>{try{return JSON.parse(sessionStorage.getItem('yl')||'{}')[k]}catch(_){return}},
 set:(k,v)=>{try{const o=JSON.parse(sessionStorage.getItem('yl')||'{}');o[k]=v;sessionStorage.setItem('yl',JSON.stringify(o))}catch(_){}}};
function prix(n){return 300000+Math.max(0,n-2)*200000}
function majRecap(){
 const ch=S.get('experts')||['fatima'];const n=ch.length+1;
 $$('[data-nb]').forEach(x=>x.textContent=n+' Experts');
 $$('[data-mens]').forEach(x=>x.textContent=fmt(prix(n)));
 $$('[data-total]').forEach(x=>x.textContent=fmt(prix(n)+1000000));
 const nom=S.get('cos')||'Djénéba';$$('[data-cos]').forEach(x=>x.textContent=nom);
 const ent=S.get('ent')||'Unifood';$$('[data-ent]').forEach(x=>x.textContent=ent);
 const sd=S.get('sd')||'unifood';$$('[data-sd]').forEach(x=>x.textContent=sd+'.yelema.ai');
 const tel=S.get('tel');if(tel)$$('[data-tel]').forEach(x=>{if('value' in x)x.value=tel;else x.textContent=tel});
 const mini=$('.recap .mini');if(mini){mini.innerHTML='<img src="img/djeneba.jpg" alt="">'+ch.map(c=>`<img src="img/${c}.jpg" alt="">`).join('')}
}
document.addEventListener('DOMContentLoaded',()=>{
 // étape 1 : choix des experts
 const ch=new Set(S.get('experts')||['fatima']);
 $$('.xp[data-x]').forEach(b=>{b.classList.toggle('on',ch.has(b.dataset.x));
  b.addEventListener('click',()=>{const x=b.dataset.x;if(ch.has(x)){ch.delete(x)}else ch.add(x);b.classList.toggle('on',ch.has(x));
   S.set('experts',[...ch]);majRecap();$$('[data-suite1]').forEach(s=>s.toggleAttribute('disabled',ch.size===0))})});
 // étape 2 : nom du chief of staff
 const ci=$('#cos');if(ci){ci.value=S.get('cos')||'Djénéba';
  const maj=()=>{S.set('cos',ci.value.trim()||'Djénéba');majRecap();$$('.sugg button').forEach(b=>b.classList.toggle('on',b.textContent===ci.value))};
  ci.addEventListener('input',maj);$$('.sugg button').forEach(b=>b.addEventListener('click',()=>{ci.value=b.textContent;maj()}));maj()}
 // étape 3 : entreprise -> sous-domaine
 const en=$('#ent'),sd=$('#sd');
 if(en&&sd){const slug=v=>v.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  en.value=S.get('ent')||'Unifood';sd.value=S.get('sd')||'unifood';let touche=false;
  en.addEventListener('input',()=>{S.set('ent',en.value);if(!touche){sd.value=slug(en.value);S.set('sd',sd.value)}majRecap()});
  sd.addEventListener('input',()=>{touche=true;sd.value=slug(sd.value);S.set('sd',sd.value);majRecap()})}
 const tl=$('#tel');if(tl){tl.value=S.get('tel')||'07 07 12 34 56';S.set('tel',tl.value);tl.addEventListener('input',()=>S.set('tel',tl.value))}
 // paiement
 $$('.moyen').forEach(m=>m.addEventListener('click',()=>{$$('.moyen').forEach(x=>x.classList.remove('on'));m.classList.add('on');
  $$('[data-pan]').forEach(p=>p.hidden=p.dataset.pan!==m.dataset.m);
  const b=$('#payer');if(b){b.dataset.go=m.dataset.go;b.textContent=m.dataset.m==='virement'?'Envoyer ma demande':'Payer '+$('[data-total]').textContent}}));
 $$('.op').forEach(o=>o.addEventListener('click',()=>{$$('.op').forEach(x=>x.classList.remove('on'));o.classList.add('on')}));
 const pb=$('#payer');if(pb)pb.addEventListener('click',()=>{pb.innerHTML='<span class="spin"></span> Validation sur votre téléphone…';pb.disabled=true;
  setTimeout(()=>location.href=pb.dataset.go||'s1-5-confirmation.html',pb.dataset.go==='s2-demande.html'?300:1400)});
 // confirmation : suivi animé
 const sv=$('.suivi[data-anim]');if(sv){const it=[...sv.children];let i=1;
  const tick=()=>{if(i>=it.length)return;it[i].className='ok';it[i].querySelector('i').innerHTML='✓';i++;
   if(i<it.length){it[i].className='enc';it[i].querySelector('i').innerHTML='<span class="spin"></span>'}
   if(i>=it.length){$$('[data-fin]').forEach(x=>x.hidden=false)}else setTimeout(tick,1300)};
  setTimeout(tick,1300)}
 // onboarding : logo / couleurs
 $$('.couleurs button').forEach(b=>b.addEventListener('click',()=>{$$('.couleurs button').forEach(x=>x.classList.remove('on'));b.classList.add('on');
  document.documentElement.style.setProperty('--c',b.dataset.c);S.set('c',b.dataset.c)}));
 const apres=document.body.dataset.apres==='1';
 const c=S.get('c')||(apres?'#D7262F':null);if(c)document.documentElement.style.setProperty('--c',c);
 const lg=S.get('logo')||(apres?'img/unifood.png':null);if(lg)$$('[data-logo]').forEach(i=>i.src=lg);
 const fl=$('#logo-f');if(fl)fl.addEventListener('change',()=>{const f=fl.files[0];if(!f)return;const u=URL.createObjectURL(f);$$('[data-logo]').forEach(i=>i.src=u);S.set('logo','img/unifood.png');toast('Logo ajouté')});
 const rec=$('#recup');if(rec)rec.addEventListener('click',()=>{rec.innerHTML='<span class="spin"></span>';setTimeout(()=>{rec.textContent='Récupérer';$('.recupere').hidden=false;
  $$('[data-logo]').forEach(i=>i.src='img/unifood.png');S.set('logo','img/unifood.png');const r=$('.couleurs button[data-c="#D7262F"]');if(r)r.click();toast('Logo et couleur trouvés sur unifood.ci')},900)});
 // mot de passe
 const mp=$('#mdp'),mp2=$('#mdp2'),go=$('#mdp-go');
 if(mp&&go){const v=()=>{const ok=mp.value.length>=8&&mp.value===mp2.value;go.disabled=!ok;$('#mdp-aide').textContent=mp.value.length&&mp.value.length<8?'8 caractères minimum':(mp2.value&&mp.value!==mp2.value?'Les deux mots de passe sont différents':'')};
  mp.addEventListener('input',v);mp2.addEventListener('input',v);v()}
 // copier
 $$('[data-copier]').forEach(b=>b.addEventListener('click',()=>{try{navigator.clipboard.writeText(b.dataset.copier)}catch(_){}toast('Adresse copiée')}));
 // back office
 $$('.filtres button').forEach(b=>b.addEventListener('click',()=>{$$('.filtres button').forEach(x=>x.classList.remove('on'));b.classList.add('on');
  const f=b.dataset.f;$$('.tab tbody tr').forEach(r=>r.hidden=f!=='tous'&&r.dataset.s!==f)}));
 $$('tr[data-href]').forEach(r=>r.addEventListener('click',()=>location.href=r.dataset.href));
 $$('.radio input').forEach(i=>i.addEventListener('change',()=>{$$('.radio label').forEach(l=>l.classList.toggle('on',l.querySelector('input').checked));
  $$('[data-si]').forEach(p=>p.hidden=p.dataset.si!==i.value);const b=$('#bo-go');if(b&&i.dataset.lib)b.textContent=i.dataset.lib}));
 $$('[data-toast]').forEach(b=>b.addEventListener('click',ev=>{ev.preventDefault();toast(b.dataset.toast)}));
 $$('[data-wait]').forEach(b=>b.addEventListener('click',ev=>{ev.preventDefault();const h=b.getAttribute('href');b.innerHTML='<span class="spin"></span>';setTimeout(()=>location.href=h,700)}));
 majRecap();
});
