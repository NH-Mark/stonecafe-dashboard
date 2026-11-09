import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { InventoryIngredientCategory } from "@/types/inventory-ingredient-category";
import IngredientCategoryActions from "./IngredientCategoryActions";

interface IngredientCategoryColumnsProps {
    onSuccess: () => Promise<void>;
}

export function IngredientCategoryColumns({
    onSuccess,
}: IngredientCategoryColumnsProps): ColumnDef<InventoryIngredientCategory>[] {
    return [
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => row.original.description || "-",
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
                <IngredientCategoryActions
                    ingredientCategory={
                        row.original
                    }
                    onSuccess={onSuccess}
                />
            ),
        },
    ];
}
