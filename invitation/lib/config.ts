export type Language = 'en' | 'nb' | 'lt';
export const languages: Language[] = ['en','nb','lt'];
// Single editable source for each date. All guest labels and server enforcement derive from these.
const weddingDate='2027-09-04';
const rsvpDeadline='2027-02-25';
const timeZone='Europe/Vilnius';
export function localMidnight(date:string,zone:string){
 const utc=Date.parse(date+'T00:00:00Z');let guess=utc;
 const formatter=new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
 for(let i=0;i<3;i++){const p=Object.fromEntries(formatter.formatToParts(new Date(guess)).map(p=>[p.type,p.value]));const shown=Date.parse(`${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}Z`);guess+=utc-shown}
 return new Date(guess).toISOString();
}
const nextDate=(date:string)=>new Date(Date.parse(date+'T12:00:00Z')+86400000).toISOString().slice(0,10);
export const event = { names:'Marthe and Deivi',weddingDate,weddingStart:localMidnight(weddingDate,timeZone),rsvpDeadline,rsvpClosesAt:localMidnight(nextDate(rsvpDeadline),timeZone),timeZone,venue:'9 Vėjai',email:'deivi.selenis@gmail.com',phone:'+4790820779',phoneDisplay:'+47 90820779',toastmaster:'Mathias Krohn',toastmasterPhone:'+4794896863',links:{venue:'',map:'',registry:''} };
export const dateLabel = (lang:Language,date:string=event.rsvpDeadline)=>new Intl.DateTimeFormat({en:'en-GB',nb:'nb-NO',lt:'lt-LT'}[lang],{day:'numeric',month:'long',year:'numeric',timeZone:event.timeZone}).format(new Date(date+'T12:00:00Z'));
export const isClosed=(now=new Date())=>now.getTime()>=Date.parse(event.rsvpClosesAt);
