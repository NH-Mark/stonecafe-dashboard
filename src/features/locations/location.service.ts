import api from "@/lib/axios";
import { ColumnFiltersState } from "@tanstack/react-table";

import {
    LocationFormValues
} from "./location.schema";
import { Location } from "@/types/location";


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

export async function getLocationSelectors(): Promise<Location[]> 
{ 
    const response = await api.get("/api/locations-selectors"); 
    const result = response.data.data ?? response.data; 
    return result; 
}


export async function createLocation(
    data: LocationFormValues
){

    return api.post(
        "/api/locations",
        data
    );

}

export async function selectLocation(locationId: number) {
    const response = await api.post("/api/active-location",{ location_id: locationId, });
    return response.data; 
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