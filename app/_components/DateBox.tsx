import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner'
import axios from 'axios';
import { socket } from '@/socket'
import Loader from '@/app/_components/Loader';
interface DateBoxProps {
    toggleDataBox: () => void;
    user2Id: string;
}
const DateBox = ({ toggleDataBox, user2Id }: DateBoxProps) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const { data: session, status } = useSession();
    if (status === 'loading') return <Loader />;
    const handleDone = async () => {
        if (!date) return alert('Please select a date')
        if (!time) return alert('Please select a time')
        const res = await axios.post('/api/Date', { id: session?.user.id, user2Id, date, time });
        if (!res.data.fixed) {
            toast.success(res.data.message);
            toggleDataBox();
            return;
        }
        socket.emit('newDate', user2Id);
        toast.success(res.data.message);
        toggleDataBox();
    };
    return (
        <div className="max-w-sm mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Fix your coding date !?</h3>
            <div className="flex">

                <input
                    type="date"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 flex-1"
                    value={date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate(e.target.value)}
                />
                <input
                    type="time"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4 flex-1"
                    value={time}
                    disabled={date ? false : true}
                    onChange={(e) => setTime(e.target.value)}
                />
            </div>
            <div className="flex justify-end space-x-4">
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-300"
                    onClick={handleDone}
                >
                    Done
                </button>
                <button
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-all duration-300"
                    onClick={toggleDataBox}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default DateBox;
