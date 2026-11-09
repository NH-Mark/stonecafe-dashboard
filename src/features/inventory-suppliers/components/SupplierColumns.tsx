import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { InventorySupplier } from "@/types/inventory-supplier";
import SupplierActions from "./SupplierActions";

interface SupplierColumnsProps {
    onSuccess: () => Promise<void>;
}

export function SupplierColumns({
    onSuccess,
}: SupplierColumnsProps): ColumnDef<InventorySupplier>[] {
    return [
        {
            accessorKey: "supplier_code",
            header: "Code",
            cell: ({ row }) => row.original.supplier_code || "-",
        },
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "phone",
            header: "Phone",
            cell: ({ row }) => row.original.phone || "-",
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => row.original.email || "-",
        },
        {
            accessorKey: "is_active",
            header: "Status",
            cell: ({ row }) => (
                <Badge
                    variant={
                        row.original.is_active
                            ? "default"
                            : "destructive"
                    }
                >
                    {row.original.is_active
                        ? "Active"
                        : "Inactive"}
                </Badge>
            ),
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <SupplierActions
                    supplier={row.original}
                    onSuccess={onSuccess}
                />
            ),
        },
    ];
}
