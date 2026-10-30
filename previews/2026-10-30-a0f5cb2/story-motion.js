(async () => {
 await document.fonts.ready;
 'use strict';
 const g=window.gsap,hasMotion=()=>!matchMedia('(prefers-reduced-motion: reduce)').matches;
 const reviews=[{name:'Nicole G.',place:'Montclair, NJ',text:'Borrow A Box made moving so much easier. The boxes were clean, sturdy, and delivered right to our apartment exactly when promised. Way better than dealing with cardboard boxes from stores. The pickup process was just as smooth. Highly recommend for anyone moving in NJ!'},{name:'Brianna A.',place:'Princeton, NJ',text:'So pleased with my experience using Borrow a Box to do a short move. These stackable boxes and the dolly they come with are a LIFESAVER. Avoiding cardboard and excessive packing material is genius. Very reasonable price to rent the totes for a week. The delivery and pickup is a game changer and the service was exceptional. So happy to have this as an option!'},{name:'Michael R.',place:'Red Bank, NJ',text:'Moving is stressful, but Borrow A Box made it simpler. The kits are perfect and so much sturdier than tape and cardboard boxes.'}];
 const reviewDialog=document.getElementById('review-dialog');let reviewTrigger;
 document.querySelectorAll('[data-review]').forEach(button=>button.addEventListener('click',()=>{const review=reviews[Number(button.dataset.review)];document.getElementById('review-title').textContent=review.name;document.getElementById('review-location').textContent=review.place;document.getElementById('review-full').textContent=`“${review.text}”`;reviewTrigger=button;reviewDialog.showModal();document.body.style.overflow='hidden';window.BAB?.smoother?.paused(true);if(g&&hasMotion())g.fromTo(reviewDialog,{opacity:0,y:15},{opacity:1,y:0,duration:.35,clearProps:'all'});}));
 reviewDialog?.addEventListener('close',()=>{reviewTrigger?.focus({preventScroll:true});});
 const journeyScenes=Array.from(document.querySelectorAll('.journey-scene')),journeyFrames=Array.from(document.querySelectorAll('[data-journey-image]'));
 const sceneLabels=['At your door','Packed and ready','Room to settle in','Ready to go again'];let activeJourney=-1;
 function showJourney(index,animate=false,overlayText=false){
  if(!journeyFrames.length||index===activeJourney)return;
  const previous=activeJourney;activeJourney=index;
  document.querySelector('.journey-stage').dataset.activeStep=String(index);
  document.querySelectorAll('[data-journey]').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));
  document.querySelector('.journey-live-label').textContent=sceneLabels[index];
  journeyFrames.forEach((frame,i)=>{
   const current=i===index;frame.classList.toggle('is-active',current);frame.setAttribute('aria-hidden',String(!current));
   if(g&&animate){g.killTweensOf(frame);if(current){g.set(frame,{zIndex:1});g.fromTo(frame,{autoAlpha:previous<0?1:0,scale:1.035},{autoAlpha:1,scale:1,duration:.65,ease:'power2.out',overwrite:true});}else{g.set(frame,{zIndex:0});g.to(frame,{autoAlpha:0,duration:.45,overwrite:true});}}
   else{frame.style.opacity=current?'1':'0';frame.style.visibility=current?'visible':'hidden';frame.style.transform='none';}
  });
  if(overlayText)journeyScenes.forEach((scene,i)=>{const current=i===index;scene.setAttribute('aria-hidden',String(!current));g.killTweensOf(scene);g.to(scene,{autoAlpha:current?1:0,y:current?0:-18,duration:animate?.4:0,ease:'power2.out',overwrite:true});});
 }
 function setupStackedJourney(animate){
  if(!journeyScenes.length)return()=>{};
  let queued=false;
  const update=()=>{queued=false;const picture=document.querySelector('.journey-picture'),line=Math.min(innerHeight*.85,header.getBoundingClientRect().bottom+picture.offsetHeight+45);let index=0;journeyScenes.forEach((scene,i)=>{if(scene.getBoundingClientRect().top<=line)index=i;});showJourney(index,animate);};
  const scroll=()=>{if(!queued){queued=true;requestAnimationFrame(update);}};
  window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',scroll);update();
  return()=>{window.removeEventListener('scroll',scroll);window.removeEventListener('resize',scroll);};
 }
 if(!g)return;
 g.registerPlugin(...['ScrollTrigger','ScrollSmoother','ScrollToPlugin','SplitText','DrawSVGPlugin','MorphSVGPlugin','Flip','CustomEase'].map(p=>window[p]).filter(Boolean));
 if(window.CustomEase)CustomEase.create('storyEase','0.22,1,0.36,1');
 const ease=window.CustomEase?'storyEase':'power3.out',header=document.querySelector('.header'),mm=g.matchMedia();let journeyTimeline;
 mm.add({motion:'(prefers-reduced-motion:no-preference)',desktop:'(min-width:901px)'},ctx=>{
  const {motion,desktop}=ctx.conditions;if(!motion)return setupStackedJourney(false);
  const cleanups=[];
  if(desktop&&window.ScrollSmoother){const smoother=ScrollSmoother.create({wrapper:'#smooth-wrapper',content:'#smooth-content',smooth:.9,smoothTouch:false,effects:false});window.BAB.smoother=smoother;cleanups.push(()=>{smoother.kill();window.BAB.smoother=null;});}
  const h1=document.querySelector('h1'),intro=g.timeline({defaults:{ease,duration:1}});
  intro.from(header,{y:-25,opacity:0,duration:.8,clearProps:'transform,opacity'},0);
  if(h1&&window.SplitText){const label=h1.innerText.replace(/\s+/g,' ').trim();const split=SplitText.create(h1,{type:'words',mask:'words',aria:'auto'});h1.setAttribute('aria-label',label);intro.from(split.words,{yPercent:110,stagger:.07,duration:1.1,clearProps:'transform'},.1);cleanups.push(()=>split.revert());}
  else if(h1)intro.from(h1,{opacity:0,y:25},.1);
  if(document.querySelector('.hero-photo')){intro.from('.hero-photo',{clipPath:'inset(3% 3% 3% 15%)',scale:1.05,duration:1.5,clearProps:'clipPath,transform'},0);intro.from('.hero-bottom>*',{y:16,opacity:0,stagger:.12,duration:.75,clearProps:'all'},.75);intro.from('.hero-location',{opacity:0,duration:.8},.4);}
  if(document.querySelector('.services-hero')){intro.from('.services-hero p,.services-hero .text-link',{opacity:0,y:15,stagger:.12,clearProps:'all'},.4);intro.from('.service-hero-art',{opacity:0,scale:.96,duration:1.1,clearProps:'all'},.15);}
  if(window.ScrollTrigger){
   g.fromTo('.header-progress',{scaleX:0},{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:.2}});
   ScrollTrigger.create({start:50,end:'max',onToggle:self=>header.classList.toggle('is-scrolled',self.isActive)});
   if(document.querySelector('.hero-photo img'))g.to('.hero-photo img',{yPercent:10,ease:'none',scrollTrigger:{trigger:'.story-hero',start:'top top',end:'bottom top',scrub:true}});
   document.querySelectorAll('.statement-line').forEach(line=>g.fromTo(line,{color:'#8dabbc'},{color:'#15354d',ease:'none',scrollTrigger:{trigger:line,start:'top 85%',end:'top 50%',scrub:true}}));
   if(document.querySelector('.statement-route path')&&window.DrawSVGPlugin)g.from('.statement-route path',{drawSVG:'0%',ease:'none',scrollTrigger:{trigger:'.service-statement',start:'top 90%',end:'bottom top',scrub:1}});
   if(desktop&&document.querySelector('.journey-stage')){
    const section=document.querySelector('.moving-journey'),stage=document.querySelector('.journey-stage'),nav=document.querySelector('.journey-nav');
    section.classList.add('journey-enhanced');stage.appendChild(nav);g.set(journeyScenes.slice(1),{autoAlpha:0,y:18});activeJourney=-1;showJourney(0,false,true);
    journeyTimeline=g.timeline({scrollTrigger:{trigger:stage,start:'top 135px',end:()=>`+=${Math.max(1500,innerHeight*1.9)}`,pin:true,scrub:.6,invalidateOnRefresh:true,onUpdate:self=>showJourney(Math.min(3,Math.round(self.progress*3)),true,true)}});
    journeyTimeline.fromTo('.journey-progress span',{scaleX:0},{scaleX:1,ease:'none',duration:3},0);
    cleanups.push(()=>{section.classList.remove('journey-enhanced');section.appendChild(nav);g.killTweensOf([...journeyScenes,...journeyFrames]);g.set(journeyScenes,{clearProps:'all'});journeyScenes.forEach(s=>s.removeAttribute('aria-hidden'));journeyTimeline=null;activeJourney=-1;showJourney(0);});
   }else cleanups.push(setupStackedJourney(true));
   if(desktop){document.querySelectorAll('.customer-photo,.customer-product').forEach((photo,i)=>g.fromTo(photo,{y:i%2?40:-20},{y:i%2?-45:35,ease:'none',scrollTrigger:{trigger:'.customer-collage',start:'top bottom',end:'bottom top',scrub:1}}));}
   document.querySelectorAll('.customer-quote').forEach(q=>g.from(q,{opacity:.2,duration:.9,ease:'power2.out',scrollTrigger:{trigger:q,start:'top 88%',once:true},clearProps:'opacity'}));
   document.querySelectorAll('.kit-image .crate-outline,.kit-image .crate-lid').forEach(p=>{if(window.DrawSVGPlugin)g.from(p,{drawSVG:'0%',duration:1.15,ease:'power2.inOut',scrollTrigger:{trigger:p.closest('.kit-image'),start:'top 90%',once:true}});});
   if(document.querySelector('.reuse-art .crate-illustration'))g.from('.reuse-art .crate-illustration',{rotation:-12,y:35,ease:'none',scrollTrigger:{trigger:'.reuse-chapter',start:'top bottom',end:'bottom top',scrub:1}});
   requestAnimationFrame(()=>ScrollTrigger.refresh());
  }
  return()=>{cleanups.forEach(fn=>fn());header.classList.remove('is-scrolled');};
 });
 function scrollToTarget(target){const offset=header.getBoundingClientRect().height+35;if(!hasMotion()){window.scrollTo({top:target.getBoundingClientRect().top+scrollY-offset,behavior:'instant'});return;}if(window.BAB?.smoother)window.BAB.smoother.scrollTo(Math.max(0,window.BAB.smoother.offset(target,'top top')-offset),true);else if(window.ScrollToPlugin)g.to(window,{scrollTo:{y:target,offsetY:offset,autoKill:true},duration:.9,ease:'power3.inOut'});else target.scrollIntoView({behavior:'smooth'});}
 document.querySelectorAll('[data-journey]').forEach(button=>button.addEventListener('click',()=>{const i=Number(button.dataset.journey);if(journeyTimeline?.scrollTrigger){const st=journeyTimeline.scrollTrigger;const to=st.start+(st.end-st.start)*(i/3);if(window.BAB?.smoother)window.BAB.smoother.scrollTo(to,true);else g.to(window,{scrollTo:to,duration:.9});}else scrollToTarget(document.querySelector(`[data-scene="${i}"]`));}));
 document.querySelectorAll('a[href*="#"]').forEach(link=>link.addEventListener('click',e=>{const url=new URL(link.href,location.href);const clean=s=>s.replace(/index\.html$/,'').replace(/\/$/,'');if(url.origin!==location.origin||clean(url.pathname)!==clean(location.pathname)||!url.hash)return;const target=document.getElementById(decodeURIComponent(url.hash.slice(1)));if(!target)return;e.preventDefault();window.BAB?.closeMenu();scrollToTarget(target);history.replaceState(null,'',url.hash);}));
 const onLoad=()=>{window.ScrollTrigger?.refresh();if(location.hash){const target=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(target)scrollToTarget(target);}};
 if(document.readyState==='complete')onLoad();else window.addEventListener('load',onLoad,{once:true});
 window.addEventListener('pagehide',()=>mm.revert(),{once:true});
})();

