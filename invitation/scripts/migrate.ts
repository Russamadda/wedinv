import {Pool} from 'pg';
import {readFileSync} from 'node:fs';
import nextEnv from '@next/env';
nextEnv.loadEnvConfig(process.cwd());
if(!process.env.DATABASE_URL)throw new Error('Set DATABASE_URL first');
const db=new Pool({connectionString:process.env.DATABASE_URL});
await db.query(readFileSync('migrations/001_initial.sql','utf8'));await db.end();console.log('Migration complete');
