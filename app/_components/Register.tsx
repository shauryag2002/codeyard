"use client";
import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "@/utils/cn";
import {
    IconBrandGithub,
    IconBrandGoogle,
} from "@tabler/icons-react";
import InfoSection from "./InfoSection";
import { useSession, signIn } from "next-auth/react";
import { saveImage } from "../_utils/SaveProfilePic";
import axios from "axios";
import Link from "next/link";
export function SignupFormDemo() {
    const [info, setInfo] = React.useState(false)
    const [userData, setUserData] = React.useState({
        name: "",
        email: "",
        password: "",
    });
    const [img, setImg] = React.useState<string>("")
    const { data: session } = useSession()
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };
    if (info || session) {
        return <InfoSection name={userData.name} email={userData.email} password={userData.password} image={img} />
    }
    function readURL(input: HTMLInputElement) {
        if (input?.files?.[0]) {
            const reader = new FileReader();
            reader.onload = async function (e) {
                setImg(e.target?.result as string)
            };
            reader.readAsDataURL(input?.files[0]);
        }
    }
    async function handleNext() {
        if (img === '' || userData.name === "" || userData.email === "" || userData.password === "") {
            alert("Please fill all the fields")
            return
        }
        try {
            setImg(await saveImage(img, "CODEYARD_ProfilePic_images") ?? "")
            setInfo(true)
            return;
        }
        catch (e) {
            console.log(e)
        }
    }
    return (

        <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 md:py-2 md:pb-[0.001rem] shadow-input bg-white dark:bg-black">
            <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
                Welcome to CodeYard
            </h2>

            <form className="my-8" onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                    <LabelInputContainer>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Enter your name" type="text" onChange={(e) => setUserData(
                            { ...userData, name: (e.target as HTMLInputElement).value }
                        )} value={userData.name} />
                    </LabelInputContainer>

                </div>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" placeholder="yourName@domain.com" type="email" onChange={(e) => {
                        setUserData({ ...userData, email: (e.target as HTMLInputElement).value })
                    }} value={userData.email} />
                </LabelInputContainer>

                <LabelInputContainer className="mb-4">
                    <Label htmlFor="img">Profile Picture</Label>

                    <Input
                        id="img"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            readURL(e.target as HTMLInputElement);
                        }}
                    />
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" placeholder="••••••••" type="password" value={userData.password} onChange={(e) => {
                        setUserData({ ...userData, password: (e.target as HTMLInputElement).value })
                    }} />
                </LabelInputContainer>


                <button
                    className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                    onClick={async () => {
                        await handleNext()
                    }}
                >
                    Next &rarr;
                    <BottomGradient />
                </button>
                <div className="opacity-[0.935] mt-2 text-center">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-500 opacity-[1]">
                        Login
                    </Link>
                </div>
                <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

                <div className="flex space-x-2">
                    <button
                        className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                        onClick={async (e) => {
                            await signIn("github", { callbackUrl: '/register' })
                        }}
                    >
                        <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm"
                        >
                            GitHub
                        </span>
                        <BottomGradient />
                    </button>
                    <button
                        className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                        onClick={async (e) => {
                            await signIn("google", { callbackUrl: '/register' })
                        }}
                    >
                        <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm"
                        >
                            Google
                        </span>
                        <BottomGradient />
                    </button>
                </div>
            </form>
        </div>
    );
}

const BottomGradient = () => {
    return (
        <>
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        </>
    );
};

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("flex flex-col space-y-2 w-full", className)}>
            {children}
        </div>
    );
};
