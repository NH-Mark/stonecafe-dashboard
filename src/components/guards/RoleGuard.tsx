"use client";





import {
    hasRole
}
    from "@/features/auth/permission";
import { useAuth } from "@/features/auth/useAuth";



export default function RoleGuard({

    role,

    children

}: {
    role: string;
    children: React.ReactNode;
}) {


    const {
        user
    }
        =
        useAuth();



    if (
        !hasRole(user, role)
    ) {

        return null;

    }



    return children;


}