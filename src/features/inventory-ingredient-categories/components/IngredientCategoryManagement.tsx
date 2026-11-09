"use client";

import { useRef } from "react";
import CreateIngredientCategoryDialog from "./CreateIngredientCategoryDialog";
import IngredientCategoryTable, {
    IngredientCategoryTableRef,
} from "./IngredientCategoryTable";

export default function IngredientCategoryManagement() {
    const tableRef =
        useRef<IngredientCategoryTableRef>(null);

    async function handleSuccess() {
        await tableRef.current?.refresh();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold">
                        Ingredient Categories
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Manage inventory ingredient categories
                    </p>
                </div>

                <CreateIngredientCategoryDialog
                    onSuccess={
                        handleSuccess
                    }
                />
            </div>

            <IngredientCategoryTable
                ref={tableRef}
            />
        </div>
    );
}
