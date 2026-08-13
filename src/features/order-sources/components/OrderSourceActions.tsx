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
import { OrderSource } from "@/types/order-sources";
import EditOrderSourceDialog from "./EditOrderSourceDialog";
import DeleteOrderSourceDialog from "./DeleteOrderSourceDialog";

interface Props {
  orderSource: OrderSource;
  onSuccess: () => Promise<void>;

} 
export default function OrderSourceActions({
    orderSource,
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

             <EditOrderSourceDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                orderSource={orderSource}
                onSuccess={onSuccess}
            />

             <DeleteOrderSourceDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                orderSource={orderSource}
                onSuccess={onSuccess}
            />

           
        </>
    );
}