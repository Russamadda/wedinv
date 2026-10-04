'use client';
import {useEffect,useRef,useState} from 'react';
import {useRouter} from 'next/navigation';
import {useLanguage,Contact} from '@/components/Site';
import {formCopy} from '@/lib/form-copy';
export default function Invite(){const router=useRouter();const {lang,setLang}=useLanguage();const [error,setError]=useState(false);const started=useRef(false);useEffect(()=>{if(started.current)return;started.current=true;const token=location.hash.slice(1);history.replaceState(null,'','/invite');if(!token){router.replace('/rsvp');return}fetch('/api/entry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token})}).then(async r=>{if(!r.ok){setError(true);return}const d=await r.json();if(!localStorage.getItem('wedding-language'))setLang(d.language);router.replace('/rsvp')}).catch(()=>setError(true))},[router,setLang]);return <section><p>{error?formCopy[lang].invalid:formCopy[lang].inviteLoading}</p>{error&&<Contact/>}</section>}
