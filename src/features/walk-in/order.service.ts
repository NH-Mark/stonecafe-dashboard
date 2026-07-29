// order.service.ts

import api from "@/lib/axios";


export async function createOrder(payload: any) {

    const response =
        await api.post(
            "/api/orders",
            payload
        );


    return response.data;

}