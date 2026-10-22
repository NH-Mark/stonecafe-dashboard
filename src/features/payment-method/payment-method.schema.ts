import { z } from "zod";


export const paymentMethodSchema = z.object({
    name: z
        .string()
        .min(1, "Method name is required"),

    status: z.boolean(),
    sort_order: z.coerce
        .number()
        .int("Sort order must be a whole number")
        .min(0, "Sort order must be 0 or greater")
        .default(0),
});


export type PaymentMethodFormInput =
    z.input<typeof paymentMethodSchema>;

export type PaymentMethodFormValues =
    z.output<typeof paymentMethodSchema>;