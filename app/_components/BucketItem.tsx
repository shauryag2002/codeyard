import React, { useEffect, useState } from "react";
import Image from "next/image";
import { MdDeleteOutline, MdPreview } from "react-icons/md";
interface Item {
    id: number;
    name: string;
    image: string;
    resume: string;
    username: string;
    bio: string;
}
interface BucketItemProps {
    item: Item;
    index: number;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, sourceId: string, index: number) => void;
    setShow: (value: string) => void;
    putInMerged: (sourceId: string, index: number, destinationId: string) => void;
}
const BucketItem = ({ item, index, onDragStart, setShow, putInMerged }: BucketItemProps) => {
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
        onDragStart={(e) => onDragStart(e, 'merged', index)}
        className='group merged shadow-md h-fit w-fit relative'
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

                {/* <Image src={item.resume} className='h-auto w-auto' height={129.91} width={93} alt={item.username} /> */}
                {item.resume ? <Image src={item.resume} className='h-auto w-auto' height={100} width={100} layout='responsive' alt={item.username} /> : null}
            </div>
            <div title={item.username} className='text-nowrap overflow-ellipsis w-[93px] overflow-hidden'>{item.username}</div>
            <div className="flex w-full">

                <button title='Reject' className='flex justify-center bg-green-500 flex-1 p-2 my-1 mx-2 rounded-md' onClick={() => putInMerged("merged", index, "rejected")} >
                    <Image src={'/RejectSvg.png'} height={20} width={20} alt={'Reject'} />
                </button>
                <button title='Trash' className='flex justify-center bg-red-700 flex-1 p-2 my-1 mx-2 rounded-md' onClick={() => putInMerged("merged", index, "trash")}><MdDeleteOutline /></button>
            </div>
        </div>
    </div>
};

export default BucketItem;
