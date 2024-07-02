import Image from 'next/image';
import { FC, useEffect, useRef, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

interface ImagePreviewProps {
    imageUrl: string;
    setImageUrl: (value: string) => void;
}

const ImagePreview: FC<ImagePreviewProps> = ({ imageUrl, setImageUrl }) => {
    const [close, setClose] = useState(imageUrl ? true : false);
    const overlayRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (overlayRef.current && overlayRef.current === event.target) {
            setClose(false);
            setImageUrl('');
        }
    };

    useEffect(() => {
        if (close) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [close]);

    return (
        <>
            {close && (
                <div
                    ref={overlayRef}
                    onClick={() => setImageUrl('')}
                    className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-[1000000]"
                >
                    <button
                        className="absolute top-0 right-0 m-2 text-white text-2xl"
                        onClick={() => {
                            setClose(false);
                            setImageUrl('');
                        }}
                    >
                        <FaTimes />
                    </button>
                    <div className="relative h-[90vh] w-full">
                        <Image
                            src={imageUrl}
                            alt="Preview"
                            fill
                            className="absolute max-w-full max-h-screen object-contain"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default ImagePreview;
