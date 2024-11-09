import { createContext, useState, useContext, ReactNode } from 'react';

const SnackbarContext = createContext<SnackbarContextProps>({
    isVisible: false,
    text: "",
    showSnackbar: (_options: ShowSnackbarProps) => {},
    hideSnackbar: (_text: string) => {}
});

export interface ShowSnackbarProps {
    text: string;
    duration?: number;
}

interface SnackbarStateProps extends ShowSnackbarProps {
    isVisible: boolean;
}

interface SnackbarContextProps extends SnackbarStateProps {
    showSnackbar: (_options: ShowSnackbarProps) => void;
    hideSnackbar: (_text: string) => void;
}

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
    const [snackbarProps, setSnackbarProps] = useState<SnackbarStateProps>({ isVisible: false, text: "" });

    const showSnackbar = (options: ShowSnackbarProps) => {
        if (snackbarProps.isVisible) return;

        setSnackbarProps({ ...options, isVisible: true });
        setTimeout(() => { hideSnackbar(options.text) }, (options.duration ?? 3) * 1000);
    };

    const hideSnackbar = (text: string) => {
        setSnackbarProps({ isVisible: false, text });
    };

    return (
        <SnackbarContext.Provider value={ { ...snackbarProps, showSnackbar, hideSnackbar } }>
            {children}
        </SnackbarContext.Provider>
    );
};

export const useSnackbar = () => useContext(SnackbarContext);
