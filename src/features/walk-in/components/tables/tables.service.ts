import api from "@/lib/axios";
import Cookies from "js-cookie";

export interface RestaurantTableSession {
    id: number;
    orderCount: number;
    total: number;
}

export type TableStatus =
    | "available"
    | "occupied"
    | "billing";

export interface RestaurantTable {
    id: number;
    name: string;
    status: TableStatus;
    session: RestaurantTableSession | null;
}

interface GetTablesResponse {
    data: RestaurantTable[];
}

export async function getTables(locationId?: number): Promise<RestaurantTable[]> {
    const resolvedLocationId =
        locationId ?? Number(Cookies.get("active_location_id"));

    const response =
        await api.get<GetTablesResponse>(
            "/api/pos/tables",
            {
                params: resolvedLocationId
                    ? { location_id: resolvedLocationId }
                    : undefined,
            }
        );

    return response.data.data;
}

