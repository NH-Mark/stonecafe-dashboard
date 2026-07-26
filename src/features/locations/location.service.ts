import api from "@/lib/axios";

import {
    LocationFormValues
} from "./location.schema";



export async function getLocations(){

    return api.get(
        "/api/locations"
    );

}



export async function createLocation(
    data: LocationFormValues
){

    return api.post(
        "/api/locations",
        data
    );

}



export async function updateLocation(
    id:number,
    data:LocationFormValues
){

    return api.put(
        `/api/locations/${id}`,
        data
    );

}



export async function deleteLocation(
    id:number
){

    return api.delete(
        `/api/locations/${id}`
    );

}