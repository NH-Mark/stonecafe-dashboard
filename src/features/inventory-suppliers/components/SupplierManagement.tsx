"use client";

import { useRef } from "react";
import CreateSupplierDialog from "./CreateSupplierDialog";
import SupplierTable, {
    SupplierTableRef,
} from "./SupplierTable";

export default function SupplierManagement() {
    const tableRef =
        useRef<SupplierTableRef>(null);

    async function handleSuccess() {
        await tableRef.current?.refresh();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold">
                        Suppliers
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Manage inventory suppliers
                    </p>
                </div>

                <CreateSupplierDialog
                    onSuccess={handleSuccess}
                />
            </div>

            <SupplierTable ref={tableRef} />
        </div>
    );
}
