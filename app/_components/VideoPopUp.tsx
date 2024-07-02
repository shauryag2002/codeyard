import React, { useState, useEffect, useCallback, useRef } from 'react';
import { socket } from '@/socket';
import Peer, { MediaConnection } from 'peerjs';
import { useSession } from 'next-auth/react';
import Draggable from 'react-draggable';
import { FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { usePathname } from 'next/navigation';

interface User {
    peerId: string;
    email: string;
}

const VideoCall: React.FC = () => {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [peer, setPeer] = useState<Peer | null>(null);
    const [peerId, setPeerId] = useState<string>('');
    const [videoEnabled, setVideoEnabled] = useState<boolean>(true);
    const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
    const [isButtonsVisible, setButtonsVisible] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const { data: session } = useSession();
    const pathName = usePathname();
    useEffect(() => {
        const peerInstance = new Peer();
        setPeer(peerInstance);

        peerInstance.on('open', (id: string) => {
            setPeerId(id);
        });

        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                peerInstance.on('call', (call: MediaConnection) => {
                    call.answer(stream);
                    call.on('stream', (remoteStream: MediaStream) => {
                        setRemoteStream(remoteStream);
                        if (remoteVideoRef.current) {
                            remoteVideoRef.current.srcObject = remoteStream;
                        }
                    });
                });
            })
            .catch((error) => {
                console.error(error);
            });

        return () => {
            socket.off('connect');
        };
    }, []);

    useEffect(() => {
        if (!session?.user.email || !peerId || !peer) return;

        socket.emit('room:join', { email: session.user.email, room: pathName.split('/').pop(), peerId });

        socket.on('room:users', (users: User[]) => {
            setUsers(users);
        });

        socket.on('room:user:toggle:audio', ({ peerId: remotePeerId, email }: User) => {
            if (peerId === remotePeerId || session.user.email === email) return;

            if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
                const stream = remoteVideoRef.current.srcObject as MediaStream;
                stream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
            }
        });

        socket.on('room:user:toggle:video', ({ peerId: remotePeerId, email }: User) => {
            if (peerId === remotePeerId || session.user.email === email) return;

            if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
                const stream = remoteVideoRef.current.srcObject as MediaStream;
                stream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
            }
        });

        const handleUnload = () => {
            socket.emit('room:leave', { email: session.user.email, room: pathName.split('/').pop(), peerId });
        };

        window.addEventListener('beforeunload', handleUnload);

        return () => {
            window.removeEventListener('beforeunload', handleUnload);
            socket.off('room:users');
        };
    }, [session?.user.email, peerId, peer]);

    useEffect(() => {
        if (users.length === 0 || !peer) return;

        for (const user of users) {
            if (user.peerId === peerId || user.email === session?.user.email) continue;

            const call = peer.call(user.peerId, localVideoRef.current?.srcObject as MediaStream);
            call?.on('stream', (remoteStream: MediaStream) => {
                setRemoteStream(remoteStream);
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = remoteStream;
                }
            });
        }
    }, [users, peerId, peer, session?.user.email]);

    const toggleVideo = useCallback(() => {
        if (localVideoRef.current && localVideoRef.current.srcObject) {
            const stream = localVideoRef.current.srcObject as MediaStream;
            stream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
            setVideoEnabled(!videoEnabled);
        }
    }, [videoEnabled]);

    const toggleAudio = useCallback(() => {
        if (localVideoRef.current && localVideoRef.current.srcObject) {
            const stream = localVideoRef.current.srcObject as MediaStream;
            stream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
            setAudioEnabled(!audioEnabled);
        }
    }, [audioEnabled]);

    useEffect(() => {
        if (!peerId || !session?.user.email) return;
        socket.emit('room:user:toggle:audio', { email: session.user.email, peerId, room: pathName.split('/').pop() });
    }, [audioEnabled, session?.user.email, peerId]);

    useEffect(() => {
        if (!peerId || !session?.user.email) return;
        socket.emit('room:user:toggle:video', { email: session.user.email, peerId, room: pathName.split('/').pop() });
    }, [videoEnabled, session?.user.email, peerId]);

    return (
        <Draggable>
            <div id="video-grid" className="fixed right-5 bottom-5 z-50 p-4 rounded-lg backdrop-filter backdrop-blur-3xl sm:block md:flex flex-wrap w-auto">
                <div className="relative group">
                    <video className="h-[210px] w-[290px] object-cover" id="localVideo" ref={localVideoRef} autoPlay playsInline muted></video>
                    <div
                        onClick={() => setButtonsVisible(!isButtonsVisible)}
                        className={`absolute inset-0 opacity-[1] flex items-center justify-center space-x-4 ${isButtonsVisible ? 'opacity-100' : 'sm:opacity-0 sm:group-hover:opacity-100'} sm:transition-opacity`}
                    >
                        <button onTouchStart={toggleVideo} className="bg-gray-800 p-2 rounded-full text-white block sm:hidden">
                            {videoEnabled ? <FaVideo /> : <FaVideoSlash />}
                        </button>
                        <button onTouchStart={toggleAudio} className="bg-gray-800 p-2 rounded-full text-white block sm:hidden">
                            {audioEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
                        </button>
                        <button onClick={toggleVideo} className="bg-gray-800 p-2 rounded-full text-white hidden sm:block">
                            {videoEnabled ? <FaVideo /> : <FaVideoSlash />}
                        </button>
                        <button onClick={toggleAudio} className="bg-gray-800 p-2 rounded-full text-white hidden sm:block">
                            {audioEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
                        </button>
                    </div>
                </div>
                {remoteStream ? (
                    <video className='h-[210px] w-[290px] object-cover' id="remoteVideo" ref={remoteVideoRef} autoPlay playsInline></video>
                ) : (
                    <div className="bg-gray-200 flex justify-center items-center w-[290px] h-[210px]">
                        <p className="text-gray-600">User is not present.</p>
                    </div>
                )}
            </div>
        </Draggable>
    );
};

export default VideoCall;
