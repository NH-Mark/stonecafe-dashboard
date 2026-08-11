"use client";

import {
    useEffect,
    useState,
} from "react";

import {
    ArrowRightLeft,
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

import {
    Button,
} from "@/components/ui/button";


import {
    toast,
} from "sonner";
import { getTables, RestaurantTable } from "../tables/tables.service";
import { transferDiningSessionTable } from "../../dining-session.service";
import { useRouter } from "next/navigation";

interface TransferTableDialogProps {
    open: boolean;

    onClose: () => void;

    currentTableId?: number | null;

    currentTableName?: string;

    sessionId?: number | null;

    onTransferred?: (
        table: RestaurantTable
    ) => void;
}

export function TransferTableDialog({
    open,
    onClose,
    currentTableId,
    currentTableName,
    sessionId,
    onTransferred,
}: TransferTableDialogProps) {

    const [
        tables,
        setTables,
    ] = useState<RestaurantTable[]>([]);

    const [
        loading,
        setLoading,
    ] = useState(false);

    const [
        transferring,
        setTransferring,
    ] = useState(false);

    const [
        selectedTableId,
        setSelectedTableId,
    ] = useState<number | null>(null);

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

                /*
                |------------------------------------------------------------------
                | Only available tables can be selected.
                |------------------------------------------------------------------
                */

                setTables(
                    result.filter(
                        table =>
                            table.status ===
                            "available"
                    )
                );

            } catch (error) {
                console.error(
                    "Failed to load tables:",
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

    /*
    |--------------------------------------------------------------------------
    | Transfer
    |--------------------------------------------------------------------------
    |
    | The backend transfer endpoint has not been created yet.
    |
    | Keep the UI ready and connect the API call here once the endpoint
    | exists.
    |
    */
    const router = useRouter();
    async function handleTransfer() {

        if (!selectedTableId) {
            toast.error(
                "Please select a table."
            );

            return;
        }

        const table =
            tables.find(
                item =>
                    item.id ===
                    selectedTableId
            );

        if (!table) {
            toast.error(
                "Selected table was not found."
            );

            return;
        }

        if (!sessionId) {
            toast.error(
                "Dining session not found."
            );

            return;
        }

        try {

            setTransferring(true);

            
            
            await transferDiningSessionTable(
                sessionId,
                table.id
            );
           

            onTransferred?.(table);
            onClose();
            router.push("/walk-in/tables");
           
            
        } catch (error) {

            console.error(
                "Failed to transfer table:",
                error
            );

            toast.error(
                "Unable to transfer table."
            );

        } finally {

            setTransferring(false);

        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={value => {
                if (!value && !transferring) {
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
                            <ArrowRightLeft
                                className="
                                    h-5
                                    w-5
                                "
                            />

                            Transfer Table
                        </DialogTitle>

                        <DialogDescription
                            className="
                                text-primary-foreground/70
                            "
                        >
                            Move this dining session to
                            another available table.
                        </DialogDescription>

                    </DialogHeader>
                </div>

                <div
                    className="
                        space-y-5
                        p-6
                    "
                >

                    {/* CURRENT TABLE */}

                    <div
                        className="
                            rounded-2xl
                            border
                            bg-muted/30
                            p-4
                        "
                    >

                        <p
                            className="
                                text-xs
                                font-medium
                                uppercase
                                tracking-wide
                                text-muted-foreground
                            "
                        >
                            Current Table
                        </p>

                        <div
                            className="
                                mt-1
                                flex
                                items-center
                                gap-2
                            "
                        >

                            <Table2
                                className="
                                    h-5
                                    w-5
                                "
                            />

                            <span
                                className="
                                    font-semibold
                                "
                            >
                                {currentTableName ??
                                    "Current Table"}
                            </span>

                        </div>

                    </div>

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
                                    {tables.length} available
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
                                    There are currently no
                                    tables available for
                                    transfer.
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
                                                    transferring
                                                }
                                                onClick={() =>
                                                    setSelectedTableId(
                                                        table.id
                                                    )
                                                }
                                                className={`
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
                                transferring
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
                                transferring
                            }
                            onClick={
                                handleTransfer
                            }
                        >

                            {transferring ? (
                                <>
                                    <Loader2
                                        className="
                                            mr-2
                                            h-4
                                            w-4
                                            animate-spin
                                        "
                                    />

                                    Transferring...
                                </>
                            ) : (
                                <>
                                    <ArrowRightLeft
                                        className="
                                            mr-2
                                            h-4
                                            w-4
                                        "
                                    />

                                    Transfer
                                </>
                            )}

                        </Button>

                    </div>

                </div>

            </DialogContent>
        </Dialog>
    );
}