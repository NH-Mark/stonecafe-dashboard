"use client";


import {
    useAuth
}
    from "@/features/auth/AuthProvider";


import {
    hasPermission
}
    from "@/features/auth/permission";



export default function PermissionGuard({

    permission,

    children

}: {

    permission: string;

    children: React.ReactNode;

}) {


    const {
        user
    }
        =
        useAuth();



    if (
        !hasPermission(
            user,
            permission
        )
    ) {

        return null;

    }



    return children;


}