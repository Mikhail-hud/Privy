import { User } from "@app/core/services";
import { useOutletContext } from "react-router-dom";

export interface UserContext {
    user: User;
}

export const useUser = () => useOutletContext<UserContext>();
