import { z } from "zod";

export const accountSchema = z
  .object({
    name: z.string().min(2, "Name is required"),

    email: z.string().email("Invalid email address"),

    location_id: z.number().min(1, "Please select a location"),

    currentPassword: z.string().optional(),

    newPassword: z.string().optional(),

    confirmPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const changingPassword =
      !!data.currentPassword ||
      !!data.newPassword ||
      !!data.confirmPassword;

    if (!changingPassword) return;

    if (!data.currentPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["currentPassword"],
        message: "Current password is required",
      });
    }

    if (!data.newPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["newPassword"],
        message: "New password is required",
      });
    } else if (data.newPassword.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["newPassword"],
        message: "Password must be at least 8 characters",
      });
    }

    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });

export type AccountForm = z.infer<typeof accountSchema>;



export const updateProfileSchema = z.object({
    name: z
        .string()
        .min(2, "Name is required"),

    email: z
        .string()
        .email("Invalid email address"),

    location_id: z
        .number()
        .min(1, "Please select a location"),
});

export type UpdateProfileInput =
    z.infer<typeof updateProfileSchema>;


export const changePasswordSchema = z
    .object({
        current_password: z
            .string()
            .min(1, "Current password is required"),

        password: z
            .string()
            .min(8, "Password must be at least 8 characters"),

        password_confirmation: z
            .string(),
    })
    .refine(
        (data) =>
            data.password ===
            data.password_confirmation,
        {
            path: ["password_confirmation"],
            message: "Passwords do not match",
        }
    );

export type ChangePasswordInput =
    z.infer<typeof changePasswordSchema>;