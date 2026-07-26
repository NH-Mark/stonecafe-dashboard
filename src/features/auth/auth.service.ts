import api from "@/services/api";


import {
    LoginRequest,
    LoginResponse
}
    from "./auth.types";
import { User } from "@/types/user";




export async function login(
    data: LoginRequest
): Promise<LoginResponse> {

    const response = await api.post(
        "/api/login",
        data
    );

    return response.data;
}

export async function logout() {
    return api.post(
        "/api/logout"
    );
}

export async function getUser()
    : Promise<User> {

    const response =
        await api.get(
            "/api/user"
        );
    return response.data.data;


}

export async function forgotPassword(email: string) {

    const response = await api.post(
        "/api/forgot-password",
        {
            email
        }
    );

    return response.data;
}