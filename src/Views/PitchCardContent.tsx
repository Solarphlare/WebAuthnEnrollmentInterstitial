import { useEffect } from 'react';
import { HeaderIcon } from '../Components/HeaderIcon';
import { LargeButton } from '../Components/LargeButton';
import enrollPasskey from '../PasskeyEnrollment';
import anime from 'animejs';
import { useSnackbar } from '../ComponentContexts/SnackbarContext';
import SetupState from '../Types/SetupState';

export function PitchCardContent({ setupState, setSetupState }: { setupState: SetupState, setSetupState: (state: SetupState) => void }) {
    const { showSnackbar } = useSnackbar();

    async function onCreateClick() {
        if (setupState !== SetupState.Complete) {
            try {
                setSetupState(SetupState.InProgress);
                await enrollPasskey(setSetupState);
            }
            catch (e) {
                setSetupState(SetupState.NotStarted);
                console.error(e);
                showSnackbar({ text: "Failed to create the passkey." });
            }
        }
        else {
            window.location.href = "/continue";
        }
    }

    useEffect(() => {
        if (setupState !== SetupState.Complete) return;

        (async () => {
            anime({
                targets: "#loading-dots",
                opacity: 0,
                duration: 150,
                easing: "easeInOutSine",
                complete: async () => {
                    document.getElementById("loading-dots")!.classList.add("hidden");
                    document.getElementById("continue-label")!.classList.remove("hidden");

                    anime({
                        targets: "#continue-label",
                        opacity: 1,
                        duration: 150,
                        easing: "easeInOutSine"
                    });
                }
            });

            const pitchElem = document.querySelector("#pitch-elements")!;
            pitchElem.addEventListener("transitionend", () => {
                pitchElem.classList.add("hidden");
                document.getElementById("complete-elements")!.classList.remove("hidden");
                document.getElementById("complete-elements")!.classList.add("flex");

                setTimeout(() => {
                    const completeElem = document.querySelector("#complete-elements")!;
                    completeElem.classList.remove("opacity-0");
                }, 50);
            }, { once: true });

            pitchElem.classList.add("opacity-0");

        })();
    }, [setupState]);

    return (
        <div className='flex flex-col gap-6 transition-all justify-between duration-250 flex-1'>
            <div className='flex flex-col gap-2 transition-all duration-300'>
                <HeaderIcon />
                <div id="pitch-elements" className='flex flex-col gap-2 transition-all duration-250'>
                    <h1 className='font-semibold text-2xl transition-all duration-300 selection:bg-neutral-900 selection:text-white dark:text-neutral-200 dark:selection:bg-neutral-200 dark:selection:text-black'>Upgrade to Passkeys</h1>
                    <p className='transition-all duration-300 selection:bg-neutral-900 selection:text-white dark:text-neutral-200 dark:selection:bg-neutral-200 dark:selection:text-black'>Switch to a more secure and effortless way to sign in to your account &ndash; one that's resistant to the threats that traditional passwords face. With just your face, fingerprint, or PIN, signing in becomes easier and more secure. Setup is quick and only takes a few clicks.</p>
                </div>
                <div id="complete-elements" className="hidden flex-col gap-2 transition-all duration-300 opacity-0">
                    <h1 className='font-semibold text-2xl transition-all duration-300 selection:bg-neutral-900 selection:text-white dark:text-neutral-200 dark:selection:bg-neutral-200 dark:selection:text-black'>Passkey Created</h1>
                    <p className='transition-all duration-300 selection:bg-neutral-900 selection:text-white dark:text-neutral-200 dark:selection:bg-neutral-200 dark:selection:text-black'>Your passkey has been successfully created. Now, you can sign in with just your face, fingerprint, or PIN &ndash; without having to remember another password.</p>
                    <p className='transition-all mt-2 duration-300 selection:bg-neutral-900 selection:text-white dark:text-neutral-200 dark:selection:bg-neutral-200 dark:selection:text-black'>Passkeys can be added or removed at <a className="md:hover:underline" href="https://auth.solarphlare.com" target="_blank">auth.solarphlare.com</a>, and they can also be removed from your device in its Settings app.</p>
                </div>
            </div>
            <div className='flex flex-col gap-3 items-center transition-all duration-300'>
                <div id="hero-button-container" className={`w-full ${setupState === SetupState.Complete ? "" : "mb-[44px]"} transition-all duration-[350ms]`}>
                    <LargeButton onClick={onCreateClick}>
                        <div className="flex justify-center items-center gap-2" id="hero-button-content">
                        {
                            setupState !== SetupState.NotStarted ? (
                                <>
                                    <div
                                        id="loading-dots" className="relative inline-block w-2.5 h-2.5 rounded-full bg-white
                                            animate-dotFlashing
                                            [animation-delay:0.2s]
                                            before:content-[''] before:absolute before:top-0 before:-left-4
                                            before:w-2.5 before:h-2.5 before:rounded-full before:bg-white
                                            before:animate-dotFlashing before:[animation-delay:0s]
                                            after:content-[''] after:absolute after:top-0 after:left-4
                                            after:w-2.5 after:h-2.5 after:rounded-full after:bg-white
                                            after:animate-dotFlashing after:[animation-delay:0.4s]">
                                    </div>
                                    <span>&nbsp;</span>
                                </>
                            ) : (
                                <p id="create-label">Create a Passkey</p>
                            )

                        }
                        <p className='hidden opacity-0' id="continue-label">Continue</p>
                        </div>
                    </LargeButton>
                </div>
                <button className={`md:hover:underline mt-[-44px] ${setupState === SetupState.Complete ? "opacity-0" : ""} select-none text-center pt-2 transition-all duration-300 dark:text-neutral-200`} onClick={() => { window.location.href = "/continue" }}>Remind Me Later</button>
            </div>
        </div>
    );
}

