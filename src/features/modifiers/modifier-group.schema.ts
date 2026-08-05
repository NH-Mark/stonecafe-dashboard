import { z } from "zod";

export const modifierGroupSchema = z.object({

    name: z.string()
          .min(2, "Name is required"),

    name_ar: z
        .string()
        .nullable()
        .optional(),

    selection_type: z.enum([
        "single",
        "multiple"
    ]),

    required: z.boolean(),

    min_selection: z.coerce
        .number()
        .min(0, "Minimum cannot be negative"),


    max_selection: z.coerce
        .number()
        .min(0, "Maximum cannot be negative"),

    active: z.boolean()

});

export type ModifierGroupFormValues =
    z.input<typeof modifierGroupSchema>;