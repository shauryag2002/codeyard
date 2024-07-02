"use client";
import { CardStack } from "./ui/card-stack";
import { cn } from "@/utils/cn";
export function CardStackDemo() {
    return (
        <div className="h-[40rem] flex items-center justify-center w-full">
            <CardStack items={CARDS} />
        </div>
    );
}

export const Highlight = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <span
            className={cn(
                "font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-700/[0.2] dark:text-emerald-500 px-1 py-0.5",
                className
            )}
        >
            {children}
        </span>
    );
};


const CARDS = [
    {
        "id": 0,
        "name": "Alice Johnson",
        "designation": "Frontend Developer",
        "content": (<p> CodeYard is the perfect place to find someone who understands my passion for coding. <Highlight>I've met amazing people</Highlight> here who share my interests in tech and development!</p>)
    },
    {
        "id": 1,
        "name": "Bob Smith",
        "designation": "Backend Developer",
        "content": (<p>I never thought I'd find a dating app tailored specifically for coders. <Highlight>CodeYard</Highlight> has helped me connect with other developers who truly get my lifestyle and work schedule. It's a game-changer!</p>)
    },
    {
        "id": 2,
        "name": "Carol Lee",
        "designation": "Full Stack Developer",
        "content": (<p>Finding someone who speaks the same coding language as me has always been a challenge. <Highlight>Thanks to CodeYard</Highlight>, I've finally met people who not only understand my work but also share my enthusiasm for it.</p>)
    }
]

