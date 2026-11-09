import { ColumnDef } from "@tanstack/react-table";
import { InventoryMeasurementUnit } from "@/types/inventory-measurement-unit";
import MeasurementUnitActions from "./MeasurementUnitActions";

interface MeasurementUnitColumnsProps {
    onSuccess: () => Promise<void>;
}

export function MeasurementUnitColumns({
    onSuccess,
}: MeasurementUnitColumnsProps): ColumnDef<InventoryMeasurementUnit>[] {
    return [
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <MeasurementUnitActions
                    measurementUnit={row.original}
                    onSuccess={onSuccess}
                />
            ),
        },
    ];
}
