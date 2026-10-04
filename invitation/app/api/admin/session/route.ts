import {NextRequest,NextResponse} from 'next/server';
import {adminSession,body,cookieOptions,errorResponse,guard,json,requireAdmin,verifyPassword} from '@/lib/security';
import {AppError} from '@/lib/model';
export async function GET(){try{await requireAdmin();return json({authenticated:true})}catch(e){return errorResponse(e)}}
export async function POST(req:NextRequest){try{await guard(req,'login',6);const {password}=await body(req);if(typeof password!=='string'||password.length>500||!verifyPassword(password))throw new AppError('unauthorized',401);const res=NextResponse.json({authenticated:true});res.cookies.set('admin',adminSession(),{...cookieOptions,maxAge:8*3600});return res}catch(e){return errorResponse(e)}}
export async function DELETE(req:NextRequest){try{await guard(req,'logout');const res=NextResponse.json({ok:true});res.cookies.set('admin','',{...cookieOptions,maxAge:0});return res}catch(e){return errorResponse(e)}}
