"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";
import PageLoader from "@/components/common/PageLoader";

interface Props {
    children: React.ReactNode;
}

export default function GuestRoute({
    children,
}: Props) {

    const {
        user,
        loading
    } = useAuth();

    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.replace("/dashboard");
        }
    }, [loading, user, router]);

    if (loading) {
         return <PageLoader />;
    }

    if (user) {
        return null;
    }

    return <>{children}</>;

}