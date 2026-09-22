import Box from "@mui/material/Box";
import { FC, useMemo } from "react";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { PAGE_SIZE_LIMITS } from "@app/core/constants/ParamsConstants.ts";
import { TALK_SPACE_PAGE_PATH } from "@app/core/constants/pathConstants.ts";
import { ThreadDetailsContext } from "@app/features/threadDetails/loaders";
import { ThreadDetailsErrorFallback } from "@app/features/threadDetails/components";
import { NavigateFunction, useLoaderData, useNavigate } from "react-router-dom";
import {
    ContentCardContainer,
    ReplyFeed,
    ReplyForm,
    ThreadListItem,
    ThreadListItemSkeleton,
    useMediaBackdrops,
} from "@app/core/components";
import {
    Reply,
    ReplyListResponse,
    ThreadRepliesParams,
    useGetThreadQuery,
    useGetThreadRepliesInfiniteQuery,
} from "@app/core/services";

export const ThreadDetails: FC = () => {
    const { threadId } = useLoaderData() as ThreadDetailsContext;
    const navigate: NavigateFunction = useNavigate();
    const {
        data: thread,
        isLoading: isLoadingThread,
        isError: isThreadError,
        refetch: refetchThread,
    } = useGetThreadQuery(threadId);

    // TODO:Implement query param for replies search
    const replyParams: ThreadRepliesParams = useMemo<ThreadRepliesParams>(
        (): ThreadRepliesParams => ({ threadId, query: "", limit: PAGE_SIZE_LIMITS.DEFAULT }),
        [threadId]
    );

    const { data, fetchNextPage, hasNextPage, isLoading, isFetching, isFetchingNextPage } =
        useGetThreadRepliesInfiniteQuery(replyParams);

    const replies: Reply[] = useMemo<Reply[]>((): Reply[] => {
        const flat: Reply[] = data?.pages.flatMap((page: ReplyListResponse): Reply[] => page.data) ?? [];
        return Array.from(new Map(flat.map((reply: Reply): [string, Reply] => [reply.id, reply])).values());
    }, [data]);

    const { handleOpenThreadMediaBackdrop, handleOpenThreadMediaGalleryBackdrop, backdrops } = useMediaBackdrops();

    const handleNavigateBack = (): void => navigate(TALK_SPACE_PAGE_PATH);

    if (isThreadError || (!isLoadingThread && !thread)) {
        return <ThreadDetailsErrorFallback onRetry={refetchThread} onBack={handleNavigateBack} />;
    }

    return (
        <ContentCardContainer
            sx={theme => ({
                padding: theme.spacing(3),
                [theme.breakpoints.down("sm")]: {
                    padding: theme.spacing(1.5, 2),
                },
            })}
        >
            <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1 }}>
                <IconButton size="small" onClick={handleNavigateBack} aria-label="Back to Talk Space">
                    <ArrowBackIcon fontSize="small" />
                </IconButton>
                <Typography variant="h3" color="primary">
                    Thread
                </Typography>
            </Box>
            <List sx={{ width: "100%", bgcolor: "transparent", padding: 0 }}>
                {isLoadingThread ? (
                    <ThreadListItemSkeleton />
                ) : (
                    <ThreadListItem
                        isLast
                        disableNavigation
                        thread={thread!}
                        handleOpenThreadMediaBackdrop={handleOpenThreadMediaBackdrop}
                        handleOpenThreadMediaGalleryBackdrop={handleOpenThreadMediaGalleryBackdrop}
                    />
                )}
            </List>
            <Divider />
            <ReplyForm threadId={threadId} />
            <Divider />
            <ReplyFeed
                thread={thread!}
                replies={replies}
                isLoading={isLoading}
                isFetching={isFetching}
                hasNextPage={hasNextPage}
                fetchNextPage={fetchNextPage}
                isFetchingNextPage={isFetchingNextPage}
            />
            {backdrops}
        </ContentCardContainer>
    );
};
