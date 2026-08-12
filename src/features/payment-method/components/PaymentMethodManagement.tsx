"use client";

import {
    useRef,
} from "react";
import PaymentMethodTable, { PaymentMethodTableRef } from "./PaymentMethodTable";
import CreatePaymentMethodDialog from "./CreatePaymentMethodDialog";



export default function PaymentMethodManagement() {
    const tableRef =
        useRef<PaymentMethodTableRef>(null);

    async function handleSuccess() {
        await tableRef.current?.refresh();
    }

    return (
        <div className="space-y-6">

            <div className="flex items-center justify-between">

                <div>
                    <h2 className="text-lg font-semibold">
                        Payment Method
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Manage Payment Methods
                    </p>
                </div>

                <CreatePaymentMethodDialog
                    onSuccess={
                        handleSuccess
                    }
                />

            </div>

            <PaymentMethodTable
                ref={tableRef}
            />

        </div>
    );
}