"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Trash2 } from "lucide-react";

import { deleteRole } from "../role.service";
import { Role } from "@/types/role";
import { toast } from "sonner";


interface Props {

  open: boolean;

  onOpenChange: (open: boolean) => void;

  role: Role;

  onSuccess: () => Promise<void>;

}



export default function DeleteRoleDialog({

  open,

  onOpenChange,

  role,

  onSuccess,

}: Props) {



  async function remove() {

    await deleteRole(role.id);
    await onSuccess();
    onOpenChange(false);
    toast.success("Role Deleted successfully.");

  }

  return (

    <Dialog

      open={open}

      onOpenChange={onOpenChange}

    >

      <DialogContent className="sm:max-w-md">


        <DialogHeader>

          <DialogTitle>
            Delete Role
          </DialogTitle>


          <DialogDescription>

            Are you sure you want to delete{" "}
            
            <strong>
              {role.name}
            </strong>
            ?

            This action cannot be undone.

          </DialogDescription>


        </DialogHeader>



        <DialogFooter>


          <Button

            variant="outline"

            onClick={() => onOpenChange(false)}

          >

            Cancel

          </Button>



          <Button

            variant="destructive"

            onClick={remove}

          >

            <Trash2 className="mr-2 h-4 w-4" />

            Delete

          </Button>


        </DialogFooter>


      </DialogContent>


    </Dialog>

  );

}