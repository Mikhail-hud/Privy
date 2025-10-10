import { useState, FC } from "react";
import Chip from "@mui/material/Chip";
import { UserLink } from "@app/core/services";
import { FormFieldShell } from "@app/core/components";
import { ManageLinksDialog } from "@app/core/components/Ui/FormControllers/UserLinks/ManageLinksDialog";

interface UserLinksProps {
    links: UserLink[];
}

export const UserLinks: FC<UserLinksProps> = ({ links }) => {
    const [isManageOpen, setIsManageOpen] = useState(false);

    const handleOpen = useCallback((): void => setIsManageOpen(true), []);
    const handleClose = useCallback((): void => setIsManageOpen(false), []);

    return (
        <FormFieldShell<UserLink>
            data={links}
            label="Links"
            onClick={handleOpen}
            placeholder="Manage your links"
            render={link => <Chip key={link.id} label={link.title} size="small" />}
        >
            <ManageLinksDialog links={links} open={isManageOpen} onClose={handleClose} />
        </FormFieldShell>
    );
};
