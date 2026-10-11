
"use client";

import { useState } from "react";
import {
    MoreHorizontal,
    Eye,
    ClipboardCheck,
    Clock,
    CheckCircle,
    XCircle,
    ListChecks,
} from "lucide-react";
import { toast } from "sonner";

import { Registered } from "@/types/registered";
import PermissionGuard from "@/components/guards/PermissionGuard";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

import RegisteredDetailsDialog from "./RegisteredDetailsDialog";
import { updateRegistrationSelectionStatus } from "../../registered.service";

type SelectionStatus =
    | "pending"
    | "selected"
    | "not_selected"
    | "waitlisted";

interface Props {
    registration: Registered;
    onSuccess: () => Promise<void>;
}

const selectionOptions: {
    value: SelectionStatus;
    label: string;
    icon: typeof Clock;
}[] = [
    { value: "pending", label: "Pending", icon: Clock },
    { value: "selected", label: "Selected", icon: CheckCircle },
    { value: "not_selected", label: "Not Selected", icon: XCircle },
    { value: "waitlisted", label: "Waitlisted", icon: ListChecks },
];

export default function RegisteredActions({
    registration,
    onSuccess,
}: Props) {
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [updating, setUpdating] = useState(false);

    async function handleSelectionStatusChange(
        selectionStatus: SelectionStatus
    ) {
        if (registration.selection_status === selectionStatus) {
            return;
        }

        try {
            setUpdating(true);

            await updateRegistrationSelectionStatus(
                registration.id,
                selectionStatus
            );

            toast.success("Selection status updated.");
            await onSuccess();
        } catch {
            toast.error("Failed to update selection status.");
        } finally {
            setUpdating(false);
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger
                    render={
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    }
                />

                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onClick={() => setDetailsOpen(true)}
                    >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                    </DropdownMenuItem>

                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <ClipboardCheck className="mr-2 h-4 w-4" />
                            Change Selection Status
                        </DropdownMenuSubTrigger>

                        <DropdownMenuSubContent>
                            {selectionOptions.map((option) => {
                                const Icon = option.icon;
                                const isCurrent =
                                    registration.selection_status === option.value;

                                return (
                                    <DropdownMenuItem
                                        key={option.value}
                                        disabled={updating || isCurrent}
                                        onClick={() =>
                                            handleSelectionStatusChange(
                                                option.value
                                            )
                                        }
                                    >
                                        <Icon className="mr-2 h-4 w-4" />
                                        {option.label}
                                        {isCurrent && " (Current)"}
                                    </DropdownMenuItem>
                                );
                            })}
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                </DropdownMenuContent>
            </DropdownMenu>

            <RegisteredDetailsDialog
                open={detailsOpen}
                onOpenChange={setDetailsOpen}
                registration={registration}
            />
        </>
    );
}