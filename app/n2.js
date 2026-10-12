/* Yelema, prototype Version 2 : comportements (aucun bouton mort, aucun select natif) */
(function(){
'use strict';
var D=window.N2||{},EX=D.experts||[],BY={};EX.forEach(function(e){BY[e.slug]=e});
function $(s,r){return (r||document).querySelector(s)}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}
function esc(t){return String(t).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(_){return null}}
function ss(k,v){try{sessionStorage.setItem(k,v)}catch(_){}}
var IC=D.icons||{};function ic(n){return IC[n]||''}

/* ---------- toast ---------- */
var TT;function toast(msg,undo){var t=$('.n2-toast');if(!t){t=document.createElement('div');t.className='n2-toast';t.setAttribute('role','status');document.body.appendChild(t)}
  t.innerHTML='<span>'+msg+'</span>'+(undo?'<button type="button">Annuler</button>':'');
  if(undo)$('button',t).onclick=function(){undo();t.classList.remove('n2-on')};
  requestAnimationFrame(function(){t.classList.add('n2-on')});clearTimeout(TT);TT=setTimeout(function(){t.classList.remove('n2-on')},undo?5000:2800)}
window.n2toast=toast;

/* ---------- modale ---------- */
function modal(o){closeModal();var ov=document.createElement('div');ov.className='n2-ov';
  ov.innerHTML='<div class="n2-mod'+(o.wide?' n2-wide':'')+(o.cls?' '+o.cls:'')+'" role="dialog" aria-modal="true" aria-label="'+esc(o.title)+'"><div class="n2-mh"><div style="flex:1"><h3>'+esc(o.title)+'</h3>'+(o.sub?'<p>'+o.sub+'</p>':'')+'</div><button type="button" class="n2-icb" data-x aria-label="Fermer">'+ic('x')+'</button></div><div class="n2-mb">'+(o.body||'')+'</div><div class="n2-mf"></div></div>';
  var f=$('.n2-mf',ov);(o.actions||[{label:'Fermer'}]).forEach(function(a){var b=document.createElement('button');b.type='button';b.className='n2-btn'+(a.pri?' n2-pri':'')+(a.dan?' n2-dan':'');b.textContent=a.label;b.onclick=function(){if(a.fn&&a.fn(ov)===false)return;closeModal()};f.appendChild(b)});
  ov.addEventListener('click',function(e){if(e.target===ov||e.target.closest('[data-x]'))closeModal()});
  document.body.appendChild(ov);dd(ov);var i=$('input,textarea',ov);if(i&&!o.nofocus)setTimeout(function(){i.focus()},30);if(o.init)o.init(ov);return ov}
function closeModal(){$$('.n2-ov').forEach(function(x){x.remove()})}
window.n2modal=modal;
document.addEventListener('keydown',function(e){if(e.key==='Escape'){closeModal();closePops()}});

/* ---------- pops et listes déroulantes maison ---------- */
function closePops(ex){$$('.n2-pop[data-tmp]').forEach(function(p){if(p!==ex)p.remove()});$$('[data-menu-open]').forEach(function(b){if(!ex||!b.contains(ex))b.removeAttribute('data-menu-open')})}
document.addEventListener('click',function(e){if(!e.target.closest('.n2-pop')&&!e.target.closest('[data-pop-btn]'))closePops()});
function pop(btn,html,cls){var open=btn.hasAttribute('data-menu-open');closePops();if(open)return null;btn.setAttribute('data-menu-open','');
  var p=document.createElement('div');p.className='n2-pop '+(cls||'');p.setAttribute('data-tmp','');p.innerHTML=html;
  var host=btn.closest('.n2-dd')||btn.parentNode;if(getComputedStyle(host).position==='static')host.style.position='relative';host.appendChild(p);
  if(!cls){var r=btn.getBoundingClientRect();p.style.top=(btn.offsetTop+btn.offsetHeight+6)+'px';
    if(r.left+240>innerWidth)p.style.right='0';else p.style.left=btn.offsetLeft+'px';
    if(r.bottom+p.offsetHeight+10>innerHeight&&r.top>p.offsetHeight){p.style.top='auto';p.style.bottom=(host.offsetHeight-btn.offsetTop+6)+'px'}}
  return p}
function dd(root){$$('.n2-dd[data-opts]',root||document).forEach(function(w){if(w._n2)return;w._n2=1;var b=$('.n2-ddb',w);b.setAttribute('data-pop-btn','');
  b.addEventListener('click',function(e){e.preventDefault();var o=JSON.parse(w.dataset.opts),cur=w.dataset.val;
    var p=pop(b,o.map(function(x){var v=x.v||x;var l=x.l||x.v||x;return '<button type="button" data-v="'+esc(v)+'" class="'+(v===cur?'n2-sel':'')+'">'+(v===cur?ic('check'):'<span style="width:18px"></span>')+'<span>'+esc(l)+(x.s?'<br><small style="color:#6A6487">'+esc(x.s)+'</small>':'')+'</span></button>'}).join(''));
    if(!p)return;if(w.classList.contains('n2-ddw')){p.style.left='0';p.style.right='0'}
    $$('button',p).forEach(function(x){x.onclick=function(){var v=x.dataset.v;w.dataset.val=v;var it=o.filter(function(y){return (y.v||y)===v})[0];$('.n2-ddl',w).textContent=it.l||it.v||it;closePops();w.dispatchEvent(new CustomEvent('n2change',{detail:v,bubbles:true}))}})})})}
window.n2dd=dd;dd();

/* ---------- menu mobile ---------- */
var APP=$('.n2-app');
function drawer(on){if(!APP)return;APP.classList.toggle('n2-open',on);var s=$('.n2-scrim');if(on&&!s){s=document.createElement('div');s.className='n2-scrim';s.onclick=function(){drawer(false)};document.body.appendChild(s)}if(!on&&s)s.remove()}
$$('.n2-burger').forEach(function(b){b.onclick=function(){drawer(!APP.classList.contains('n2-open'))}});

/* ---------- notifications ---------- */
var NOTIFS=D.notifs||[];
$$('[data-notif]').forEach(function(b){b.setAttribute('data-pop-btn','');b.onclick=function(){var p=pop(b,'<h4>Notifications</h4>'+NOTIFS.map(function(n){return '<a class="n2-ni" href="'+n.href+'"><img src="'+n.img+'" alt=""><div><p>'+n.t+'</p><small>'+n.d+'</small></div></a>'}).join('')+'<hr><button type="button" data-allread>'+ic('check')+'Tout marquer comme lu</button>','n2-notif');
  if(!p)return;$('[data-allread]',p).onclick=function(){var d=$('.n2-dot',b);if(d)d.remove();closePops();toast('Notifications marquées comme lues.')}}});

/* ---------- carte utilisateur ---------- */
$$('[data-user]').forEach(function(b){b.setAttribute('data-pop-btn','');b.onclick=function(){var p=pop(b,'<a href="parametres.html#profil">'+ic('user')+'Mon profil</a><hr><a href="index.html">'+ic('logout')+'Se déconnecter</a>');
  if(p){p.style.top='auto';p.style.bottom='52px';p.style.left='0';p.style.right='0'}}});

/* ---------- Yélé ---------- */
var YP=$('.n2-yp');
function yeleOpen(){if(!YP)return;YP.hidden=false;if(innerWidth<=860)YP.classList.add('n2-mob');var im=$('.n2-yh img',YP);if(im){im.src='../img/yele/yele_laugh.webp';setTimeout(function(){im.src='../img/yele/yele_smile.webp'},3500)}}
function yeleClose(){if(YP){YP.hidden=true;YP.classList.remove('n2-mob')}}
$$('[data-yele]').forEach(function(b){b.onclick=function(){YP&&YP.hidden?yeleOpen():yeleClose()}});
if(YP){$('[data-yx]',YP).onclick=yeleClose;var YB=$('.n2-ybody',YP),YI=$('input',YP),bugStep=-1,BUGQ=['Sur quelle page étiez-vous ?','Qu’avez-vous fait juste avant ?','Que s’est-il passé ?'];
  function ysay(t,me){var m=document.createElement('div');m.className='n2-ym'+(me?' n2-moi':'');m.textContent=t;YB.appendChild(m);YB.scrollTop=YB.scrollHeight}
  $$('.n2-ysg button',YP).forEach(function(b){b.onclick=function(){var k=b.dataset.k;
    if(k==='bug'){ysay('Signaler un bug',1);bugStep=0;setTimeout(function(){ysay(BUGQ[0])},300);YI.focus();return}
    if(k==='recruter'){location.href='recruter.html';return}
    if(k==='outils'){location.href='parametres.html#connecteurs';return}
    if(k==='facture'){location.href='parametres.html#facturation';return}
    if(k==='routine'){location.href='expert-djeneba-routines.html?nouvelle=1';return}
    if(k==='tableau'){location.href='expert-djeneba-tableau.html?nouveau=1';return}}});
  function yask(){var t=YI.value.trim();if(!t)return;ysay(t,1);YI.value='';
    if(bugStep>=0){bugStep++;if(bugStep<BUGQ.length)setTimeout(function(){ysay(BUGQ[bugStep])},300);else{bugStep=-1;setTimeout(function(){ysay('Merci, c’est transmis à l’équipe Yelema avec une capture de la page. Je vous préviens dès que c’est corrigé.')},400)}return}
    var r=/factur|payer|paiement/i.test(t)?'Votre facture du mois est dans Paramètres, onglet Facturation. Je vous y emmène si vous cliquez sur « Ma facture ».':/connect|outil|gmail|drive/i.test(t)?'Les outils se branchent dans Paramètres, onglet Connecteurs : un clic sur Connecter, puis vous choisissez les Experts qui s’en servent.':/invit|collègue|membre/i.test(t)?'Pour inviter un collègue : bouton « Inviter un collègue » en haut à droite. Vous choisissez son rôle, Admin ou Membre.':'Je regarde. Pour aller plus vite, choisissez un des raccourcis ci-dessus ou décrivez ce que vous cherchez à faire.';
    setTimeout(function(){ysay(r)},400)}
  $('[data-ysend]',YP).onclick=yask;YI.addEventListener('keydown',function(e){if(e.key==='Enter')yask()})}

/* ---------- inviter un collègue (barre du haut, partout) ---------- */
var ROLES={Admin:['Écrire à tous les Experts','Voir les conversations, fichiers et tableaux partagés','Recruter un Expert pour soi ou un collègue','Inviter des membres et changer leur rôle','Gérer connecteurs, canaux, clés et facturation'],
  Membre:['Écrire aux Experts de l’équipe','Voir les conversations, fichiers et tableaux partagés','Demander un recrutement à l’admin'],MembreNon:['Inviter des membres','Gérer connecteurs, canaux, clés et facturation']};
function permHtml(r){var h=(ROLES[r]||[]).map(function(t){return '<li>'+ic('check')+t+'</li>'}).join('');if(r==='Membre')h+=ROLES.MembreNon.map(function(t){return '<li class="n2-x">'+ic('x')+t+'</li>'}).join('');return h}
function invite(onAdd){modal({title:'Inviter un collègue',sub:'Il reçoit un lien pour choisir son mot de passe.',
  body:'<label class="n2-fld"><span>Adresse e-mail</span><input class="n2-in" type="email" placeholder="prenom.nom@unifood.info" data-em></label><div class="n2-fld"><span>Rôle</span><div class="n2-dd n2-ddw" data-val="Membre" data-opts=\'[{"v":"Membre","s":"Utilise les Experts de l’équipe"},{"v":"Admin","s":"Gère aussi l’équipe, les réglages et la facture"}]\'><button type="button" class="n2-ddb"><span class="n2-ddl">Membre</span>'+ic('chev')+'</button></div><ul class="n2-perm" data-perm>'+permHtml('Membre')+'</ul></div>',
  actions:[{label:'Annuler'},{label:'Envoyer l’invitation',pri:1,fn:function(ov){var em=$('[data-em]',ov),v=em.value.trim();if(!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(v)){em.classList.add('n2-bad');em.style.borderColor='#d9443a';em.focus();toast('Indiquez une adresse e-mail valide.');return false}
    var r=$('.n2-dd',ov).dataset.val;if(onAdd)onAdd(v,r);toast('Invitation envoyée à '+esc(v)+' ('+r+').')}}],
  init:function(ov){$('.n2-dd',ov).addEventListener('n2change',function(e){$('[data-perm]',ov).innerHTML=permHtml(e.detail)})}})}
window.n2invite=invite;
$$('[data-invite]').forEach(function(b){b.onclick=function(){if(window.n2addMember)invite(window.n2addMember);else invite()}});

/* ---------- PDF réel (téléchargements) ---------- */
function pdf(name,lines){function a(t){return t.replace(/[’]/g,"'").replace(/[«»]/g,'"').replace(/[  ]/g,' ').replace(/[()\\]/g,'\\$&')}
  var y=780,c='BT /F1 18 Tf 56 '+y+' Td ('+a(lines[0])+') Tj ET\n';lines.slice(1).forEach(function(l,i){y-=(i?20:34);c+='BT /F1 11 Tf 56 '+y+' Td ('+a(l)+') Tj ET\n'});
  c+='BT /F1 9 Tf 56 40 Td (Yelema, document de démonstration) Tj ET\n';
  var o=['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [3 0 R] /Count 1 >>','<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>','<< /Length '+c.length+' >>\nstream\n'+c+'endstream','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>'];
  var s='%PDF-1.4\n',off=[];o.forEach(function(x,i){off.push(s.length);s+=(i+1)+' 0 obj\n'+x+'\nendobj\n'});var xr=s.length;
  s+='xref\n0 '+(o.length+1)+'\n0000000000 65535 f \n'+off.map(function(n){return ('000000000'+n).slice(-10)+' 00000 n \n'}).join('')+'trailer\n<< /Size '+(o.length+1)+' /Root 1 0 R >>\nstartxref\n'+xr+'\n%%EOF';
  var u=new Uint8Array(s.length);for(var i=0;i<s.length;i++){var k=s.charCodeAt(i);u[i]=k<256?k:63}
  var url=URL.createObjectURL(new Blob([u],{type:'application/pdf'})),l=document.createElement('a');l.href=url;l.download=name;document.body.appendChild(l);l.click();setTimeout(function(){URL.revokeObjectURL(url);l.remove()},500);toast('Téléchargement de '+esc(name)+'.')}
window.n2pdf=pdf;
$$('[data-pdf]').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();pdf(b.dataset.pdf,JSON.parse(b.dataset.lines||'["Document"]'))})});

/* ================= pages ================= */
var P=document.body.dataset.page;

/* ---------- connexion ---------- */
if(P==='connexion'){var F=$('[data-login]'),FG=$('[data-forgot]');
  F.addEventListener('submit',function(e){e.preventDefault();var b=$('button[type=submit]',F);b.disabled=true;b.textContent='Connexion…';setTimeout(function(){location.href='accueil.html'},500)});
  $('[data-forgot-open]').onclick=function(){F.hidden=true;FG.hidden=false;$('[data-fst="1"]').hidden=false;$('[data-fst="2"]').hidden=true};
  $('[data-forgot-back]').onclick=function(){F.hidden=false;FG.hidden=true};
  FG.addEventListener('submit',function(e){e.preventDefault();$('[data-fst="1"]').hidden=true;$('[data-fst="2"]').hidden=false});
  $('[data-first]').onclick=function(){modal({title:'Recrutez votre premier Expert',sub:'Créez le compte administrateur de votre entreprise, puis choisissez votre Expert.',body:'<label class="n2-fld"><span>Entreprise</span><input class="n2-in" placeholder="Nom de l’entreprise"></label><label class="n2-fld"><span>Votre adresse e-mail professionnelle</span><input class="n2-in" type="email" placeholder="vous@entreprise.com"></label>',
    actions:[{label:'Annuler'},{label:'Recevoir mon lien',pri:1,fn:function(ov){var i=$$('input',ov);if(!i[0].value.trim()||!/@/.test(i[1].value)){toast('Indiquez l’entreprise et une adresse e-mail.');return false}toast('Lien envoyé à '+esc(i[1].value.trim())+'. Il ouvre la création de votre espace.')}}]})};
  $('[data-askadmin]').onclick=function(){modal({title:'Demander un accès',sub:'Votre administrateur reçoit votre demande et vous invite.',body:'<label class="n2-fld"><span>Votre adresse e-mail professionnelle</span><input class="n2-in" type="email" placeholder="vous@unifood.info"></label>',actions:[{label:'Annuler'},{label:'Envoyer la demande',pri:1,fn:function(ov){var v=$('input',ov).value.trim();if(!/@/.test(v)){toast('Indiquez votre adresse e-mail.');return false}toast('Demande envoyée à votre administrateur.')}}]})};
  $$('[data-eye]').forEach(function(b){b.onclick=function(){var i=$('input',b.parentNode);i.type=i.type==='password'?'text':'password';b.setAttribute('aria-label',i.type==='password'?'Afficher le mot de passe':'Masquer le mot de passe')}})}

/* ---------- choix de version ---------- */
if(P==='choix'){$('[data-v1]').onclick=function(){ls('v33-vue','admin');ss('v36-splash','1');location.href='../yelema/accueil.html'};$('[data-v2]').onclick=function(){location.href='accueil.html'}}

/* ---------- barre d'écriture commune : trombone, champ, modèle, un bouton micro puis Envoyer ---------- */
function initComposer(BOX,onSend){if(!BOX)return null;var T=$('textarea',BOX),GO=$('[data-go]',BOX),ATT=$('.n2-att',BOX),FI=$('input[type=file]',BOX),L=$('.n2-recl',BOX),rec=null,recT=0;
  function mode(){var has=T.value.trim()||ATT.children.length;GO.innerHTML=rec?ic('stop'):has?ic('send'):ic('mic');GO.setAttribute('aria-label',rec?'Arrêter la dictée':has?'Envoyer':'Dicter un message');GO.classList.toggle('n2-rec',!!rec)}
  function grow(){T.style.height='auto';T.style.height=Math.min(T.scrollHeight,180)+'px'}
  T.addEventListener('input',function(){grow();mode()});
  T.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();if(T.value.trim()||ATT.children.length)send()}});
  $('[data-clip]',BOX).onclick=function(){FI.click()};
  FI.onchange=function(){Array.prototype.forEach.call(FI.files,function(f){var s=document.createElement('span');s.innerHTML=ic('file')+'<em>'+esc(f.name)+'</em><button type="button" aria-label="Retirer">'+ic('x')+'</button>';$('button',s).onclick=function(){s.remove();mode()};ATT.appendChild(s)});FI.value='';mode()};
  GO.onclick=function(){if(rec){clearInterval(rec);rec=null;L.hidden=true;T.value=(T.value?T.value+' ':'')+'Peux-tu me préparer ça pour demain matin ?';grow();mode();T.focus();return}
    if(T.value.trim()||ATT.children.length){send();return}
    recT=0;L.hidden=false;L.textContent='Dictée 0:00';rec=setInterval(function(){recT++;L.textContent='Dictée 0:'+('0'+recT).slice(-2)},1000);mode()};
  function send(){var t=T.value.trim(),files=$$('em',ATT).map(function(s){return s.textContent});if(!t&&!files.length)return;T.value='';ATT.innerHTML='';grow();mode();onSend(t,files)}
  mode();return {set:function(v){T.value=v;grow();mode();T.focus()},focus:function(){T.focus()},model:function(){return $('.n2-dd',BOX).dataset.val}}}

/* ---------- accueil ---------- */
if(P==='accueil'){var cur='djeneba',SG=$('[data-sugg]'),CP;
  CP=initComposer($('.n2-comp .n2-cbox'),function(t,files){location.href='expert-'+cur+'.html?msg='+encodeURIComponent(t||('Fichier joint : '+files.join(', ')))});
  function setX(s){cur=s;var x=BY[s];$$('.n2-chip').forEach(function(c){var on=c.dataset.x===s;c.classList.toggle('n2-on',on);c.setAttribute('aria-pressed',on)});$('.n2-comp textarea').placeholder='Que voulez-vous confier à '+x.nom+' ?';
    SG.innerHTML=x.sugg.map(function(t){return '<button type="button">'+esc(t)+'</button>'}).join('');$$('button',SG).forEach(function(b){b.onclick=function(){CP.set(b.textContent)}})}
  $$('.n2-chip').forEach(function(c){c.onclick=function(){setX(c.dataset.x)}});setX('djeneba');
  var br=$('[data-brief]');function goBrief(){location.href='expert-djeneba.html?msg='+encodeURIComponent('Donne-moi le point du jour en détail')}
  br.onclick=goBrief;br.onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();goBrief()}}}

/* ---------- conversations (Expert et chat entreprise) ---------- */
function chatPage(X,replyFn){var MS=$('.n2-msgw'),CL=$('[data-cvlist]');
  function scroll(){var m=$('.n2-msgs');m.scrollTop=m.scrollHeight}
  function empty(){var e=$('.n2-empty',MS);if(e)e.remove()}
  function user(t){empty();var u=document.createElement('div');u.className='n2-u';u.textContent=t;MS.appendChild(u)}
  function reply(t,html){var a=document.createElement('div');a.className='n2-a';a.innerHTML=(X?'<img src="'+X.img+'" alt="">':'<span class="n2-cei n2-sm">'+ic('chat')+'</span>')+'<div><span class="n2-typing"><i></i><i></i><i></i></span></div>';MS.appendChild(a);scroll();
    setTimeout(function(){$('div',a).innerHTML=html||replyFn(t,a);var fb=$('.n2-file button',a);if(fb)fb.onclick=function(){pdf(fb.dataset.n,[fb.dataset.n.replace(/\.pdf$/,''),X?X.nom+', '+X.court:'Chat entreprise',t,'Version de travail à valider.'])};scroll()},900)}
  function cvEl(t){var c=document.createElement('div');c.className='n2-cv';c.innerHTML='<span>'+esc(t)+'</span><button type="button" data-ren aria-label="Renommer">'+ic('pen')+'</button><button type="button" data-del aria-label="Supprimer">'+ic('trash')+'</button>';return c}
  function closeList(){var l=$('.n2-cvl');if(l)l.classList.remove('n2-open');var s=$('.n2-scrim2');if(s)s.remove()}
  function newConv(t){$$('.n2-cv',CL).forEach(function(c){c.classList.remove('n2-on')});var c=cvEl(t.slice(0,40));c.classList.add('n2-on');var d=$('.n2-cvd',CL);CL.insertBefore(c,d?d.nextSibling:CL.firstChild)}
  function send(t,files){if(!MS.querySelector('.n2-u'))newConv(t||files[0]);user(t+(files.length?'\n'+files.map(function(f){return '📎 '+f}).join('\n'):''));scroll();reply(t||files[0])}
  var CP=initComposer($('.n2-cw .n2-cbox'),send);
  function bindSugg(){$$('.n2-empty .n2-sugg button',MS).forEach(function(b){b.onclick=function(){CP.set(b.textContent)}})}bindSugg();
  function blank(){MS.innerHTML=$('#n2-emptytpl').innerHTML;bindSugg();$$('.n2-cv',CL).forEach(function(x){x.classList.remove('n2-on')});closeList();CP.focus()}
  $$('[data-newconv]').forEach(function(b){b.onclick=blank});
  function open(c){$$('.n2-cv',CL).forEach(function(x){x.classList.toggle('n2-on',x===c)});closeList();
    if(c.dataset.demo){location.href=location.pathname.split('/').pop().split('?')[0];return}
    var i=c.dataset.ci,ce=D.cent&&i!==undefined?D.cent[+i]:null;MS.innerHTML='';
    if(ce){user(ce[1]);reply(ce[1],'<p>'+esc(ce[2])+'</p>')}else{user($('span',c).textContent);reply($('span',c).textContent)}}
  CL.addEventListener('click',function(e){var c=e.target.closest('.n2-cv');if(!c)return;
    if(e.target.closest('[data-ren]')){var s=$('span',c);modal({title:'Renommer la conversation',body:'<input class="n2-in" value="'+esc(s.textContent)+'" aria-label="Titre">',actions:[{label:'Annuler'},{label:'Renommer',pri:1,fn:function(ov){var v=$('input',ov).value.trim();if(v)s.textContent=v;toast('Conversation renommée.')}}]});return}
    if(e.target.closest('[data-del]')){var nx=c.nextSibling,par=c.parentNode,was=c.classList.contains('n2-on');c.remove();if(was)blank();toast('Conversation supprimée.',function(){par.insertBefore(c,nx)});return}
    open(c)});
  var H=$('[data-hist]');if(H)H.onclick=function(){var l=$('.n2-cvl');l.classList.add('n2-open');var s=document.createElement('div');s.className='n2-scrim n2-scrim2';s.style.zIndex=94;s.onclick=closeList;document.body.appendChild(s)};
  $$('.n2-file [data-dl]').forEach(function(b){b.onclick=function(){pdf(b.dataset.dl,[b.dataset.dl.replace(/\.pdf$/,''),'Fatima, Marketing et contenu','Semaine du 5 au 11 octobre 2026','Lundi : présentation de la boutique et de ses jus','Mardi : le jus du jour, visuel produit','Mercredi : coulisses de la préparation','Jeudi : avis client à confirmer','Vendredi : offre du week-end, à valider'])}});
  var q=new URLSearchParams(location.search).get('msg');if(q){MS.innerHTML='';send(q,[])}
  var h=location.hash;if(/^#c\d+/.test(h)){var c=$('.n2-cv[data-ci="'+h.slice(2)+'"]',CL);if(c)open(c)}else if(h==='#nouvelle')blank()}

/* ---------- espace d'un Expert : appel et ordinateur (tous les onglets) ---------- */
var X=D.slug?BY[D.slug]:null;
if(X){
  if(P==='expert')chatPage(X,function(t){var nm=X.livre;return '<p>'+esc(X.rep)+'</p><div class="n2-file"><i>PDF</i><div><b>'+esc(nm)+'</b><small>À l’instant, dans Livrables</small></div><button type="button" class="n2-icb" data-n="'+esc(nm)+'" aria-label="Télécharger">'+ic('down')+'</button></div><p>Dites-moi si je dois ajuster quelque chose avant de le partager.</p>'});
  $$('[data-call]').forEach(function(b){b.onclick=function(){var c=document.createElement('div');c.className='n2-call';c.setAttribute('role','dialog');c.setAttribute('aria-label','Appel avec '+X.nom);c.innerHTML='<img src="'+X.img+'" alt=""><h2>'+esc(X.nom)+'</h2><p data-ct>Appel en cours…</p><div class="n2-cbtns"><button type="button" data-mute aria-label="Couper le micro">'+ic('mic')+'</button><button type="button" class="n2-hang" data-hang aria-label="Raccrocher">'+ic('phoneoff')+'</button><button type="button" data-spk aria-label="Haut-parleur">'+ic('vol')+'</button></div>';document.body.appendChild(c);
    var s=0,iv=setInterval(function(){s++;$('[data-ct]',c).textContent=Math.floor(s/60)+':'+('0'+s%60).slice(-2)},1000);
    $('[data-mute]',c).onclick=function(){this.classList.toggle('n2-on');toast(this.classList.contains('n2-on')?'Micro coupé.':'Micro rétabli.')};
    $('[data-spk]',c).onclick=function(){this.classList.toggle('n2-on');toast(this.classList.contains('n2-on')?'Haut-parleur activé.':'Haut-parleur coupé.')};
    $('[data-hang]',c).onclick=function(){clearInterval(iv);c.remove();toast('Appel terminé. '+X.nom+' range le compte rendu dans Livrables.')}}});
  $$('[data-ordi]').forEach(function(b){b.onclick=function(){var O=D.ordi,app=O[0],url=O[1],task=O[2],st=O[3],ac=O[4],done=st.filter(function(x){return /^\d/.test(x[1])}).length;
    var screen=X.slug==='fatima'?'<img src="../img/flyer-sossa.jpg" alt="Visuel en cours">':'<div class="n2-sdoc"><b>'+esc(task.charAt(0).toUpperCase()+task.slice(1))+'</b><i></i><i></i><i class="n2-s"></i><i></i><i class="n2-s"></i><i></i></div>';
    modal({title:X.nom+' '+task,sub:'<span class="n2-live"></span>En direct, depuis '+esc(st[0][1]),wide:1,nofocus:1,
      body:'<div class="n2-ordi"><div class="n2-win"><div class="n2-wbar"><span></span><span></span><span></span><em>'+esc(app)+'</em></div><div class="n2-wurl">'+ic('lock')+esc(url)+'</div><div class="n2-wscr">'+screen+'<div class="n2-cursor"></div></div></div>'+
        '<div class="n2-oside"><h4>Étapes, '+done+' sur '+st.length+'</h4><ol class="n2-ost">'+st.map(function(x){var ok=/^\d/.test(x[1]),now=x[1]==='en cours';return '<li class="'+(ok?'n2-sok':now?'n2-snow':'')+'"><span>'+(ok?ic('check'):'')+'</span><p>'+esc(x[0])+'</p><small>'+esc(x[1])+'</small></li>'}).join('')+'</ol>'+
        '<h4>Ce qu’'+(X.elle?'elle':'il')+' a fait sur l’ordinateur</h4><ul class="n2-oac">'+ac.map(function(x){return '<li><p>'+esc(x[0])+'</p><small>'+esc(x[1])+'</small></li>'}).join('')+'</ul><p class="n2-pp">Demandé par Aïcha. Fin prévue '+esc(st[st.length-1][1])+'.</p></div></div>',
      actions:[{label:'Écrire à '+X.nom,fn:function(){location.href='expert-'+X.slug+'.html#nouvelle'}},{label:'Fermer',pri:1}]})}})}

/* ---------- chat entreprise ---------- */
if(P==='chat')chatPage(null,function(t){return '<p>Voici ce que je trouve dans vos fichiers et vos conversations. Pour « '+esc(t.slice(0,60))+' », je vous propose une première version ci-dessous ; dites-moi ce qu’il faut ajuster.</p><p class="n2-mut">Sources : Fichiers de l’équipe, conversations de la semaine.</p>'});

/* ---------- explorateur de fichiers (Fichiers et Livrables) ---------- */
$$('[data-explorer]').forEach(function(EX){var root={n:EX.dataset.root,dir:1,c:JSON.parse(EX.dataset.tree)},path=[root],view='list',q='';
  var TY={pdf:['PDF','#b4372a','#FCE9E3'],docx:['Word','#2E4EC4','#E3E8FB'],xlsx:['Excel','#17784b','#E5F5EC'],pptx:['PowerPoint','#c25a1c','#FDEBDD'],jpg:['Image','#6d3fd9','#EFE8FD'],png:['Image','#6d3fd9','#EFE8FD']};
  function cur(){return path[path.length-1]}
  function badge(f){if(f.dir)return '<span class="n2-fi n2-fd">'+ic('folder')+'</span>';var t=TY[f.t]||['Fichier','#555','#eee'];return '<span class="n2-fi" style="color:'+t[1]+';background:'+t[2]+'">'+(f.t==='jpg'?ic('image'):'<b>'+esc(f.t.toUpperCase().slice(0,4))+'</b>')+'</span>'}
  EX.innerHTML='<div class="n2-exb"><button type="button" class="n2-icb" data-up aria-label="Dossier parent">'+ic('up')+'</button><nav class="n2-exc" aria-label="Chemin"></nav><label class="n2-srch n2-exs">'+ic('search')+'<input placeholder="Chercher un fichier" aria-label="Chercher un fichier"></label>'+
    '<div class="n2-seg n2-exv"><button type="button" class="n2-on" data-v="list" aria-label="Vue liste" aria-pressed="true">'+ic('list')+'</button><button type="button" data-v="grid" aria-label="Vue grille" aria-pressed="false">'+ic('grid')+'</button></div>'+
    '<button type="button" class="n2-btn" data-mkdir>'+ic('folderplus')+'<span class="n2-lbl">Nouveau dossier</span></button><button type="button" class="n2-btn n2-pri" data-imp>'+ic('upload')+'<span class="n2-lbl">Importer</span></button><input type="file" multiple hidden></div><div class="n2-exl"></div>';
  var LST=$('.n2-exl',EX),FIN=$('input[type=file]',EX),SR=$('.n2-exs input',EX);
  function render(){var c=cur(),items=c.c.slice();if(q)items=flat(root).filter(function(f){return f.n.toLowerCase().indexOf(q)>=0});
    items.sort(function(a,b){return (b.dir?1:0)-(a.dir?1:0)});
    $('.n2-exc',EX).innerHTML=path.map(function(p,i){return i<path.length-1?'<button type="button" data-pi="'+i+'">'+esc(p.n)+'</button>'+ic('chevr'):'<b>'+esc(p.n)+'</b>'}).join('');
    $('[data-up]',EX).disabled=path.length<2;
    if(!items.length){LST.innerHTML='<div class="n2-exe">'+ic('folder')+'<p>'+(q?'Aucun fichier ne correspond.':'Ce dossier est vide. Importez un fichier ou demandez un livrable à un Expert.')+'</p></div>';return}
    LST.className='n2-exl n2-ex-'+view;
    LST.innerHTML=(view==='list'?'<div class="n2-exr n2-exh"><span>Nom</span><span>Modifié le</span><span class="n2-exz">Taille</span><span></span></div>':'')+items.map(function(f,i){
      return '<div class="n2-exr" data-i="'+i+'" tabindex="0" role="button" aria-label="'+(f.dir?'Ouvrir le dossier ':'Aperçu de ')+esc(f.n)+'"><span class="n2-exn">'+badge(f)+'<span><b>'+esc(f.n)+'</b><small class="n2-exm">'+esc(f.d||'')+'</small></span></span><span class="n2-exd">'+esc(f.d||'')+'</span><span class="n2-exz">'+(f.dir?(f.c.length+' élément'+(f.c.length>1?'s':'')):esc(f.s))+'</span><button type="button" class="n2-icb" data-fm aria-label="Actions pour '+esc(f.n)+'">'+ic('dots')+'</button></div>'}).join('');
    LST._items=items}
  function flat(n){var r=[];n.c.forEach(function(f){if(f.dir)r=r.concat(flat(f));else r.push(f)});return r}
  function parentOf(f,n){n=n||root;for(var i=0;i<n.c.length;i++){if(n.c[i]===f)return n;if(n.c[i].dir){var p=parentOf(f,n.c[i]);if(p)return p}}return null}
  function dl(f){var n=f.n;if(f.t==='pdf')return pdf(n,[n.replace(/\.pdf$/,''),'Unifood, document de travail','Modifié le '+(f.d||'')]);
    var src=f.t==='jpg'?'../img/flyer-sossa.jpg':'../img/demo/modele.'+f.t;if(f.dir){src='../img/demo/modele.zip';n=n+'.zip'}
    var a=document.createElement('a');a.href=src;a.download=n;document.body.appendChild(a);a.click();a.remove();toast('Téléchargement de '+esc(n)+'.')}
  function preview(f){var t=TY[f.t]||['Fichier'];var inner=f.t==='jpg'?'<img src="../img/flyer-sossa.jpg" alt="" class="n2-pvi">':'<div class="n2-pvd"><b>'+esc(f.n.replace(/\.[a-z]+$/,''))+'</b><small>Unifood, '+esc(t[0])+'</small><i></i><i></i><i class="n2-s"></i><i></i><i></i><i class="n2-s"></i><i></i></div>';
    modal({title:f.n,sub:esc(t[0])+', '+esc(f.s)+', modifié le '+esc(f.d),wide:1,nofocus:1,body:'<div class="n2-pv">'+inner+'</div>',actions:[{label:'Fermer'},{label:'Télécharger',pri:1,fn:function(){dl(f)}}]})}
  function act(f){if(f.dir){q='';SR.value='';path.push(f);render()}else preview(f)}
  LST.addEventListener('click',function(e){var r=e.target.closest('.n2-exr');if(!r||r.classList.contains('n2-exh'))return;var f=LST._items[+r.dataset.i];
    var m=e.target.closest('[data-fm]');if(!m){act(f);return}
    m.setAttribute('data-pop-btn','');var p=pop(m,(f.dir?'<button type="button" data-a="open">'+ic('folder')+'Ouvrir</button>':'<button type="button" data-a="see">'+ic('eye')+'Aperçu</button>')+'<button type="button" data-a="dl">'+ic('down')+'Télécharger</button><button type="button" data-a="ren">'+ic('pen')+'Renommer</button><hr><button type="button" data-a="del" style="color:#b4372a">'+ic('trash')+'Supprimer</button>');
    if(!p)return;p.style.left='auto';p.style.right='0';
    $$('button',p).forEach(function(x){x.onclick=function(){closePops();var a=x.dataset.a,par=parentOf(f);
      if(a==='open'||a==='see')act(f);if(a==='dl')dl(f);
      if(a==='ren')modal({title:'Renommer',body:'<input class="n2-in" value="'+esc(f.n)+'" aria-label="Nom">',actions:[{label:'Annuler'},{label:'Renommer',pri:1,fn:function(ov){var v=$('input',ov).value.trim();if(v){f.n=v;render();toast('Renommé.')}}}]});
      if(a==='del'){var i=par.c.indexOf(f);par.c.splice(i,1);render();toast(esc(f.n)+' supprimé.',function(){par.c.splice(i,0,f);render()})}}})});
  LST.addEventListener('keydown',function(e){var r=e.target.closest('.n2-exr');if(r&&e.key==='Enter'&&e.target===r){act(LST._items[+r.dataset.i])}});
  $('.n2-exc',EX).addEventListener('click',function(e){var b=e.target.closest('[data-pi]');if(b){path=path.slice(0,+b.dataset.pi+1);render()}});
  $('[data-up]',EX).onclick=function(){if(path.length>1){path.pop();render()}};
  SR.addEventListener('input',function(){q=SR.value.trim().toLowerCase();render()});
  $$('.n2-exv button',EX).forEach(function(b){b.onclick=function(){view=b.dataset.v;$$('.n2-exv button',EX).forEach(function(x){x.classList.toggle('n2-on',x===b);x.setAttribute('aria-pressed',x===b)});render()}});
  $('[data-mkdir]',EX).onclick=function(){modal({title:'Nouveau dossier',body:'<label class="n2-fld"><span>Nom du dossier</span><input class="n2-in" placeholder="Par exemple Salon Agro"></label>',actions:[{label:'Annuler'},{label:'Créer',pri:1,fn:function(ov){var v=$('input',ov).value.trim();if(!v){toast('Donnez un nom au dossier.');return false}cur().c.unshift({n:v,dir:1,d:'4 oct. 2026, à l’instant',c:[]});render();toast('Dossier « '+esc(v)+' » créé.')}}]})};
  $('[data-imp]',EX).onclick=function(){FIN.click()};
  FIN.onchange=function(){Array.prototype.forEach.call(FIN.files,function(f){var ext=(f.name.split('.').pop()||'').toLowerCase();cur().c.unshift({n:f.name,t:TY[ext]?ext:'pdf',s:Math.max(1,Math.round(f.size/1024))+' Ko',d:'4 oct. 2026, à l’instant'})});var n=FIN.files.length;FIN.value='';render();toast(n+' fichier'+(n>1?'s':'')+' importé'+(n>1?'s':'')+'.')};
  render()});

/* ---------- tableau de bord ---------- */
if(P==='x-tableau'){var PERL={Semaine:'Semaine du 28 septembre au 4 octobre',Mois:'Septembre 2026',Trimestre:'Juillet à septembre 2026'};
  $$('[data-period] button').forEach(function(b){b.onclick=function(){$$('[data-period] button').forEach(function(x){x.classList.toggle('n2-on',x===b);x.setAttribute('aria-pressed',x===b)});$('[data-perl]').textContent=PERL[b.textContent];toast('Période : '+PERL[b.textContent]+'.')}});
  $('[data-tdbsave]').onclick=function(){modal({title:'Enregistrer comme modèle',sub:'Le modèle se retrouve dans « Créer un tableau ».',body:'<label class="n2-fld"><span>Nom du modèle</span><input class="n2-in" value="'+esc($('[data-tdbsel]').dataset.val)+'"></label><div class="n2-fld"><span>Pour</span><div class="n2-dd n2-ddw" data-val="Moi seule" data-opts=\'["Moi seule","Certaines personnes","Toute l’équipe"]\'><button type="button" class="n2-ddb"><span class="n2-ddl">Moi seule</span>'+ic('chev')+'</button></div></div>',actions:[{label:'Annuler'},{label:'Enregistrer',pri:1,fn:function(){toast('Modèle enregistré.')}}]})};
  $('[data-tdbedit]').onclick=function(){modal({title:'Modifier le tableau',sub:'Dites à '+X.nom+' ce qu’il faut changer : '+(X.elle?'elle':'il')+' refait le tableau et vous prévient.',body:'<textarea class="n2-in" rows="4" placeholder="Par exemple : ajoute la portée par campagne et retire le tableau des posts"></textarea>',actions:[{label:'Annuler'},{label:'Envoyer à '+X.nom,pri:1,fn:function(ov){if(!$('textarea',ov).value.trim()){toast('Écrivez votre demande.');return false}toast(X.nom+' a reçu votre demande.')}}]})};
  function newTdb(){var opts=[{v:'Vide',s:'Vous ajoutez les blocs'}].concat((D.experts||[]).filter(function(e){return e.team}).map(function(e){return {v:'Modèle de '+e.nom,s:e.court}}));
    modal({title:'Créer un tableau',body:'<label class="n2-fld"><span>Nom</span><input class="n2-in" placeholder="Par exemple Suivi du salon Agro"></label><div class="n2-fld"><span>Partir de</span><div class="n2-dd n2-ddw" data-val="Modèle de '+esc(X.nom)+'" data-opts=\''+esc(JSON.stringify(opts))+'\'><button type="button" class="n2-ddb"><span class="n2-ddl">Modèle de '+esc(X.nom)+'</span>'+ic('chev')+'</button></div></div>',
      actions:[{label:'Annuler'},{label:'Créer',pri:1,fn:function(ov){var v=$('input',ov).value.trim();if(!v){toast('Donnez un nom au tableau.');return false}var s=$('[data-tdbsel]');var o=JSON.parse(s.dataset.opts);o.unshift({v:v,s:'Mon tableau'});s.dataset.opts=JSON.stringify(o);s.dataset.val=v;$('.n2-ddl',s).textContent=v;toast('Tableau « '+esc(v)+' » créé : '+X.nom+' le remplit.')}}]})}
  $('[data-tdbnew]').onclick=newTdb;if(new URLSearchParams(location.search).get('nouveau'))setTimeout(newTdb,200);
  $('[data-tdbsel]').addEventListener('n2change',function(e){toast('Tableau « '+esc(e.detail)+' ».')});
  $('[data-share]').onclick=function(){var link='unifood.yelema.ai/aicha/'+X.slug+'-tableau';
    modal({title:'Partager « '+$('[data-tdbsel]').dataset.val+' »',body:'<label class="n2-srch" style="max-width:none">'+ic('userplus')+'<input placeholder="Ajouter des personnes" aria-label="Ajouter des personnes" data-addp></label><div data-pl><div class="n2-row"><img src="../img/aicha.jpg" alt="" style="border-radius:50%"><div><b>Aïcha Diabaté (vous)</b><small>Propriétaire</small></div></div><div class="n2-row"><img src="../img/m_women_62.jpg" alt="" style="border-radius:50%"><div><b>Mariam Bamba</b><small>mariam.bamba@unifood.info</small></div><div class="n2-dd" data-val="Lecteur" data-opts=\'["Lecteur","Éditeur","Retirer"]\'><button type="button" class="n2-ddb"><span class="n2-ddl">Lecteur</span>'+ic('chev')+'</button></div></div></div>'+
      '<div class="n2-fld" style="margin-top:12px"><span>Accès général</span><div class="n2-dd n2-ddw" data-val="Entreprise" data-opts=\'[{"v":"Limité","s":"Seules les personnes ajoutées"},{"v":"Entreprise","s":"Tous les membres d’Unifood avec le lien"},{"v":"Tous avec le lien","s":"N’importe qui avec le lien"}]\'><button type="button" class="n2-ddb"><span class="n2-ddl">Entreprise</span>'+ic('chev')+'</button></div></div><div class="n2-fld"><span>Envoyer aussi sur</span><div class="n2-tags"><button type="button" class="n2-pill n2-grey" data-ch>Telegram</button><button type="button" class="n2-pill n2-grey" data-ch>Slack</button><button type="button" class="n2-pill n2-grey" data-ch>Teams</button></div></div>',
      init:function(ov){var A=$('[data-addp]',ov);A.addEventListener('keydown',function(e){if(e.key==='Enter'&&A.value.trim()){var r=document.createElement('div');r.className='n2-row';r.innerHTML='<span class="n2-av">'+esc(A.value.trim()[0].toUpperCase())+'</span><div><b>'+esc(A.value.trim())+'</b><small>Lecteur</small></div>';$('[data-pl]',ov).appendChild(r);A.value='';toast('Personne ajoutée.')}});
        $$('[data-ch]',ov).forEach(function(b){b.onclick=function(){b.classList.toggle('n2-grey');b.setAttribute('aria-pressed',!b.classList.contains('n2-grey'))}});
        $('[data-pl] .n2-dd',ov).addEventListener('n2change',function(e){if(e.detail==='Retirer'){e.target.closest('.n2-row').remove();toast('Mariam Bamba n’a plus accès.')}})},
      actions:[{label:'Copier le lien',fn:function(){try{navigator.clipboard.writeText('https://'+link)}catch(_){}toast('Lien copié : '+link);return false}},{label:'OK',pri:1,fn:function(ov){var n=$$('[data-ch]:not(.n2-grey)',ov).map(function(b){return b.textContent});toast(n.length?'Tableau partagé, envoyé sur '+n.join(', ')+'.':'Partage enregistré.')}}]})}}

/* ---------- routines ---------- */
if(P==='x-routines'){var AL=$('[data-ractl]');
  function swb(root){$$('.n2-sw',root).forEach(function(s){if(s._b)return;s._b=1;s.onclick=function(){s.classList.toggle('n2-on');var on=s.classList.contains('n2-on');s.setAttribute('aria-checked',on);toast((on?'Routine activée : ':'Routine en pause : ')+esc($('b',s.parentNode).textContent)+'.')}})}
  swb(AL);
  AL.addEventListener('click',function(e){var b=e.target.closest('[data-rmenu]');if(!b)return;b.setAttribute('data-pop-btn','');var row=b.closest('.n2-rt'),nm=$('b',row).textContent;
    var p=pop(b,'<button type="button" data-a="edit">'+ic('pen')+'Modifier</button><button type="button" data-a="run">'+ic('send')+'Lancer maintenant</button><hr><button type="button" data-a="del" style="color:#b4372a">'+ic('trash')+'Supprimer</button>');if(!p)return;p.style.left='auto';p.style.right='0';
    $$('button',p).forEach(function(x){x.onclick=function(){closePops();var a=x.dataset.a;if(a==='run')toast(X.nom+' lance « '+esc(nm)+' » : le résultat arrive dans ses canaux.');if(a==='edit')routineModal(row);if(a==='del'){var nx=row.nextSibling;row.remove();toast('Routine supprimée.',function(){AL.insertBefore(row,nx)})}}})});
  $$('[data-ract]').forEach(function(b){b.onclick=function(){var r=b.closest('.n2-rt');b.remove();r.classList.remove('n2-rtp');var s=document.createElement('button');s.type='button';s.className='n2-sw n2-on';s.setAttribute('role','switch');s.setAttribute('aria-checked','true');s.setAttribute('aria-label','Activer');r.insertBefore(s,r.firstChild);var m=document.createElement('button');m.type='button';m.className='n2-icb';m.setAttribute('data-rmenu','');m.setAttribute('aria-label','Actions');m.innerHTML=ic('dots');r.appendChild(m);AL.appendChild(r);swb(AL);toast('Routine activée : '+esc($('b',r).textContent)+'.')}});
  var SK=JSON.parse($('[data-rnew]').dataset.skills);
  var DAYS=['Aujourd’hui, 4 oct.','Demain, 5 oct.','Lundi 6 oct.','Mardi 7 oct.','Mercredi 8 oct.'],HRS=[];for(var h=6;h<=21;h++){HRS.push(('0'+h).slice(-2)+':00');HRS.push(('0'+h).slice(-2)+':30')}
  var FREQ=['Chaque jour','Chaque jour ouvré','Chaque lundi','Chaque vendredi','Le 1er du mois'];
  function ddh(attr,val,opts){return '<div class="n2-dd" '+attr+' data-val="'+esc(val)+'" data-opts=\''+esc(JSON.stringify(opts))+'\'><button type="button" class="n2-ddb"><span class="n2-ddl">'+esc(val)+'</span>'+ic('chev')+'</button></div>'}
  function routineModal(row){var ed=!!row,nm=ed?$('b',row).textContent:'',ds=ed?$('p',row).textContent:'';
    var ov=modal({title:X.nom+', '+(ed?'modifier la routine':'nouvelle routine'),wide:1,cls:'n2-rmod',
      body:'<div class="n2-rm"><div class="n2-rml"><input class="n2-rmn" placeholder="Nom de la routine" aria-label="Nom de la routine" value="'+esc(nm)+'"><textarea class="n2-rmd" placeholder="Décrivez la tâche à faire" aria-label="Description">'+esc(ds)+'</textarea>'+
        '<div class="n2-rmw"><div class="n2-rmrow" data-later-row>'+ddh('data-day','Demain, 5 oct.',DAYS)+ddh('data-hr','09:00',HRS)+'<span class="n2-tz">'+ic('hist')+'Africa/Abidjan, GMT</span></div><div class="n2-rmrow" data-rec-row hidden>'+ddh('data-freq','Chaque jour ouvré',FREQ)+ddh('data-hr2','09:00',HRS)+'<span class="n2-tz">'+ic('hist')+'Africa/Abidjan, GMT</span></div></div>'+
        '<div class="n2-rmbar"><div class="n2-seg" data-rmode><button type="button" class="n2-on" aria-pressed="true" data-m="later">'+ic('hist')+'Plus tard</button><button type="button" aria-pressed="false" data-m="rec">'+ic('repeat')+'Récurrent</button></div><button type="button" class="n2-icb" data-rclip aria-label="Joindre un fichier">'+ic('clip')+'</button><input type="file" hidden><button type="button" class="n2-btn n2-sm" data-sk><span>Compétences (<b data-skn>'+Math.min(2,SK.length)+'</b>)</span></button><span class="n2-grow"></span></div></div>'+
        '<aside class="n2-rma"><b>Assistant</b><p class="n2-pp">Décrivez la tâche, je remplis le formulaire. Par exemple : « Chaque lundi à 9 h, prépare le point de la semaine ».</p><div class="n2-rmal"></div><div class="n2-rmai"><input placeholder="Décrivez votre tâche" aria-label="Décrire la tâche à l’assistant"><button type="button" class="n2-go" aria-label="Envoyer">'+ic('send')+'</button></div></aside></div>',
      actions:[{label:'Annuler'},{label:ed?'Enregistrer':'Créer',pri:1,fn:function(ov){var n=$('.n2-rmn',ov).value.trim(),d=$('.n2-rmd',ov).value.trim();if(!d){$('.n2-rmd',ov).focus();toast('Décrivez la tâche à faire.');return false}
        var rec=$('[data-rmode] .n2-on',ov).dataset.m==='rec',when=rec?$('[data-freq]',ov).dataset.val+' à '+$('[data-hr2]',ov).dataset.val:$('[data-day]',ov).dataset.val+' à '+$('[data-hr]',ov).dataset.val+', une fois';
        if(!n)n=d.split(/[.,]/)[0].slice(0,40);
        if(ed){$('b',row).textContent=n;$('p',row).textContent=d;$('small',row).innerHTML=ic('hist')+esc(when)+', Africa/Abidjan';toast('Routine enregistrée.');return}
        var r=document.createElement('div');r.className='n2-rt';r.innerHTML='<button type="button" class="n2-sw n2-on" role="switch" aria-checked="true" aria-label="Activer '+esc(n)+'"></button><div><b>'+esc(n)+'</b><p>'+esc(d)+'</p><small>'+ic('hist')+esc(when)+', Africa/Abidjan</small></div><button type="button" class="n2-icb" data-rmenu aria-label="Actions">'+ic('dots')+'</button>';AL.appendChild(r);swb(AL);toast('Routine créée : '+esc(n)+'.')}}]});
    $$('[data-rmode] button',ov).forEach(function(b){b.onclick=function(){$$('[data-rmode] button',ov).forEach(function(x){x.classList.toggle('n2-on',x===b);x.setAttribute('aria-pressed',x===b)});var rec=b.dataset.m==='rec';$('[data-rec-row]',ov).hidden=!rec;$('[data-later-row]',ov).hidden=rec}});
    $('[data-rclip]',ov).onclick=function(){$('input[type=file]',ov).click()};$('input[type=file]',ov).onchange=function(){if(this.files.length)toast(esc(this.files[0].name)+' joint à la routine.')};
    var chosen=SK.slice(0,2);$('[data-sk]',ov).setAttribute('data-pop-btn','');$('[data-sk]',ov).onclick=function(){var b=this,p=pop(b,SK.map(function(s){var on=chosen.indexOf(s)>=0;return '<button type="button" class="'+(on?'n2-sel':'')+'" data-s="'+esc(s)+'">'+(on?ic('check'):'<span style="width:18px"></span>')+esc(s)+'</button>'}).join(''));if(!p)return;p.style.maxHeight='260px';p.style.overflow='auto';
      $$('button',p).forEach(function(x){x.onclick=function(e){e.stopPropagation();var s=x.dataset.s,i=chosen.indexOf(s);if(i>=0)chosen.splice(i,1);else chosen.push(s);x.classList.toggle('n2-sel',i<0);x.firstChild.outerHTML=i<0?ic('check'):'<span style="width:18px"></span>';$('[data-skn]',b).textContent=chosen.length}})};
    var AI=$('.n2-rmai input',ov);function ask(){var t=AI.value.trim();if(!t)return;var l=$('.n2-rmal',ov);l.innerHTML+='<div class="n2-ym n2-moi">'+esc(t)+'</div>';AI.value='';
      var hm=t.match(/(\d{1,2})\s*(h|:)\s*(\d{2})?/),hh=hm?('0'+hm[1]).slice(-2)+':'+(hm[3]||'00'):'09:00',rec=/chaque|tous les|toutes les/i.test(t),fq=/lundi/i.test(t)?'Chaque lundi':/vendredi/i.test(t)?'Chaque vendredi':/mois/i.test(t)?'Le 1er du mois':/ouvr/i.test(t)?'Chaque jour ouvré':'Chaque jour';
      $('.n2-rmd',ov).value=t.replace(/^(chaque|tous les|toutes les)\s+\S+(\s+à\s+\d{1,2}\s*(h|:)\s*\d{0,2})?\s*,?\s*/i,'').replace(/^./,function(c){return c.toUpperCase()});if(!$('.n2-rmn',ov).value)$('.n2-rmn',ov).value=$('.n2-rmd',ov).value.split(/[.,]/)[0].slice(0,40);
      $$('[data-rmode] button',ov)[rec?1:0].click();function setdd(sel,v){var d=$(sel,ov);d.dataset.val=v;$('.n2-ddl',d).textContent=v}if(rec){setdd('[data-freq]',fq);setdd('[data-hr2]',hh)}else setdd('[data-hr]',hh);
      setTimeout(function(){l.innerHTML+='<div class="n2-ym">C’est rempli : '+(rec?esc(fq.toLowerCase())+' à '+hh:'une fois, à '+hh)+'. Vérifiez et cliquez sur Créer.</div>'},300)}
    $('.n2-rmai .n2-go',ov).onclick=ask;AI.addEventListener('keydown',function(e){if(e.key==='Enter')ask()})}
  $('[data-rnew]').onclick=function(){routineModal(null)};if(new URLSearchParams(location.search).get('nouvelle'))setTimeout(function(){routineModal(null)},200)}

/* ---------- analytique ---------- */
if(P==='x-analytique'){$$('[data-anaper] button').forEach(function(b){b.onclick=function(){var m=b.textContent==='30 jours';$$('[data-anaper] button').forEach(function(x){x.classList.toggle('n2-on',x===b);x.setAttribute('aria-pressed',x===b)});$$('[data-m]').forEach(function(el){el.textContent=m?el.dataset.m:el.dataset.s});var sb=$('[data-anasub]');if(sb)sb.textContent='Les fichiers du dossier Livrables, sur les '+(m?'30':'7')+' derniers jours.';toast(m?'Chiffres des 30 derniers jours.':'Chiffres des 7 derniers jours.')}})}

/* ---------- recruter et fiches ---------- */
if(P==='recruter'){$$('.n2-fchip').forEach(function(c){c.onclick=function(){var f=c.dataset.fam;$$('.n2-fchip').forEach(function(x){x.classList.toggle('n2-on',x===c);x.setAttribute('aria-pressed',x===c)});$$('[data-rc]').forEach(function(k){k.hidden=!!f&&k.dataset.fam!==f})}});
  if(location.hash.length>1){var k=$('[data-rc="'+location.hash.slice(1)+'"]');if(k)setTimeout(function(){k.scrollIntoView({block:'center'})},100)}}
$$('[data-recruit]').forEach(function(b){b.onclick=function(){var x=BY[b.dataset.recruit];modal({title:'Recruter '+x.nom,sub:(x.elle?'Experte, ':'Expert, ')+x.court+'. '+x.tl,
  body:'<div style="display:flex;gap:14px;align-items:center;margin:0 0 14px"><img src="'+x.img+'" alt="" style="width:64px;height:64px;border-radius:50%;object-fit:cover;object-position:50% 12%"><div style="font-size:14px;color:#3a3360">'+esc(x.mission)+'</div></div><div class="n2-fld"><span>Pour qui</span><div class="n2-dd n2-ddw" data-val="Pour moi" data-opts=\'["Pour moi","Pour un collègue","Pour un service"]\'><button type="button" class="n2-ddb"><span class="n2-ddl">Pour moi</span>'+ic('chev')+'</button></div></div><div class="n2-k" style="padding:14px"><small>Abonnement</small><b style="font-size:20px">+ 200 000 FCFA par mois</b><p>Ajouté à votre prochaine facture, sans frais d’installation en plus.</p></div>',
  actions:[{label:'Plus tard'},{label:'Recruter '+x.nom,pri:1,fn:function(){$$('[data-rc="'+x.slug+'"]').forEach(function(c){var bd=$('.n2-badge',c);if(bd){bd.textContent='Arrive demain matin';bd.classList.add('n2-bin')}var rb=$('[data-recruit]',c);if(rb){rb.outerHTML='<span class="n2-btn n2-done">'+ic('check')+'Recruté'+(x.elle?'e':'')+'</span>'}});toast(x.nom+' rejoint votre équipe : '+(x.elle?'elle':'il')+' se présente demain matin.')}}]})}});

/* ---------- paramètres ---------- */
if(P==='parametres'){
  function tab(){var h=(location.hash||'#equipe').slice(1).split('&')[0];if(!$('[data-pane="'+h+'"]'))h='equipe';
    $$('[data-pane]').forEach(function(p){p.hidden=p.dataset.pane!==h});$$('.n2-tabs a').forEach(function(a){a.classList.toggle('n2-on',a.getAttribute('href')==='#'+h);if(a.classList.contains('n2-on'))a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
    var cr=$('[data-crumb]');if(cr)cr.textContent=$('.n2-tabs a.n2-on').textContent.trim();
    if(/inviter/.test(location.hash))setTimeout(function(){invite(addMember)},150)}
  addEventListener('hashchange',tab);tab();
  /* équipe */
  var TB=$('[data-members]');
  function addMember(em,r){var row=document.createElement('div');row.className='n2-tr';var ini=em[0].toUpperCase();row.innerHTML='<div class="n2-who"><span class="n2-av">'+ini+'</span><div><b>'+esc(em.split('@')[0].replace(/[._]/g,' '))+'</b><small>'+esc(em)+'</small></div></div><div class="n2-c2"><span class="n2-pill'+(r==='Admin'?'':' n2-grey')+'" data-role>'+r+'</span><span class="n2-pill n2-cor">Invitation envoyée</span></div><div class="n2-cell n2-c3">4 oct. 2026</div><div class="n2-cell n2-c4">Jamais</div><div class="n2-c5"><button type="button" class="n2-icb" data-mact aria-label="Actions">'+ic('dots')+'</button></div>';TB.appendChild(row)}
  window.n2addMember=addMember;
  TB.addEventListener('click',function(e){var b=e.target.closest('[data-mact]');if(!b)return;b.setAttribute('data-pop-btn','');var row=b.closest('.n2-tr'),me=row.hasAttribute('data-me');
    var p=pop(b,(me?'':'<button type="button" data-a="role">'+ic('swap')+'Changer le rôle</button>')+'<button type="button" data-a="link">'+ic('link')+'Copier un lien d’accès</button>'+(me?'<a href="#profil">'+ic('user')+'Mon profil</a>':'<hr><button type="button" data-a="del" style="color:#b4372a">'+ic('trash')+'Retirer de l’équipe</button>'));
    if(!p)return;p.style.right='0';p.style.left='auto';
    $$('button',p).forEach(function(x){x.onclick=function(){closePops();var a=x.dataset.a,nm=$('b',row).textContent;
      if(a==='link'){try{navigator.clipboard.writeText('https://unifood.yelema.ai/acces/'+Math.random().toString(36).slice(2,10))}catch(_){}toast('Lien d’accès copié.')}
      if(a==='role'){var R=$('[data-role]',row);var cur=R.textContent;modal({title:'Rôle de '+nm,body:'<div class="n2-dd n2-ddw" data-val="'+cur+'" data-opts=\'["Membre","Admin"]\'><button type="button" class="n2-ddb"><span class="n2-ddl">'+cur+'</span>'+ic('chev')+'</button></div><ul class="n2-perm" data-perm>'+permHtml(cur)+'</ul>',
        init:function(ov){$('.n2-dd',ov).addEventListener('n2change',function(e){$('[data-perm]',ov).innerHTML=permHtml(e.detail)})},actions:[{label:'Annuler'},{label:'Enregistrer',pri:1,fn:function(ov){var v=$('.n2-dd',ov).dataset.val;R.textContent=v;R.classList.toggle('n2-grey',v!=='Admin');toast(nm+' est maintenant '+v+'.')}}]})}
      if(a==='del'){modal({title:'Retirer '+nm+' ?',sub:'Il perd l’accès tout de suite. Ses conversations restent dans l’espace.',actions:[{label:'Annuler'},{label:'Retirer',dan:1,fn:function(){var nx=row.nextSibling;row.remove();toast(nm+' a été retiré.',function(){TB.insertBefore(row,nx)})}}]})}}})});
  $('[data-addm]').onclick=function(){invite(addMember)};
  /* connecteurs */
  var CS=$('[data-csearch]');if(CS)CS.addEventListener('input',function(){var q=CS.value.trim().toLowerCase();var n=0;$$('[data-con]').forEach(function(c){var on=!q||c.dataset.con.toLowerCase().indexOf(q)>=0;c.hidden=!on;if(on)n++});$('[data-cnone]').hidden=n>0});
  function conState(c,on){c.dataset.on=on?'1':'';$('.n2-st',c).className='n2-st '+(on?'n2-ok':'n2-no');$('.n2-st',c).innerHTML=on?ic('check'):ic('plus');$('.n2-st',c).setAttribute('aria-label',on?'Connecté':'Non connecté');var b=$('footer .n2-btn',c);b.textContent=on?'Gérer':'Connecter';b.classList.toggle('n2-pri',!on);$('footer small',c).textContent=on?c.dataset.who:''}
  $$('[data-con]').forEach(function(c){$('footer .n2-btn',c).onclick=function(){var nm=c.dataset.con,on=!!c.dataset.on;
    var chips=EX.filter(function(x){return x.team}).map(function(x){return '<div class="n2-row" style="padding:8px 0"><img src="'+x.img+'" alt="" style="border-radius:50%;object-fit:cover;object-position:50% 12%"><div><b>'+x.nom+'</b><small>'+x.court+'</small></div><button type="button" class="n2-sw n2-on" role="switch" aria-checked="true" aria-label="'+x.nom+' peut s’en servir"></button></div>'}).join('');
    modal({title:(on?'Gérer ':'Connecter ')+nm,sub:on?'Choisissez les Experts qui s’en servent.':'Vous autorisez '+nm+' dans une fenêtre sécurisée, puis vous choisissez les Experts qui s’en servent. Vous révoquez quand vous voulez.',body:'<div style="max-height:300px;overflow:auto">'+chips+'</div>',
      init:function(ov){$$('.n2-sw',ov).forEach(function(s){s.onclick=function(){s.classList.toggle('n2-on');s.setAttribute('aria-checked',s.classList.contains('n2-on'))}})},
      actions:on?[{label:'Déconnecter',dan:1,fn:function(){conState(c,false);toast(nm+' est déconnecté.')}},{label:'Enregistrer',pri:1,fn:function(ov){var n=$$('.n2-sw.n2-on',ov).length;c.dataset.who=n+' Expert'+(n>1?'s':'');conState(c,true);toast('Accès à '+nm+' mis à jour.')}}]
        :[{label:'Annuler'},{label:'Autoriser '+nm,pri:1,fn:function(ov){var n=$$('.n2-sw.n2-on',ov).length;c.dataset.who=n+' Expert'+(n>1?'s':'');conState(c,true);toast(nm+' est connecté pour '+n+' Expert'+(n>1?'s':'')+'.')}}]})}});
  /* canaux */
  $$('[data-chan]').forEach(function(c){var b=$('footer .n2-btn',c);if(!b)return;b.onclick=function(){var nm=c.dataset.chan,on=!!c.dataset.on;
    if(on){modal({title:nm,sub:'Connecté. Vos Experts répondent aussi sur '+nm+'.',actions:[{label:'Déconnecter',dan:1,fn:function(){chanState(c,false);toast(nm+' est déconnecté.')}},{label:'Fermer',pri:1}]});return}
    var body=nm==='Telegram'?'<ol class="n2-steps"><li>Ouvrez @BotFather dans Telegram.</li><li>Envoyez <code>/newbot</code> et suivez les étapes.</li><li>Collez ici le jeton du bot.</li></ol><label class="n2-fld"><span>Jeton du bot</span><input class="n2-in" placeholder="123456789:AA…"></label>'
      :nm==='WhatsApp'?'<label class="n2-fld"><span>Numéro WhatsApp de l’entreprise</span><input class="n2-in" type="tel" placeholder="+225 07 00 00 00 00"></label><p style="font-size:13.5px;color:#6A6487;margin:0">Vous recevez un code sur ce numéro pour confirmer.</p>'
      :'<p style="margin:0 0 6px;font-size:14px">Une fenêtre '+nm+' s’ouvre : choisissez l’espace de travail, puis autorisez Yelema.</p>';
    modal({title:'Connecter '+nm,body:body,actions:[{label:'Annuler'},{label:'Continuer',pri:1,fn:function(ov){var i=$('input',ov);if(i&&!i.value.trim()){i.style.borderColor='#d9443a';toast('Ce champ est requis.');return false}chanState(c,true);toast(nm+' est connecté.')}}]})}});
  function chanState(c,on){c.dataset.on=on?'1':'';var p=$('.n2-pill',c);p.textContent=on?'Connecté':'Non connecté';p.className='n2-pill '+(on?'n2-gr':'n2-grey');var b=$('footer .n2-btn',c);b.textContent=on?'Gérer':'Connecter';b.classList.toggle('n2-pri',!on);
    if(c.dataset.chan==='Telegram'){var s=$('[data-topics]');s.disabled=!on;$('[data-topics-h]').textContent=on?'Telegram est connecté : vous pouvez créer les sujets.':'Connectez d’abord Telegram ci-dessus.'}}
  var TP=$('[data-topics]');if(TP)TP.onclick=function(){toast('Les 6 sujets sont créés dans votre groupe Telegram.');TP.textContent='Sujets créés';TP.disabled=true};
  var RF=$('[data-refresh]');if(RF)RF.onclick=function(){toast('États des canaux à jour.')};
  /* clés et connexions */
  $$('[data-sw]').forEach(function(s){s.onclick=function(){s.classList.toggle('n2-on');s.setAttribute('aria-checked',s.classList.contains('n2-on'));toast(s.dataset.sw+(s.classList.contains('n2-on')?' activé.':' désactivé.'))}});
  $$('[data-kmenu]').forEach(function(b){b.setAttribute('data-pop-btn','');b.onclick=function(){var row=b.closest('.n2-row'),nm=$('b',row).textContent;var p=pop(b,'<button type="button" data-a="def">'+ic('check')+'Mettre par défaut</button><button type="button" data-a="test">'+ic('swap')+'Tester la connexion</button><hr><button type="button" data-a="del" style="color:#b4372a">'+ic('trash')+'Supprimer</button>');if(!p)return;p.style.right='0';p.style.left='auto';
    $$('button',p).forEach(function(x){x.onclick=function(){closePops();var a=x.dataset.a;if(a==='def'){$$('[data-defk]').forEach(function(d){d.hidden=true});var d=$('[data-defk]',row);if(d)d.hidden=false;toast(nm+' est la clé par défaut.')}
      if(a==='test')toast(nm+' répond correctement.');if(a==='del'){var nx=row.nextSibling,par=row.parentNode;row.remove();toast(nm+' supprimé.',function(){par.insertBefore(row,nx)})}}})}});
  $('[data-addcon]').onclick=function(){var kinds={ia:'<div class="n2-fld"><span>Fournisseur</span><div class="n2-dd n2-ddw" data-val="Anthropic" data-opts=\'["Anthropic","OpenAI","Google","Mistral"]\'><button type="button" class="n2-ddb"><span class="n2-ddl">Anthropic</span>'+ic('chev')+'</button></div></div><label class="n2-fld"><span>Clé API</span><input class="n2-in" placeholder="Collez la clé"></label>',
      api:'<label class="n2-fld"><span>Service</span><input class="n2-in" placeholder="Nom du service, par exemple Odoo"></label><label class="n2-fld"><span>Clé API</span><input class="n2-in" placeholder="Collez la clé"></label>',
      mcp:'<label class="n2-fld"><span>Nom</span><input class="n2-in" placeholder="Par exemple Stock Unifood"></label><label class="n2-fld"><span>Adresse du serveur</span><input class="n2-in" placeholder="https://"></label>'};
    modal({title:'Ajouter une connexion',body:'<div class="n2-choice"><button type="button" class="n2-on" data-k="ia"><b>Modèle d’IA</b>Votre clé chez un fournisseur</button><button type="button" data-k="api"><b>Autre service</b>Une clé API</button><button type="button" data-k="mcp"><b>Serveur MCP</b>Les outils d’un serveur</button></div><div data-kf style="min-height:170px">'+kinds.ia+'</div>',
      init:function(ov){$$('[data-k]',ov).forEach(function(b){b.onclick=function(){$$('[data-k]',ov).forEach(function(x){x.classList.toggle('n2-on',x===b)});$('[data-kf]',ov).innerHTML=kinds[b.dataset.k];dd(ov)}})},
      actions:[{label:'Annuler'},{label:'Ajouter',pri:1,fn:function(ov){var ins=$$('[data-kf] input',ov);if(ins.some(function(i){return !i.value.trim()})){toast('Remplissez les champs.');return false}
        var k=$('[data-k].n2-on',ov).dataset.k,L=$(k==='mcp'?'[data-mcpl]':'[data-keyl]');var r=document.createElement('div');r.className='n2-row';var nm=k==='ia'?$('.n2-dd',ov).dataset.val:ins[0].value.trim();
        r.innerHTML='<img src="'+(k==='mcp'?'../img/sg-icone.svg':'https://www.google.com/s2/favicons?domain=yelema.ai&sz=64')+'" alt=""><div><b>'+esc(nm)+'</b><small>'+(k==='mcp'?esc(ins[1].value.trim()):'•••• '+esc(ins[ins.length-1].value.trim().slice(-4)))+'</small></div><span class="n2-st n2-ok" aria-label="Connecté">'+ic('check')+'</span>';L.appendChild(r);toast(esc(nm)+' est ajouté.')}}]})};
  /* facturation */
  $$('.n2-seg').forEach(function(sg){$$('button',sg).forEach(function(b){b.onclick=function(){$$('button',sg).forEach(function(x){x.classList.toggle('n2-on',x===b);x.setAttribute('aria-pressed',x===b)});var t=$('[data-payhelp]');if(t)t.textContent=b.dataset.help;toast('Mode de paiement : '+b.textContent+'.')}})});
  $$('.n2-pays button').forEach(function(b){b.onclick=function(){$$('.n2-pays button').forEach(function(x){x.classList.toggle('n2-on',x===b)});var n=$('[data-momo]');if(n)n.hidden=!b.dataset.momo;toast(b.textContent.trim()+' choisi pour les prochains paiements.')}});
  var PL=$('[data-plus]');if(PL)PL.onclick=function(){modal({title:'Ajouter Yelema Plus',sub:'Yelema Plus s’ajoute à votre formule Team. Votre conseiller Yelema vous présente le détail avant toute facturation.',actions:[{label:'Annuler'},{label:'Être rappelé',pri:1,fn:function(){toast('Demande envoyée : votre conseiller Yelema vous rappelle.')}}]})};
  var PN=$('[data-paynow]');if(PN)PN.onclick=function(){modal({title:'Recharger le compte',sub:'Le compte prépayé règle chaque mois l’abonnement de vos Experts.',body:'<div class="n2-fld"><span>Montant</span><div class="n2-dd n2-ddw" data-val="2100000" data-opts=\'[{"v":"2100000","l":"2 100 000 FCFA, un mois"},{"v":"6300000","l":"6 300 000 FCFA, trois mois"}]\'><button type="button" class="n2-ddb"><span class="n2-ddl">2 100 000 FCFA, un mois</span>'+ic('chev')+'</button></div></div>',actions:[{label:'Annuler'},{label:'Payer',pri:1,fn:function(){toast('Paiement envoyé : validez-le sur votre téléphone.')}}]})};
  /* profil */
  var PF=$('[data-photo]');if(PF){var pfi=$('[data-photoin]');PF.onclick=function(){pfi.click()};pfi.onchange=function(){var f=pfi.files[0];if(!f)return;var u=URL.createObjectURL(f);$$('[data-myphoto]').forEach(function(i){i.src=u});toast('Photo mise à jour.')}}
  $$('[data-save]').forEach(function(b){b.onclick=function(){toast('Modifications enregistrées.')}});
  var PW=$('[data-pw]');if(PW)PW.onclick=function(){modal({title:'Changer le mot de passe',body:'<label class="n2-fld"><span>Mot de passe actuel</span><input class="n2-in" type="password"></label><label class="n2-fld"><span>Nouveau mot de passe</span><input class="n2-in" type="password" placeholder="8 caractères au moins"></label>',actions:[{label:'Annuler'},{label:'Changer',pri:1,fn:function(ov){var i=$$('input',ov);if(!i[0].value||i[1].value.length<8){toast('Le nouveau mot de passe doit faire 8 caractères au moins.');return false}toast('Mot de passe changé.')}}]})};
  $$('[data-look] button').forEach(function(b){b.onclick=function(){$$('[data-look] button').forEach(function(x){x.classList.toggle('n2-on',x===b)});toast('Apparence : '+b.textContent+'.')}})}
})();
