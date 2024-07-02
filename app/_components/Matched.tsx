import Link from 'next/link';
import React, { useEffect } from 'react';
import { FaHeart } from 'react-icons/fa';

const Matched = ({ onClose, id, username }: {
    onClose: () => void;
    id: string;
    username: string;
}) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
            <div className="text-center flex flex-col justify-center items-center">
                <FaHeart className="text-red-500 text-6xl mb-4 text-center" />
                <h1 className="text-white text-4xl font-bold">It's a Match!</h1>
                <Link href={'/chat/' + id} className='bg-[#EA1A58] hover:bg-[#a53a5a] text-white font-bold py-2 px-2 mx-4 my-2 rounded' >Chat with{" "}<span>{username}</span>

                </Link>
            </div>
        </div>
    );
};

export default Matched;
