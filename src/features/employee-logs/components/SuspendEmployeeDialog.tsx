"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import type { EmployeeLogUser } from "@/types/employee-log";
import { restoreStaff, suspendStaff } from "@/features/staff/staff.service";
import { toast } from "sonner";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: EmployeeLogUser;
    action: "suspend" | "restore";
    onSuccess: () => Promise<void>;
}

export default function SuspendEmployeeDialog({
    open,
    onOpenChange,
    user,
    action,
    onSuccess,
}: Props) {

    async function handleAction() {
        try {
            if (action === "restore") {
                await restoreStaff(user.id);
                toast.success("Staff restored successfully.");
            } else {
                await suspendStaff(user.id);
                toast.success("Staff suspended successfully.");
            }

            await onSuccess();
            onOpenChange(false);
        } catch {
            toast.error(action === "restore" ? "Failed to restore staff." : "Failed to suspend staff.");
        }
    }

    const isRestore = action === "restore";

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {isRestore ? "Restore Staff" : "Suspend Staff"}
                    </DialogTitle>

                    <DialogDescription>
                        Are you sure you want to {isRestore ? "restore" : "suspend"} <strong>{user.name}</strong>?
                        <br />
                        {isRestore
                            ? "This will reactivate the account for future access."
                            : "This will deactivate the account until it is restored."}
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
                        variant={isRestore ? "default" : "destructive"}
                        onClick={handleAction}
                    >
                        {isRestore ? "Restore" : "Suspend"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}