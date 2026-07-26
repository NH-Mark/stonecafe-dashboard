"use client";

import { useState } from "react";
import EditStaffDialog from "./EditStaffDialog";
import DeleteStaffDialog from "./DeleteStaffDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Button
} from "@/components/ui/button";

import {
    MoreHorizontal,
    Pencil,
    Trash2
} from "lucide-react";
import { Role } from "@/types/role";
import { User } from "@/types/user";
import { Location } from "@/types/location";

interface Props {
   user: User;
  roles: Role[];
  locations: Location[];
  onSuccess: () => Promise<void>;

} 
export default function StaffActions({
    user,
    roles,
    locations,
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
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    }
                />

                <DropdownMenuContent align="end">

                    <DropdownMenuItem
                        onClick={() => setEditOpen(true)}
                    >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => setDeleteOpen(true)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>

                </DropdownMenuContent>

            </DropdownMenu>

            <EditStaffDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                user={user}
                roles={roles}
                locations={locations}
                onSuccess={onSuccess}
            />

            <DeleteStaffDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                user={user}
                onSuccess={onSuccess}
            />
        </>
    );
}