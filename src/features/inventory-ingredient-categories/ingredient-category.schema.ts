import { z } from "zod";

export const ingredientCategorySchema = z.object({
    name: z
        .string()
        .min(1, "Category name is required"),
    description: z
        .string()
        .optional()
        .nullable(),
    is_active: z.boolean(),
});

export type IngredientCategoryFormInput =
    z.input<typeof ingredientCategorySchema>;

export type IngredientCategoryFormValues =
    z.output<typeof ingredientCategorySchema>;
