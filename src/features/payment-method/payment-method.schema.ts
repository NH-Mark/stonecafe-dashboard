import { z } from "zod";


export const paymentMethodSchema = z.object({
    name: z
        .string()
        .min(1, "Method name is required"),

    status: z.boolean(),
});


export type PaymentMethodFormValues =
    z.infer<typeof paymentMethodSchema>;