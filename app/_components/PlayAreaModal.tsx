"use client"
import { useState, useEffect } from 'react';
import { FiCopy } from 'react-icons/fi';
import { useParams, usePathname } from 'next/navigation'
const Modal = ({ onClose }: {
    onClose: () => void;
}) => {
    const [copied, setCopied] = useState(false);
    const params = useParams<{ id?: string; }>();
    const pathName = usePathname();
    useEffect(() => {

        setPath(pathName);
    }, []);
    const copyToClipboard = () => {
        const url = pathName;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    const [path, setPath] = useState('');
    if (params.id) {

        return null
    };
    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-[102]">
            <div className="bg-white p-8 rounded-lg max-w-md">
                <p className="text-lg mb-4">Give this link to your Code Buddy!</p>
                <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-mono select-all pr-2">
                        {path}
                    </span>
                    <button
                        className="flex items-center text-gray-600 hover:text-gray-800 bg-gray-200 px-2 py-1 rounded-md"
                        onClick={copyToClipboard}
                    >
                        <FiCopy className="mr-2" />
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
                <button className="mt-4 text-gray-600 hover:text-gray-800" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default Modal;