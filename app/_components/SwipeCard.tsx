import React, { useEffect, useState } from "react";
import TinderCard from "react-tinder-card";
import axios from "axios";
import { useSession } from "next-auth/react"
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import Image from "next/image";
import Matched from "./Matched";
import Loader from "./Loader";

interface TinderCardsProps {
    peoples: Person[];
    setPeople: React.Dispatch<React.SetStateAction<never[]>>;
}

interface Person {
    name: string;
    resume: string;
    username: string;
    id: string;
    bio: string;
    image: string;
}

function TinderCards({ peoples, setPeople }: TinderCardsProps) {

    const { data: session, status } = useSession();
    const [count, setCount] = useState(-1);
    const [match, setMatch] = useState(false);
    const swiped = async (direction: string, id: string, SwipedUserId: string) => {
        if (direction === "left") {
            const res = await axios.put("/api/swipe", {
                id,
                swipeId: SwipedUserId,
                swipeAction: "rejected"
            });
        }
        if (direction === "right") {
            const res = await axios.put("/api/swipe", {
                id,
                swipeId: SwipedUserId,
                swipeAction: "merged"
            });
            setUsername(res.data.username);
            setId(res.data.id);
            setMatch(res.data.match);
        }
    };
    const [loader, setLoader] = useState(true);
    useEffect(() => {
        const allResumeFetch = async () => {
            if (!session?.user.id) return;
            const res = await axios.post("/api/yard", {
                id: session?.user.id
            });
            setLoader(false)
            setCount(res.data.length);
            setPeople(res.data);
        };
        allResumeFetch();
    }, []);
    const [username, setUsername] = useState("");
    const [id, setId] = useState("");
    if (status === "loading" || loader) {
        return <Loader />;
    }

    return (
        <div className="relative">
            {match && <Matched onClose={() => setMatch(false)} username={username} id={id} />}
            <div className="hidden sm:block absolute bottom-0 left-0 -z-1 p-5 text-center text-[3vw]">
                <div className="">Reject</div>
                <FaLongArrowAltLeft />
            </div>
            <div className="flex justify-center h-[653px] bg-transparent relative z-10">
                {peoples?.map((person: Person, index) => (
                    <TinderCard
                        key={index}
                        className="absolute bg-white *:select-none sm:w-[440px] w-[90%]"
                        preventSwipe={["up", "down"]}
                        onSwipe={(dir) => swiped(dir, session?.user.id ?? "", person.id)}
                        onCardLeftScreen={() => { setCount((prev) => prev - 1) }}
                    >
                        <div className="relative w-full h-0 pb-[133.33%]">
                            {person.resume ? (
                                <Image
                                    src={person.resume}
                                    alt={"Resume of " + person.username}
                                    layout="fill"
                                    objectFit="contain"
                                    className="pointer-events-none"
                                />
                            ) : (
                                <div className="h-auto w-full bg-gray-200 flex justify-center items-center">No resume</div>
                            )}
                        </div>
                        <div className="flex px-3 py-2">
                            <img
                                src={person.image}
                                alt={person.username}
                                className="rounded-full h-[40px] w-[40px] object-cover border-2 border-white shadow-lg"
                            />
                            <div className="pl-2 flex flex-col flex-1 h-[40px] w-[40px]">
                                <h3 className="text-left">{person.name}</h3>
                                <h4 className="text-left text-sm font-semibold">@{person.username}</h4>
                            </div>
                            <div title={'Bio: ' + person.bio} className="border rounded-full flex justify-center items-center h-[40px] w-[40px]">?</div>
                        </div>
                    </TinderCard>
                ))}
                {count === 0 && <h1 className="text-[4vw] text-center opacity-50 text-black">No more resumes to show</h1>}
            </div>
            <div className="hidden sm:block absolute bottom-0 right-0 -z-1 p-5 text-center text-[3vw]">
                <div className="">Merge</div>
                <FaLongArrowAltRight />
            </div>
        </div>
    );
}

export default TinderCards;
