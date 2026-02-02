import { createContext, useContext, useEffect, useRef, useMemo, ReactNode, FC } from "react";

type ObserverCallback = (isIntersecting: boolean) => void;

interface VirtualizationContextType {
    unregister: (node: HTMLElement) => void;
    register: (node: HTMLElement, callback: ObserverCallback) => void;
}

const VirtualizationContext = createContext<VirtualizationContextType | null>(null);

export const useVirtualization = () => {
    const context = useContext(VirtualizationContext);
    if (!context) {
        throw new Error("useVirtualization must be used within a VirtualizationProvider");
    }
    return context;
};

export const VirtualizationProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const callbacks = useRef(new Map<HTMLElement, ObserverCallback>());
    const observer = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        observer.current = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    const callback = callbacks.current.get(entry.target as HTMLElement);
                    if (callback) {
                        callback(entry.isIntersecting);
                    }
                });
            },
            { rootMargin: "800px 0px 800px 0px" }
        );

        return () => {
            observer.current?.disconnect();
        };
    }, []);

    const contextValue = useMemo(
        () => ({
            register: (node: HTMLElement, callback: ObserverCallback) => {
                if (observer.current) {
                    callbacks.current.set(node, callback);
                    observer.current.observe(node);
                }
            },
            unregister: (node: HTMLElement) => {
                if (observer.current) {
                    observer.current.unobserve(node);
                    callbacks.current.delete(node);
                }
            },
        }),
        []
    );

    return <VirtualizationContext.Provider value={contextValue}>{children}</VirtualizationContext.Provider>;
};
