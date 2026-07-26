"use client";





import {
    hasPermission
}
    from "@/features/auth/permission";
import { useAuth } from "@/features/auth/useAuth";



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
            user?.permissions,
            permission
        )
    ){

        return null;

    }



    return children;


}