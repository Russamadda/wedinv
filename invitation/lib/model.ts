import {z} from 'zod';
import {isClosed,Language} from './config';
export type Guest={id:string;name:string;companion:boolean;attendance:'yes'|'no'|null;diet:'none'|'details'|null;dietDetails:string;hotel:'own'|'group'|'none'|null;overnight:boolean|null};
export type Invitation={id:string;label:string;language:Language;contact:string;guests:Guest[];message:string;version:number;createdAt:string;updatedAt:string;submittedAt:string|null;revoked:boolean;lastRequestId:string|null};
export class AppError extends Error{constructor(public code:string,public status=400){super(code)}}
export const guestInput=z.object({id:z.uuid(),name:z.string().trim().max(150),attendance:z.enum(['yes','no']),diet:z.enum(['none','details']).nullable(),dietDetails:z.string().trim().max(1500),hotel:z.enum(['own','group','none']).nullable(),overnight:z.boolean().nullable()}).strict();
export const responseInput=z.object({version:z.number().int().nonnegative(),requestId:z.uuid(),contact:z.string().trim().min(5).max(200),message:z.string().trim().max(3000),guests:z.array(guestInput).min(1).max(30)}).strict();
export function applyResponse(inv:Invitation,raw:unknown,admin=false,now=new Date()):Invitation{
 if(inv.revoked&&!admin)throw new AppError('invalid',404);
 if(!admin&&isClosed(now))throw new AppError('closed',403);
 const parsed=responseInput.safeParse(raw);if(!parsed.success)throw new AppError('validation');const data=parsed.data;
 if(!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact)||(/^\+?[\d ()-]{7,25}$/.test(data.contact)&&data.contact.replace(/\D/g,'').length>=7)))throw new AppError('contact');
 if(inv.lastRequestId===data.requestId)return inv;
 if(inv.version!==data.version)throw new AppError('conflict',409);
 const ids=new Set(data.guests.map(g=>g.id));if(ids.size!==inv.guests.length||data.guests.length!==inv.guests.length||inv.guests.some(g=>!ids.has(g.id)))throw new AppError('invalid',403);
 const guests=inv.guests.map(g=>{const a=data.guests.find(a=>a.id===g.id)!;
  if(!g.companion&&a.name!==g.name)throw new AppError('validation');
  if(a.attendance==='yes'&&((g.companion&&!a.name)||!a.diet||(a.diet==='details'&&!a.dietDetails)||!a.hotel||a.overnight===null))throw new AppError('validation');
  return {...g,...a,name:g.companion?a.name:g.name,...(a.attendance==='no'?{diet:null,dietDetails:'',hotel:null,overnight:null}:a.diet==='none'?{dietDetails:''}:{})};
 });
 return {...inv,guests,contact:data.contact,message:data.message,version:inv.version+1,lastRequestId:data.requestId,updatedAt:now.toISOString(),submittedAt:now.toISOString()};
}
export function status(inv:Invitation){const yes=inv.guests.filter(g=>g.attendance==='yes').length;const no=inv.guests.filter(g=>g.attendance==='no').length;return yes&&no?'mixed':yes===inv.guests.length?'accepted':no===inv.guests.length?'declined':'unanswered'}
export function totals(invs:Invitation[]){const gs=invs.flatMap(i=>i.guests);return {invited:gs.length,attending:gs.filter(g=>g.attendance==='yes').length,declining:gs.filter(g=>g.attendance==='no').length,unanswered:gs.filter(g=>!g.attendance).length,hotel:gs.filter(g=>g.attendance==='yes'&&g.hotel==='group').length,overnight:gs.filter(g=>g.attendance==='yes'&&g.overnight).length}}
export function csv(invs:Invitation[],hotelOnly=false){const rows=[['Invitation','Guest','Attendance','Diet','Diet details','Kaunas','Venue overnight','Contact','Message'],...invs.flatMap(i=>i.guests.filter(g=>!hotelOnly||(g.attendance==='yes'&&g.hotel==='group')).map(g=>[i.label,g.name,g.attendance??'unanswered',g.diet??'',g.dietDetails,g.hotel??'',g.overnight===null?'':g.overnight?'yes':'no',i.contact,i.message]))];return '\uFEFF'+rows.map(r=>r.map(s=>'"'+(/^[=+@\-\t\r]/.test(s)?"'"+s:s).replaceAll('"','""')+'"').join(',')).join('\r\n')}
