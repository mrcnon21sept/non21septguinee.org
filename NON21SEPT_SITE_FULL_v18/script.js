const y=document.querySelector('#year');if(y)y.textContent=new Date().getFullYear();
(async()=>{const s=document.querySelector('#reasons-slot');if(!s)return;try{const r=await fetch('user-content/raisons.html',{cache:'no-store'});if(r.ok){s.innerHTML=await r.text();}}catch(e){}})();
