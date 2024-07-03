"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { RecoilRoot } from "recoil";
import Navbar from "./_components/Navbar";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import AllDateModal from "./_components/AllDateModal";
import { Toaster } from "sonner";
import Loading from "./_components/Loading";
const inter = Inter({ subsets: ["latin"] });
const Support = ({ children }: {
    children: React.ReactNode;
}) => {
    const pathname = usePathname();
    return <html lang="en" className={`${pathname === '/yard' || pathname.startsWith('/chats') || pathname.startsWith('/chat') ? 'h-screen bg-[#e6d2bd] !overflow-hidden' : ''}`}>
        <link rel="shortcut icon" href="/favicon.ico" />
        <body className={inter.className}>

            <SessionProvider>

                <RecoilRoot>
                    <Loading />
                    <Toaster position="bottom-center" duration={2000} />
                    <AllDateModal />
                    <Navbar />
                    {children}
                </RecoilRoot>
            </SessionProvider>
        </body>
    </html>
}
export default Support;