"use client";

import { useEffect, useState } from "react";

import {
getModifierGroups,
} from "../modifier.service";

import ModifierGroupSidebar from "./ModifierGroupSidebar";
import ModifierTable from "./ModifierTable";
import CreateModifierDialog from "./CreateModifierDialog";

export default function ModifierManagement() {
const [groups, setGroups] =
useState<any[]>([]);

const [selectedGroup, setSelectedGroup] =
    useState<number | null>(null);

const [loading, setLoading] =
    useState(true);

async function loadGroups() {
    try {
        setLoading(true);

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
    } finally {
        setLoading(false);
    }
}

useEffect(() => {
    loadGroups();
}, []);

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

                <h2 className="text-lg font-semibold">
                    Modifiers
                </h2>

                <CreateModifierDialog
                    groups={groups}
                    onSuccess={loadGroups}
                />

            </div>

            <ModifierTable
                groups={groups}
                selectedGroup={selectedGroup}
                onSuccess={loadGroups}
            />

        </div>
    </div>
);

}
