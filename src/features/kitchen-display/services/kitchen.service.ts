import api from "@/lib/axios";
import { KitchenOrder } from "../kitchen.types";





export async function getKitchenOrders(): Promise<KitchenOrder[]> {


    const response =
        await api.get(
            `/api/kitchen/orders`
        );


    return response.data.data as KitchenOrder[];

}

export async function updateKitchenStatus(
    orderId:number,
    status:string
){

    const response =
        await api.patch(
            `/api/kitchen/orders/${orderId}/status`,
            {
                kitchen_status:status
            }
        );


    return response.data;

}