import {NextRequest} from 'next/server';
import {findInvitation,updateInvitation,demo,rateLimit} from '@/lib/db';
import {applyResponse,AppError} from '@/lib/model';
import {isClosed} from '@/lib/config';
import {body,errorResponse,guard,guestHash,json} from '@/lib/security';
export const runtime='nodejs';
export async function GET(req:NextRequest){try{await guard(req,'read');const inv=await findInvitation(await guestHash());if(!inv||inv.revoked)throw new AppError('invalid',404);return json({...inv,closed:isClosed(),demo:demo()})}catch(e){return errorResponse(e)}}
export async function PUT(req:NextRequest){try{await guard(req,'save',40);const hash=await guestHash();await rateLimit('save:'+hash,20);const data=await body(req);const inv=await updateInvitation(hash,'token_hash',i=>applyResponse(i,data));return json({...inv,closed:isClosed(),demo:demo()})}catch(e){return errorResponse(e)}}
