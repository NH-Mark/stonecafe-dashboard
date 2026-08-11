
import api from "@/lib/axios";
import { RestaurantTable } from "./components/tables/tables.service";

export interface DiningSessionOrder {
    id: number;
    order_no: string;
    status:
        | "draft"
        | "pending"
        | "confirmed"
        | "completed"
        | "cancelled";

    total: number;

    createdAt: string;
}

export interface DiningSession {
    id: number;

    table: RestaurantTable;

    tableId: number;

    status:
        | "open"
        | "billing"
        | "closed"
        | "cancelled";

    subtotal: number;

    discountAmount: number;

    total: number;

    openedAt: string | null;

    closedAt: string | null;

    orders: DiningSessionOrder[];
}

interface CreateDiningSessionResponse {
    data: DiningSession;
}

interface GetDiningSessionResponse {
    data: DiningSession;
}

export async function createDiningSession(
    tableId: number
): Promise<DiningSession> {
    const response =
        await api.post<CreateDiningSessionResponse>(
            "/api/pos/dining-sessions",
            {
                table_id: tableId,
            }
        );

    return response.data.data;
}

export async function getDiningSession(
    id: number
): Promise<DiningSession> {
    const response =
        await api.get<GetDiningSessionResponse>(
            `/api/pos/dining-sessions/${id}`
        );

    return response.data.data;
}


/*
|--------------------------------------------------------------------------
| Transfer dining session to another table
|--------------------------------------------------------------------------
*/

interface TransferDiningSessionResponse {
    data: DiningSession;
    message?: string;
}

export async function transferDiningSessionTable(
    sessionId: number,
    tableId: number
): Promise<DiningSession> {
    const response =
        await api.patch<TransferDiningSessionResponse>(
            `/api/pos/dining-sessions/${sessionId}/transfer-table`,
            {
                table_id: tableId,
            }
        );

    return response.data.data;
}
