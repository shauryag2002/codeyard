"use client";
import Link from 'next/link';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {

    return (
        <footer className="bg-slate-900 text-white py-8">
            <div className="container mx-auto flex flex-col md:flex-row justify-around items-center">
                <div className="mb-4 md:mb-0">
                    <Link className="text-lg font-semibold hover:text-gray-400 transition-colors duration-300" href={"/about"}>
                        About Us
                    </Link>
                </div>
                <div className="flex space-x-4 mb-4 md:mb-0">
                    <Link href="https://www.linkedin.com/in/shauryagupta6/" className="hover:text-gray-400 transition-colors duration-300">
                        <FaLinkedin size={24} />
                    </Link>
                    <Link className="cursor-pointer hover:text-gray-400 transition-colors duration-300" href={'https://github.com/shauryag2002'}>
                        <FaGithub size={24} />
                    </Link>
                    <Link className="cursor-pointer hover:text-gray-400 transition-colors duration-300" href={"https://twitter.com/i/flow/login?redirect_after_login=%2FShauryag_2002"}>
                        <FaTwitter size={24} />
                    </Link>
                </div>
                <div className="text-center">
                    <span className="block font-semibold">Mail Me:</span>
                    <Link
                        className="underline cursor-pointer hover:text-gray-400 transition-colors duration-300"
                        href={"mailto:guptashaurya2002@gmail.com"}
                    >
                        guptashaurya2002@gmail.com
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
