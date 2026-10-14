
"use client";

import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { updateStaff } from "../staff.service";
import { StaffFormValues } from "../staff.schema";

import { User } from "@/types/user";
import { Role } from "@/types/role";
import { Location } from "@/types/location";
import { applyApiErrors } from "@/lib/form-errors";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  roles: Role[];
  locations: Location[];
  onSuccess: () => Promise<void>;
}

export default function EditStaffDialog({
  open,
  onOpenChange,
  user,
  roles,
  locations,
  onSuccess,
}: Props) {
  const form = useForm<StaffFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role_id: undefined,
      location_ids: [],
    },
  });

  const selectedLocationIds = form.watch("location_ids") ?? [];

  useEffect(() => {
    if (!open) return;

    form.reset({
      name: user.name,
      email: user.email,
      password: "",
      role_id: user.roles?.[0]?.id ?? undefined,
      location_ids: (user.locations ?? []).map(
        (location) => Number(location.id)
      ),
    });
  }, [open, user, form]);

  async function submit(values: StaffFormValues) {
    const toastId = toast.loading("Saving...");

    try {
      await updateStaff(user.id, {
        ...values,
        password: values.password || undefined,
      });

      await onSuccess();

      onOpenChange(false);

      toast.success("Staff updated successfully.", {
        id: toastId,
      });
    } catch (error) {
      applyApiErrors(form, error);

      toast.error("Update failed.", {
        id: toastId,
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Staff</DialogTitle>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(submit)}
            className="space-y-4"
          >
            <div className="space-y-1">
              <Input
                placeholder="Name"
                {...form.register("name")}
              />

              {form.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Input
                type="email"
                placeholder="Email"
                {...form.register("email")}
              />

              {form.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Input
                type="password"
                placeholder="Leave blank to keep current password"
                {...form.register("password")}
              />

              {form.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* Multiple location assignments */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Assigned Locations
              </label>

              <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border p-3">
                {locations.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No locations available.
                  </p>
                ) : (
                  locations.map((location) => (
                    <label
                      key={location.id}
                      className="flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-muted"
                    >
                      <input
                        type="checkbox"
                        checked={selectedLocationIds.includes(
                          Number(location.id)
                        )}
                        onChange={(event) => {
                          const locationId = Number(location.id);

                          const nextIds = event.target.checked
                            ? [
                                ...selectedLocationIds,
                                locationId,
                              ]
                            : selectedLocationIds.filter(
                                (id) => id !== locationId
                              );

                          form.setValue("location_ids", nextIds, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                        }}
                        className="h-4 w-4"
                      />

                      <span className="text-sm">
                        {location.name}
                      </span>
                    </label>
                  ))
                )}
              </div>

              {form.formState.errors.location_ids && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.location_ids.message}
                </p>
              )}
            </div>

            {/* Role selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Role
              </label>

              <select
                className="w-full rounded-md border p-2"
                {...form.register("role_id", {
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
              >
                <option value="">Select Role</option>

                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>

              {form.formState.errors.role_id && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.role_id.message}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? "Saving..."
                  : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
