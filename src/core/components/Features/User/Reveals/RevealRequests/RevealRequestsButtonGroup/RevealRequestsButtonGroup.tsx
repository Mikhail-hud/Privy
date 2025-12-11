import { FC, MouseEvent } from "react";
import Tooltip from "@mui/material/Tooltip";
import { enqueueSnackbar } from "notistack";
import { useIsMobile } from "@app/core/hooks";
import IconButton from "@mui/material/IconButton";
import ButtonGroup from "@mui/material/ButtonGroup";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { ApiError, RevealStatus, useRespondToRevealRequestMutation } from "@app/core/services";

interface RevealButtonGroupProps {
    requestId: string;
    status: RevealStatus | undefined;
    size?: "small" | "medium" | "large";
}

export const RevealRequestsButtonGroup: FC<RevealButtonGroupProps> = memo(({ size = "medium", status, requestId }) => {
    const isMobile: boolean = useIsMobile();
    const { mutateAsync: respondToRequest, isPending } = useRespondToRevealRequestMutation();

    const handleSendRevealRequest = async (
        requestId: string,
        status: RevealStatus.ACCEPTED | RevealStatus.REJECTED
    ): Promise<void> => {
        try {
            await respondToRequest({ requestId, status });
        } catch (error) {
            const errorMessage: string = (error as ApiError)?.message;
            enqueueSnackbar(errorMessage, { variant: "error" });
        }
    };

    const handleApprove = async (_event: MouseEvent<HTMLButtonElement>): Promise<void> =>
        await handleSendRevealRequest(requestId, RevealStatus.ACCEPTED);

    const handleReject = async (_event: MouseEvent<HTMLButtonElement>): Promise<void> =>
        await handleSendRevealRequest(requestId, RevealStatus.REJECTED);

    return (
        <ButtonGroup size={isMobile ? "small" : size}>
            <Tooltip title="Reject" placement="top">
                <IconButton
                    color="primary"
                    disabled={isPending}
                    onClick={handleReject}
                    size={isMobile ? "small" : "medium"}
                >
                    {status === RevealStatus.REJECTED ? <CancelIcon /> : <CancelOutlinedIcon />}
                </IconButton>
            </Tooltip>
            <Tooltip title="Approve" placement="top">
                <IconButton
                    color="primary"
                    disabled={isPending}
                    onClick={handleApprove}
                    size={isMobile ? "small" : "medium"}
                >
                    {status === RevealStatus.ACCEPTED ? <CheckCircleIcon /> : <CheckCircleOutlineIcon />}
                </IconButton>
            </Tooltip>
        </ButtonGroup>
    );
});
