import { User } from "@/types/user";



export function hasPermission(
    permissions: string[] = [],
    permission?: string | null
) {

    // menu item has no restriction
    if (!permission) {
        return true;
    }

    return permissions.includes(permission);

}



export function hasRole(
    user: User | null,
    role: string
) {

    if (!user) {
        return false;
    }

    return user.roles.includes(role);

}