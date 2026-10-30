(function(root,factory){const data=factory();if(typeof module==='object'&&module.exports)module.exports=data;else root.BABCatalog=data;})(typeof window!=='undefined'?window:this,function(){
 'use strict';
 return Object.freeze({currency:'USD',includedDays:7,maxExtraDays:28,extraDayCents:2500,extraWeekCents:10000,dollyCents:2500,leadHours:48,timeZone:'America/New_York',email:'borrowaboxnj@gmail.com',instagram:'https://www.instagram.com/borrowaboxnj/',extensionPolicy:'best-rate',
  // Empty until the business supplies approved geographic zones and charges.
  deliveryZones:[],taxConfigured:false,liveAvailability:false,livePayments:false,
  kits:[{id:0,name:'Studio',count:10,cents:9999,slug:'studio-box-package'},{id:1,name:'1-Bedroom',count:20,cents:12999,slug:'one-bedroom-box-package'},{id:2,name:'2-Bedroom',count:30,cents:15999,slug:'2-bedroom-box-package'},{id:3,name:'3-Bedroom',count:40,cents:18999,slug:'3-bedroom-box-package'},{id:4,name:'4-Bedroom',count:50,cents:21999,slug:'4-bedroom-box-package'}].map(k=>({...k,price:k.cents/100})),
  windows:[{id:'08:00',label:'8:00–10:00 am',hour:8},{id:'10:00',label:'10:00 am–12:00 pm',hour:10},{id:'12:00',label:'12:00–2:00 pm',hour:12},{id:'14:00',label:'2:00–4:00 pm',hour:14},{id:'16:00',label:'4:00–6:00 pm',hour:16}],
  supplies:[{id:'fragile-kit',name:'Fragile Packaging Kit',description:'Contents and price are being finalized. Ask us to include a quote.',cents:null},{id:'packing-supplies',name:'Additional packaging supplies',description:'Tell us what you need. Product selection, price and availability will be confirmed.',cents:null}]
 });
});
