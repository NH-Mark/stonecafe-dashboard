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

});


export type MenuItemFormValues =
    z.infer<typeof menuItemSchema>;