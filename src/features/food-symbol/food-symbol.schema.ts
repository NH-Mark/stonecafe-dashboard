import { z } from "zod";


export const foodSymbolSchema = z.object({

    name: z.string()
        .min(1, "name is required"),

    active: z.boolean(),

});


export type FoodSymbolFormValues =
    z.infer<typeof foodSymbolSchema>;