"use client"
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { ThreeDCardDemo } from "./_components/Home";
import { BackgroundBoxesDemo } from "./_components/BackBoxes";
import { VortexDemo } from "./_components/MidSection";
import { GlobeDemo } from "./_components/Globe";
import VideoStream from "./_components/VideoStream";
import Footer from "./_components/Footer";
export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playAreaRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = playAreaRef.current;
    let videoHasEnded = false;

    const handleScroll = () => {
      if (videoHasEnded) return;

      const videoRect = videoElement?.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;

      if (videoRect && videoRect.top < windowHeight) {
        videoElement?.play();
      } else {
        videoElement?.pause();
      }
    };

    const handleVideoEnd = () => {
      videoElement?.pause();
      videoHasEnded = true;
    };

    window.addEventListener("scroll", handleScroll);
    videoElement?.addEventListener("ended", handleVideoEnd);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      videoElement?.removeEventListener("ended", handleVideoEnd);
    };
  }, []);

  return (
    <div >
      <div className="flex justify-center lg:justify-between" style={{ backgroundImage: 'url("/bg.jpg")' }}>

        <ThreeDCardDemo />
        <Image src={'/good_img-removebg2.png'} className="lg:block hidden" height="100" width="550" alt="thumbnail" />
      </div>
      <div className="features">
        <BackgroundBoxesDemo />
      </div>
      <div className="bg-black">
        <VortexDemo />
      </div>
      <div className="h-[500px] bg-transparent">
        <video ref={videoRef} className='w-screen h-screen overflow-hidden fixed right-0 bottom-0 -z-10 object-fill' src="/backgroundImg.mp4" loop muted playsInline autoPlay />
      </div>
      <div className="text-[3rem] text-center bg-gradient-to-r from-purple-500 to-pink-500">Real time Collaboration</div>
      <div className="left flex flex-col md:flex-row flex-1 bg-[#54c896]">
        <GlobeDemo />
      </div>

      <div className="text-[3rem] text-center bg-gradient-to-r from-purple-500 to-pink-500">Video Call</div>
      <div className="flex justify-center items-center p-3 md:p-28 bg-opacity-50 backdrop-blur-md">

        <VideoStream video="/CodeYard_Playarea.mp4" />
      </div>
      <Footer />
    </div>
  );
}
