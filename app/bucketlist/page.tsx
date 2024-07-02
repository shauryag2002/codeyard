"use client";
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { MdPreview } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { PiGitMergeDuotone } from "react-icons/pi";
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation'
import Preview from '../_components/Preview';
import Loader from '../_components/Loader';
import BucketItem from '../_components/BucketItem';
import BucketItemReject from '../_components/BucketItemReject';
interface Item {
    id: number;
    name: string;
    image: string;
    resume: string;
    username: string;
    bio: string;
}

interface Items {
    merged: Item[];
    rejected: Item[];
    trash: Item[];
}
const initialItems: Items = {
    merged: [
    ],
    rejected: [
    ],
    trash: [],
};
const BucketList = () => {
    const [items, setItems] = useState<Items>(initialItems);
    const { data: session, status } = useSession()
    const [loader, setLoader] = useState(true)
    const [show, setShow] = useState('')
    const router = useRouter()
    useEffect(() => {
        const allUsersFunc = async () => {
            if (!session || !session?.user.id) {
                return;
            }
            const res = await axios.post('/api/yard/bucketlist', {
                id: session?.user.id ?? ""
            })
            setLoader(false)
            setItems({
                merged: res.data?.accounts[0].merged ?? [],
                rejected: res.data?.accounts[0].rejected ?? [],
                trash: [],

            })
        }
        allUsersFunc()
    }, [session])
    const onDragStart = (e: React.DragEvent<HTMLDivElement>, sourceId: string, index: number) => {
        e.dataTransfer.setData('sourceId', sourceId);
        e.dataTransfer.setData('index', index.toString());
    };
    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const onDrop = async (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
        const sourceId: string = e.dataTransfer.getData('sourceId');
        if (sourceId === '') return;
        const index: number = Number(e.dataTransfer.getData('index'));
        const item = items[sourceId as keyof Items][index];
        if (targetId === 'trash') {
            setItems({
                ...items,
                [sourceId]: items[sourceId as keyof Items].filter((_: Item, i: number) => i != Number(index)),
                trash: [],
            });
            const res = await axios.put('/api/yard/bucketlist', {
                id: session?.user.id,
                sourceAction: sourceId,
                targetAction: targetId,
                swipeId: item.id
            })
            return;
        }
        if (sourceId !== targetId) {
            const updatedSource = items[sourceId as keyof Items].filter((_: Item, i: number) => i != Number(index));
            const updatedTarget = [...items[targetId as keyof Items], item];
            setItems({
                ...items,
                [sourceId]: updatedSource,
                [targetId]: updatedTarget,
            });
            const res = await axios.put('/api/yard/bucketlist', {
                id: session?.user.id,
                sourceAction: sourceId,
                targetAction: targetId,
                swipeId: item.id
            })
        }
    };
    const putInMerged = async (sourceId: string, index: number, targetId: string) => {
        const ind = Number(index)
        const item = items[sourceId as keyof Items][ind];
        if (targetId === 'trash') {
            setItems({
                ...items,
                [sourceId]: items[sourceId as keyof Items].filter((_: Item, i: number) => i != Number(index)),
                trash: [],
            });
            const res = await axios.put('/api/yard/bucketlist', {
                id: session?.user.id,
                sourceAction: sourceId,
                targetAction: targetId,
                swipeId: item.id
            })
            return;
        }
        if (sourceId !== targetId) {
            const updatedSource = items[sourceId as keyof Items].filter((_: Item, i: number) => i != Number(index));
            const updatedTarget = [...items[targetId as keyof Items], item];
            setItems({
                ...items,
                [sourceId]: updatedSource,
                [targetId]: updatedTarget,
            });
            const res = await axios.put('/api/yard/bucketlist', {
                id: session?.user.id,
                sourceAction: sourceId,
                targetAction: targetId,
                swipeId: item.id
            })
        }
    }
    if (status === 'loading' || loader) {
        return <Loader />
    }
    if (status === 'unauthenticated') {
        router.push('/register')
    }
    return (
        <div className="main sm:m-3 m-7 select-none h-full">
            {show && <Preview imageUrl={show} setImageUrl={setShow} />}
            <h1 className='text-3xl font-semibold'>Bucket List</h1>
            <div className='flex flex-col gap-1 justify-center items-center mx-auto  flex-wrap'>

                <div className="left flex md:flex-row flex-col justify-center lg:gap-10 gap-4 md:m-0 my-7 flex-wrap md:w-auto w-full">
                    <div className="itemCard pt-5 lg:pt-0 md:w-auto w-[-webkit-fill-available]">
                        <button className='source marginL text-xl'>Merged:</button>

                        <div
                            className="Cards flex gap-6 overflow-auto w-[-webkit-fill-available] md:w-[512px] p-2 shadow-md md:h-h-auto"
                            onDragOver={(e) => onDragOver(e)}
                            onDrop={(e) => onDrop(e, 'merged')}
                        >

                            {items?.merged?.map((item: Item, index) => (
                                <BucketItem
                                    key={item.id}
                                    item={item}
                                    index={index}
                                    onDragStart={onDragStart}
                                    putInMerged={putInMerged}
                                    setShow={setShow}
                                />
                            ))}

                            {items.merged?.length === 0 && <div className="empty text-gray-400 opacity-[0.7] text-7xl lg:w-[512px]">Drop Items here...</div>}
                        </div>
                        {/* </div> */}
                    </div>
                    <div className="itemCard pt-5 lg:pt-0 md:w-auto w-[-webkit-fill-available]">
                        <button className='source marginL text-xl'>Rejected:</button>
                        <div
                            className="Cards flex gap-6 overflow-auto w-[-webkit-fill-available] md:w-[512px] p-2 shadow-md md:h-h-auto"
                            onDragOver={(e) => onDragOver(e)}
                            onDrop={(e) => onDrop(e, 'rejected')}
                        >
                            {items.rejected?.map((item: Item, index) => (
                                <BucketItemReject
                                    key={item.id}
                                    item={item}
                                    index={index}
                                    onDragStart={onDragStart}
                                    putInMerged={putInMerged}
                                    setShow={setShow}
                                />
                            ))}
                            {items.rejected?.length === 0 && <div className="empty  text-gray-400 opacity-[0.7] text-7xl">Drop Items here...</div>}

                        </div>
                    </div>
                </div>

                <div className="trash md:block hidden" onDrop={(e) => onDrop(e, 'trash')} onDragOver={(e) => onDragOver(e)}>
                    <div className="Cards justify-center"  >
                        <div
                        >
                            <div className="card">
                                <Image src={'/trash.png'} height={129.91} width={93} alt={'trash'} />
                                <span className='text-3xl '>Trash</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default BucketList;
