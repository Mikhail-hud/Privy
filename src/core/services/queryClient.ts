import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 1, // 1 minute
            gcTime: 1000 * 60 * 5, // 5 minutes (formerly cacheTime)
            refetchOnWindowFocus: false,
        },
        mutations: {
            // Disable automatic retries for mutations
            retry: false,
        },
    },
});
