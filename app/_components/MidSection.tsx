import React from "react";
import { Vortex } from "./ui/Vortex";
import { EvervaultCardDemo } from "./EvervaultCard";
import VideoStream from "./VideoStream";

export function VortexDemo() {

    return (
        <div className="h-full overflow-hidden">
            <Vortex
                backgroundColor="black"
                className=" items-center flex-col justify-center w-full"
            >
                <div className="flex flex-wrap justify-around h-full w-full">

                    <EvervaultCardDemo />
                    <VideoStream video="/CodeYard_Swipe.mp4" />
                </div>

            </Vortex>
        </div>
    );
}
