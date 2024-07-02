import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { FiMenu } from "react-icons/fi";
import { useSession } from "next-auth/react";
import DateBox from "./DateBox";
import { toast } from 'sonner';
import { socket } from '@/socket'
import Image from "next/image";
import Loader from "./Loader";
interface AllMessageType {
    color?: string;
    content?: string;
    user?: {
        username?: string;
        image?: string;
    };
    id: string;
}
const ChatSection = ({ toggleSidebar, name, setName, allMessages, setAllMessages, message, setMessage, user2Id }: {
    toggleSidebar: () => void
    name: string
    allMessages: AllMessageType[]
    message: string
    setMessage: (value: string) => void
    user2Id: string
    setAllMessages: (value: AllMessageType[]) => void
    setName: (value: string) => void
}) => {
    const { data: session } = useSession();
    const [count, setCount] = useState(0);
    function scrollToBottom(elementId: string) {
        let divElement = document.getElementById(elementId);
        if (divElement)
            divElement.scrollTop = divElement.scrollHeight;
    }

    const hasFetchedDate = useRef(false);

    useEffect(() => {
        if (session?.user.username && !hasFetchedDate.current) {
            const fetchIsDate = async () => {
                const res = await axios.post('/api/myDate', { id: session?.user.id, user2Id });
                if (res.data?.fixed && count == 0) {
                    toast.success('Date Fixed on ' + res.data.meetingDate.split('T')[0].toString() + ' at ' + res.data.meetingTime, { duration: 10000, position: 'top-right', style: { zIndex: 100000000000000 } });
                    setCount(1);
                }
                else if (res.data?.fixed === false) {
                    toast.info('Date might be fixed with ' + name + ' on ' + res.data.meetingDate.split('T')[0].toString() + ' at ' + res.data.meetingTime, { duration: 10000, position: 'top-right', style: { zIndex: 100000000000000 } });
                }
            };

            fetchIsDate();
            hasFetchedDate.current = true;
        }
    }, [session?.user.username, count]);
    useEffect(() => {
        socket.on("message", (message: string) => {
            const fetchChatsData = async () => {
                const res = await axios.post('/api/chat', { id: session?.user.id, user2Id: user2Id });
                setAllMessages(res.data?.messages);
                scrollToBottom('chatting')
                setName(res.data?.user2?.username);
            }
            fetchChatsData();
        });

    }, []);
    const [img, setImg] = useState('');
    const [loader, setLoader] = useState(true);
    useEffect(() => {
        const fetchChatsData = async () => {
            const res = await axios.post('/api/chat', { id: session?.user.id, user2Id: user2Id });
            setLoader(false)
            setAllMessages(res.data?.messages);
            scrollToBottom('chatting')
            if (session?.user.username === res.data?.user1?.username) {
                setImg(res.data?.user2?.image);
                setName(res.data?.user2?.username);
            }
            else {
                setImg(res.data?.user1?.image);
                setName(res.data?.user1?.username);

            }
        }
        if (session?.user.username) {

            fetchChatsData();
        }
    }, [session?.user.username]);
    const handleSendMessage = async () => {
        const res = await axios.post('/api/chat', { id: session?.user.id, user2Id: user2Id, content: message });
        socket.emit("message", message);
        setMessage('');
    }
    const [dataBox, setDataBox] = useState(false);
    const toggleDataBox = () => {
        setDataBox(!dataBox);
    }
    if (loader) return <div className="w-screen"><Loader /></div>
    return <div className="flex flex-col chats h-screen w-full bg-[#D95358] shadow-lg border-r  border-[#1FA0AC] left-[10px] z-[10000] overflow-hidden">
        <div className="flex justify-between border-b-2 border-white sm:flex-row flex-col ">
            <div className="text-2xl ml-3  pt-2 flex gap-3 font-semibold">

                <button onClick={toggleSidebar} className=" flex top-4 left-4 z-50 text-white bg-gray-800 p-2 rounded">
                    <FiMenu size={24} />
                </button>
                <Image src={img ?? ""} alt={name} width={32} height={32} className="rounded-full border shadow-sm border-black h-8 w-8" />
                @{name}
            </div>
            <div className="flex justify-center items-center m-3 sm:mr-3 sm:m-auto">
                <span onClick={() => setDataBox(!dataBox)} className="cursor-pointer text-center sm:w-auto w-full  inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-400 text-white font-semibold rounded-md shadow-md hover:from-blue-600 hover:to-teal-500 transition-all duration-300 ease-in-out">
                    Coding Date
                </span>
            </div>
        </div>
        <div id="chats" className={`flex-1 allChat smooth-scroll overflow-y-auto w-full px-3 pt-5 ${!dataBox ? "h-[calc(100vh-334px)] sm:h-[calc(100vh-268px)] md:h-[calc(100vh-184px)]" : "h-[calc(100vh-568px)] sm:h-[calc(100vh-505px)] md:h-[calc(100vh-417px)]"}  relative`}>
            <div id='chatting' className="scroll-smooth flex flex-col space-y-2 h-[47vh] sm:h-[56vh] md:h-[70vh] overflow-auto">
                {allMessages?.map((message: AllMessageType, index: number) => (
                    <div key={index} className={`flex space-x-2 ${message?.user?.username === session?.user.username ? 'self-end' : ''}`}>
                        {message?.user?.username === session?.user.username ? (
                            <>
                                <div className="bg-[#1FA0AC] rounded-lg p-2">
                                    <p className="text-white max-w-[294px] break-words">{message?.content}</p>
                                </div>
                                <div className="h-10 w-10 rounded text-black flex items-center justify-center" title={message?.user?.username}>
                                    <Image src={message.user?.image ?? ""} alt="user" width={32} height={32} className="rounded-full border shadow-sm border-black h-8 w-8" />
                                </div>
                            </>
                        ) : (
                            <>
                                <div title={message?.user?.username} className="h-10 w-10 rounded text-black flex items-center justify-center">
                                    <Image src={message.user?.image ?? ""} alt="user" width={32} height={32} className="rounded-full border shadow-sm border-black h-8 w-8" />

                                </div>
                                <div className="bg-[#a44e60] rounded-lg p-2">
                                    <p className="text-white max-w-[294px] break-words">{message?.content}</p>
                                </div>
                            </>
                        )}
                    </div>
                ))}
                {allMessages?.length == 0 && <div className='font-semibold text-3xl opacity-[0.8] text-gray-700'>
                    No Messages Yet...
                </div>}
                <div id="last" className='h-16'></div>
            </div>
            <div className="fixed  bottom-1 w-[95%] bg-[#d95358]">

                {dataBox && <DateBox toggleDataBox={toggleDataBox} user2Id={user2Id} />}
                <div className=" py-4 flex gap-2 bottom-1 left-0 w-full">
                    <input
                        type="text"
                        className="w-full bg-[#1FA0AC] rounded-lg p-2 text-white"
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                    />
                    <button className="bg-[#983e41] rounded-lg p-2 text-white" onClick={async () => await handleSendMessage()} onKeyDown={(e) => {
                        e.preventDefault();
                        if (e.key === 'Enter') handleSendMessage();
                    }}>
                        Send
                    </button>
                </div>
            </div>

        </div>
    </div>;
};

export default ChatSection;
