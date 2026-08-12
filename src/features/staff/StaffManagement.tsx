"use client";

import { useEffect, useState } from "react";

import StaffTable from "./components/StaffTable";

import { getRoles } from "../roles/role.service";
import { getPermissions } from "./staff.service";
import { getLocations } from "../locations/location.service";

import { Role } from "@/types/role";
import { Location } from "@/types/location";
import { Permission } from "@/types/permission";

import RoleSidebar from "../roles/components/RoleSidebar";
import CreateStaffDialog from "./components/CreateStaffDialog";

export default function StaffManagement() {
    const [roles, setRoles] =
        useState<Role[]>([]);

    const [permissions, setPermissions] =
        useState<Permission[]>([]);

    const [locations, setLocations] =
        useState<Location[]>([]);

    const [selectedRole, setSelectedRole] =
        useState<number | null>(null);

    /**
     * Used to tell StaffTable
     * that it needs to reload.
     */
    const [refreshKey, setRefreshKey] =
        useState(0);

    async function loadRoles() {
        const response =
            await getRoles();

        setRoles(
            response.data.data ??
            response.data
        );
    }

    async function loadPermissions() {
        const response =
            await getPermissions();

        setPermissions(
            response.data.data ??
            response.data
        );
    }

    async function loadLocations() {
        const response =
            await getLocations();

        setLocations(
            response.data.data ??
            response.data
        );
    }

    useEffect(() => {
        loadRoles();
        loadPermissions();
        loadLocations();
    }, []);

    /**
     * Called after create/update/delete.
     */
    async function handleSuccess() {
        await loadRoles();
        await loadLocations();

        setRefreshKey(
            (value) => value + 1
        );
    }

    return (
        <div className="grid grid-cols-12 gap-6">

            <div className="col-span-3">
                <RoleSidebar
                    roles={roles}
                    selectedRole={selectedRole}
                    onSelect={setSelectedRole}
                    onRefresh={loadRoles}
                    permissions={permissions}
                />
            </div>

            <div className="col-span-9">

                <div className="flex justify-between mb-5">

                    <h2 className="text-xl font-semibold">
                        Staff
                    </h2>

                    <CreateStaffDialog
                        roles={roles}
                        locations={locations}
                        onSuccess={handleSuccess}
                    />

                </div>

                <StaffTable
                    selectedRole={selectedRole}
                    refreshKey={refreshKey}
                    onSuccess={handleSuccess}
                    roles={roles}
                    locations={locations}
                />

            </div>

        </div>
    );
}