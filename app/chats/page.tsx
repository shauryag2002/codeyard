"use client"
import React, { FunctionComponent, useEffect, useState } from 'react'
import axios from 'axios';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Loader from '../_components/Loader';
const Chats: FunctionComponent = () => {


    const [loader, setLoader] = useState(true)


    const { data: session, status } = useSession();
    const router = useRouter();
    const fullUrl = usePathname();
    useEffect(() => {
        const fetchData = async () => {
            const url = fullUrl.split('/');
            const id = url[url.length - 1];
            if (id !== 'chats') {
                router.push('/chat/' + url[url.length - 2])
                return;
            };
            const res = await axios.post('/api/yard/bucketlist', { id: session?.user?.id ?? "" });
            if (res.data.accounts[0]?.merged && res.data.accounts[0].merged.length !== 0) {
                router.push('/chat/' + res.data.accounts[0].merged[0].id)
            }
            else if (res.data.accounts[0]?.rejected && res.data.accounts[0].rejected.length !== 0) {
                router.push('/chat/' + res.data.accounts[0].rejected[0].id)
            }
            else if (res.data.accounts[0]?.others && res.data.accounts[0].others.length !== 0) {
                router.push('/chat/' + res.data.accounts[0].others[0].id)
            }
            if (res.data) {
                setLoader(false)
            }
        }
        if (session?.user.id) {

            fetchData();
        }
    }, [session?.user.username]);
    if (status === 'unauthenticated') {
        router.push('/register')
    }
    if (status === 'loading' || loader) return <Loader />;
    return (

        <div className='flex items-center justify-center flex-col'>

            <div className="chats h-screen w-full bg-[#D95358] shadow-lg border-r  border-[#1FA0AC] left-[10px] z-[10000] overflow-hidden">

                <div className="allChat smooth-scroll overflow-y-auto w-full px-3 pt-5 h-[calc(100vh-251px)] md:h-[calc(100vh-171px)] relative">

                    <div className='text-center flex items-center justify-center flex-col'>
                        <div className='font-semibold '>No users to talk?</div>
                        <div >Go to{" "}
                            <Link href='/yard' className='underline text-cyan-700'>Yard</Link></div>
                    </div>
                    <div id="last" className='h-10'></div>
                </div>

            </div>

        </div>
    )
}

export default Chats