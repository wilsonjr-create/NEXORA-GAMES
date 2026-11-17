import { CartProvider } from "@/contexts/CartContext";
import type { Metadata } from 'next';import './globals.css';
export const metadata:Metadata={title:'NEXORA GAMES | Premium Digital Store',description:'Premium digital gaming storefront — portfolio sandbox demo'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body><CartProvider>{children}</CartProvider></body></html>}
