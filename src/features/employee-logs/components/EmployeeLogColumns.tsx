import { ColumnDef } from "@tanstack/react-table";

import type { EmployeeLog } from "@/types/employee-log";
import RoleGuard from "@/components/guards/RoleGuard";
import EmployeeLogActions from "./EmployeeLogActions";

interface EmployeeLogColumnsProps {
    onSuccess: () => Promise<void>;
}

function formatDate(value?: string | null) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}

function getEmployeeName(log: EmployeeLog) {
    return log.user?.name ?? log.employee_name ?? `Employee #${log.user_id ?? log.id}`;
}

function getDuration(log: EmployeeLog) {
    const signedInAt = log.signed_in_at;
    const signedOutAt = log.signed_out_at;

    if (!signedInAt) return "—";
    if (!signedOutAt) {
        return log.status === "Signed In" ? "Active" : "—";
    }

    const start = new Date(signedInAt);
    const end = new Date(signedOutAt);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return log.duration_hours ?? "—";
    }

    const differenceMs = end.getTime() - start.getTime();
    const hours = differenceMs / (1000 * 60 * 60);

    if (hours < 1) {
        const minutes = Math.round(hours * 60);
        return `${minutes} min`;
    }

    return `${hours.toFixed(1)} hrs`;
}

export function employeeLogColumns({ onSuccess }: EmployeeLogColumnsProps): ColumnDef<EmployeeLog>[] {
    return [
        {
            accessorKey: "employee_name",
            header: "Employee",
            cell: ({ row }) => getEmployeeName(row.original),
        },
        {
            accessorKey: "role",
            header: "Role",
            cell: ({ row }) => row.original.role ?? row.original.user?.roles?.[0]?.name ?? "Staff",
        },
        {
            accessorKey: "signed_in_at",
            header: "Sign In",
            cell: ({ row }) => formatDate(row.original.signed_in_at),
        },
        {
            accessorKey: "signed_out_at",
            header: "Sign Out",
            cell: ({ row }) => formatDate(row.original.signed_out_at),
        },
        {
            accessorKey: "ip_address",
            header: "IP Address",
            cell: ({ row }) => row.original.ip_address ?? "—",
        },
        // {
        //     accessorKey: "user_agent",
        //     header: "Device",
        //     cell: ({ row }) => row.original.user_agent ?? "—",
        // },
        {
            id: "duration",
            header: "Duration",
            cell: ({ row }) => getDuration(row.original),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <span
                    className={
                        row.original.status === "Signed In"
                            ? "inline-flex rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700"
                            : "inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700"
                    }
                >
                    {row.original.status ?? (row.original.signed_out_at ? "Logged Out" : "Signed In")}
                </span>
            ),
        },
        {
            id: "user-status",
            header: "User Status",
            cell: ({ row }) => {
                const isSuspended = row.original.user?.status === false;

                return (
                    <span
                        className={
                            isSuspended
                                ? "inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700"
                                : "inline-flex rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700"
                        }
                    >
                        {isSuspended ? "Suspended" : "Active"}
                    </span>
                );
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <RoleGuard role="Super Admin">
                    <EmployeeLogActions
                        log={row.original}
                        onSuccess={onSuccess}
                    />
                </RoleGuard>
            ),
        },
    ];
}
