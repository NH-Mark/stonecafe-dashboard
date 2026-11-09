import { z } from "zod";

const optionalNullableText = z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((value) => {
        if (value == null) {
            return null;
        }

        return value.length ? value : null;
    });

const optionalNullableNumber = z.preprocess(
    (value) => {
        if (value === "" || value == null) {
            return null;
        }

        if (typeof value === "string") {
            const parsed = Number(value);
            return Number.isNaN(parsed) ? value : parsed;
        }

        return value;
    },
    z
        .number({ error: "Please enter a valid number" })
        .min(0, "Value must be at least 0")
        .nullable()
);

const categoryIdSchema = z.preprocess(
    (value) => {
        if (value === "" || value == null) {
            return null;
        }

        if (typeof value === "string") {
            const parsed = Number(value);
            return Number.isNaN(parsed) ? value : parsed;
        }

        return value;
    },
    z
        .number({ error: "Please select a category" })
        .int()
        .positive()
        .nullable()
);

export const ingredientSupplierSchema = z.object({
    supplier_id: z
        .coerce
        .number({ error: "Please select a supplier" })
        .int()
        .positive("Please select a supplier"),

    price: z
        .coerce
        .number({ error: "Please enter a valid price" })
        .min(0, "Price must be at least 0"),

    buying_unit: optionalNullableText,

    has_sub_unit: z.boolean().default(false),

    sub_unit_name: optionalNullableText,

    unit_to_sub_unit_quantity: optionalNullableNumber,

    sub_unit_to_base_quantity: optionalNullableNumber,

    net_quantity: optionalNullableNumber,

    is_default: z.boolean().default(false),
});

export const ingredientLocationSchema = z.object({
    location_id: z
        .coerce
        .number({ error: "Location is required" })
        .int()
        .positive("Location is required"),

    opening_balance: z
        .coerce
        .number({ error: "Please enter a valid opening balance" }),

    reorder_level: z
        .coerce
        .number({ error: "Please enter a valid reorder level" })
        .min(0, "Reorder level must be at least 0"),

    track_inventory: z.boolean().default(true),
});

export const ingredientSchema = z.object({
    ingredient_type: z.enum(["ingredient", "sub_recipe"]),

    name: z
        .string()
        .trim()
        .min(1, "Ingredient name is required"),

    sku: optionalNullableText,

    description: optionalNullableText,

    category_id: categoryIdSchema,

    measurement_unit_id: z
        .coerce
        .number({ error: "Please select a measurement unit" })
        .int()
        .positive("Please select a measurement unit"),

    buying_unit_name: optionalNullableText,

    has_sub_unit: z.boolean().default(false),

    sub_unit_name: optionalNullableText,

    unit_to_sub_unit_quantity: optionalNullableNumber,

    sub_unit_to_base_quantity: optionalNullableNumber,

    buying_unit_quantity: z
        .coerce
        .number({ error: "Please enter a valid quantity" })
        .min(0.0001, "Buying unit quantity must be greater than 0"),

    net_quantity: optionalNullableNumber,

    last_buying_price: optionalNullableNumber,

    cost_per_unit: optionalNullableNumber,

    is_active: z.boolean().default(true),

    suppliers: z.array(ingredientSupplierSchema).default([]),

    locations: z.array(ingredientLocationSchema).default([]),
});

export type IngredientFormInput =
    z.input<typeof ingredientSchema>;

export type IngredientFormValues =
    z.output<typeof ingredientSchema>;
