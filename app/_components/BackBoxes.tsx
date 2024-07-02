"use client";
import React from "react";
import { CardStackDemo } from "./Features";

export function BackgroundBoxesDemo() {
    return (
        <div className="bg-slate-200 bg-opacity-[0.70] backdrop-blur-3xl">

            <CardStackDemo />
        </div>
    );
}
