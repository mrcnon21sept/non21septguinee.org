/*! MCBR cleanup-global v39-20250825-064351Z */
(function(){"use strict";
  const BANNED = [
    /Votre\s+texte\s*\(tel\s*quel\)\s*s[’']affiche\s*depuis\s*user-content\/raisons\.html\./i,
    /Formulaire\s*Netlify\s*Forms\.\s*Les\s*signatures\s*sont\s*visibles\s*dans\s*l[’']onglet\s*Forms\./i
  ];
  function removeBanned(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    const culled = new Set();
    let node;
    while ((node = walker.nextNode())) {
      const t = (node.nodeValue||"").replace(/\s+/g," ").trim();
      if (!t) continue;
      if (BANNED.some(r=>r.test(t))) {
        let el = node.parentElement;
        // escalate to a sensible block container
        while (el && !/^(P|DIV|SECTION|ARTICLE|LI|SMALL)$/i.test(el.tagName)) el = el.parentElement;
        if (el) culled.add(el);
      }
    }
    culled.forEach(el => el.remove());
  }
  function relabelActualites(root) {
    const candidates = root.querySelectorAll('a, button, nav *, .nav *, h2, h3, .menu *');
    candidates.forEach(el => {
      const txt = (el.textContent||"").trim();
      if (/^Actualit[ée]s$/.test(txt)) {
        el.textContent = "L’actualité guinéenne";
      }
      // fix weird "Signer le Actualités"
      if (/Signer\s+le\s+Actualit[ée]s/i.test(txt)) {
        el.textContent = "L’actualité guinéenne";
      }
    });
  }
  function onReady(fn){ if(document.readyState!=="loading") fn(); else document.addEventListener("DOMContentLoaded", fn); }
  onReady(function(){
    removeBanned(document.body);
    relabelActualites(document.body);
  });
})();
