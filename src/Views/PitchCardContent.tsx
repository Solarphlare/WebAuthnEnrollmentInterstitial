import { useEffect } from 'react';
import { HeaderIcon } from '../Components/HeaderIcon';
import { LargeButton } from '../Components/LargeButton';
import enrollPasskey from '../PasskeyEnrollment';
import anime from 'animejs';
import { useSnackbar } from '../ComponentContexts/SnackbarContext';

export function PitchCardContent({ complete, onComplete }: { complete: boolean, onComplete: () => void }) {
    const { showSnackbar } = useSnackbar();

    async function onCreateClick() {
        if (!complete) {
            try {
                await enrollPasskey();
                onComplete();
            }
            catch (e) {
                console.error(e);
                showSnackbar({ text: "Failed to create the passkey." });
            }
        }
        else {
            window.location.href = "/continue";
        }
    }


    useEffect(() => {
        if (!complete) return;

        (async () => {
            anime({
                targets: "#create-label",
                opacity: 0,
                duration: 150,
                easing: "easeInOutSine",
                complete: async () => {
                    document.getElementById("create-label")!.classList.add("hidden");
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
    }, [complete]);

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
                    <p className='transition-all mt-2 duration-300 selection:bg-neutral-900 selection:text-white dark:text-neutral-200 dark:selection:bg-neutral-200 dark:selection:text-black'>Passkeys can be added or removed at <a className="md:hover:underline" href="https://auth.cominatyou.com" target="_blank">auth.cominatyou.com</a>, and they can also be removed from your device in its Settings app.</p>
                </div>
            </div>
            <div className='flex flex-col gap-3 items-center transition-all duration-300'>
                <div id="hero-button-container" className={`w-full ${complete ? "" : "mb-[44px]"} transition-all duration-[350ms]`}>
                    <LargeButton onClick={onCreateClick}>
                        <p id="create-label">Create a Passkey</p>
                        <p className='hidden opacity-0' id="continue-label">Continue</p>
                    </LargeButton>
                </div>
                <button className={`md:hover:underline mt-[-44px] ${complete ? "opacity-0" : ""} select-none text-center pt-2 transition-all duration-300 dark:text-neutral-200`} onClick={() => { window.location.href = "/continue" }}>Remind Me Later</button>
            </div>
        </div>
    );
}

