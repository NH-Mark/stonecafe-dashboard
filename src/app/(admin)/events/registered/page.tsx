"use client";

import { useState } from "react";

import RegisteredTable from "@/features/events/components/registered/RegisteredTable";

export default function RegisteredPage() {
    const [refreshKey, setRefreshKey] = useState(0);

    function handleRefresh() {
        setRefreshKey((prev) => prev + 1);
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">
                    Registered List
                </h1>

                <p className="text-muted-foreground">
                    Manage event registrations.
                </p>
            </div>

            <RegisteredTable
                refreshKey={refreshKey}
            />
        </div>
    );
}