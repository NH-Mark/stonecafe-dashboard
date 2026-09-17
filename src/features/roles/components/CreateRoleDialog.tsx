"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";

import {
Dialog,
DialogContent,
DialogDescription,
DialogHeader,
DialogTitle,
DialogTrigger,
DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { createRole } from "../role.service";

import {
roleSchema,
RoleFormValues,
} from "../role.schema";

import { applyApiErrors } from "@/lib/form-errors";
import { Permission } from "@/types/permission";
import PermissionSelector from "./PermissionSelector";
import { toast } from "sonner";
import PermissionGuard from "@/components/guards/PermissionGuard";

interface CreateRoleDialogProps {
onSuccess: () => Promise<void>;
permissions: Permission[];
}

export default function CreateRoleDialog({
onSuccess,
permissions,
}: CreateRoleDialogProps) {
const [open, setOpen] = useState(false);

const form = useForm<RoleFormValues>({
resolver: zodResolver(roleSchema),
defaultValues: {
name: "",
permissions: [],
},
});

async function onSubmit(values: RoleFormValues) {
try {
await createRole(values);

  form.reset();

  setOpen(false);

  await onSuccess();

  toast.success("Role created successfully.");
} catch (error) {
  applyApiErrors(form, error);

  toast.error(
    (error as any)?.message ?? "Failed to create role."
  );
}

}

return ( <Dialog
   open={open}
   onOpenChange={setOpen}
 > <PermissionGuard permission="users.create">
<DialogTrigger
render={ <Button> <Plus className="mr-2 h-4 w-4" />
New Role </Button>
}
/> </PermissionGuard>

  <DialogContent
    className="
      sm:max-w-3xl
      max-h-[90vh]
      overflow-hidden
      flex
      flex-col
    "
  >
    {/* Header */}
    <DialogHeader className="shrink-0">
      <DialogTitle>
        Create Role
      </DialogTitle>

      <DialogDescription>
        Create a role and assign permissions.
      </DialogDescription>
    </DialogHeader>

    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="
          flex
          flex-col
          flex-1
          min-h-0
          overflow-hidden
        "
      >
        {/* Fixed fields */}
        <div className="shrink-0 space-y-2 pb-4">
          <Label htmlFor="role-name">
            Role Name
          </Label>

          <Input
            id="role-name"
            {...form.register("name")}
            placeholder="Manager"
          />

          {form.formState.errors.name && (
            <p className="text-sm text-destructive">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        {/* Scrollable permissions */}
        <div
          className="
            flex-1
            min-h-0
            overflow-y-auto
            pr-2
            py-2
          "
        >
          <div className="space-y-3">
            <Label>
              Permissions
            </Label>

            <PermissionSelector
              permissions={permissions}
            />

            {form.formState.errors.permissions && (
              <p className="text-sm text-destructive">
                {form.formState.errors.permissions.message}
              </p>
            )}
          </div>
        </div>

        {/* Fixed footer */}
        <DialogFooter
          className="
            shrink-0
            pt-4
            mt-2
            border-t
          "
        >
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "Creating..."
              : "Create Role"}
          </Button>
        </DialogFooter>
      </form>
    </FormProvider>
  </DialogContent>
</Dialog>

);
}
