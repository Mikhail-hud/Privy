import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import { Tag, UserLink } from "@app/core/services";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import { FC, PropsWithChildren, ReactNode } from "react";
import { InterestList } from "@app/core/components/Ui/InterestList";
import { ContentCardContainer, LinksList, UserStats } from "@app/core/components";

interface ProfileCardContainerProps extends PropsWithChildren {
    isOwner?: boolean;
    fullName?: string | null | undefined;
    userName: string;
    titleAction?: ReactNode;
    biography?: string | null | undefined;
    avatar: ReactNode;
    links?: UserLink[] | null | undefined;
    interests?: Tag[] | null | undefined;
    followersCount: number;
    followingCount: number;
}

export const ProfileCardContainer: FC<ProfileCardContainerProps> = ({
    avatar,
    titleAction,
    children,
    fullName,
    userName,
    biography,
    links,
    interests,
    followingCount,
    followersCount,
}) => {
    return (
        <ContentCardContainer>
            <CardHeader
                sx={{
                    "& .MuiCardHeader-content": {
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                        // alignSelf: "self-start",
                        alignSelf: "stretch",
                        justifyContent: "space-between",
                    },
                }}
                avatar={avatar}
                title={
                    <Box
                        sx={{
                            gap: 1,
                            mb: 1,
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "start",
                            justifyContent: "space-between",
                        }}
                    >
                        <Box>
                            {fullName && (
                                <Typography variant="subtitle1" color="primary">
                                    {fullName}
                                </Typography>
                            )}
                            <Typography variant="body2" color="textSecondary">
                                @{userName}
                            </Typography>
                        </Box>
                        {titleAction}
                    </Box>
                }
                subheader={
                    <>
                        <LinksList links={links} />
                        <InterestList interest={interests} />
                    </>
                }
            />
            <CardActions disableSpacing>
                <UserStats followersCount={followersCount} followingCount={followingCount} userName={userName} />
            </CardActions>

            {biography && (
                <>
                    <Divider textAlign="left">
                        <Typography variant="subtitle1" color="primary">
                            Biography
                        </Typography>
                    </Divider>
                    <CardContent>
                        <Typography variant="body1" color="textPrimary" sx={{ whiteSpace: "pre-wrap" }}>
                            {biography}
                        </Typography>
                    </CardContent>
                </>
            )}
            {children && <CardContent sx={{ pt: 0 }}>{children}</CardContent>}
        </ContentCardContainer>
    );
};
