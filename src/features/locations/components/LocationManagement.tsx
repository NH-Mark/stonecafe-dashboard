"use client";

import { useState } from "react";

import CreateLocationDialog from "./CreateLocationDialog";
import LocationTable from "./LocationTable";

export default function LocationManagement() {
    const [refreshKey, setRefreshKey] = useState(0);

    async function handleSuccess() {
        setRefreshKey((prev) => prev + 1);
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-semibold">
                        Locations
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Manage company branches and offices.
                    </p>
                </div>

                <CreateLocationDialog
                    onSuccess={handleSuccess}
                />
            </div>

            <LocationTable
                refreshKey={refreshKey}
            />
        </div>
    );
}