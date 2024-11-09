import { ReactNode } from "react";

export function LargeButton({ onClick, children }: { onClick: () => void, children: ReactNode }) {
    return (
        <button onClick={onClick} className="bg-zinc-800 text-white dark:bg-zinc-200 select-none dark:text-black font-semibold rounded-xl px-4 py-2 w-full transition-all duration-200 md:duration-300 md:hover:bg-zinc-700 dark:md:hover:bg-[#aaaaad] shadow">
            {children}
        </button>
    )
}
