/* Interface finale Yelema : compléments du prototype (E-mails des Experts, inscription, revue tech). */
(function () {
  var page = location.pathname.split('/').pop() || 'index.html';
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function toast(t) {
    var d = document.createElement('div'); d.className = 'fz-toast'; d.textContent = t; document.body.appendChild(d);
    setTimeout(function () { d.classList.add('fz-in'); }, 10); setTimeout(function () { d.remove(); }, 2400);
  }

  /* Connexion : « Recrutez votre premier Expert » ouvre l'inscription du site */
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('[data-first]')) {
      e.preventDefault(); e.stopImmediatePropagation(); location.href = '../parcours/s1-1-experts.html';
    }
  }, true);

  /* E-mails d'un Expert */
  $$('[data-fz-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      try { navigator.clipboard.writeText(b.dataset.fzCopy); } catch (_) {}
      toast('Adresse copiée');
    });
  });
  $$('[data-fz-f]').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('[data-fz-f]').forEach(function (x) { x.classList.toggle('n2-on', x === b); });
      $$('[data-fz-mail]').forEach(function (m) { m.hidden = !(b.dataset.fzF === 'tous' || m.dataset.sens === b.dataset.fzF); });
    });
  });
  function modale(titre, corps, ok) {
    var m = document.createElement('div'); m.className = 'fz-mod';
    m.innerHTML = '<div class="fz-box" role="dialog" aria-label="' + esc(titre) + '"><div class="fz-bh"><b>' + esc(titre) +
      '</b><button type="button" data-x aria-label="Fermer">×</button></div><div class="fz-bb">' + corps +
      '</div><div class="fz-bf"><button type="button" class="n2-btn" data-x>Fermer</button>' + (ok ? '<button type="button" class="n2-btn n2-pri" data-ok>' + esc(ok) + '</button>' : '') + '</div></div>';
    document.body.appendChild(m);
    m.addEventListener('click', function (e) { if (e.target === m || e.target.closest('[data-x]')) m.remove(); });
    return m;
  }
  $$('[data-fz-mail]').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = b.querySelector('.fz-mt');
      modale(t.querySelector('span').textContent,
        '<p class="fz-de">' + esc(t.querySelector('b').textContent) + '</p><p>' + esc(t.querySelector('small').textContent) + '</p>' +
        (b.querySelector('.fz-md svg') ? '<p class="fz-pj">📎 document.pdf</p>' : ''), 'Répondre')
        .querySelector('[data-ok]').addEventListener('click', function () { toast('Réponse envoyée'); $('.fz-mod').remove(); });
    });
  });
  var nv = $('[data-fz-new]');
  if (nv) nv.addEventListener('click', function () {
    var m = modale('Nouveau message',
      '<label>À<input type="email" placeholder="adresse@entreprise.ci"></label><label>Objet<input type="text"></label>' +
      '<label>Message<textarea rows="5"></textarea></label>', 'Envoyer');
    m.querySelector('[data-ok]').addEventListener('click', function () { m.remove(); toast('Message envoyé'); });
  });

  /* Revue tech : ce qui est en ligne, en local, en erreur ou à faire sur cet écran */
  var bt = document.createElement('button'); bt.type = 'button'; bt.className = 'fz-rv'; bt.textContent = 'Revue tech';
  document.body.appendChild(bt);
  var pan = document.createElement('aside'); pan.className = 'fz-pan'; pan.hidden = true; document.body.appendChild(pan);
  var data = null;
  function ouvrir() {
    var et = data[data.length - 1].etats, items = data.slice(0, -1).filter(function (x) { return new RegExp(x.pages).test(page); });
    pan.innerHTML = '<div class="fz-ph"><b>Revue tech · cet écran</b><button type="button" data-c aria-label="Fermer">×</button></div>' +
      (items.length ? items.map(function (x) {
        var e = et[x.etat];
        return '<div class="fz-it"><span class="fz-pill" style="color:' + e[1] + ';background:' + e[2] + '">' + e[0] + '</span><b>' + esc(x.nom) +
          '</b><small>' + esc(x.qui) + (x.note ? ' · ' + esc(x.note) : '') + '</small></div>';
      }).join('') : '<p>Rien de particulier sur cet écran.</p>') +
      '<a class="fz-all" href="' + (location.pathname.indexOf('/app/') > -1 || location.pathname.indexOf('/parcours/') > -1 ? '../' : '') + 'a-terminer.html">Tout ce qui reste à terminer →</a>';
    pan.hidden = false; try { sessionStorage.setItem('fz-rv', '1'); } catch (_) {}
    pan.querySelector('[data-c]').onclick = function () { pan.hidden = true; try { sessionStorage.removeItem('fz-rv'); } catch (_) {} };
  }
  function charger(cb) {
    if (data) return cb();
    fetch('../fonctionnalites.json').then(function (r) { return r.json(); }).then(function (d) { data = d; cb(); })
      .catch(function () { toast('Liste indisponible hors ligne'); });
  }
  bt.addEventListener('click', function () { if (!pan.hidden) { pan.hidden = true; try { sessionStorage.removeItem('fz-rv'); } catch (_) {} return; } charger(ouvrir); });
  try { if (sessionStorage.getItem('fz-rv')) charger(ouvrir); } catch (_) {}
})();
