import api from "@/lib/axios";
import { ColumnFiltersState } from "@tanstack/react-table";

import {
    LocationFormValues
} from "./location.schema";


export interface GetLocationsParams {
    page?: number;
    per_page?: number;
    search?: string;
    filters?: ColumnFiltersState;
}

export function getLocations(
    params: GetLocationsParams = {}
) {
    return api.get("/api/locations", {
        params: {
            page: params.page,
            per_page: params.per_page,

            search:
                params.search || undefined,

            filters:
                params.filters || undefined,
        },
    });
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