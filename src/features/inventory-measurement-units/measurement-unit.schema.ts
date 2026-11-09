import { z } from "zod";

export const measurementUnitSchema = z.object({
    name: z
        .string()
        .min(1, "Measurement unit name is required"),
});

export type MeasurementUnitFormInput =
    z.input<typeof measurementUnitSchema>;

export type MeasurementUnitFormValues =
    z.output<typeof measurementUnitSchema>;
