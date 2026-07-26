import { z } from "zod";


export const locationSchema = z.object({

    name: z.string()
        .min(1, "Location name is required"),

    code: z.string()
        .min(1, "Location code is required"),

    address: z.string()
        .nullable()
        .optional(),

    phone: z.string()
        .nullable()
        .optional(),

    status: z.boolean(),

});


export type LocationFormValues =
    z.infer<typeof locationSchema>;