import axios from 'axios';
import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSetRecoilState } from 'recoil';
import { loadingAtom, notiAtom } from './state/atoms/atom';
import { socket } from '@/socket'
const AllDateModal = () => {
    const { data: session, status } = useSession();
    const [username, setUsername] = React.useState('');
    const [meetingDate, setMeetingDate] = React.useState('');
    const [meetingTime, setMeetingTime] = React.useState('');
    const [toggleDate, setToggleDate] = React.useState(false);
    const [user2Id, setUser2Id] = React.useState('');
    const setLoading = useSetRecoilState(loadingAtom);


    const fetchData = async () => {
        try {
            const res = await axios.post('/api/allDates', { id: session?.user?.id });
            if (res.data.length !== 0) {
                setUsername(res.data[0].user1.username);
                setMeetingDate(res.data[0].meetingDate);
                setMeetingTime(res.data[0].meetingTime);
                setUser2Id(res.data[0].user1Id);
                if (res.data[0].user1Id !== session?.user?.id) {

                    setToggleDate(true);
                }
            }
            else {
                setToggleDate(false);
            }
        } catch (error) {
            setToggleDate(false);

        }
    }
    useEffect(() => {
        if (!session?.user?.id) return;
        const deleteExpiredDate = async () => {
            const res = await axios.delete('/api/expireNotifications')
        }
        deleteExpiredDate()
        fetchData()
    }, [session?.user.id]);
    const socketFunc = (data: string) => {
        fetchData()
    }
    useEffect(() => {
        socket.on('newDate', socketFunc)
    }, [])
    const onOk = async () => {
        const res = await axios.put('/api/allDates', { id: session?.user?.id, user2Id, fixed: true });
        socket.emit('notification', "true");
        fetchData();
    }
    const onNo = async () => {
        const res = await axios.put('/api/allDates', { id: session?.user?.id, user2Id, fixed: false });
        fetchData();
    }
    useEffect(() => {
        if (status === "unauthenticated") {
            setToggleDate(false);
        }
    }, [status])
    if (status === 'loading') {
        setLoading(true)
    }
    else {
        setLoading(false)
    }
    return (
        <>
            {toggleDate ? <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[10000000]">
                <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-auto">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Want to fix coding date with {username}?</h2>
                    <p className="text-lg text-gray-700 mb-6">
                        On{" "}<span className='font-semibold'>{meetingDate.split('T')[0].toString()}</span>{" "}at{" "}<span className='font-semibold'>{meetingTime}</span>
                    </p>
                    <div className="flex justify-end space-x-4">
                        <button
                            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all duration-300"
                            onClick={onOk}
                        >
                            Yes
                        </button>
                        <button
                            className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all duration-300"
                            onClick={onNo}
                        >
                            No
                        </button>
                    </div>
                </div>
            </div> : ''}
        </>
    );
};

export default AllDateModal;
