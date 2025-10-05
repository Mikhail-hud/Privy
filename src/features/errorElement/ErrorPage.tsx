import { FC } from "react";

export const ErrorPage: FC = () => {
    // TODO: Add logging functionality for errors
    return (
        <div style={{ textAlign: "center", marginTop: "10vh" }}>
            <h1>Oops!</h1>
            <p>Something went wrong. Please try again later.</p>
        </div>
    );
};
