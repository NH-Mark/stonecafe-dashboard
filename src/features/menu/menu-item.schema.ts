import { z } from "zod";


export const menuItemSchema = z.object({

    menu_category_id: z
        .number()
        .nullable()
        .refine(
            value => value !== null,
            {
                message: "Category is required",
            }
        ),


    name: z
        .string()
        .min(1, "Item name is required"),


    barcode: z
        .string()
        .nullable()
        .optional(),

    name_ar: z
        .string()
        .nullable()
        .optional(),

    description_ar: z
        .string()
        .nullable()
        .optional(),
    sku: z
        .string()
        .nullable()
        .optional(),


    description: z
        .string()
        .nullable()
        .optional(),


    price: z.coerce
        .number()
        .min(0),


    cost_price: z.coerce
        .number()
        .min(0),

    menu_item_ingredients: z
        .array(
            z.object({
                ingredient_id: z
                    .coerce
                    .number()
                    .int()
                    .positive(),
                unit_name: z
                    .string()
                    .nullable()
                    .optional(),
                cost_per_unit: z.coerce
                    .number()
                    .min(0),
                quantity: z.coerce
                    .number()
                    .min(0),
                subtotal: z.coerce
                    .number()
                    .min(0),
                sort_order: z.coerce
                    .number()
                    .int()
                    .min(0)
                    .default(0),
            })
        )
        .default([]),


    image: z
        .string()
        .nullable()
        .optional(),


    modifier_groups: z.array(
        z.object({
            id: z.number(),
            name: z.string().optional(),
            modifiers_count: z.number().optional(),

            selection_type: z.enum(["single","multiple"]),
            required: z.boolean(),
            min_selection: z.number(),
            max_selection: z.number(),

            pivot: z.object({
                selection_type: z.enum(["single","multiple"]),
                required: z.boolean(),
                min_selection: z.number(),
                max_selection: z.number(),
            }).optional(),
        })
    ),


    food_symbols:
        z.array(z.number())
        .default([]),


    menu_item_tags:
        z.array(z.number())
        .default([]),


    active:
        z.boolean()
        .default(true),

    location_statuses: z
        .array(
            z.object({
                location_id: z.number(),
                active: z.boolean(),
            })
        )
        .default([]),

    printer_id: z
        .number()
        .nullable()
        .optional(),

});


export type MenuItemFormValues =
    z.infer<typeof menuItemSchema>;