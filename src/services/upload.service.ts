import api from "@/lib/axios";

export function uploadImage(
    data: FormData
) {

    return api.post(
        "/api/uploads/image",
        data,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

}