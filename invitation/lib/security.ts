import {createHash,createHmac,randomBytes,scryptSync,timingSafeEqual} from 'node:crypto';
import {cookies} from 'next/headers';
import {NextRequest,NextResponse} from 'next/server';
import {AppError} from './model';
import {rateLimit} from './db';
export const hashToken=(token:string)=>createHash('sha256').update(token).digest('hex');
export const newToken=()=>randomBytes(32).toString('base64url');
function secret(){const value=process.env.SESSION_SECRET;if(!value||value.length<32)throw new AppError('setup',503);return value}
export function seal(value:string){const payload=Buffer.from(value).toString('base64url');return payload+'.'+createHmac('sha256',secret()).update(payload).digest('base64url')}
export function unseal(raw:string){const [p,s]=raw.split('.');if(!p||!s)return null;const expected=createHmac('sha256',secret()).update(p).digest('base64url');if(s.length!==expected.length||!timingSafeEqual(Buffer.from(s),Buffer.from(expected)))return null;return Buffer.from(p,'base64url').toString()}
export const cookieOptions={httpOnly:true,secure:process.env.NODE_ENV==='production'&&process.env.LOCAL_DEMO!=='true',sameSite:'strict' as const,path:'/'};
export async function guestHash(){const raw=(await cookies()).get('invitation')?.value;if(!raw)throw new AppError('link',401);const value=unseal(raw);if(!value)throw new AppError('invalid',401);return value}
export async function requireAdmin(){const raw=(await cookies()).get('admin')?.value;if(!raw)throw new AppError('unauthorized',401);const value=unseal(raw);if(!value)throw new AppError('unauthorized',401);const [role,expires,fingerprint]=value.split(':');if(role!=='admin'||Number(expires)<Date.now()||fingerprint!==hashToken(process.env.ADMIN_PASSWORD_HASH||'').slice(0,16))throw new AppError('unauthorized',401)}
export function passwordHash(password:string,salt=randomBytes(16).toString('hex')){return salt+':'+scryptSync(password,salt,64).toString('hex')}
export function verifyPassword(password:string){const raw=process.env.ADMIN_PASSWORD_HASH;if(!raw)throw new AppError('setup',503);const [salt,hash]=raw.split(':');if(!salt||!hash||hash.length!==128)return false;return timingSafeEqual(scryptSync(password,salt,64),Buffer.from(hash,'hex'))}
export function adminSession(){return seal('admin:'+(Date.now()+8*3600000)+':'+hashToken(process.env.ADMIN_PASSWORD_HASH||'').slice(0,16))}
export async function guard(req:NextRequest,scope:string,max=60){if(req.method!=='GET'){const origin=req.headers.get('origin');if(origin!==new URL(process.env.APP_ORIGIN||req.url).origin)throw new AppError('origin',403)}const ip=process.env.TRUST_PROXY==='true'?(req.headers.get('x-forwarded-for')?.split(',')[0]||'unknown'):'local';await rateLimit(hashToken(scope+':'+ip),max)}
export async function body(req:NextRequest){const text=await req.text();if(text.length>40000)throw new AppError('validation');try{return JSON.parse(text)}catch{throw new AppError('validation')}}
export function errorResponse(e:unknown){const err=e instanceof AppError?e:new AppError('server',500);return NextResponse.json({error:err.code},{status:err.status,headers:{'Cache-Control':'no-store'}})}
export function json(data:unknown){return NextResponse.json(data,{headers:{'Cache-Control':'no-store'}})}
