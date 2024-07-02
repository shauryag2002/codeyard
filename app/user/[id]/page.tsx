"use client"
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import countryList from 'react-select-country-list';
import Loader from '@/app/_components/Loader';
const ProfilePage = ({ params }: { params: { id: string } }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [yearOfExperience, setYearOfExperience] = useState('');
    const [bio, setBio] = useState('');
    const [location, setLocation] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [image, setImage] = useState('');
    const [resume, setResume] = useState('');
    const options = useMemo(() => countryList().getData(), [])

    const { data: session, status } = useSession();
    const [loader, setLoader] = useState(true)
    const handleEdit = () => {
        setIsEditing(true);
    }

    const handleCancelEdit = () => {
        setIsEditing(false);
    }

    const handleSave = () => {
        setIsEditing(false);
    }
    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`/api/user/${params.id}`);
            const user = await res.data;
            setName(user.name);
            setUsername(user.username);
            setEmail(user.email);
            setYearOfExperience(user.YOE);
            setBio(user.bio);
            setLocation(user.location);
            setAge(user.age);
            setImage(user.image);
            setResume(user.resume);
            setGender(user.gender);
            setLoader(false)

        }
        fetchUser();
    }, [params]);
    if (status === 'loading' || loader) return <Loader />;
    return (
        <div className="flex items-center justify-center bg-gray-100 h-full md:h-[91vh] md:flex-row flex-col">
            <div className='flex flex-col items-center justify-center'>

                <Image width={128} height={128} src={image} alt="Profile" className="w-32 h-32 rounded-full mb-4" />

                {isEditing ? (
                    <div className="mb-4 text-center flex gap-1 flex-col">
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="border-b border-gray-400 focus:outline-none focus:border-blue-500 mb-2" />
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="border-b border-gray-400 focus:outline-none focus:border-blue-500 mb-2" />
                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="border-b border-gray-400 focus:outline-none focus:border-blue-500 mb-2" />
                    </div>
                ) : (
                    <div className="mb-4 text-center">
                        <h1 className="text-xl font-bold">{name}</h1>
                        <p className="text-gray-600">@{username}</p>
                        <p className="text-gray-600">{email}</p>
                    </div>
                )}

                {isEditing ? (
                    <div className="flex justify-center mb-4">
                        <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2">Save</button>
                        <button onClick={handleCancelEdit} className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">Cancel</button>
                    </div>
                ) : (
                    <div className='flex justify-center gap-2 mb-4'>
                        <Link href={params.id ? '/chat/' + params.id : '/chats'} className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded' >{params.id !== session?.user.id ? "Chat" : "Chats"} </Link>
                        {params.id === session?.user.id ? <button onClick={handleEdit} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Edit</button> : null}
                    </div>
                )}

                <div className="max-w-lg mx-auto mt-8">
                    <div className="m-4">
                        <p className='flex justify-around'><span className="font-semibold">Year of Experience:</span> {isEditing ? <input type="text" value={yearOfExperience} onChange={(e) => setYearOfExperience(e.target.value)} className="border-b border-gray-400 focus:outline-none mb-2" /> : yearOfExperience}</p>
                        <p className='flex justify-around' title={bio}><span className="font-semibold">Bio:</span> {isEditing ? <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="border border-gray-400 focus:outline-none mb-2" /> : bio.split('').slice(0, 50).join('') + '...'}</p>
                        <p className='flex justify-around'><span className="font-semibold">Location:</span> {isEditing ?
                            <select value={location} onChange={(e) => setLocation(e.target.value)} className="border-b border-gray-400 focus:outline-none mb-2 w-[236px]">
                                {options.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            : location}</p>
                        <p className='flex justify-around'><span className="font-semibold">Age:</span> {isEditing ? <input type="text" value={age} onChange={(e) => setAge(e.target.value)} className="border-b border-gray-400 focus:outline-none mb-2" /> : age}</p>
                        <p className='flex justify-around'><span className="font-semibold">Gender:</span> {isEditing ? <input type="text" value={gender} onChange={(e) => setGender(e.target.value)} className="border-b border-gray-400 focus:outline-none mb-2" /> : gender}</p>
                    </div>

                </div>
            </div>

            <div className='max-w-lg flex justify-center'>

                <Image height={100} width={512} src={resume} alt="Resume" className="w-[90%] rounded-lg" />
            </div>
        </div>
    );
}

export default ProfilePage;
