import {scryptSync,randomBytes} from 'node:crypto';
import {createInterface} from 'node:readline/promises';
const rl=createInterface({input:process.stdin,output:process.stdout});
console.log('Run in a private terminal. Input will be visible; no password is stored in source.');
const password=await rl.question('New administrator password (at least 14 characters): ');rl.close();
if(password.length<14)throw new Error('Use at least 14 characters');
const salt=randomBytes(16).toString('hex');console.log('ADMIN_PASSWORD_HASH='+salt+':'+scryptSync(password,salt,64).toString('hex'));
console.log('SESSION_SECRET='+randomBytes(48).toString('base64url'));
