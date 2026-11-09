"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import IngredientTable from "./IngredientTable";

export default function IngredientManagement() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold">
                        Ingredients & Sub Recipes
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        View ingredient list with unit, cost and supplier details.
                    </p>
                </div>

                <Button nativeButton={false} render={<Link href="/ingredients/create">Add Ingredient</Link>}>
                    Add Ingredient
                </Button>
            </div>

            <IngredientTable />
        </div>
    );
}
