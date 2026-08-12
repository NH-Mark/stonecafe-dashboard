"use client";

import { useEffect, useState } from "react";

import { getModifierGroups } from "../modifier.service";

import ModifierGroupSidebar from "./ModifierGroupSidebar";
import ModifierTable from "./ModifierTable";
import CreateModifierDialog from "./CreateModifierDialog";

import { ModifierGroup } from "@/types/modifier-group";

export default function ModifierManagement() {
    const [groups, setGroups] =
        useState<ModifierGroup[]>([]);

    const [selectedGroup, setSelectedGroup] =
        useState<number | null>(null);

    const [refreshKey, setRefreshKey] =
        useState(0);

    async function loadGroups() {
        try {
            const response =
                await getModifierGroups();

            setGroups(
                response.data.data ??
                response.data
            );
        } catch (error) {
            console.error(
                "Failed to load modifier groups:",
                error
            );
        }
    }

    useEffect(() => {
        loadGroups();
    }, []);

    /**
     * Called after create/update/delete.
     *
     * This tells ModifierTable to reload.
     */
    async function handleSuccess() {
        await loadGroups();

        setRefreshKey((value) => value + 1);
    }

    return (
        <div className="grid lg:grid-cols-4 gap-6">

            <ModifierGroupSidebar
                groups={groups}
                selectedGroup={selectedGroup}
                onSelect={setSelectedGroup}
                onRefresh={loadGroups}
            />

            <div className="lg:col-span-3">

                <div className="flex justify-between mb-5">

                    <div>
                        <h2 className="text-lg font-semibold">
                            Modifiers
                        </h2>

                        <p className="text-sm text-muted-foreground">
                            Manage modifiers
                        </p>
                    </div>

                    <CreateModifierDialog
                        groups={groups}
                        onSuccess={handleSuccess}
                    />

                </div>

                <ModifierTable
                    groups={groups}
                    selectedGroup={selectedGroup}
                    refreshKey={refreshKey}
                    onSuccess={handleSuccess}
                />

            </div>

        </div>
    );
}