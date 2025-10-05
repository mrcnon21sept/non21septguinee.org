// patch-actualités-v30.js — applique 3 correctifs au chargement:
// 1) Insère 2 cartes (Le Monde + Reuters) juste après "6 sept 2025 — Paris (France)"
// 2) Supprime le lien TV5MONDE sur "5 sept 2025 — Guinée"
// 3) Supprime tout label isolé "Info" sur la page actualité
(function(){
  function ready(fn){document.readyState!=='loading'?fn():document.addEventListener('DOMContentLoaded',fn);}
  function card(o){
    const art=document.createElement('article'); art.className='card';
    const h=document.createElement('header');
    const t=document.createElement('time'); t.setAttribute('datetime',o.iso); t.innerHTML=o.dateText;
    const span=document.createElement('span'); span.className='city'; span.textContent=o.city;
    h.appendChild(t); h.appendChild(document.createTextNode(' — ')); h.appendChild(span);
    const body=document.createElement('div'); body.innerHTML=o.bodyHTML;
    const refs=document.createElement('div'); refs.className='refs'; refs.style.pointerEvents='auto';
    refs.appendChild(document.createTextNode(': '));
    o.links.forEach((L,i)=>{const a=document.createElement('a'); a.href=L.href; a.target='_blank'; a.rel='noopener';
      a.style.pointerEvents='auto'; a.style.position='relative'; a.style.zIndex='3'; a.textContent=L.label;
      refs.appendChild(a); if(i<o.links.length-1) refs.appendChild(document.createTextNode(', '));});
    art.appendChild(h); art.appendChild(body); art.appendChild(refs); return art;
  }
  function insertCards(){
    const cards=[...document.querySelectorAll('article.card')];
    let anchor=null;
    for(const c of cards){
      const time=c.querySelector('time'); const city=c.querySelector('.city');
      const iso=time?(time.getAttribute('datetime')||'').trim():'';
      const cityTxt=city?city.textContent.trim():'';
      if(iso.startsWith('2025-09-06') && /paris/i.test(cityTxt)){anchor=c;break;}
    }
    if(!anchor){
      for(const c of cards){
        const time=c.querySelector('time'); const iso=time?(time.getAttribute('datetime')||'').trim():'';
        if(iso.startsWith('2025-09-06')){anchor=c;break;}
      }
    }
    if(!anchor) return;
    // dedupe
    const DUP=['lemonde.fr/afrique/article/2025/10/02/en-guinee-l-enlevement-du-pere','reuters.com/world/africa/guinea-announces-first-post-coup-presidential-vote'];
    document.querySelectorAll('article.card a[href]').forEach(a=>{
      if(DUP.some(u=>a.href.includes(u))){
        const art=a.closest('article.card'); if(art&&art.parentNode) art.parentNode.removeChild(art);
      }
    });
    const cardLeMonde=card({
      iso:'2025-10-02',
      dateText:'2&nbsp;octobre&nbsp;2025',
      city:'Guinée',
      bodyHTML:"L’enlèvement du père d’un journaliste <strong>suscite l’indignation</strong> et relance les inquiétudes sur le climat sécuritaire.",
      links:[{href:'https://www.lemonde.fr/afrique/article/2025/10/02/en-guinee-l-enlevement-du-pere-d-un-journaliste-suscite-l-indignation_6644056_3212.html?utm_source=chatgpt.com',label:'Le Monde'}]
    });
    const cardReuters=card({
      iso:'2025-09-29',
      dateText:'29&nbsp;septembre&nbsp;2025',
      city:'Guinée',
      bodyHTML:"Annonce officielle : la présidentielle est <strong>fixée au 28&nbsp;décembre&nbsp;2025</strong>. Réactions critiques sur le calendrier.",
      links:[{href:'https://www.reuters.com/world/africa/guinea-announces-first-post-coup-presidential-vote-december-28-2025-09-29/?utm_source=chatgpt.com',label:'Reuters'}]
    });
    anchor.insertAdjacentElement('afterend', cardReuters);
    anchor.insertAdjacentElement('afterend', cardLeMonde);
  }
  function stripTV5(){
    // 5 sept 2025: retirer TV5MONDE
    document.querySelectorAll('article.card').forEach(c=>{
      const t=c.querySelector('time'); const iso=t?(t.getAttribute('datetime')||''):'';
      if(iso.startsWith('2025-09-05')){
        c.querySelectorAll('a[href]').forEach(a=>{
          if(/tv5monde/i.test(a.href) || /tv5monde/i.test(a.textContent)){ a.remove(); }
        });
        // Nettoie ", ,"
        c.querySelectorAll('.refs').forEach(ref=>{
          ref.innerHTML=ref.innerHTML.replace(/,\s*,/g,', ').replace(/:\s*,/g,': ');
        });
      }
    });
  }
  function stripInfo(){
    // Supprime tout élément dont le texte exact est "Info"
    document.querySelectorAll('small,span,a,em,strong,div,p,li,button').forEach(el=>{
      if(el.textContent.trim().toLowerCase()==='info'){ el.remove(); }
    });
  }
  ready(function(){ insertCards(); stripTV5(); stripInfo(); });
})();
