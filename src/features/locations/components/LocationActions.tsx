"use client";

import { useState } from "react";
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
import { Location } from "@/types/location";
import EditLocationDialog from "./EditLocationDialog";
import DeleteLocationDialog from "./DeleteLocationDialog";

interface Props {
  location: Location;
  onSuccess: () => Promise<void>;

} 
export default function LocationActions({
    location,
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

            <EditLocationDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                location={location}
                onSuccess={onSuccess}
            />

             <DeleteLocationDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                location={location}
                onSuccess={onSuccess}
            />

           
        </>
    );
}