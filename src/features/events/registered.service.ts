
import api from "@/lib/axios";
import { SelectionStatus } from "@/types/registered";

import { ColumnFiltersState } from "@tanstack/react-table";

interface GetRegisteredListParams {
    page?: number;
    per_page?: number;
    search?: string;
    filters?: ColumnFiltersState;
}

export async function getRegisteredList({
    page = 1,
    per_page = 10,
    search,
    filters,
}: GetRegisteredListParams = {}) {
    return api.get("/api/event-registrations", {
        params: {
            page,
            per_page,
            search,
            filters,
        },
    });
}

export type RegistrationEmailGroup =
    | "selected"
    | "not_selected"
    | "waitlisted";

export async function sendRegistrationEmails(
    event_id: number,
    group: RegistrationEmailGroup
) {
    return api.post("/api/event-registrations/send-emails", {
        event_id,
        group,
    });
}

export async function updateRegistrationSelectionStatus(
    id: number,
    selection_status: SelectionStatus
) {
    return api.patch(
        `/api/event-registrations/${id}/selection-status`,
        { selection_status }
    );
}

export async function deleteRegistration(id: number) {
    return api.delete(`/api/event-registrations/${id}`);
}

export async function exportRegisteredList(params: {
    search?: string;
    filters?: unknown[];
}) {
    return api.get("/api/event-registrations/export", {
        params: {
            search: params.search || undefined,
            filters: params.filters?.length
                ? JSON.stringify(params.filters)
                : undefined,
        },
        responseType: "blob",
    });
}
