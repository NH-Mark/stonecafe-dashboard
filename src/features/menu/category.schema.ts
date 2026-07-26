import { z } from "zod";


export const categorySchema = z.object({

    name: z
        .string()
        .min(2, "Category name is required"),


    description: z
        .string()
        .nullable()
        .optional(),


    image: z
        .string()
        .nullable()
        .optional(),


    parent_id: z
    .number()
    .nullable()
    .optional(),


    active: z.boolean(),

});


// form input type
export type CategoryFormValues =
    z.input<typeof categorySchema>;


// after validation type
export type CategoryData =
    z.output<typeof categorySchema>;