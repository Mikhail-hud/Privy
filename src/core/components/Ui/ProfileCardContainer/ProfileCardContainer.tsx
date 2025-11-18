import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { useIsMobile } from "@app/core/hooks";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import { Tag, UserLink } from "@app/core/services";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import { FC, PropsWithChildren, ReactNode } from "react";
import { InterestList } from "@app/core/components/Ui/InterestList";
import { ContentCardContainer, LinksList } from "@app/core/components";

export const HAS_LINKS_OR_INTERESTS = (links?: UserLink[] | null, interests?: Tag[] | null): boolean =>
    (links?.length ?? 0) > 0 || (interests?.length ?? 0) > 0;

interface ProfileCardContainerProps extends PropsWithChildren {
    fullName?: string | null | undefined;
    userName: string;
    titleAction?: ReactNode;
    cardAction?: ReactNode;
    biography?: string | null | undefined;
    avatar: ReactNode;
    links?: UserLink[] | null | undefined;
    interests?: Tag[] | null | undefined;
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
    cardAction,
}) => {
    const isMobile: boolean = useIsMobile();
    return (
        <ContentCardContainer>
            {isMobile ? (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 1, gap: 1 }}>
                    <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>{titleAction}</Box>
                    {avatar}
                    <Box sx={{ textAlign: "center" }}>
                        {fullName && (
                            <Typography variant="subtitle1" color="primary">
                                {fullName}
                            </Typography>
                        )}
                        <Typography variant="body2" color="textPrimary">
                            @{userName}
                        </Typography>
                        {HAS_LINKS_OR_INTERESTS(links, interests) && (
                            <Box sx={{ mt: 1, display: "flex", gap: 1, flexDirection: "column" }}>
                                <LinksList links={links} />
                                <InterestList interest={interests} />
                            </Box>
                        )}
                    </Box>
                </Box>
            ) : (
                <CardHeader
                    sx={{
                        "& .MuiCardHeader-content": {
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.5,
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
                                <Typography variant="body2" color="textPrimary">
                                    @{userName}
                                </Typography>
                            </Box>
                            {titleAction}
                        </Box>
                    }
                    subheader={
                        HAS_LINKS_OR_INTERESTS(links, interests) && (
                            <>
                                <LinksList links={links} />
                                <InterestList interest={interests} />
                            </>
                        )
                    }
                />
            )}
            {cardAction && <CardActions disableSpacing>{cardAction}</CardActions>}
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
