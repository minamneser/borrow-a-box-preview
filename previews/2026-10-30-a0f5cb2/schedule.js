(() => {
 'use strict';
 const M=window.ScheduleModel,$=id=>document.getElementById(id),clock=M.serviceClock();
 const param=new URLSearchParams(location.search).get('kit');let kitIndex=param!==null&&/^[0-4]$/.test(param)?Number(param):1;
 let selectedDate=M.addDays(clock.today,1),selectedTime='',showAll=false;
 let month=M.parse(selectedDate).getUTCMonth(),year=M.parse(selectedDate).getUTCFullYear();
 const fullDate=iso=>new Intl.DateTimeFormat('en-US',{timeZone:'UTC',weekday:'long',month:'long',day:'numeric',year:'numeric'}).format(M.parse(iso));
 const shortDate=iso=>new Intl.DateTimeFormat('en-US',{timeZone:'UTC',month:'long',day:'numeric',year:'numeric'}).format(M.parse(iso));
 const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n);
 const previous=$('previous-month'),next=$('next-month'),days=$('calendar-days'),packageSelect=$('schedule-package'),review=$('schedule-review');
 document.querySelectorAll('.desktop-nav a').forEach(a=>{a.classList.remove('current');a.removeAttribute('aria-current');if(a.getAttribute('href')==='schedule.html'){a.classList.add('current');a.setAttribute('aria-current','page');}});
 packageSelect.value=String(kitIndex);
 function renderMonth(focusDate){
  $('calendar-month').textContent=new Intl.DateTimeFormat('en-US',{timeZone:'UTC',month:'long',year:'numeric'}).format(new Date(Date.UTC(year,month,1)));
  const cells=M.monthCells(year,month);let html='';
  for(let row=0;row<cells.length;row+=7){html+='<tr>';for(const date of cells.slice(row,row+7)){if(!date){html+='<td></td>';continue;}const day=Number(date.slice(-2)),past=date<clock.today,current=date===selectedDate;html+=`<td><button type="button" data-date="${date}" aria-label="${fullDate(date)}" aria-pressed="${current}" ${date===clock.today?'aria-current="date"':''} ${past?'disabled':''} tabindex="${current||date===focusDate?'0':'-1'}" class="calendar-day${current?' selected':''}${date===clock.today?' today':''}">${day}${past?'':'<span class="day-dot" aria-hidden="true"></span>'}</button></td>`;}html+='</tr>';}
  days.innerHTML=html;
  const currentMonth=Number(clock.today.slice(0,4))*12+Number(clock.today.slice(5,7))-1;previous.disabled=year*12+month<=currentMonth;
  const focus=focusDate?days.querySelector(`[data-date="${focusDate}"]`):null;
  if(focus&&!focus.disabled){days.querySelectorAll('button').forEach(b=>b.tabIndex=b===focus?0:-1);focus.focus({preventScroll:true});}
  else if(!days.querySelector('button[tabindex="0"]')){const first=days.querySelector('button:not([disabled])');if(first)first.tabIndex=0;}
 }
 function renderSummary(){const kit=M.kits[kitIndex];$('schedule-price').textContent=money(kit.price);$('schedule-inclusions').textContent=`${kit.count} reusable boxes + dolly`;$('summary-date').textContent=shortDate(selectedDate);$('summary-time').textContent=selectedTime?`${M.timeLabel(selectedTime)} ${M.zoneLabel(selectedDate)}`:'Choose a time to continue';$('request-booking').disabled=!selectedTime;}
 function renderTimes(){
  $('selected-date-heading').textContent=`Preferred delivery: ${new Intl.DateTimeFormat('en-US',{timeZone:'UTC',weekday:'long',month:'long',day:'numeric'}).format(M.parse(selectedDate))}`;
  $('timezone-label').textContent=`Eastern Time (${M.zoneLabel(selectedDate)})`;
  const slots=M.slots(selectedDate);const visible=showAll?slots:slots.slice(0,10);
  $('time-options').innerHTML=visible.length?visible.map(t=>`<label class="time-option"><input type="radio" name="delivery-time" value="${t}" ${t===selectedTime?'checked':''}><span>${M.timeLabel(t)}</span></label>`).join(''):'<p class="no-times">No sample times remain for this day. Please choose another date.</p>';
  $('show-sessions').hidden=slots.length<=10;$('show-sessions').textContent=showAll?'Show fewer sessions':'Show all sessions';$('show-sessions').setAttribute('aria-expanded',String(showAll));renderSummary();
 }
 function chooseDate(date){if(date<clock.today)return;selectedDate=date;selectedTime='';showAll=false;renderMonth(date);renderTimes();$('schedule-feedback').textContent=`${fullDate(date)} selected. Choose a preferred delivery time.`;}
 function changeMonth(delta){const d=new Date(Date.UTC(year,month+delta,1));year=d.getUTCFullYear();month=d.getUTCMonth();renderMonth();}
 previous.addEventListener('click',()=>changeMonth(-1));next.addEventListener('click',()=>changeMonth(1));
 days.addEventListener('click',e=>{const button=e.target.closest('[data-date]');if(button&&!button.disabled)chooseDate(button.dataset.date);});
 days.addEventListener('keydown',e=>{const button=e.target.closest('[data-date]');if(!button)return;let targetDate;const current=M.parse(button.dataset.date);const offsets={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7};if(e.key in offsets)targetDate=M.addDays(button.dataset.date,offsets[e.key]);else if(e.key==='Home')targetDate=M.addDays(button.dataset.date,-current.getUTCDay());else if(e.key==='End')targetDate=M.addDays(button.dataset.date,6-current.getUTCDay());else if(e.key==='PageUp'||e.key==='PageDown'){const targetMonth=current.getUTCMonth()+(e.key==='PageUp'?-1:1);const last=new Date(Date.UTC(current.getUTCFullYear(),targetMonth+1,0)).getUTCDate();targetDate=M.toISO(new Date(Date.UTC(current.getUTCFullYear(),targetMonth,Math.min(current.getUTCDate(),last),12)));}if(!targetDate)return;e.preventDefault();if(targetDate<clock.today)targetDate=clock.today;const d=M.parse(targetDate);year=d.getUTCFullYear();month=d.getUTCMonth();renderMonth(targetDate);});
 $('time-options').addEventListener('change',e=>{if(e.target.name==='delivery-time'){selectedTime=e.target.value;renderSummary();$('schedule-feedback').textContent=`Preferred time: ${M.timeLabel(selectedTime)} ${M.zoneLabel(selectedDate)}. You can review your request.`;}});
 $('show-sessions').addEventListener('click',()=>{showAll=!showAll;renderTimes();});
 packageSelect.addEventListener('change',()=>{kitIndex=Number(packageSelect.value);const url=new URL(location.href);url.searchParams.set('kit',String(kitIndex));history.replaceState(null,'',url);renderSummary();});
 $('request-booking').addEventListener('click',()=>{
  if(!selectedTime||!M.slots(selectedDate).includes(selectedTime)){selectedTime='';renderTimes();$('schedule-feedback').textContent='Please choose a current preferred time.';return;}
  const kit=M.kits[kitIndex];$('request-summary').innerHTML=`<div><dt>Package</dt><dd>${kit.name}</dd></div><div><dt>Included</dt><dd>${kit.count} boxes + dolly · 7 days</dd></div><div><dt>Preferred date</dt><dd>${fullDate(selectedDate)}</dd></div><div><dt>Preferred time</dt><dd>${M.timeLabel(selectedTime)} ${M.zoneLabel(selectedDate)} (New Jersey)</dd></div><div><dt>Rental price</dt><dd>${money(kit.price)}</dd></div>`;
  $('wix-booking').href=`https://www.borrowabox.net/booking-calendar/${kit.slug}`;review.showModal();document.body.style.overflow='hidden';if(window.gsap&&!matchMedia('(prefers-reduced-motion:reduce)').matches)gsap.fromTo(review,{opacity:0,y:15},{opacity:1,y:0,duration:.3,clearProps:'all'});
 });
 $('edit-schedule').addEventListener('click',()=>review.close());review.addEventListener('close',()=>$('request-booking').focus({preventScroll:true}));
 renderMonth();renderTimes();
})();
