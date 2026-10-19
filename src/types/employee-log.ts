export interface EmployeeLogRole {
    id: number;
    name: string;
}

export interface EmployeeLogUser {
    id: number;
    name: string;
    email: string;
    status?: boolean;
    roles?: EmployeeLogRole[];
}

export interface EmployeeLog {
    id: number;
    user_id: number;
    personal_access_token_id?: number | null;
    signed_in_at: string | null;
    signed_out_at?: string | null;
    ip_address?: string | null;
    user_agent?: string | null;
    user?: EmployeeLogUser | null;
    role?: string | null;
    employee_name?: string | null;
    status?: "Signed In" | "Logged Out";
    duration_hours?: string | null;
}
