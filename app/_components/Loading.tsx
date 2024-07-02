import React from "react";
import { useRecoilValue } from "recoil";
import { loadingAtom } from "./state/atoms/atom";

const Loading = () => {
    const loading = useRecoilValue(loadingAtom);
    return <>
        {loading && <div className='fixed z-[1000000] top-0 w-[-webkit-fill-available] h-screen flex items-center justify-center bg-white'>
            <video src='/3d logo.mp4' loop muted playsInline autoPlay />
        </div>}
    </>
};

export default Loading;
