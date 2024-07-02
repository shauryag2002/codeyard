import { EvervaultCard, Icon } from "./ui/evervault-card";

export function EvervaultCardDemo() {
    return (
        <div className="border border-black/[0.2] dark:border-white/[0.2] flex flex-col items-start  mx-auto  relative md:flex-1">
            <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
            <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
            <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
            <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

            <EvervaultCard text="Code. Swipe. Connect." />
        </div>
    );
}
