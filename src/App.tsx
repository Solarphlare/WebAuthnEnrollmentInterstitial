import { useState } from 'react';
import { PitchCardContent } from './Views/PitchCardContent';
import { Snackbar } from './Components/Snackbar';
import SetupState from './Types/SetupState';

function App() {
  const [setupState, setSetupState] = useState(SetupState.NotStarted);

  return (
    <div className="w-full h-[100dvh] px-[10%] md:px-0 flex flex-col items-center justify-center bg-neutral-100/60 dark:bg-zinc-900 transition-all duration-300">
      <div className="bg-white dark:bg-zinc-800 shadow-sm dark:shadow-[#090909] border-neutral-200 dark:border-neutral-700 border-[1px] h-[28.5rem] sm:w-[28rem] w-full sm:h-[25.125rem] rounded-2xl p-8 flex flex-col transition-all duration-300">
        <PitchCardContent setupState={setupState} setSetupState={setSetupState} />
      </div>
      <Snackbar />
    </div>
  );
}

export default App;
