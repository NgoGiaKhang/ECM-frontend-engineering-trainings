import { useEffect, useRef, type ReactNode } from "react";
import { useAuthStore } from "./auth.store";
import {
    Navigate,
    Outlet,
} from "react-router-dom";
import { toast } from "sonner";
import { authorize } from './authorize';
import { type RoleType } from "@/constants/role.enum";


type Props = {
    minimum?: RoleType

    exact?: RoleType;


    fallback?: ReactNode;
};

export default function Authorize({
    minimum,
    exact,
    fallback,
}: Props) {

    const user = useAuthStore(
        (s) => s.user,
    );

    const allowed = user
        ? authorize(
            user.roles as RoleType[],
            minimum
                ? { minimum }
                : { exact: exact! },
        )
        : false;
    const hasShownRef = useRef(false);

    useEffect(() => {
        if (
            !allowed &&
            !fallback &&
            !hasShownRef.current
        ) {
            hasShownRef.current = true;
            toast.error(
                "Permission denied",
            );
        }
    }, [allowed, fallback]);

    if (!allowed) {
        return (
            fallback ?? (
                <Navigate
                    to="/"
                    replace
                />
            )
        );
    }

    return <Outlet />;
}