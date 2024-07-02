
import axios from 'axios';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { IoNotificationsSharp } from 'react-icons/io5';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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
interface DataNotificationProps {
    allNoti: NotificationProps[];
    setAllNoti: (allNoti: NotificationProps[]) => void;
    notiValue: number;
    setNoti: (notiValue: number) => void;
}
const DateNotification = ({ allNoti, setAllNoti, notiValue, setNoti }: DataNotificationProps) => {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement | null>(null);
    const { data: session } = useSession();
    const router = useRouter();
    const [notiFetched, setNotiFetched] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsNotificationOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    const fetchNotification = async () => {
        if (!session?.user.id) return;
        try {
            const res = await axios.post('/api/notification', {
                session: {
                    user: {
                        id: session.user.id
                    }
                }
            });

            setAllNoti(res.data);
            setNoti(0);
            localStorage.setItem('notifications', JSON.stringify(res.data));
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        if (isNotificationOpen && session && !notiFetched) {
            fetchNotification();
            setNotiFetched(true);
        }
    }, [isNotificationOpen, session?.user.username, notiFetched]);

    const handleMouseEnter = useCallback(() => {
        setIsNotificationOpen(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsNotificationOpen(false);
        setNotiFetched(false);
    }, []);

    return (
        <div
            className="p-1 md:p-[1vw] cursor-pointer relative"
            ref={searchRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <IoNotificationsSharp />
            {notiValue > 0 && (
                <div className="absolute md:top-[-7px] top-[-14px] z-[2] w-[33px] h-[34px] scale-[0.6] border rounded-full flex justify-center items-center text-white bg-slate-600">
                    {notiValue}
                </div>
            )}
            {isNotificationOpen && (
                <div className="max-h-[400px] overflow-y-auto w-[100vw] p-1 sm:w-max fixed top-[136px] sm:top-auto sm:absolute right-0 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl z-[10000000]">
                    <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Date Notification</div>
                    {allNoti.map((noti: NotificationProps, index: number) => (
                        <div key={index} className="flex justify-around">
                            <div className="p-1">
                                <div className="block mt-1 text-lg leading-tight font-medium text-black">
                                    <span
                                        title={
                                            noti.user1.username === session?.user.username
                                                ? noti?.user2?.username ?? ""
                                                : noti?.user1?.username ?? ""
                                        }
                                        className="inline-block max-w-[10rem] md:max-w-[260px] text-ellipsis overflow-hidden"
                                    >
                                        Date with {noti.user1.username === session?.user.username ? noti.user2.username : noti.user1.username}
                                    </span>
                                    <div className="mt-2 text-gray-500">
                                        on {(noti?.meetingDate ?? "")?.split('T')[0]} at {noti.meetingTime}
                                    </div>
                                </div>
                            </div>
                            {new Date(`${(noti.meetingDate ?? "").split('T')[0]}T${noti.meetingTime}`) > new Date() ? (
                                <button
                                    className="cursor-not-allowed self-center ml-4 px-4 py-2 bg-[#6a82a7] text-white text-sm font-medium rounded-md hover:bg-blue-600 transition duration-300"
                                    disabled
                                >
                                    PlayArea
                                </button>
                            ) : (
                                <button
                                    onClick={() => router.push(`/playarea/${noti.id}`)}
                                    className="self-center ml-4 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition duration-300"
                                >
                                    PlayArea
                                </button>
                            )}
                        </div>
                    ))}
                    {allNoti.length === 0 && <div className="text-center p-2">No Notification</div>}
                </div>
            )}
        </div>
    );
};

export default DateNotification;

