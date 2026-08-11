import api from "@/lib/axios";


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

export async function getTables(): Promise<RestaurantTable[]> {

    const response =
        await api.get<GetTablesResponse>(
            "/api/pos/tables"
        );

    return response.data.data;
}

