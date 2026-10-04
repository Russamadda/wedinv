import {NextRequest} from 'next/server';
import {listInvitations} from '@/lib/db';
import {csv} from '@/lib/model';
import {errorResponse,requireAdmin} from '@/lib/security';
export async function GET(req:NextRequest){try{await requireAdmin();const hotel=req.nextUrl.searchParams.get('hotel')==='1';return new Response(csv(await listInvitations(),hotel),{headers:{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':`attachment; filename="${hotel?'hotel-interest':'guests'}.csv"`,'Cache-Control':'no-store'}})}catch(e){return errorResponse(e)}}
