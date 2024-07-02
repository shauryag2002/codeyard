"use client"
import React, { FunctionComponent, useEffect, useState } from 'react'
import ChatSidebar from '../../_components/ChatSidebar';
import ChatSection from '@/app/_components/ChatSection';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Loader from '@/app/_components/Loader';
interface ChatsProps {
    params: {
        id: string;
    };
}

const Chats: FunctionComponent<ChatsProps> = ({ params }) => {
    const router = useRouter();
    const [message, setMessage] = useState('')
    const { id: user2Id } = params

    interface AllMessageType {
        color?: string;
        content?: string;
        user?: {
            username?: string;

        };
        id: string;
    }
    interface UsersType {
        id: string;
        image: string | null;
        name: string | null;
        username: string | null;
        bio: string | null;
        resume: string | null;
    }
    const [allMessages, setAllMessages] = useState<AllMessageType[]>([

    ])

    const [name, setName] = useState('')
    const [mergedUsers, setMergedUsers] = useState<UsersType[]>([]);
    const [rejectedUsers, setRejectedUsers] = useState<UsersType[]>([]);
    const [otherUsers, setOtherUsers] = useState<UsersType[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const { data: session, status } = useSession();
    useEffect(() => {
        const fetchData = async () => {

            const res = await axios.post('/api/yard/bucketlist', { id: session?.user?.id ?? "" });
            setMergedUsers(res.data.accounts[0].merged);
            setRejectedUsers(res.data.accounts[0].rejected);
            setOtherUsers(res.data.accounts[0].others);
        }
        if (session?.user.id) {

            fetchData();
        }
    }, [session?.user.username, isOpen]);
    if (status === 'unauthenticated')
        router.push('/register')
    if (status === 'loading') return <Loader />
    const toggleSidebar = () => setIsOpen(!isOpen);
    return (

        <div className='flex '>

            <ChatSidebar otherUsers={otherUsers} setOtherUsers={setOtherUsers} setAllMessages={setAllMessages} mergedUsers={mergedUsers} rejectedUsers={rejectedUsers} isOpen={isOpen} toggleSidebar={toggleSidebar} />

            <ChatSection setName={setName} setAllMessages={setAllMessages} toggleSidebar={toggleSidebar} name={name} allMessages={allMessages} message={message} setMessage={setMessage} user2Id={user2Id ?? ""} />

        </div>
    )
}

export default Chats