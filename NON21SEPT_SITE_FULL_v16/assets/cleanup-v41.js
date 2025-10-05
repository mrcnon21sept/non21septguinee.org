/*! MCBR cleanup-v41 v41-20250825-065446Z */
(function(){"use strict";
  const PHRASES = [
    /Votre\s+texte\s*\(tel\s*quel\)\s*s[’']affiche\s*depuis\s*user-content\/raisons\.html\./i,
    /Formulaire\s*Netlify\s*Forms\.\s*Les\s*signatures\s*sont\s*visibles\s*dans\s*l[’']onglet\s*Forms\./i
  ];
  const BLOCK_TAG = /^(P|DIV|SECTION|ARTICLE|LI|SMALL|FIGCAPTION|H\d)$/i;

  function cullRoot(root) {
    const walker = (root.createTreeWalker||document.createTreeWalker).call(root, root, NodeFilter.SHOW_TEXT, null);
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

  function cullAllContexts(win) {
    try { cullRoot(win.document.body || win.document); } catch(e){}
    try {
      (win.document||{}).querySelectorAll('*').forEach(el => {
        if (el.shadowRoot) try { cullRoot(el.shadowRoot); } catch(e){}
      });
    } catch(e){}
    try {
      (win.document||{}).querySelectorAll('iframe').forEach(fr => {
        try { if (fr.contentWindow && fr.contentWindow.document) cullAllContexts(fr.contentWindow); } catch(e){}
      });
    } catch(e){}
  }

  const obs = new MutationObserver(() => cullAllContexts(window));
  function onReady(fn){ if(document.readyState!=="loading") fn(); else document.addEventListener("DOMContentLoaded", fn); }

  onReady(function(){
    cullAllContexts(window);
    try { obs.observe(document.documentElement, {subtree:true, childList:true, characterData:true}); } catch(e){}
  });
})();
