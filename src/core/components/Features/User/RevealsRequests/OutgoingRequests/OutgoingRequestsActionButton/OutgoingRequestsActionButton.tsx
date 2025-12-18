import { FC } from "react";
import Tooltip from "@mui/material/Tooltip";
import { enqueueSnackbar } from "notistack";
import { useIsMobile } from "@app/core/hooks";
import IconButton from "@mui/material/IconButton";
import ButtonGroup from "@mui/material/ButtonGroup";
import CancelIcon from "@mui/icons-material/Cancel";
import { ApiError, RevealStatus, useDeleteRevealRequestByUserNameMutation } from "@app/core/services";

interface OutgoingRequestsActionButtonProps {
    status: RevealStatus | undefined;
    userName: string;
    size?: "small" | "medium" | "large";
}

export const OutgoingRequestsActionButton: FC<OutgoingRequestsActionButtonProps> = memo(
    ({ size = "medium", userName }) => {
        const isMobile: boolean = useIsMobile();
        const { mutateAsync: deleteRevealRequest, isPending } = useDeleteRevealRequestByUserNameMutation();

        const handleDeletRevealRequest = async (): Promise<void> => {
            try {
                await deleteRevealRequest(userName);
            } catch (error) {
                const errorMessage: string = (error as ApiError)?.message;
                enqueueSnackbar(errorMessage, { variant: "error" });
            }
        };

        return (
            <ButtonGroup size={isMobile ? "small" : size}>
                <Tooltip title="Revoke" placement="top">
                    <IconButton
                        color="error"
                        disabled={isPending}
                        onClick={handleDeletRevealRequest}
                        size={isMobile ? "small" : "medium"}
                    >
                        <CancelIcon />
                    </IconButton>
                </Tooltip>
            </ButtonGroup>
        );
    }
);
