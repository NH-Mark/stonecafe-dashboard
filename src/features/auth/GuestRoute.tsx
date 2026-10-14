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
            const locations = user.locations ?? [];

            router.replace(
                locations.length === 1
                    ? "/dashboard"
                    : "/select-location"
            );
        }
    }, [loading, user, router]);

    if (loading || user) {
        return <PageLoader />;
    }

    if (loading) {
         return <PageLoader />;
    }

    if (user) {
        return null;
    }

    return <>{children}</>;

}