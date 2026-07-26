"use client";

import {
    createContext,
    useEffect,
    useState
} from "react";

import {
    getUser,
    logout
} from "./auth.service";
import { User } from "@/types/user";




interface AuthContextType {

    user: User | null;

    loading: boolean;

    refreshUser: () => Promise<void>;

    logoutUser: () => Promise<void>;

}


export const AuthContext =
createContext<AuthContextType | null>(null);



export function AuthProvider({
    children
}:{
    children: React.ReactNode;
}) {


    const [user, setUser] =
        useState<User | null>(null);


    const [loading, setLoading] =
        useState(true);



    async function refreshUser() {

        try {

            const user =
                await getUser();

            setUser(user);


        } catch {

            setUser(null);

        } finally {

            setLoading(false);

        }

    }



    useEffect(() => {

        refreshUser();

    }, []);




    async function logoutUser() {

        await logout();

        setUser(null);

    }



    return (

        <AuthContext.Provider
            value={{
                user,
                loading,
                refreshUser,
                logoutUser
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}