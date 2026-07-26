"use client";

import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { Pencil } from "lucide-react";

import { Permission } from "@/types/permission";
import { RoleFormValues } from "../role.schema";
import { updateRole } from "../role.service";

import PermissionSelector from "./PermissionSelector";
import { toast } from "sonner";


interface EditRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: {
    id: number;
    name: string;
    permissions: string[];
  };

  permissions: Permission[];

  onSuccess: () => Promise<void>;

}



export default function EditRoleDialog({
  open,
  onOpenChange,
  role,
  permissions,
  onSuccess,
}: EditRoleDialogProps) {




  const form =
    useForm<RoleFormValues>({

      defaultValues: {
        name: role.name,
        permissions: role.permissions,
      },

    });



  useEffect(() => {

    form.reset({

      name: role.name,

      permissions: role.permissions,

    });


  }, [role, form]);




  async function onSubmit(
    values: RoleFormValues
  ) {
    try {
      await updateRole(
        role.id,
        values
      );


      await onSuccess();
      onOpenChange(false);
      toast.success("Role Updated successfully.");

    }
    catch{
        toast.error(
            "Failed to Update Role."
            );
    }
   

  }





  return (

    <Dialog
      open={open}
      onOpenChange={onOpenChange}>



      <DialogContent

        className="
    sm:max-w-3xl
    max-h-[90vh]
    overflow-hidden
    flex
    flex-col
  "

      >


        <DialogHeader>

          <DialogTitle>

            Edit Role: {role.name}

          </DialogTitle>


          <DialogDescription>

            Update permissions assigned to this role.

          </DialogDescription>


        </DialogHeader>



        <FormProvider {...form}>


          <form

            onSubmit={
              form.handleSubmit(onSubmit)
            }

            className="
flex
flex-col
flex-1
overflow-hidden
"

          >


            {/* Permission area */}

            <div

              className="
flex-1
overflow-y-auto
py-4
pr-2
"

            >


              <PermissionSelector

                permissions={permissions}

              />


            </div>



            <DialogFooter>


              <Button

                type="submit"

              >

                Save Changes

              </Button>


            </DialogFooter>



          </form>


        </FormProvider>



      </DialogContent>


    </Dialog>

  );

}