"use client"
import { useState, useEffect } from "react";
import { ImHtmlFive } from "react-icons/im";
import { DiCss3 } from "react-icons/di";
import { IoLogoJavascript } from "react-icons/io";
import Modal from "../../_components/PlayAreaModal";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import dynamic from 'next/dynamic';
import VideoCall from "@/app/_components/VideoPopUp";
import axios from "axios";
import Link from "next/link";
import { useSetRecoilState } from "recoil";
import { UserAtom } from "@/app/_components/state/atoms/atom";
import Loader from "@/app/_components/Loader";
const CodeEditor = dynamic(() => import('../../_components/CodeEditor'), {
    ssr: false,
});
const CodeArea: React.FC = () => {
    const generateRandomColor = () => {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };
    const [userColor, setUserColor] = useState(generateRandomColor())
    const [html, setHtml] = useState('')
    const [activeCode, setActiveCode] = useState("html");
    const [srcDoc, setSrcDoc] = useState("")
    const [css, setCss] = useState('')
    const [javascript, setJavascript] = useState('')
    const params = useParams()
    const setUsers = useSetRecoilState(UserAtom)
    const { data: session, status } = useSession()
    const removeJS = (inputStr: string) => {
        if (inputStr.startsWith("javascript")) {
            return inputStr.substring(10);
        } else if (inputStr.startsWith("js")) {
            return inputStr.substring(2);
        } else {
            return inputStr;
        }
    };

    useEffect(() => {
        setTimeout(() => {
            setSrcDoc(`
      <html>
        <body>${html}</body>
        <style>${css}</style>
        <script>${javascript}</script>
      </html>`);
        }, 250);
    }, [html, css, javascript]);
    const [modalOpen, setModalOpen] = useState(true);

    const closeModal = () => {
        setModalOpen(false);
    };
    const [playarea, setPlayarea] = useState(false)
    const [shouldRenderEditor, setShouldRenderEditor] = useState(false);

    useEffect(() => {
        setShouldRenderEditor(window.innerWidth >= 1024);
    }, []);
    useEffect(() => {
        window.addEventListener('resize', () => {
            setShouldRenderEditor(window.innerWidth >= 1024)
        })
    }, [])
    const [loader, setLoader] = useState(true)
    useEffect(() => {
        if (!session?.user.username) return;
        const fetchPlayarea = async () => {
            const res = await axios.post('/api/playarea', {
                id: params.id
            });
            setLoader(false)

            setUsers(res.data.message)
            if (new Date(res.data.message.meetingDate.split('T')[0].toString() + 'T' + res.data.message.meetingTime) <= new Date()) {
                if (session.user.username === res.data.message.user1.username || session.user.username === res.data.message.user2.username) {

                    setPlayarea(true)
                } else {
                    setPlayarea(false)

                }
            }
            else {
                setPlayarea(false)
            }
        }
        fetchPlayarea()
    }, [session?.user.username])


    if (status === "loading" || loader) return <Loader />
    return (
        <div className="flex flex-col">
            {!playarea ? <>
                <div className="h-screen w-full flex flex-col justify-center items-center bg-gray-900">
                    <h1 className="text-white text-4xl font-bold">
                        This playarea does not belong to you.
                    </h1>
                    <div className="flex justify-center items-center mt-4">
                        <p className="text-white text-lg">
                            Go to{" "}
                            <Link href={'/yard'} className="font-semibold underline">Yard</Link>
                            , make friends, and convert them to coding dates.
                        </p>
                    </div>
                </div>
            </> :
                <>
                    {modalOpen && <Modal onClose={closeModal} />}

                    {shouldRenderEditor ? <div className="hidden w-full lg:flex flex-row justify-around text-base gap-2">
                        <CodeEditor
                            displayName="HTML"
                            language="html"
                            code={html}
                            handleChange={setHtml}
                            params={params.id as string}
                            name={session?.user.username ?? 'Guest'}
                            color={userColor}
                        />
                        <CodeEditor
                            displayName="CSS"
                            language="css"
                            code={css}
                            handleChange={setCss}
                            params={params.id as string}
                            name={session?.user.username ?? 'Guest'}
                            color={userColor}
                        />
                        <CodeEditor
                            displayName="JavaScript"
                            language="javascript"
                            code={javascript}
                            handleChange={setJavascript}
                            params={params.id as string}
                            name={session?.user.username ?? 'Guest'}
                            color={userColor}
                        />
                    </div> : <div className="lg:hidden w-full flex flex-row px-2 sm:px-10 gap-2 text-base">
                        <div className="py-4 flex flex-col gap-2">
                            <button
                                className={`${activeCode === "html" && "text-white bg-[#2C74B3]"
                                    } px-2 py-2 rounded-md`}
                                onClick={() => {
                                    setActiveCode("html");
                                }}
                            >
                                <ImHtmlFive size={23} />
                            </button>
                            <button
                                className={`${activeCode === "css" && "text-white bg-[#2C74B3]"
                                    } px-2 py-2 rounded-md`}
                                onClick={() => {
                                    setActiveCode("css");
                                }}
                            >
                                <DiCss3 size={26} />
                            </button>
                            <button
                                className={`${activeCode === "js" && "text-white bg-[#2C74B3]"
                                    } px-2 py-2 rounded-md`}
                                onClick={() => {
                                    setActiveCode("js");
                                }}
                            >
                                <IoLogoJavascript size={22} />
                            </button>
                        </div>
                        <div className="w-full">
                            <CodeEditor
                                displayName="HTML"
                                language="html"
                                code={html}
                                handleChange={setHtml}
                                params={params.id as string}
                                name={session?.user.username ?? 'Guest'}
                                color={userColor}
                                className={activeCode === "html" ? "block" : "hidden"}
                            />
                            <CodeEditor
                                displayName="CSS"
                                language="css"
                                code={css}
                                handleChange={setCss}
                                params={params.id as string}
                                name={session?.user.username ?? 'Guest'}
                                color={userColor}
                                className={activeCode === "css" ? "block" : "hidden"}
                            />
                            <CodeEditor
                                displayName="JavaScript"
                                language="javascript"
                                code={javascript}
                                handleChange={setJavascript}
                                params={params.id as string}
                                name={session?.user.username ?? 'Guest'}
                                color={userColor}
                                className={activeCode === "js" ? "block" : "hidden"}
                            />
                        </div>
                    </div>}

                    <div className="flex-1 h-[40vh]">
                        <iframe
                            id="output"
                            srcDoc={srcDoc}
                            title="output"
                            sandbox="allow-scripts"
                            className="bg-white"
                            width="100%"
                            height="100%"
                            style={{
                                height: "40vh"
                            }}
                        />
                    </div>

                    <VideoCall />
                </>
            }
        </div>
    );
}

export default CodeArea;
