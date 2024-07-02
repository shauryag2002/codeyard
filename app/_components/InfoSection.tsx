"use client"
import React, { useEffect, useMemo } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "@/utils/cn";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { saveImage } from "../_utils/SaveProfilePic";
import axios from "axios";
import Link from "next/link";
import Select from 'react-select'
import countryList from 'react-select-country-list'
import { toast } from "sonner";
interface InfoSectionProps {
    name: string;
    email: string;
    password: string;
    image: string;
}
const InfoSection = ({ name, email, password, image }: InfoSectionProps) => {
    const options = useMemo(() => countryList().getData(), [])

    const [info, setInfo] = React.useState({
        bio: "",
        location: "",
        YOE: 0,
        gender: "male",
        username: "",
        age: 20
    });
    const { data: session } = useSession()
    const [img, setImg] = React.useState<string>("")
    const router = useRouter()
    const handleSubmit = async () => {
        if (info.username === "" || info.bio === "" || info.location === "" || img === null) {
            alert("Please fill all the fields")
            return
        }

        const resumeLink = await saveImage(img, 'CODEYARD_RESUME')

        if (!session?.user.username && session?.user.id) {
            const res2 = await axios.put("/api/infoRegister", {
                ...info, id: session.user.id, resume: resumeLink
            }
            )
            toast(res2.data.message)

            router.push("/yard")
            return;
        }
        const res = await axios.post("/api/register", {
            ...info, name, email, password, image, resume: resumeLink
        }
        )
        if (res.status === 200) {
            await signIn("credentials", {
                email: email,
                password: password,
                redirect: false
            })
            router.push("/yard")
        }
    }
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        if (!e?.target?.files?.[0]) {
            alert('No file selected');
            return;
        }

    };
    useEffect(() => {

        if (session?.user?.username) {
            router.push("/yard")
        }
    }, [session?.user?.username])

    async function readURL(input: HTMLInputElement) {
        if (input?.files?.[0]) {
            const reader = new FileReader();
            reader.onload = async function (e) {
                setImg(e.target?.result as string)
            };
            reader.readAsDataURL(input?.files[0]);
        }
    }
    return <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 py-3 shadow-input bg-white dark:bg-black">
        <LabelInputContainer className="mb-4">
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="yourName@123" type="text"
                value={info.username}
                onChange={(e) => { setInfo({ ...info, username: e.target.value }) }}
            />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
            <Label htmlFor="bio">Bio</Label>
            <Input id="bio" placeholder="Tell us about yourself"
                value={info.bio}
                onChange={(e) => { setInfo({ ...info, bio: e.target.value }) }}
            />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
            <Label htmlFor="location">Location</Label>
            <Select
                isSearchable={true}
                options={options}
                onChange={(e) => {
                    setInfo({ ...info, location: e?.value ?? "" })
                }}
            />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
            <Label htmlFor="gender">Gender</Label>
            <select value={info.gender} onChange={
                (e) => { setInfo({ ...info, gender: e.target.value }) }
            }>
                <option value="male">Male</option>
                <option value='female'>Female</option>
                <option value='other'>Other</option>
            </select>
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
            <Label htmlFor="YOE">Years of Experience</Label>
            <Input id="YOE" placeholder="How many years have you been coding?" type="number"
                value={info.YOE}
                onChange={(e) => { setInfo({ ...info, YOE: Number(e.target.value) }) }}
            />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
            <Label htmlFor="resume">Resume</Label>
            <Input id="resume" type="file" accept=".pdf"
                onChange={(e) => {
                    readURL(e.target as HTMLInputElement);
                    handleFileChange(e);
                }}
            />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
            <Label htmlFor="age">Age</Label>
            <Input id="age" type="number"
                value={info.age}
                onChange={(e) => { setInfo({ ...info, age: Number(e.target.value) }) }}
            />
        </LabelInputContainer>
        <button
            className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            onClick={handleSubmit}
        >
            Sign up &rarr;
            <BottomGradient />
        </button>
        <div className="opacity-[0.935] mt-2 text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 opacity-[1]">
                Login
            </Link>
        </div>
        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

    </div>
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
const BottomGradient = () => {
    return (
        <>
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        </>
    );
};
export default InfoSection;
