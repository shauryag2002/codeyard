"use client";

import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";

export function PlaceholdersAndVanishInputDemo({ setSearch }: {
    setSearch: (search: string) => void
}) {
    const placeholders = [
        "Design a login page with username and password fields",
        "Create a registration page with form fields for email, password, and username",
        "Implement a news feed section where users can see posts from friends",
        "Develop a profile page where users can view and edit their personal information",
        "Build a messaging feature allowing users to send and receive messages in real-time",
        "Add a notification system to alert users of new friend requests, messages, or likes",
    ];


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    };
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };
    return (
        <div className="w-full flex flex-col justify-center  items-center">
            <PlaceholdersAndVanishInput
                placeholders={placeholders}
                onChange={handleChange}
                onSubmit={onSubmit}
            />
        </div>
    );
}
