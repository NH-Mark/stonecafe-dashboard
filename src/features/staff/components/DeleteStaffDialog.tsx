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

import { User } from "@/types/user";
import { deleteStaff } from "../staff.service";
import { toast } from "sonner";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User;
    onSuccess: () => Promise<void>;
}

export default function DeleteStaffDialog({
    open,
    onOpenChange,
    user,
    onSuccess,
}: Props) {

    async function remove() {
        try {
            await deleteStaff(user.id);

            await onSuccess();

            onOpenChange(false);
            toast.success("Staff deleted successfully.");
        }
        catch{
            toast.error(
            "Failed to delete staff."
            );
        }
    }

    return (

        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >

            <DialogContent className="sm:max-w-md">

                <DialogHeader>

                    <DialogTitle>
                        Delete Staff
                    </DialogTitle>

                    <DialogDescription>
                        Are you sure you want to delete{" "}
                        <strong>{user.name}</strong>?
                        <br />
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
                        Delete
                    </Button>

                </DialogFooter>

            </DialogContent>

        </Dialog>

    );

}