(() => {
 'use strict';const C=window.BABCatalog;if(!C)return;
 const page=location.pathname.split('/').pop()||'index.html';
 document.querySelectorAll('.desktop-nav a').forEach(a=>{const current=a.getAttribute('href')===page;a.classList.toggle('current',current);if(current)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 const money=cents=>new Intl.NumberFormat('en-US',{style:'currency',currency:C.currency}).format(cents/100);
 function setPrice(el,cents){if(!el)return;const [whole,decimal]=money(cents).split('.');el.replaceChildren(document.createTextNode(whole));const small=document.createElement('small');small.textContent='.'+decimal;el.append(small);}
 C.kits.forEach(kit=>{document.querySelectorAll(`[data-kit-card="${kit.id}"]`).forEach(card=>setPrice(card.querySelector('.kit-caption>span'),kit.cents));document.querySelectorAll(`.service-card:has([data-kit="${kit.id}"])`).forEach(card=>setPrice(card.querySelector('.price'),kit.cents));});
 document.querySelectorAll('[data-reviews-link]').forEach(a=>a.href='reviews.html');
 document.querySelectorAll('.contact-form').forEach(form=>{
  const topic=form.querySelector('[name=topic]'),rating=form.querySelector('[data-review-rating]');const q=new URLSearchParams(location.search).get('topic');if(q&&[...topic.options].some(o=>o.value===q))topic.value=q;
  const updateTopic=()=>{if(rating){rating.hidden=topic.value!=='review';rating.querySelectorAll('input').forEach(i=>i.disabled=rating.hidden);}};updateTopic();topic.addEventListener('change',updateTopic);
  const result=form.querySelector('[data-contact-draft]');form.addEventListener('input',()=>result.hidden=true);form.addEventListener('change',()=>result.hidden=true);
  form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const d=new FormData(form),label=topic.selectedOptions[0].textContent;const body=[`Borrow A Box — ${label}`,`Name: ${d.get('name')}`,`Reply email: ${d.get('email')}`,d.get('phone')?`Phone: ${d.get('phone')}`:'',d.get('rating')?`My rating: ${d.get('rating')} out of 5`:'',d.get('permission')?'Permission to publish feedback: yes':'Permission to publish feedback: not granted','',String(d.get('message')||''),'','Prepared from the preview contact form. Please reply to the email above.'].filter(Boolean).join('\n');result.querySelector('textarea').value=body;result.querySelector('a').href=`mailto:${C.email}?subject=${encodeURIComponent(label)}&body=${encodeURIComponent(body)}`;result.hidden=false;result.querySelector('a').focus();});
 });
})();
