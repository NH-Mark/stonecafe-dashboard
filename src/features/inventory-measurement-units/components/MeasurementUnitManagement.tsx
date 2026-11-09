"use client";

import { useRef } from "react";
import CreateMeasurementUnitDialog from "./CreateMeasurementUnitDialog";
import MeasurementUnitTable, {
    MeasurementUnitTableRef,
} from "./MeasurementUnitTable";

export default function MeasurementUnitManagement() {
    const tableRef =
        useRef<MeasurementUnitTableRef>(null);

    async function handleSuccess() {
        await tableRef.current?.refresh();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold">
                        Measurement Units
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Manage inventory measurement units
                    </p>
                </div>

                <CreateMeasurementUnitDialog
                    onSuccess={handleSuccess}
                />
            </div>

            <MeasurementUnitTable ref={tableRef} />
        </div>
    );
}
