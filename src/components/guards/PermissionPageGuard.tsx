"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { hasPermission } from "@/features/auth/permission";
import { useAuth } from "@/features/auth/useAuth";

export default function PermissionPageGuard({
    permission,
    children,
    redirectTo = "/sales/orders",
}: {
    permission: string;
    children: React.ReactNode;
    redirectTo?: string;
}) {
    const router = useRouter();
    const { user } = useAuth();

    const allowed = hasPermission(
        user?.permissions,
        permission
    );

    useEffect(() => {
        if (!user) {
            return;
        }

        if (!allowed) {
            router.replace(redirectTo);
        }
    }, [user, allowed, redirectTo, router]);

    if (!user || !allowed) {
        return null;
    }

    return children;
}