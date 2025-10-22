document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{const id=a.getAttribute('href'); if(id.length>1){e.preventDefault(); const el=document.querySelector(id); if(el){el.scrollIntoView({behavior:'smooth',block:'start'});} } });
  });
  const sections=[...document.querySelectorAll('.product-section')];
  const toc=document.getElementById('toc-list'); const items=[];
  sections.forEach((sec,i)=>{
    const n=i+1; const title=(sec.dataset.title||`Editor’s Pick #${n}`).trim(); const id=`pick-${n}`; sec.id=id;
    const li=document.createElement('li'); const a=document.createElement('a'); a.href=`#${id}`; a.textContent=title; li.appendChild(a); toc.appendChild(li);
    const btn=sec.querySelector('a.cta'); items.push({"@type":"ListItem",position:n,url:btn?btn.href:"",name:title});
  });
  const script=document.getElementById('itemlist-jsonld'); if(script){ script.textContent=JSON.stringify({"@context":"https://schema.org","@type":"ItemList","itemListElement":items}); }
});