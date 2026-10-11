
export type SelectionStatus =
    | "pending"
    | "selected"
    | "not_selected"
    | "waitlisted";

export interface RegisteredEvent {
    id: number;
    name: string;
    slug?: string;
    date?: string;
    location:string;
}

export interface RegisteredTimeSlot {
    id: number;
    name: string;
    start_time: string;
    end_time: string;
    capacity: number;
    is_active: boolean;
}

export interface Registered {
    id: number;

    event_id: number;
    event_time_slot_id: number | null;

    event?: RegisteredEvent;
    timeSlot?: RegisteredTimeSlot;

    full_name: string;
    email: string;
    phone: string;
    gender: string;
    company: string | null;

    status:
        | "pending"
        | "confirmed"
        | "cancelled";

    payment_status:
        | "not_required"
        | "pending"
        | "paid"
        | "failed"
        | "refunded";

    payment_amount: string | number | null;
    payment_currency: string | null;

    payment_reference: string | null;
    payment_transaction_id: string | null;

    paid_at: string | null;

    seat_count: number;

    metadata: Record<string, unknown> | null;

    created_at: string;
    updated_at: string;

    selection_status: SelectionStatus | null;
}
