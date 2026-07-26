"use client";

import { useState } from "react";

import {
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import EditRoleDialog from "./EditRoleDialog";

import { Role } from "@/types/role";
import { Permission } from "@/types/permission";
import DeleteRoleDialog from "./DeleteRoleDialog";


interface Props {
  role: Role;
  permissions: Permission[];
  onSuccess: () => Promise<void>;
}


export default function RoleActions({
  role,
  permissions,
  onSuccess,
}: Props) {


  const [editOpen, setEditOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);



  return (

    <>

      <DropdownMenu>

        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
            >
              <MoreHorizontal
                className="h-4 w-4"
              />
            </Button>
          }
        />


        <DropdownMenuContent
          align="end"
        >

          <DropdownMenuItem
            onClick={() => setEditOpen(true)}
          >

            <Pencil className="mr-2 h-4 w-4" />

            Edit

          </DropdownMenuItem>



          <DropdownMenuItem
            onClick={() => setDeleteOpen(true)}
            className="text-destructive"
          >

            <Trash2 className="mr-2 h-4 w-4" />

            Delete

          </DropdownMenuItem>


        </DropdownMenuContent>


      </DropdownMenu>



      <EditRoleDialog

        open={editOpen}

        onOpenChange={setEditOpen}

        role={role}

        permissions={permissions}

        onSuccess={onSuccess}

      />



      <DeleteRoleDialog

        open={deleteOpen}

        onOpenChange={setDeleteOpen}

        role={role}

        onSuccess={onSuccess}

      />


    </>

  );

}