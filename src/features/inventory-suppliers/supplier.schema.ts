import { z } from "zod";

const optionalNullableText = z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((value) => {
        if (value == null) {
            return null;
        }

        return value.length ? value : null;
    });

export const supplierSchema = z.object({
    supplier_code: optionalNullableText,
    name: z
        .string()
        .trim()
        .min(1, "Supplier name is required"),
    email: optionalNullableText.refine(
        (value) => value == null || z.string().email().safeParse(value).success,
        "Please enter a valid email"
    ),
    phone: optionalNullableText,
    alternate_phone: optionalNullableText,
    tax_number: optionalNullableText,
    address: optionalNullableText,
    city: optionalNullableText,
    country: optionalNullableText,
    notes: optionalNullableText,
    is_active: z.boolean(),
});

export type SupplierFormInput =
    z.input<typeof supplierSchema>;

export type SupplierFormValues =
    z.output<typeof supplierSchema>;
