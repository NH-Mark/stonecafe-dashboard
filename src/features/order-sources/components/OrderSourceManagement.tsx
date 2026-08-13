"use client";

import {
    useRef,
} from "react";
import OrderSourceTable, { OrderSourceTableRef } from "./OrderSourceTable";
import CreateOrderSourceDialog from "./CreateOrderSourceDialog";


export default function OrderSourceManagement() {
    const tableRef =
        useRef<OrderSourceTableRef>(null);

    async function handleSuccess() {
        await tableRef.current?.refresh();
    }

    return (
        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <div>
                    <h2 className="text-lg font-semibold">
                        Order Sources
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Manage Order Sources
                    </p>
                </div>

                <CreateOrderSourceDialog
                    onSuccess={
                        handleSuccess
                    }
                />

            </div>

            <OrderSourceTable
                ref={tableRef}
            />

        </div>
    );
}