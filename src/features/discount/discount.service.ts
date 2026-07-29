import api from "@/lib/axios";


export function getDiscounts(){

    return api.get(
        "/api/discounts"
    );

}