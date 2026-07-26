import { z } from "zod";


export const staffSchema = z.object({

    name: z
        .string()
        .min(2, "Name is required"),


    email: z
        .string()
        .email("Invalid email address"),


    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .optional()
        .or(z.literal("")),



    role_id: z
        .number()
        .min(1, "Please select a role"),

    location_id: z
        .number()
        .min(1, "Please select a location"),

});

export const createStaffSchema =
    staffSchema.extend({

        password:z
            .string()
            .min(
                8,
                "Password must be at least 8 characters"
            )

    });

export type StaffFormValues =
    z.infer<typeof staffSchema>;

export type CreateStaffFormValues =
    z.infer<typeof createStaffSchema>;