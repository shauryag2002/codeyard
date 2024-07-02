"use client";
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
const ProfileDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { data: session } = useSession();
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div ref={dropdownRef} className="relative" onMouseLeave={() => setIsOpen(false)}>
            <button
                className="flex items-center gap-2 p-2 bg-gray-100 rounded-full focus:outline-none"
                onClick={toggleDropdown}
                onMouseEnter={() => setIsOpen(true)}
            >
                <Image
                    src={session?.user?.image ?? ""}
                    alt={session?.user.username ?? "User"}
                    className="w-8 h-8 rounded-full"
                    width={32}
                    height={32}
                />
                <FaChevronDown className="text-gray-600" />
            </button>
            {isOpen && (
                <div className="absolute right-0  w-48 bg-white border border-gray-300 rounded shadow-lg">
                    <Link href={"/user/" + session?.user.id} className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        My Profile
                    </Link>
                    <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={async () => await signOut()}>
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;
