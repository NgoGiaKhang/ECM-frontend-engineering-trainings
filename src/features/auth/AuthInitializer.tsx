import { useFetch } from '@/api/useFetch';
import React, { useEffect, type PropsWithChildren } from 'react'
import { authService } from './auth.service';
import { FullScreenLoader } from '@/components/FullScreenLoader/FullScreenLoader';
import { useAuthStore } from './auth.store';
import { toast } from 'sonner';
import { ErrorCode } from '@/constants/error';

export function AuthInitializer({ children }: PropsWithChildren) {
    const login = useAuthStore((s) => s.login);
    const logout = useAuthStore((s) => s.logout);

    const { loading } = useFetch(["users"], (s) => authService.getMe(s), {
        onSuccess: (data) => {
            login(data);

        },
        onError: (error) => {
            logout();
            if (error.code === ErrorCode.TokenExpired) {
                toast.error("Session expired. Please login again.")
                return;
            }

        }
    });
    if (loading) {
        return <FullScreenLoader text="Authenticating..." />
    }

    return (
        <div>{children}</div>
    )
}
