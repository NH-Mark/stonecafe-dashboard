import { ColumnDef } from "@tanstack/react-table";
import { InventoryIngredient } from "@/types/inventory-ingredient";
import IngredientActions from "./IngredientActions";

function formatCost(value: number): string {
    if (!Number.isFinite(value)) {
        return "-";
    }

    return value
        .toFixed(6)
        .replace(/\.0+$/, "")
        .replace(/(\.\d*?)0+$/, "$1");
}

function resolveUnitName(item: InventoryIngredient): string {
    return (
        item.measurement_unit?.name ||
        item.measurement_unit_name ||
        item.buying_unit_name ||
        "-"
    );
}

function resolveDefaultSupplier(item: InventoryIngredient) {
    const suppliers = item.suppliers ?? [];

    const defaultSupplier = suppliers.find(
        (supplier) => supplier.is_default
    );

    return defaultSupplier ?? suppliers[0];
}

function resolveSupplierName(item: InventoryIngredient): string {
    const supplier = resolveDefaultSupplier(item);

    return (
        supplier?.supplier?.name ||
        supplier?.name ||
        "-"
    );
}

function resolveCostPerUnit(item: InventoryIngredient): string {
    if (item.cost_per_unit != null) {
        return `${formatCost(
            Number(item.cost_per_unit)
        )} QAR`;
    }

    const supplier = resolveDefaultSupplier(item);

    const price =
        supplier?.price ??
        item.last_buying_price;

    if (price == null) {
        return "-";
    }

    return `${formatCost(Number(price))} QAR`;
}

interface IngredientColumnsProps {
    onSuccess: () => Promise<void>;
}

export function ingredientColumns({
    onSuccess,
}: IngredientColumnsProps): ColumnDef<InventoryIngredient>[] {
    return [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => {
                const item = row.original;
                const code = item.sku?.trim();

                if (!code) {
                    return item.name;
                }

                return `${item.name} (${code})`;
            },
        },
        {
            id: "unit_name",
            header: "Unit Name",
            cell: ({ row }) =>
                resolveUnitName(
                    row.original
                ),
        },
        {
            id: "cost_per_unit",
            header: "Cost / Unit",
            cell: ({ row }) =>
                resolveCostPerUnit(
                    row.original
                ),
        },
        {
            id: "supplier",
            header: "Supplier",
            cell: ({ row }) =>
                resolveSupplierName(
                    row.original
                ),
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => (
                <IngredientActions
                    ingredient={row.original}
                    onSuccess={onSuccess}
                />
            ),
        },
    ];
}
