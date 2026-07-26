import { z } from "zod";


export const menuItemTagSchema = z.object({

    name: z
        .string()
        .min(1, "Item name is required"),


    active:
        z.boolean()
        .default(true),

});


export type MenuItemTagFormValues =
    z.infer<typeof menuItemTagSchema>;