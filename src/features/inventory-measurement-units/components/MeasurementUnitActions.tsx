"use client";

import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import {
    MoreHorizontal,
    Pencil,
    Trash2,
} from "lucide-react";
import { InventoryMeasurementUnit } from "@/types/inventory-measurement-unit";
import EditMeasurementUnitDialog from "./EditMeasurementUnitDialog";
import DeleteMeasurementUnitDialog from "./DeleteMeasurementUnitDialog";
import PermissionGuard from "@/components/guards/PermissionGuard";

interface Props {
    measurementUnit: InventoryMeasurementUnit;
    onSuccess: () => Promise<void>;
}

export default function MeasurementUnitActions({
    measurementUnit,
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
                    <PermissionGuard permission="inventory.view">
                        <DropdownMenuItem
                            onClick={() => setEditOpen(true)}
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                    </PermissionGuard>

                    <PermissionGuard permission="inventory.view">
                        <DropdownMenuItem
                            onClick={() => setDeleteOpen(true)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </PermissionGuard>
                </DropdownMenuContent>
            </DropdownMenu>

            <EditMeasurementUnitDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                measurementUnit={measurementUnit}
                onSuccess={onSuccess}
            />

            <DeleteMeasurementUnitDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                measurementUnit={measurementUnit}
                onSuccess={onSuccess}
            />
        </>
    );
}
