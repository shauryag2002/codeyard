"use client";
import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { VscAccount } from "react-icons/vsc";
interface UsersType {
    id: string;
    image: string | null;
    name: string | null;
    username: string | null;
    bio: string | null;
    resume: string | null;
}
interface AllMessageType {
    color?: string;
    content?: string;
    user?: {
        username?: string;

    };
    id: string;
}
const Sidebar = ({ otherUsers, isOpen, toggleSidebar, mergedUsers, rejectedUsers }:
    {
        isOpen: boolean;
        toggleSidebar: () => void;
        mergedUsers: UsersType[];
        rejectedUsers: UsersType[];
        setAllMessages: (allMessages: AllMessageType[]) => void;
        otherUsers: UsersType[];
        setOtherUsers: (otherUsers: UsersType[]) => void;
    }
) => {
    const [activeTab, setActiveTab] = useState('merged');
    const router = useRouter();
    const switchTab = (tab: string) => setActiveTab(tab);
    const { data: session } = useSession();
    const handleClick = async (name: string, id: string, userId: string) => {
        try {

            router.push('/chat/' + userId)
        }
        catch (e) {
            console.log(e);
        }
        finally {
            toggleSidebar();
        }
    }

    return (
        <div className="flex">
            <div
                className={`fixed z-[100000000000000000] inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 bg-gray-800 text-white w-64 z-50`}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold">CodeYard</h2>
                    <button onClick={toggleSidebar} className="text-white">
                        <FiX size={24} />
                    </button>
                </div>
                <div className="p-4">
                    <div className="flex mb-4">
                        <button
                            className={`flex-1 p-2 ${activeTab === 'merged' ? 'bg-gray-700' : 'bg-gray-800'} rounded-l`}
                            onClick={() => switchTab('merged')}
                        >
                            Merged
                        </button>
                        <button

                            className={`flex-1 p-2 ${activeTab === 'rejected' ? 'bg-gray-700' : 'bg-gray-800'} rounded-r`}
                            onClick={() => switchTab('rejected')}
                        >
                            Rejected
                        </button>
                        <button
                            title='Other Users'
                            className={`flex-1 p-2 ${activeTab === 'others' ? 'bg-gray-700' : 'bg-gray-800'} rounded-r justify-center items-center flex`}
                            onClick={() => switchTab('others')}
                        >
                            <VscAccount />
                        </button>
                    </div>
                    <div>
                        {activeTab === 'merged' ? (
                            <div>
                                {mergedUsers.length > 0 ? (
                                    mergedUsers.map((user, index) => (
                                        <div title={user.name ?? ""} onClick={async () => await handleClick(user?.name ?? "", session?.user?.id ?? "", user.id)} key={index} className="cursor-pointer p-2 border-b border-gray-700 overflow-hidden text-ellipsis flex items-center gap-1">
                                            <Image src={user.image ?? ""} alt={user?.name ?? ""} width={50} height={50} className="rounded-full h-[40px] w-[40px]" />
                                            {user?.username}
                                        </div>
                                    ))
                                ) : (
                                    <div>No merged users</div>
                                )}
                            </div>
                        ) : null}
                        {
                            activeTab === 'rejected' ? (

                                <div>
                                    {rejectedUsers.length > 0 ? (
                                        rejectedUsers.map((user, index) => (
                                            <div title={user.name ?? ""} onClick={async () => await handleClick(user?.name ?? "", session?.user?.id ?? "", user.id)} key={index} className="cursor-pointer p-2 border-b border-gray-700 overflow-hidden text-ellipsis flex items-center gap-1">
                                                <Image src={user.image ?? ""} alt={user?.name ?? ""} width={50} height={50} className="rounded-full h-[40px] w-[40px]" />

                                                {user?.username}
                                            </div>
                                        ))
                                    ) : (
                                        <div>No rejected users</div>
                                    )}
                                </div>
                            ) : null
                        }
                        {activeTab === 'others' ? (
                            <div>
                                {otherUsers.length > 0 ? (
                                    otherUsers.map((user, index) => (
                                        <div title={user.name ?? ""} onClick={async () => await handleClick(user?.name ?? "", session?.user?.id ?? "", user.id)} key={index} className="cursor-pointer p-2 border-b border-gray-700 overflow-hidden text-ellipsis flex items-center gap-1">
                                            <Image src={user.image ?? ""} alt={user?.name ?? ""} width={50} height={50} className="rounded-full h-[40px] w-[40px]" />
                                            {user?.username}
                                        </div>
                                    ))
                                ) : (

                                    <div>No other users</div>
                                )}

                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
