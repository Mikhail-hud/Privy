import Box from "@mui/material/Box";
import { Reply, Thread } from "@app/core/services";
import { FC, ReactElement } from "react";
import Typography from "@mui/material/Typography";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import { InfiniteScrollList, ReplyListItem, ReplyListItemSkeleton, useMediaBackdrops } from "@app/core/components";

interface ReplyFeedProps {
    replies: Reply[];
    isLoading: boolean;
    isFetching: boolean;
    isFetchingNextPage: boolean;
    hasNextPage: boolean | undefined;
    fetchNextPage: () => void;
    loaderCount?: number;
    thread: Thread;
}

const EmptyReplyFallback: FC = () => (
    <Box
        sx={{
            py: 4,
            gap: 0.5,
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
        }}
    >
        <ForumOutlinedIcon sx={{ fontSize: { xxs: 35, xs: 40, sm: 50 } }} color="primary" />
        <Typography color="primary" variant="subtitle1">
            No Replies Yet
        </Typography>
        <Typography variant="body1" color="textPrimary">
            Be the first to reply
        </Typography>
    </Box>
);

export const ReplyFeed: FC<ReplyFeedProps> = ({
    replies,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    thread,
    loaderCount = 3,
}) => {
    const { handleOpenThreadMediaBackdrop, handleOpenThreadMediaGalleryBackdrop, backdrops } = useMediaBackdrops();

    if (!isLoading && !replies.length) {
        return <EmptyReplyFallback />;
    }

    return (
        <>
            <InfiniteScrollList<Reply>
                data={replies}
                isLoading={isLoading}
                isFetching={isFetching}
                hasNextPage={hasNextPage}
                loaderCount={loaderCount}
                fetchNextPage={fetchNextPage}
                loader={ReplyListItemSkeleton}
                isFetchingNextPage={isFetchingNextPage}
                renderItem={(reply: Reply, index: number): ReactElement => (
                    <ReplyListItem
                        reply={reply}
                        key={reply.id}
                        thread={thread}
                        isLast={index === replies.length - 1}
                        handleOpenThreadMediaBackdrop={handleOpenThreadMediaBackdrop}
                        handleOpenThreadMediaGalleryBackdrop={handleOpenThreadMediaGalleryBackdrop}
                    />
                )}
            />
            {backdrops}
        </>
    );
};
