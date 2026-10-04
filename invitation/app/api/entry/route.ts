import {NextRequest,NextResponse} from 'next/server';
import {findInvitation} from '@/lib/db';
import {AppError} from '@/lib/model';
import {body,cookieOptions,errorResponse,guard,hashToken,seal} from '@/lib/security';
export async function POST(req:NextRequest){try{await guard(req,'entry',15);const {token}=await body(req);if(typeof token!=='string'||!/^[A-Za-z0-9_-]{43}$/.test(token))throw new AppError('invalid',404);const hash=hashToken(token);const inv=await findInvitation(hash);if(!inv||inv.revoked)throw new AppError('invalid',404);const res=NextResponse.json({language:inv.language});res.cookies.set('invitation',seal(hash),{...cookieOptions,maxAge:60*60*24*365});res.headers.set('Cache-Control','no-store');return res}catch(e){return errorResponse(e)}}
