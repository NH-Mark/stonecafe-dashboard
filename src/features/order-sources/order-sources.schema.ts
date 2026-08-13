import { z } from "zod";


export const orderSourceSchema = z.object({
    name: z
        .string()
        .min(1, "Method name is required"),

    status: z.boolean(),
});

export type OrderSourceFormValues =
    z.infer<typeof orderSourceSchema>;