"use client";

import { useState } from "react";
import { Ban, MoreHorizontal } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/useAuth";
import { hasRole } from "@/features/auth/permission";
import type { EmployeeLog } from "@/types/employee-log";
import SuspendEmployeeDialog from "./SuspendEmployeeDialog";

interface Props {
    log: EmployeeLog;
    onSuccess: () => Promise<void>;
}

export default function EmployeeLogActions({
    log,
    onSuccess,
}: Props) {
    const [suspendOpen, setSuspendOpen] = useState(false);
    const { user: authUser } = useAuth();

    const user = log.user;
    const isSuspended = user?.status === false;
    const canManageUser = hasRole(authUser, "Super Admin");

    if (!user || !canManageUser) {
        return null;
    }

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
                        onClick={() => setSuspendOpen(true)}
                        variant={isSuspended ? "default" : "destructive"}
                    >
                        <Ban className="mr-2 h-4 w-4" />
                        {isSuspended ? "Restore" : "Suspend"}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <SuspendEmployeeDialog
                open={suspendOpen}
                onOpenChange={setSuspendOpen}
                user={user}
                action={isSuspended ? "restore" : "suspend"}
                onSuccess={onSuccess}
            />
        </>
    );
}