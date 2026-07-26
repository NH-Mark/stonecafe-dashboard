import api from "@/lib/axios";
import {
    ChangePasswordInput,
    UpdateProfileInput,
} from "./account.schema";

export async function updateProfile(data: UpdateProfileInput) {
    const response = await api.put("/api/account/profile", data);

    return response.data;
}

export async function changePassword(data: ChangePasswordInput) {
    const response = await api.put("/api/account/password", data);

    return response.data;
}