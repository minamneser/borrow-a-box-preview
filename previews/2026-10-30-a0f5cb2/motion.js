(() => {
 'use strict';
 if(!window.gsap)return;
 const plugins=['ScrollTrigger','ScrollSmoother','ScrollToPlugin','SplitText','TextPlugin','ScrambleTextPlugin','DrawSVGPlugin','MotionPathPlugin','MorphSVGPlugin','Flip','CustomEase'].map(name=>window[name]).filter(Boolean);
 gsap.registerPlugin(...plugins);
 if(window.CustomEase)CustomEase.create('borrowEase','0.22,1,0.36,1');
 const ease=window.CustomEase?'borrowEase':'power3.out';
 const mm=gsap.matchMedia();
 const header=document.querySelector('.header');
 mm.add({motion:'(prefers-reduced-motion: no-preference)',desktop:'(min-width:901px)',fine:'(hover:hover) and (pointer:fine)'},context=>{
  const {motion,desktop,fine}=context.conditions;
  if(!motion)return;
  const cleanups=[];
  let smoother;
  if(desktop&&window.ScrollSmoother&&window.ScrollTrigger){smoother=ScrollSmoother.create({wrapper:'#smooth-wrapper',content:'#smooth-content',smooth:1.05,smoothTouch:false,effects:false,normalizeScroll:false});window.BAB.smoother=smoother;cleanups.push(()=>{smoother.kill();window.BAB.smoother=null;});}
  const intro=gsap.timeline({defaults:{ease,duration:1}});
  intro.from(header,{y:-35,opacity:0,duration:.9,clearProps:'transform,opacity'},0);
  const headline=document.querySelector('h1');
  let split;
  if(headline&&window.SplitText){const headingLabel=headline.innerText.replace(/\s+/g,' ').trim();split=SplitText.create(headline,{type:'words',mask:'words',wordsClass:'headline-word',aria:'auto'});headline.setAttribute('aria-label',headingLabel);intro.from(split.words,{yPercent:115,rotation:2,stagger:.055,duration:1.05,clearProps:'transform'},.12);cleanups.push(()=>split.revert());}
  else if(headline)intro.from(headline,{y:30,opacity:0},.1);
  const hero=document.querySelector('.hero-copy')||document.querySelector('.services-hero>div');
  if(hero){intro.from(hero.querySelector('.eyebrow'),{opacity:0,y:12,duration:.8},.08);const copy=hero.querySelector('.hero-description')||hero.querySelector('p:not(.eyebrow)');if(copy)intro.from(copy,{opacity:0,y:20,duration:.8},.5);const actions=hero.querySelector('.hero-actions')||hero.querySelector('.text-link');if(actions)intro.from(actions,{opacity:0,y:15,duration:.8},.65);}
  const visual=document.querySelector('.hero-visual')||document.querySelector('.service-hero-art');
  if(visual){intro.from(visual,{opacity:0,y:40,scale:.97,duration:1.2,clearProps:'transform'},.2);const image=visual.querySelector('img');if(image)intro.from(image,{scale:1.14,duration:1.7,ease:'power2.out',clearProps:'transform'},.2);const tag=visual.querySelector('.photo-tag')||visual.querySelector('.service-floating-tag');if(tag)intro.from(tag,{opacity:0,y:18,duration:.8},.95);}
  if(document.querySelector('.hero-checks'))intro.from('.hero-checks span',{opacity:0,y:9,stagger:.1,duration:.6},.9);
  if(document.querySelector('.hero-status')){intro.from('.hero-status',{opacity:0,y:10,duration:.7},.85);if(window.TextPlugin)intro.fromTo('#hero-status-text',{text:''},{text:'Delivered. Packed. Picked up.',duration:.8,ease:'none'},.9);}
  const eyebrow=document.querySelector('.hero .eyebrow')||document.querySelector('.services-hero .eyebrow');
  if(eyebrow&&window.ScrambleTextPlugin)intro.to(eyebrow,{scrambleText:{text:eyebrow.textContent.trim(),chars:'01',revealDelay:.1,speed:.5},duration:.85},.15);
  if(window.ScrollTrigger){
   gsap.fromTo('.header-progress',{scaleX:0},{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:.3}});
   ScrollTrigger.create({start:35,end:'max',onToggle:self=>header.classList.toggle('is-scrolled',self.isActive)});
   document.querySelectorAll('.section-heading,.services-heading,.faq-intro,.service-details>div:first-child,.closing>div').forEach(el=>gsap.from(el,{scrollTrigger:{trigger:el,start:'top 90%',once:true},opacity:0,y:28,duration:.85,ease}));
   document.querySelectorAll('.steps,.review-grid,.price-grid:not(.service-grid),.service-specs,.service-inclusions').forEach(group=>{const children=Array.from(group.children);gsap.from(children,{scrollTrigger:{trigger:group,start:'top 88%',once:true},opacity:0,y:34,stagger:.095,duration:.85,ease,clearProps:'transform,opacity'});});
   document.querySelectorAll('.faq-list details').forEach((detail,i)=>gsap.from(detail,{scrollTrigger:{trigger:detail,start:'top 94%',once:true},opacity:0,y:16,duration:.55,delay:Math.min(i*.025,.15),clearProps:'transform,opacity'}));
   if(document.querySelector('.hero-visual')&&desktop)gsap.to('.hero-visual>img',{yPercent:8,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
   if(document.querySelector('.tree-stat')){const stat=document.querySelector('.tree-stat strong');const counter={value:0};cleanups.push(()=>{stat.innerHTML='500<span>+</span>';});gsap.to(counter,{value:500,duration:1.8,ease:'power2.out',onUpdate:()=>{stat.innerHTML=`${Math.round(counter.value)}<span>+</span>`;},scrollTrigger:{trigger:stat,start:'top 90%',once:true},onComplete:()=>{stat.innerHTML='500<span>+</span>';}});}
   if(document.querySelector('#moving-route')&&window.DrawSVGPlugin&&window.MotionPathPlugin){const route=gsap.timeline({scrollTrigger:{trigger:'#how-it-works',start:'top 80%',end:'bottom 50%',scrub:1}});route.from('#moving-route',{drawSVG:'0%',ease:'none'},0);route.to('#route-box',{motionPath:{path:'#moving-route',align:'#moving-route',alignOrigin:[.5,.5],autoRotate:false},ease:'none'},0);}
   if(window.DrawSVGPlugin){document.querySelectorAll('.step-top svg,.service-inclusions svg').forEach(svg=>gsap.from(svg.querySelectorAll('path,circle'),{drawSVG:'0%',duration:1.2,stagger:.1,ease:'power2.inOut',scrollTrigger:{trigger:svg,start:'top 94%',once:true}}));}
   if(document.querySelector('.tree-stat svg')&&window.MorphSVGPlugin){const leaf=document.querySelector('.tree-stat svg path');const onEnter=()=>gsap.to(leaf,{morphSVG:'M4 12L9 17L20 6 M4 12L9 17L20 6',duration:.6,ease:'power2.inOut'});const original=leaf.getAttribute('d');const onLeave=()=>gsap.to(leaf,{morphSVG:original,duration:.6,ease:'power2.inOut'});const stat=document.querySelector('.tree-stat');stat.addEventListener('pointerenter',onEnter);stat.addEventListener('pointerleave',onLeave);cleanups.push(()=>{stat.removeEventListener('pointerenter',onEnter);stat.removeEventListener('pointerleave',onLeave);leaf.setAttribute('d',original);});}
  }
  if(fine){
   document.querySelectorAll('.button,.icon-button').forEach(button=>{const x=gsap.quickTo(button,'x',{duration:.45,ease:'power3.out'}),y=gsap.quickTo(button,'y',{duration:.45,ease:'power3.out'});const move=e=>{const r=button.getBoundingClientRect();x((e.clientX-r.left-r.width/2)*.12);y((e.clientY-r.top-r.height/2)*.18);};const leave=()=>{x(0);y(0);};button.addEventListener('pointermove',move);button.addEventListener('pointerleave',leave);cleanups.push(()=>{button.removeEventListener('pointermove',move);button.removeEventListener('pointerleave',leave);x.tween.kill();y.tween.kill();gsap.set(button,{clearProps:'transform'});});});
   document.querySelectorAll('.price-card,.review-grid figure,.steps article').forEach(card=>{const enter=()=>gsap.to(card,{y:-5,duration:.35,ease:'power2.out',overwrite:'auto'});const leave=()=>gsap.to(card,{y:0,duration:.45,ease:'power2.out',overwrite:'auto'});card.addEventListener('pointerenter',enter);card.addEventListener('pointerleave',leave);cleanups.push(()=>{card.removeEventListener('pointerenter',enter);card.removeEventListener('pointerleave',leave);gsap.set(card,{clearProps:'transform'});});});
  }
  if(window.ScrollTrigger)requestAnimationFrame(()=>ScrollTrigger.refresh());
  return()=>{cleanups.forEach(fn=>fn());header.classList.remove('is-scrolled');};
 });
 document.querySelectorAll('a[href*="#"]').forEach(link=>link.addEventListener('click',e=>{
  const url=new URL(link.href,location.href);const path=p=>p.replace(/index\.html$/,'').replace(/\/$/,'');if(url.origin!==location.origin||path(url.pathname)!==path(location.pathname)||!url.hash)return;
  const target=document.getElementById(decodeURIComponent(url.hash.slice(1)));if(!target)return;
  e.preventDefault();window.BAB?.closeMenu();const offset=header.getBoundingClientRect().height+34;
  if(window.BAB?.reduced()){target.scrollIntoView({behavior:'instant'});}
  else if(window.BAB?.smoother){window.BAB.smoother.scrollTo(Math.max(0,window.BAB.smoother.offset(target,'top top')-offset),true);}
  else if(window.ScrollToPlugin)gsap.to(window,{scrollTo:{y:target,offsetY:offset,autoKill:true},duration:.95,ease:'power3.inOut'});
  else target.scrollIntoView({behavior:'smooth'});
  history.replaceState(null,'',url.hash);
 }));
 const refresh=()=>{window.ScrollTrigger?.refresh();if(location.hash){const target=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(target){const offset=header.getBoundingClientRect().height+34;if(window.BAB?.smoother)window.BAB.smoother.scrollTo(Math.max(0,window.BAB.smoother.offset(target,'top top')-offset),false);else window.scrollTo({top:target.getBoundingClientRect().top+window.scrollY-offset,behavior:'instant'});}}};
 if(document.readyState==='complete')refresh();else window.addEventListener('load',refresh,{once:true});
 window.addEventListener('pagehide',()=>mm.revert(),{once:true});
})();

