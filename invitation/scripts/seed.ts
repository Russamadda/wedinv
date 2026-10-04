import nextEnv from '@next/env';
import {randomUUID} from 'node:crypto';
nextEnv.loadEnvConfig(process.cwd());
if(process.env.LOCAL_DEMO!=='true')throw new Error('Fixtures are restricted to LOCAL_DEMO=true');
const {insertInvitation}=await import('../lib/db');const {hashToken,newToken}=await import('../lib/security');
const now=new Date().toISOString();
for(const names of [['Alex Example'],['Anna Example','Jonas Example'],['Sam Example','']]){const token=newToken();await insertInvitation({id:randomUUID(),label:'FICTIONAL: '+names[0],language:'en',contact:'example@example.invalid',guests:names.map(name=>({id:randomUUID(),name,companion:!name,attendance:null,diet:null,dietDetails:'',hotel:null,overnight:null})),message:'',version:0,createdAt:now,updatedAt:now,submittedAt:null,revoked:false,lastRequestId:null},hashToken(token));console.log(names.join(' + ')+': '+process.env.APP_ORIGIN+'/invite#'+token)}
