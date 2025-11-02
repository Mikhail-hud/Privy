import { FC, ChangeEvent } from "react";
import TextField from "@mui/material/TextField";
import { useIsMobile } from "@app/core/hooks";

interface UserSearchFieldProps {
    value: string;
    placeholder?: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const UserSearchField: FC<UserSearchFieldProps> = ({
    value,
    onChange,
    placeholder = "Start typing to search...",
}) => {
    const isMobile: boolean = useIsMobile();
    return (
        <TextField
            fullWidth
            value={value}
            variant="outlined"
            onChange={onChange}
            placeholder={placeholder}
            size={isMobile ? "small" : "medium"}
        />
    );
};
