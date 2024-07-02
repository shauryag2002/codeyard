import React, { useRef, useEffect } from "react";

const VideoStream = ({ video }: {
    video: string
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        const videoElement = videoRef.current;
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
    return <div>
        <video ref={videoRef} src={video} controls muted className="px-2 py-1 rounded md:flex-1 w-[95%] h-full object-cover" />
    </div>;
};

export default VideoStream;
