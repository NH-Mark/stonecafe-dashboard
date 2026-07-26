"use client";


import {
    useAuth
}
    from "@/features/auth/AuthProvider";


import {
    hasRole
}
    from "@/features/auth/permission";



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