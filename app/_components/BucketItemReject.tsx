import React, { useEffect, useState } from "react";
import Image from "next/image";
import { MdDeleteOutline, MdPreview } from "react-icons/md";
import { PiGitMergeDuotone } from "react-icons/pi";
interface Item {
    id: number;
    name: string;
    image: string;
    resume: string;
    username: string;
    bio: string;
}
interface BucketItemRejectProps {
    item: Item;
    index: number;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, sourceId: string, index: number) => void;
    setShow: (value: string) => void;
    putInMerged: (sourceId: string, index: number, destinationId: string) => void;
}
const BucketItemReject = ({ item, index, onDragStart, setShow, putInMerged }: BucketItemRejectProps) => {
    const [showPreview, setShowPreview] = useState(false);
    useEffect(() => {
        if (window.innerWidth <= 768) {
            setShowPreview(true);
        }
    }
        , [window.innerWidth])
    return <div
        key={item.id}
        draggable
        onDragStart={(e) => onDragStart(e, 'rejected', index)}
        className='group reject shadow-md h-fit w-fit relative'
        onClick={() => {
            if (window.innerWidth <= 768) {
                setShowPreview(!showPreview);
            }
        }}
    >
        {showPreview && (<div className='absolute top-[2px] right-[2px] opacity-[0.8] rounded-md p-1 bg-slate-500 z-10' onClick={() => {
            setShow(item.resume)

        }}><MdPreview height={40} width={40} /></div>)}
        <div className='group-hover:block hidden absolute top-[2px] right-[2px] opacity-[0.8] rounded-md p-1 bg-slate-500 z-10' onClick={() => {
            setShow(item.resume)

        }}><MdPreview height={40} width={40} /></div>
        <div className="card">
            <div className="h-auto w-auto md:h-[129.91px] md:w-[93px] relative">

                {item.resume ? <Image src={item.resume} className='h-auto w-auto' height={100} width={100} alt={item.username} layout='responsive' /> : null}
            </div>
            <div title={item.username} className='text-nowrap overflow-ellipsis w-[93px] overflow-hidden'>{item.username}</div>
            <div className="flex w-full">

                <button title='Merge' className='flex justify-center bg-green-500 flex-1 p-2 my-1 mx-2 rounded-md' onClick={() => putInMerged("rejected", index, "merged")}><PiGitMergeDuotone /></button>
                <button title='Trash' className='flex justify-center bg-red-700 flex-1 p-2 my-1 mx-2 rounded-md' onClick={() => putInMerged("rejected", index, "trash")}><MdDeleteOutline /></button>
            </div>
        </div>
    </div>
};

export default BucketItemReject;
