import { z } from "zod";

export const modifierSchema = z.object({

    modifier_group_id: z.coerce
        .number()
        .min(1, "Modifier group is required"),

    name: z.string()
        .min(2, "Modifier name is required"),

    price: z.coerce
        .number()
        .min(0),
 

    active: z.boolean()

});

export type ModifierFormValues =
    z.input<typeof modifierSchema>;