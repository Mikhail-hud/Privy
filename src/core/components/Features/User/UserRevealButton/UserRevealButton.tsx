import { FC, MouseEvent } from "react";
import Button from "@mui/material/Button";
import { enqueueSnackbar } from "notistack";
import { useIsMobile } from "@app/core/hooks";
import {
    RevealStatus,
    useSendRevealRequestMutation,
    useDeleteRevealRequestByUserNameMutation,
    ApiError,
} from "@app/core/services";

type StatusKey = RevealStatus.PENDING | RevealStatus.REJECTED | RevealStatus.NONE;

interface UserRevealButtonProps {
    userName: string;
    status: RevealStatus | undefined;
    size?: "small" | "medium" | "large";
}

const statusConfig: Record<
    StatusKey,
    {
        text: string;
        variant: "text" | "outlined" | "contained";
        color: "primary" | "error" | "inherit" | "success";
    }
> = {
    [RevealStatus.PENDING]: {
        text: "Reveal request active — click to revoke",
        variant: "outlined",
        color: "primary",
    },
    [RevealStatus.REJECTED]: {
        text: "Reveal request rejected — click to resend",
        variant: "outlined",
        color: "error",
    },
    [RevealStatus.NONE]: {
        text: "Request profile reveal",
        variant: "contained",
        color: "primary",
    },
} as const;

const getStatusButtonProps = (status: StatusKey) => statusConfig[status ?? RevealStatus.NONE];

export const UserRevealButton: FC<UserRevealButtonProps> = memo(({ userName, size = "medium", status }) => {
    const isMobile: boolean = useIsMobile();
    const { mutateAsync: sendRevealRequest, isPending: isRevealRequestSending } = useSendRevealRequestMutation();
    const { mutateAsync: deleteRevealRequest, isPending: isRevealRequestDeleting } =
        useDeleteRevealRequestByUserNameMutation();

    const handleSendRevealRequest = async (userName: string): Promise<void> => {
        try {
            await sendRevealRequest(userName);
        } catch (error) {
            const errorMessage: string = (error as ApiError)?.message;
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
    };

    const handleDeletRevealRequest = async (userName: string): Promise<void> => {
        try {
            await deleteRevealRequest(userName);
        } catch (error) {
            const errorMessage: string = (error as ApiError)?.message;
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
    };

    const handleClick = async (event: MouseEvent<HTMLButtonElement>): Promise<void> => {
        event.stopPropagation();
        event.preventDefault();
        if (status === RevealStatus.ACCEPTED) {
            return;
        }
        if (status === RevealStatus.PENDING) {
            await handleDeletRevealRequest(userName);
            return;
        }
        if (status === RevealStatus.REJECTED || RevealStatus.NONE) {
            await handleSendRevealRequest(userName);
            return;
        }
    };
    const { text, variant, color } = getStatusButtonProps(status as StatusKey);

    return (
        <Button
            color={color}
            onClick={handleClick}
            variant={variant}
            size={isMobile ? "small" : size}
            loading={isRevealRequestSending || isRevealRequestDeleting}
        >
            {text}
        </Button>
    );
});
