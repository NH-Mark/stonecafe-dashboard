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
import { Discount } from "@/types/discount";
import EditDiscountDialog from "./EditDiscountDialog";
import DeleteDiscountDialog from "./DeleteDiscountDialog";

interface Props {
  discount: Discount;
  onSuccess: () => Promise<void>;

} 
export default function DiscountActions({
    discount,
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

            <EditDiscountDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                discount={discount}
                onSuccess={onSuccess}
            />

             <DeleteDiscountDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                discount={discount}
                onSuccess={onSuccess}
            />

           
        </>
    );
}