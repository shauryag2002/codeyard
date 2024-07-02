"use client"
import React, { useCallback } from "react";
import { ImHtmlFive } from "react-icons/im";
import { DiCss3 } from "react-icons/di";
import { IoLogoJavascript } from "react-icons/io";
import { MdOutlineContentCopy } from "react-icons/md";
import { useSession } from "next-auth/react";
import { RealTimeMonaco } from 'real-time-monaco'
import Loader from "./Loader";
interface EditorProps {
    displayName: string;
    language: string;
    code: string;
    params: string;
    name: string;
    color: string;
    className?: string;
    handleChange: (value: string) => void;
}
export interface UsersType {
    cursor: {
        column?: number,
        lineNumber?: number
    },
    selection: {
        endColumn?: number, endLineNumber?: number, positionColumn?: number, positionLineNumber?: number, selectionStartColumn?: number, selectionStartLineNumber?: number, startColumn?: number, startLineNumber?: number
    },
    user: {
        color?: string, name?: string
    }
}
const Editor: React.FC<EditorProps> = (props) => {
    const { displayName, language, code, handleChange, params, name, color } = props;
    const { status } = useSession()

    const handleCopyCode = async () => {
        if (code) {
            await navigator.clipboard.writeText(code);
        }
    };
    const onChange = useCallback((value: string) => {
        handleChange(value);
    }, [handleChange]);

    if (status === 'loading') return (
        <Loader />
    )
    return (
        <div className={` w-full ${props.className ? props.className : ""}`}>
            <div className="flex justify-between gap-4 px-2">
                <div className="flex gap-2">
                    {language === "html" && <ImHtmlFive size={20} />}
                    {language === "css" && <DiCss3 size={20} />}
                    {language === "javascript" && <IoLogoJavascript size={20} />}
                    {displayName}
                </div>
                <div className="flex gap-4">
                    <button onClick={handleCopyCode} className="hover:text-[#5e5e5e]">
                        <MdOutlineContentCopy size={20} />
                    </button>

                </div>
            </div>

            <RealTimeMonaco name={name} color={color} roomId={params + language}
                language={language}
                theme="vs-dark"
                onChange={(value: string | undefined) => onChange(value || '')}
                height={"350px"}
                width={"100%"}
            />
        </div>
    );
}
export default Editor;