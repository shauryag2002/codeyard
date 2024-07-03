import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { PlaceholdersAndVanishInputDemo } from "./ui/AIinput";
import { useRouter } from "next/navigation";
import axios from "axios";
import Dropdown from '../_components/Dropdown'
import { IoChatbubblesOutline } from "react-icons/io5";
import DateNotification from "./Notification";
import { notiAtom } from "./state/atoms/atom";
import { useRecoilState_TRANSITION_SUPPORT_UNSTABLE } from "recoil";
import { socket } from "@/socket";
interface UsersType {
    YOE: number;
    age: number;
    bio: string;
    email: string;
    emailVerified: string | null;
    gender: string;
    id: string;
    image: string;
    location: string;
    mergedId: string;
    name: string;
    otherId: string | null;
    password: string;
    rejectedId: string | null;
    resume: string;
    username: string;
}
interface NotificationProps {
    id: string;
    user2Id: string;
    user1Id: string;
    meetingDate: string | null;
    meetingTime: string | null;
    user1: {
        username: string | null;
    };
    user2: {
        username: string | null;
    };
}
const Navbar = () => {
    const { data: session } = useSession();
    const [search, setSearch] = useState("");
    const router = useRouter();
    const [users, setUsers] = useState<UsersType[]>([]);
    const searchRef = React.useRef<HTMLDivElement | null>(null);
    const [isUsersOpen, setisUsersOpen] = useState(false);
    useEffect(() => {
        try {
            if (search == '') return setUsers([])
            const fetchUsers = async () => {

                const res = await axios.post('/api/searchUsers', { search });
                setUsers(res.data);
                if (res.data.length > 0)
                    setisUsersOpen(true);
            }
            fetchUsers();
        }
        catch (e) {
            console.log(e)
        }
    }, [search])
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setisUsersOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    const [notiValue, setNoti] = useRecoilState_TRANSITION_SUPPORT_UNSTABLE(notiAtom);
    function safeParseJSON(jsonString: string) {
        try {
            return JSON.parse(jsonString);
        } catch (error) {
            console.error('Failed to parse JSON:', error);
            return null;
        }
    }
    const fetchNotifications = async () => {
        if (session?.user.id === undefined) return;
        const res = await axios.post('/api/notification', {
            session: session
        });
        const localNoti = safeParseJSON(localStorage.getItem('notifications') || '[]');
        if (localStorage.getItem('notifications') !== JSON.stringify(res.data)) {
            setNoti(res.data.length - localNoti.length);
        }
    }
    useEffect(() => {
        socket.on('notification', () => {
            fetchNotifications();
        })
    }, [])
    useEffect(() => {
        window.addEventListener('beforeunload', async () => {
            const notifications = await axios.post('/api/notification', {
                session: session
            });

            const localNoti = safeParseJSON(localStorage.getItem('notifications') || '[]');
            if (localNoti.length > notifications.data.length) {
                localStorage.setItem('notifications', JSON.stringify(notifications.data));
            }
        });
    }, [])
    const [allNoti, setAllNoti] = useState<NotificationProps[]>([]);



    return <div className="sticky z-[1000000] top-0">
        <nav className="flex flex-col md:flex-row justify-between items-center h-auto gap-2 md:gap-0 md:h-16 bg-[#E9804A] w-full shadow-sm font-serif top-0" role="navigation">
            <Link href="/" className="pl-8 flex justify-center items-center gap-2">
                <Image src="/Logo.png" alt="logo of CodeYard" width={40} height={40} />
                <span>

                    CodeYard
                </span>
            </Link>
            <div className="w-[90%] md:w-auto" ref={searchRef}>
                <PlaceholdersAndVanishInputDemo setSearch={setSearch} />
                {isUsersOpen ? <div className="searchItems absolute md:w-[50%] z-[1000] w-[-webkit-fill-available] pr-3 md:p-0 h-[293px] overflow-auto">
                    {users.map((user: UsersType, index: number) => {
                        return <div key={index} className="flex justify-between gap-2 p-2 bg-red-100 *:text-[#584646] ">

                            <div className="flex items-center gap-2">
                                <Image src={user?.image} alt="user" width={40} height={40} className="rounded-full" />
                                <span onClick={() => {
                                    setUsers([])
                                    router.push('/user/' + user.id)
                                }} className="cursor-pointer" >
                                    <span className="font-semibold">

                                        {user?.name ?? ""}
                                    </span>
                                    <div >@{user?.username ?? ""}</div>
                                </span>

                            </div>
                            <button className=" bg-[#EA1A58] hover:bg-[#a53a5a] text-white font-bold py-2 px-2 mx-4 my-2 rounded " onClick={() => {
                                setUsers([])
                                router.push('/chat/' + user.id)
                            }}>Chat</button>
                        </div>
                    })}
                </div> : null}
            </div>
            <div className="md:pr-8 md:m-0 m-auto flex items-center sm:w-auto w-[87%] justify-around sm:justify-start">
                <Link href="/yard" className="p-1 md:p-[1vw] "><span className="border-b border-[#1FA0AC]">Yard</span></Link>
                <Link href="/bucketlist" className="p-1 md:p-[1vw] "><span className="border-b border-[#1FA0AC]">Bucket List</span></Link>
                <Link href="/chats" className="p-1 md:p-[1vw] " title="Chats"><span className="border-b border-[#1FA0AC]"><
                    IoChatbubblesOutline height={"50px"} width={"50px"}
                /></span></Link>
                {session?.user.username ? <DateNotification allNoti={allNoti} setAllNoti={setAllNoti} setNoti={setNoti} notiValue={notiValue} /> : null}
                {
                    session?.user.username ?
                        <Dropdown />
                        : <Link href="/login" className="p-1 md:p-[1vw] "><span className="border-b border-[#1FA0AC]">Login</span></Link>
                }
            </div>
        </nav>
    </div>;
};

export default Navbar;
