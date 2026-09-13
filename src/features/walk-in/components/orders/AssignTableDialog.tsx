"use client";

import { useEffect, useState } from "react";
import {
    Check,
    Loader2,
    Table2,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import {
    getTables,
    RestaurantTable,
} from "../tables/tables.service";
import { assignOrderTable } from "../../orders.service";


interface AssignTableDialogProps {
    open: boolean;
    onClose: () => void;

    orderId: number;

    onAssigned?: (
        table: RestaurantTable
    ) => void;
}

export function AssignTableDialog({
    open,
    onClose,
    orderId,
    onAssigned,
}: AssignTableDialogProps) {
    const [tables, setTables] = useState<
        RestaurantTable[]
    >([]);

    const [loading, setLoading] =
        useState(false);

    const [assigning, setAssigning] =
        useState(false);

    const [selectedTableId, setSelectedTableId] =
        useState<number | null>(null);

    useEffect(() => {
        if (!open) {
            return;
        }

        setSelectedTableId(null);

        async function loadTables() {
            try {
                setLoading(true);

                const result =
                    await getTables();

                setTables(
                    result.filter(
                        table =>
                            table.status ===
                            "available"
                    )
                );
            } catch (error) {
                console.error(
                    "Failed to load available tables:",
                    error
                );

                toast.error(
                    "Unable to load available tables."
                );

                setTables([]);
            } finally {
                setLoading(false);
            }
        }

        void loadTables();
    }, [open]);

    async function handleAssign() {
        if (!selectedTableId) {
            toast.error(
                "Please select a table."
            );

            return;
        }

        const table = tables.find(
            item =>
                item.id === selectedTableId
        );

        if (!table) {
            toast.error(
                "Selected table was not found."
            );

            return;
        }

        if (!orderId) {
            toast.error(
                "Order not found."
            );

            return;
        }

        try {
            setAssigning(true);

            await assignOrderTable(
                orderId,
                table.id
            );

            onAssigned?.(table);

            onClose();

            toast.success(
                `Table ${table.name} assigned successfully.`
            );
        } catch (error) {
            console.error(
                "Failed to assign table:",
                error
            );

            toast.error(
                "Unable to assign table."
            );
        } finally {
            setAssigning(false);
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={value => {
                if (
                    !value &&
                    !assigning
                ) {
                    onClose();
                }
            }}
        >
            <DialogContent
                className="
                    !max-w-lg
                    rounded-[28px]
                    p-0
                    overflow-hidden
                "
            >
                {/* HEADER */}

                <div
                    className="
                        bg-primary
                        px-6
                        py-5
                        text-primary-foreground
                    "
                >
                    <DialogHeader>
                        <DialogTitle
                            className="
                                flex
                                items-center
                                gap-2
                                text-xl
                            "
                        >
                            <Table2
                                className="
                                    h-5
                                    w-5
                                "
                            />

                            Assign Table
                        </DialogTitle>

                        <DialogDescription
                            className="
                                text-primary-foreground/70
                            "
                        >
                            Select an available table
                            for this dine-in order.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div
                    className="
                        space-y-5
                        p-6
                    "
                >
                    {/* AVAILABLE TABLES */}

                    <div>
                        <div
                            className="
                                mb-3
                                flex
                                items-center
                                justify-between
                            "
                        >
                            <p
                                className="
                                    text-sm
                                    font-semibold
                                "
                            >
                                Available Tables
                            </p>

                            {!loading && (
                                <span
                                    className="
                                        text-xs
                                        text-muted-foreground
                                    "
                                >
                                    {tables.length}{" "}
                                    available
                                </span>
                            )}
                        </div>

                        {loading ? (
                            <div
                                className="
                                    flex
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    border
                                    p-8
                                "
                            >
                                <Loader2
                                    className="
                                        h-5
                                        w-5
                                        animate-spin
                                        text-muted-foreground
                                    "
                                />
                            </div>
                        ) : tables.length === 0 ? (
                            <div
                                className="
                                    rounded-2xl
                                    border
                                    border-dashed
                                    p-8
                                    text-center
                                "
                            >
                                <Table2
                                    className="
                                        mx-auto
                                        mb-2
                                        h-7
                                        w-7
                                        text-muted-foreground
                                    "
                                />

                                <p
                                    className="
                                        text-sm
                                        font-medium
                                    "
                                >
                                    No available tables
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        text-muted-foreground
                                    "
                                >
                                    There are currently
                                    no tables available
                                    for this order.
                                </p>
                            </div>
                        ) : (
                            <div
                                className="
                                    grid
                                    grid-cols-2
                                    gap-3
                                "
                            >
                                {tables.map(
                                    table => {
                                        const selected =
                                            selectedTableId ===
                                            table.id;

                                        return (
                                            <button
                                                key={
                                                    table.id
                                                }
                                                type="button"
                                                disabled={
                                                    assigning
                                                }
                                                onClick={() =>
                                                    setSelectedTableId(
                                                        table.id
                                                    )
                                                }
                                                className={`
                                                    relative
                                                    rounded-2xl
                                                    border
                                                    p-4
                                                    text-left
                                                    transition
                                                    ${
                                                        selected
                                                            ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                                                            : "hover:border-primary/50 hover:bg-muted/50"
                                                    }
                                                    disabled:cursor-not-allowed
                                                    disabled:opacity-50
                                                `}
                                            >
                                                {selected && (
                                                    <div
                                                        className="
                                                            absolute
                                                            right-3
                                                            top-3
                                                            flex
                                                            h-5
                                                            w-5
                                                            items-center
                                                            justify-center
                                                            rounded-full
                                                            bg-primary
                                                            text-primary-foreground
                                                        "
                                                    >
                                                        <Check
                                                            className="
                                                                h-3
                                                                w-3
                                                            "
                                                        />
                                                    </div>
                                                )}

                                                <div
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-3
                                                    "
                                                >
                                                    <div
                                                        className="
                                                            flex
                                                            h-10
                                                            w-10
                                                            items-center
                                                            justify-center
                                                            rounded-xl
                                                            bg-green-100
                                                            text-green-700
                                                        "
                                                    >
                                                        <Table2
                                                            className="
                                                                h-5
                                                                w-5
                                                            "
                                                        />
                                                    </div>

                                                    <div>
                                                        <p
                                                            className="
                                                                font-semibold
                                                            "
                                                        >
                                                            {
                                                                table.name
                                                            }
                                                        </p>

                                                        <p
                                                            className="
                                                                text-xs
                                                                text-green-600
                                                            "
                                                        >
                                                            Available
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    }
                                )}
                            </div>
                        )}
                    </div>

                    {/* ACTIONS */}

                    <div
                        className="
                            flex
                            gap-3
                            border-t
                            pt-5
                        "
                    >
                        <Button
                            type="button"
                            variant="outline"
                            className="
                                flex-1
                                rounded-xl
                            "
                            disabled={
                                assigning
                            }
                            onClick={
                                onClose
                            }
                        >
                            Cancel
                        </Button>

                        <Button
                            type="button"
                            className="
                                flex-1
                                rounded-xl
                            "
                            disabled={
                                !selectedTableId ||
                                assigning
                            }
                            onClick={
                                handleAssign
                            }
                        >
                            {assigning ? (
                                <>
                                    <Loader2
                                        className="
                                            mr-2
                                            h-4
                                            w-4
                                            animate-spin
                                        "
                                    />

                                    Assigning...
                                </>
                            ) : (
                                <>
                                    <Table2
                                        className="
                                            mr-2
                                            h-4
                                            w-4
                                        "
                                    />

                                    Assign Table
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}