'use client'
import React, { useEffect, useState } from "react";
import SwipeCard from '../_components/SwipeCard'
import SideBar from "../_components/SideBar";
import { useRecoilState_TRANSITION_SUPPORT_UNSTABLE } from "recoil";
import { useRouter } from "next/navigation";
import { SideBarAtom } from "../_components/state/atoms/atom";
import { useSession } from "next-auth/react";
const Yard = () => {
    const { data: session } = useSession()
    const [open, setOpen] = useRecoilState_TRANSITION_SUPPORT_UNSTABLE(SideBarAtom)
    const router = useRouter()
    useEffect(() => {
        if (!session || !session?.user.username) {
            router.push("/register")
        }
    }, [session])
    const [peoples, setPeople] = useState([
    ]);
    return <div className=" overflow-hidden bg-[#e6d2bd]">
        {!open ? <div className={`top-[0] relative `}>
            <div className=" z-[100] fixed bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-3 rounded" onClick={() => setOpen(true)}> {">"}</div>
        </div> : null}
        <SideBar setPeople={setPeople} peoples={peoples} />

        <SwipeCard peoples={peoples} setPeople={setPeople} />
    </div>;
};

export default Yard;
