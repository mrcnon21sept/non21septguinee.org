
/*! MCBR runtime patch v30-20250825-051313Z */
(function(){"use strict";
  const banned = [
    /Ajoutez\s+les\s+annonces\s+v[ée]rifi[ée]es\s+pour\s+enrichir\s+cette\s+rubrique\.?/i,
    /Lieu\(x\)\s*:\s*[àa]\s*pr[ée]ciser\s*\(Guin[ée]e\s*\+\s*capitales\s*diaspora\).*?(Sujet\s*:\s*(rejet|Boycott|Non)\s+du\s+r[ée]f[ée]rendum\s+du\s+21\s*septembre\.)?/i,
    /Dates,\s*lieux,\s*sujets\s*des\s*mobilisations.*?Cette\s*section\s*est\s*pr[ée]vue.*?(v[ée]rifi[ée]es)?\.?/i
  ];

  function removeBannedText(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    const toCull = new Set();
    let n;
    while ((n = walker.nextNode())) {
      const t = n.nodeValue && n.nodeValue.replace(/\s+/g,' ').trim();
      if (!t) continue;
      if (banned.some(r => r.test(t))) {
        let el = n.parentElement;
        // escalate to a sensible block container
        while (el && !/^(P|DIV|SECTION|ARTICLE|LI|MAIN)$/i.test(el.tagName)) el = el.parentElement;
        if (el) toCull.add(el);
      }
    }
    toCull.forEach(el => el.remove());
  }

  function injectCurated() {
    // Only on actualités pages
    const p = location.pathname.toLowerCase();
    if (!/(^|\/)actualit[ée]s\//.test(p)) return;
    // Find main container or body
    const main = document.querySelector('main') || document.querySelector('#main') || document.body;
    // If already curated, skip
    if (main.querySelector('[data-curated="v30"]')) return;
    // Clear repeated/legacy blocks containing 'Actualités – Mobilisations'
    Array.from(main.querySelectorAll('*')).forEach(el => {
      const txt = (el.textContent||'').replace(/\s+/g,' ').trim();
      if (/^Actualit[ée]s\s*[–—-]/i.test(txt)) {
        // remove top-level parent card/section
        let t = el;
        while (t.parentElement && !/^(MAIN|BODY|SECTION|DIV)$/i.test(t.parentElement.tagName)) t = t.parentElement;
        t.remove();
      }
    });
    // Ensure basic styles exist (only add once)
    if (!document.querySelector('#mcbr-actus-style')) {
      const style = document.createElement('style');
      style.id = 'mcbr-actus-style';
      style.textContent = `
        :root{--gn-green:#009e49;--gn-yellow:#fcd116;--gn-red:#ce1126}
        .hero{background:#fff;border:1px solid #e5e7eb;border-left:6px solid var(--gn-red);border-radius:14px;padding:18px;margin:16px 0}
        .hero h1{margin:0 0 8px;font-size:1.9rem;line-height:1.2}
        .lead{margin:0;font-size:1.05rem}
        .group{margin-top:18px}
        .grid{display:grid;gap:14px;margin-top:12px}
        .card{background:#fff;border:1px solid #e5e7eb;border-left:6px solid var(--gn-red);padding:14px;border-radius:12px}
        .card time{font-weight:700}
        .stamp{margin-top:6px;color:#64748b;font-size:.8rem}
      `;
      document.head.appendChild(style);
    }
    // Inject curated fragment
    const wrapper = document.createElement('div');
    wrapper.className = 'container';
    wrapper.innerHTML = "\n<section class=\"hero\" data-curated=\"v30\">\n  <h1>Actualit\u00e9s \u2014 Mobilisations contre le r\u00e9f\u00e9rendum du 21 septembre</h1>\n  <p class=\"lead\">Agenda des mobilisations \u00e0 venir et points de contexte r\u00e9cents (Guin\u00e9e &amp; diaspora).</p>\n  <div class=\"stamp\">Version v30-20250825-051313Z</div>\n</section>\n\n<section class=\"group\">\n  <h2>\u00c0 venir</h2>\n  <div class=\"grid\">\n    <article class=\"card\">\n      <time datetime=\"2025-09-05\">5&nbsp;septembre&nbsp;2025 \u2014 Guin\u00e9e &amp; diaspora</time>\n      <div>D\u00e9but des manifestations appel\u00e9es par les Forces Vives de Guin\u00e9e.</div>\n    </article>\n    <article class=\"card\">\n      <time datetime=\"2025-09-06\">6&nbsp;septembre&nbsp;2025 \u2014 Diaspora</time>\n      <div>Rassemblements annonc\u00e9s en Europe &amp; Am\u00e9rique (Berlin, Bruxelles, Paris, Montr\u00e9al, New&nbsp;York).</div>\n    </article>\n    <article class=\"card\">\n      <time datetime=\"2025-09-13\">13&nbsp;septembre&nbsp;2025 \u2014 New&nbsp;York (USA)</time>\n      <div>Grande marche de la diaspora (\u00ab&nbsp;paix &amp; unit\u00e9&nbsp;\u00bb), organis\u00e9e par le Comit\u00e9 Unit\u00e9 &amp; Fiert\u00e9.</div>\n    </article>\n    <article class=\"card\">\n      <time datetime=\"2025-09-21\">21&nbsp;septembre&nbsp;2025 \u2014 Guin\u00e9e</time>\n      <div>R\u00e9f\u00e9rendum constitutionnel.</div>\n    </article>\n  </div>\n</section>\n\n<section class=\"group\">\n  <h2>Contexte r\u00e9cent</h2>\n  <div class=\"grid\">\n    <article class=\"card\">\n      <time datetime=\"2025-08-23\">23&nbsp;ao\u00fbt&nbsp;2025 \u2014 Conakry</time>\n      <div>Suspension des trois principaux partis d\u2019opposition par la junte, un mois avant le scrutin.</div>\n    </article>\n  </div>\n</section>\n";
    // If page already has a container with news, try to replace it
    const anchor = main.querySelector('.container, main, body');
    if (anchor && anchor.parentNode) {
      main.appendChild(wrapper);
    } else {
      main.appendChild(wrapper);
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    removeBannedText(document.body);
    injectCurated();
  });
})();
