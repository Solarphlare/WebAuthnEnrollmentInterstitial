import { useSnackbar } from "../ComponentContexts/SnackbarContext";

export function Snackbar() {
    const { isVisible, text } = useSnackbar();

    return (
        <div className={`${!isVisible && "opacity-0 pointer-events-none"} fixed w-full h-36 top-[100%] left-[50%] sbc-transform transition-all duration-200`}>
            <div className="flex items-center justify-center px-[8%] sm:px-0 ">
                <div className={`w-full sm:w-[25.125rem] text-start bg-neutral-800 shadow-md text-white py-3 px-4 rounded-xl transition duration-200 ease-in-out text-[0.95rem] ${!isVisible && "scale-[90%]"}`}>{text}</div>
            </div>
        </div>
    )
}
