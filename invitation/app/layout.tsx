import type {Metadata} from 'next';
import {Site} from '@/components/Site';
import './globals.css';
export const metadata:Metadata={title:'Marthe & Deivi · 4 September 2027',description:'Together with our family and friends. Lithuania, 4 September 2027.',robots:{index:false,follow:false},referrer:'no-referrer',openGraph:{title:'Marthe & Deivi',description:'4 September 2027 · Lithuania',type:'website'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body><Site>{children}</Site></body></html>}
