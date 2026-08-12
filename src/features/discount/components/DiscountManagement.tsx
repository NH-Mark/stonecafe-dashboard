"use client";

import {
    useRef,
} from "react";

import DiscountTable, {
    DiscountTableRef,
} from "./DiscountTable";

import CreateDiscountDialog from "./CreateDiscountDialog";

export default function DiscountManagement() {
    const tableRef =
        useRef<DiscountTableRef>(null);

    async function handleSuccess() {
        await tableRef.current?.refresh();
    }

    return (
        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <div>
                    <h2 className="text-lg font-semibold">
                        Discount
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Manage Discounts
                    </p>
                </div>

                <CreateDiscountDialog
                    onSuccess={
                        handleSuccess
                    }
                />

            </div>

            <DiscountTable
                ref={tableRef}
            />

        </div>
    );
}