/*! MCBR cleanup-home v38-20250825-063732Z */
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
        while (el && !/^(P|DIV|SECTION|ARTICLE|LI|SMALL)$/i.test(el.tagName)) el = el.parentElement;
        if (el) culled.add(el);
      }
    }
    culled.forEach(el => el.remove());
  }
  function onReady(fn){ if(document.readyState!=="loading") fn(); else document.addEventListener("DOMContentLoaded", fn); }
  onReady(function(){
    if (location.pathname === "/" || /\bindex\.html$/i.test(location.pathname)) {
      removeBanned(document.body);
    }
  });
})();
