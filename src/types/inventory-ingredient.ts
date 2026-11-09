export interface InventoryIngredientSupplier {
    id?: number;
    supplier_id?: number;
    name?: string;
    price?: number;
    buying_unit?: string | null;
    has_sub_unit?: boolean;
    sub_unit_name?: string | null;
    unit_to_sub_unit_quantity?: number | null;
    sub_unit_to_base_quantity?: number | null;
    net_quantity?: number | null;
    is_default?: boolean;
    supplier?: {
        id: number;
        name: string;
    };
}

export interface InventoryLocationIngredient {
    id?: number;
    location_id?: number;
    opening_balance?: number | null;
    reorder_level?: number | null;
    track_inventory?: boolean;
    location?: {
        id: number;
        name: string;
    };
}

export interface InventoryIngredient {
    id: number;
    ingredient_type?: "ingredient" | "sub_recipe";
    name: string;
    description?: string | null;
    category_id?: number | null;
    measurement_unit_id?: number | null;
    sku?: string | null;
    buying_unit_name?: string | null;
    has_sub_unit?: boolean;
    sub_unit_name?: string | null;
    unit_to_sub_unit_quantity?: number | null;
    sub_unit_to_base_quantity?: number | null;
    buying_unit_quantity?: number | null;
    net_quantity?: number | null;
    cost_per_unit?: number | null;
    measurement_unit_name?: string | null;
    last_buying_price?: number | null;
    is_active?: boolean;
    measurement_unit?: {
        id: number;
        name: string;
    };
    suppliers?: InventoryIngredientSupplier[];
    inventory_ingredient_suppliers?: InventoryIngredientSupplier[];
    locations?: InventoryLocationIngredient[];
    location_ingredients?: InventoryLocationIngredient[];
    inventory_location_ingredients?: InventoryLocationIngredient[];
}
