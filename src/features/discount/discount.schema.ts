import { z } from "zod";


export const discountSchema = z.object({
    name: z
        .string()
        .min(1, "Discount name is required"),

    type: z.enum([
        "percentage",
        "fixed",
    ]),

    value: z
        .string()
        .min(1, "Discount value is required"),

    status: z.boolean(),
});



export type DiscountFormValues =
    z.infer<typeof discountSchema>;