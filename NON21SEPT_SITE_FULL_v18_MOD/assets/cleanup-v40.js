/*! MCBR cleanup-v40 v40-20250825-064905Z */
(function(){"use strict";
  const PHRASES = [
    /Votre\s+texte\s*\(tel\s*quel\)\s*s[’']affiche\s*depuis\s*user-content\/raisons\.html\./i,
    /Formulaire\s*Netlify\s*Forms\.\s*Les\s*signatures\s*sont\s*visibles\s*dans\s*l[’']onglet\s*Forms\./i
  ];
  const BLOCK_TAG = /^(P|DIV|SECTION|ARTICLE|LI|SMALL|FIGCAPTION|H\d)$/i;

  function cull(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    const culled = new Set();
    let node;
    while ((node = walker.nextNode())) {
      const t = (node.nodeValue||"").replace(/\s+/g," ").trim();
      if (!t) continue;
      if (PHRASES.some(r=>r.test(t))) {
        let el = node.parentElement;
        while (el && !BLOCK_TAG.test(el.tagName)) el = el.parentElement;
        if (el) culled.add(el);
      }
    }
    culled.forEach(el => el.remove());
  }

  const obs = new MutationObserver(muts => {
    let need = false;
    for (const m of muts) {
      if (m.type === "childList") { need = true; break; }
      if (m.type === "characterData") { need = true; break; }
    }
    if (need) cull(document.body);
  });

  function onReady(fn){ if(document.readyState!=="loading") fn(); else document.addEventListener("DOMContentLoaded", fn); }

  onReady(function(){
    cull(document.body);
    try { obs.observe(document.body, {subtree:true, childList:true, characterData:true}); } catch(e){}
  });
})();
