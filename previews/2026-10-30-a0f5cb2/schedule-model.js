(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ScheduleModel=api;})(typeof window!=='undefined'?window:this,function(){
 'use strict';
 const kits=[{name:'Studio Box Package',count:10,price:99.99,slug:'studio-box-package'},{name:'One-Bedroom Box Package',count:20,price:129.99,slug:'one-bedroom-box-package'},{name:'2 Bedroom Box Package',count:30,price:159.99,slug:'2-bedroom-box-package'},{name:'3 Bedroom Box Package',count:40,price:189.99,slug:'3-bedroom-box-package'},{name:'4 Bedroom Box Package',count:50,price:219.99,slug:'4-bedroom-box-package'}];
 const pad=n=>String(n).padStart(2,'0');
 function toISO(date){return `${date.getUTCFullYear()}-${pad(date.getUTCMonth()+1)}-${pad(date.getUTCDate())}`;}
 function parse(iso){return new Date(`${iso}T12:00:00Z`);}
 function addDays(iso,days){const d=parse(iso);d.setUTCDate(d.getUTCDate()+days);return toISO(d);}
 function monthCells(year,month){const offset=new Date(Date.UTC(year,month,1)).getUTCDay(),last=new Date(Date.UTC(year,month+1,0)).getUTCDate();const result=Array.from({length:Math.ceil((offset+last)/7)*7},(_,i)=>i>=offset&&i<offset+last?`${year}-${pad(month+1)}-${pad(i-offset+1)}`:null);return result;}
 function serviceClock(now=new Date()){const parts=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(now).map(p=>[p.type,p.value]));return {today:`${parts.year}-${parts.month}-${parts.day}`,minute:Number(parts.hour)*60+Number(parts.minute)};}
 function slots(iso,now=new Date()){const clock=serviceClock(now);if(iso<clock.today)return [];return Array.from({length:20},(_,i)=>480+i*30).filter(m=>iso!==clock.today||m>clock.minute).map(m=>`${pad(Math.floor(m/60))}:${pad(m%60)}`);}
 function timeLabel(time){const [h,m]=time.split(':').map(Number);return `${h%12||12}:${pad(m)} ${h<12?'am':'pm'}`;}
 function zoneLabel(iso){return new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',timeZoneName:'short'}).formatToParts(parse(iso)).find(p=>p.type==='timeZoneName').value;}
 return {kits,toISO,parse,addDays,monthCells,serviceClock,slots,timeLabel,zoneLabel};
});
