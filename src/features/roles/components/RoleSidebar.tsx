"use client";


import { Shield, Plus, Pencil } from "lucide-react";


import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";


import { Button } from "@/components/ui/button";

import { Role } from "@/types/role";
import CreateRoleDialog from "@/features/roles/components/CreateRoleDialog";
import EditRoleDialog from "@/features/roles/components/EditRoleDialog";
import { Permission } from "@/types/permission";
import RoleActions from "./RoleActions";



interface Props {

    roles: Role[];

    selectedRole: number | null;

    onSelect: (id: number | null) => void;

    onRefresh: () => Promise<void>;

    permissions:Permission[];

}



export default function RoleSidebar({
    roles,
    selectedRole,
    onSelect,
    onRefresh,
    permissions,
}: Props) {


    return (

        <Card>

            <CardHeader>

                <div className="flex justify-between items-center">

                    <CardTitle>
                        Roles
                    </CardTitle>


                    <CreateRoleDialog
                        onSuccess={onRefresh}
                        permissions = {permissions}
                    />


                </div>

            </CardHeader>



            <CardContent className="space-y-2">


                <Button

                    variant={
                        selectedRole === null
                            ? "secondary"
                            : "ghost"
                    }

                    className="w-full justify-start"

                    onClick={() => onSelect(null)}

                >

                    <Shield className="mr-2 h-4" />

                    All Staff
                </Button>



                {
                    roles.map(role => (

                        <div
                            key={role.id}
                            className="flex items-center gap-2"
                        >


                            <Button

                                variant={
                                    selectedRole === role.id
                                        ? "secondary"
                                        : "ghost"
                                }

                                className="flex-1 justify-between"

                                onClick={() => onSelect(role.id)}

                            >


                                <span>
                                    {role.name}
                                </span>


                                <span className="text-xs text-muted-foreground">
                                    {role.users_count}
                                </span>


                            </Button>
                            <RoleActions
                                role={role}
                                permissions={permissions}
                                onSuccess={onRefresh}
                            />
                        </div>


                    ))
                }


            </CardContent>

        </Card>

    );

}