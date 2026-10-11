
import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Registered } from "@/types/registered";
import RegisteredActions from "./RegisteredActions";

interface RegisteredColumnsProps {
    onSuccess: () => Promise<void>;
}

export function RegisteredColumns({
    onSuccess,
}: RegisteredColumnsProps): ColumnDef<Registered>[] {
    return [
        {
            id: "event_id",
            accessorKey: "event.name",
            header: "Event",

            cell: ({ row }) =>
                row.original.event?.name ?? "-",
        },

        // {
        //     accessorKey: "timeSlot.name",
        //     header: "Time Slot",

        //     cell: ({ row }) =>
        //         row.original.timeSlot?.name ?? "-",
        // },

        {
            accessorKey: "full_name",
            header: "Name",
        },

        {
            accessorKey: "email",
            header: "Email",
        },

        {
            accessorKey: "phone",
            header: "Phone",
        },

        // {
        //     accessorKey: "seat_count",
        //     header: "Seats",

        //     cell: ({ row }) =>
        //         row.original.seat_count ?? 1,
        // },

        {
            accessorKey: "status",
            header: "Status",

            cell: ({ row }) => {
                const status =
                    row.original.status;

                return (
                    <Badge
                        variant={
                            status === "confirmed"
                                ? "default"
                                : status === "cancelled"
                                ? "destructive"
                                : "secondary"
                        }
                    >
                        {status
                            ? status
                                .charAt(0)
                                .toUpperCase() +
                              status.slice(1)
                            : "-"}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "selection_status",
            header: "Selection Status",

            cell: ({ row }) => {
                const status =
                    row.original.selection_status;

                return (
                    <Badge
                        variant={
                            status === "selected"
                                ? "default"
                                : status === "not_selected"
                                ? "destructive"
                                : "secondary"
                        }
                    >
                        {status
                            ? status
                                .charAt(0)
                                .toUpperCase() +
                              status.slice(1)
                            : "-"}
                    </Badge>
                );
            },
        },

        {
            accessorKey: "payment_status",
            header: "Payment Status",

            cell: ({ row }) => {
                const status =
                    row.original.payment_status;

                let variant:
                    | "default"
                    | "secondary"
                    | "destructive"
                    | "outline" =
                    "secondary";

                if (status === "paid") {
                    variant = "default";
                }

                if (
                    status === "failed" ||
                    status === "refunded"
                ) {
                    variant = "destructive";
                }

                return (
                    <Badge variant={variant}>
                        {status
                            ? status
                                .replace("_", " ")
                                .replace(
                                    /^\w/,
                                    (char) =>
                                        char.toUpperCase()
                                )
                            : "-"}
                    </Badge>
                );
            },
        },

        {
            accessorKey: "payment_amount",
            header: "Amount",

            cell: ({ row }) => {
                const amount =
                    row.original.payment_amount;

                if (
                    amount === null ||
                    amount === undefined
                ) {
                    return "-";
                }

                return (
                    <>
                        {amount}{" "}
                        {row.original.payment_currency ?? ""}
                    </>
                );
            },
        },

        {
            accessorKey: "paid_at",
            header: "Paid At",

            cell: ({ row }) => {
                const paidAt =
                    row.original.paid_at;

                if (!paidAt) {
                    return "-";
                }

                return new Date(
                    paidAt
                ).toLocaleString();
            },
        },

        {
            id: "actions",

            cell: ({ row }) => (
                <RegisteredActions
                    registration={row.original}
                    onSuccess={onSuccess}
                />
            ),
        },
    ];
}

