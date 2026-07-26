import api from "@/lib/axios";
import { FoodSymbolFormValues } from "./food-symbol.schema";




export async function getFoodSymbols(){

    return api.get(
        "/api/food-symbols"
    );

}



export async function createFoodSymbol(
    data: FoodSymbolFormValues
){

    return api.post(
        "/api/food-symbols",
        data
    );

}



export async function updateFoodSymbol(
    id:number,
    data:FoodSymbolFormValues
){

    return api.put(
        `/api/food-symbols/${id}`,
        data
    );

}



export async function deleteFoodSymbol(
    id:number
){

    return api.delete(
        `/api/food-symbols/${id}`
    );

}