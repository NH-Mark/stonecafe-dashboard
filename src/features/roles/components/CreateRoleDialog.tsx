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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { useAuth } from "../../auth/useAuth";
import { createRole } from "../role.service";

import {
  roleSchema,
  RoleFormValues,
} from "../role.schema";
import EditRoleDialog from "./EditRoleDialog";
import { applyApiErrors } from "@/lib/form-errors";
import { Permission } from "@/types/permission";
import PermissionSelector from "./PermissionSelector";
import { toast } from "sonner";

interface CreateRoleDialogProps {
  onSuccess: () => Promise<void>;
  permissions: Permission[];
}
export default function CreateRoleDialog({
  onSuccess,
  permissions
}: CreateRoleDialogProps) {

  const { user } = useAuth();

  const [open, setOpen] = useState(false);


  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      permissions: [],
    },
  });



  const groupedPermissions = permissions.reduce(
    (acc, permission) => {

      const [resource, action] =
        permission.name.split(".");


      if (!acc[resource]) {
        acc[resource] = [];
      }


      acc[resource].push({
        id: permission.id,
        value: permission.name,
        action,
      });


      return acc;

    },
    {} as Record<
      string,
      {
        id: number;
        value: string;
        action: string;
      }[]
    >
  );

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
            (error as any)?.message ?? "Failed to create staff."
            );
    }

  }


  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >

      <DialogTrigger
        render={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Role
          </Button>
        }
      />


      <DialogContent className="sm:max-w-lg">

        <DialogHeader>

          <DialogTitle>
            Create Role
          </DialogTitle>

          <DialogDescription>
            Assign permissions to this role.
          </DialogDescription>

        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >


            <div className="space-y-2">

              <Label>
                Role Name
              </Label>


              <Input
                {...form.register("name")}
                placeholder="Manager"
              />


              {form.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}

            </div>



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



            <DialogFooter>

              <Button
                type="submit"
              >
                Create Role
              </Button>

            </DialogFooter>


          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}