"use client";

import { useEffect, useState } from "react";

import StaffTable from "./components/StaffTable";

import { getRoles } from "../roles/role.service";

import { Role } from "@/types/role";
import { User } from "@/types/user";
import { getPermissions, getStaff } from "./staff.service";
import RoleSidebar from "../roles/components/RoleSidebar";
import { Permission } from "@/types/permission";
import CreateStaffDialog from "./components/CreateStaffDialog";
import { getLocations } from "../locations/location.service";
import { Location } from "@/types/location";


export default function StaffManagement() {

    const [roles, setRoles] =
        useState<Role[]>([]);

    const [permissions, setPermissions] =
        useState<Permission[]>([]);


    const [staff, setStaff] =
        useState<User[]>([]);

    const [locations, setLocations] =
        useState<Location[]>([]);


    const [selectedRole, setSelectedRole] =
        useState<number | null>(null);



    async function loadRoles() {

        const response =
            await getRoles();

        setRoles(
            response.data.data ?? response.data
        );

    }



    async function loadStaff() {

        const response =
            await getStaff();

        setStaff(
            response.data.data ?? response.data
        );

    }

    async function loadPermissions() {

        const response =
            await getPermissions();

        setPermissions(
            response.data.data ?? response.data
        );

    }
    
    async function loadLocations() {

        const response =
            await getLocations();

        setLocations(
            response.data.data ?? response.data
        );

    }



    useEffect(() => {

        loadRoles();

        loadStaff();
        loadPermissions();
        loadLocations();

    }, []);



    const filteredStaff =
        selectedRole === null

            ? staff

            : staff.filter(user =>
                user.roles.some(
                    role =>
                        role.id === selectedRole
                )
            );



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
                        onSuccess={loadStaff}

                    />


                </div>

                <StaffTable

                    users={filteredStaff}

                    onSuccess={loadStaff}
                    roles={roles}
                    locations={locations}
                />

            </div>


        </div>

    );
}