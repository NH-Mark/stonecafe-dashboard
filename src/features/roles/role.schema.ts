import { z } from "zod";

export const roleSchema = z.object({
  name: z
    .string()
    .min(2, "Role name required"),

  permissions: z
    .array(z.string())
    .min(1, "Select at least one permission"),
});

export type RoleFormValues = z.infer<typeof roleSchema>;