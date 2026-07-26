"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Permission } from "@/types/permission";
import { useFormContext } from "react-hook-form";
import { RoleFormValues } from "../role.schema";


interface Props {
    permissions: Permission[];
}


export default function PermissionSelector({
    permissions
}: Props) {


    const form =
        useFormContext<RoleFormValues>();


    const groupedPermissions =
        permissions.reduce(
            (acc, permission)=>{


                const [
                    resource,
                    action
                ] = permission.name.split(".");


                if(!acc[resource]){
                    acc[resource] = [];
                }


                acc[resource].push({
                    id:permission.id,
                    value:permission.name,
                    action
                });


                return acc;

            },
            {} as Record<
                string,
                {
                    id:number;
                    value:string;
                    action:string;
                }[]
            >
        );



    return (

        <div className="space-y-4">


            {
                Object.entries(groupedPermissions)
                .map(([resource,items])=>(


                <div
                    key={resource}
                    className="rounded-lg border p-3"
                >


                    <h3 className="mb-3 font-semibold capitalize">
                        {resource}
                    </h3>



                    <div className="grid grid-cols-2 gap-2">


                    {
                        items.map(
                        ({
                            id,
                            value,
                            action
                        })=>{


                            const checked =
                                form
                                .watch("permissions")
                                .includes(value);



                            return (

                            <label

                                key={id}

                                className="
                                flex items-center gap-2
                                rounded-md border p-2
                                cursor-pointer
                                hover:bg-muted
                                "

                            >


                                <Checkbox

                                    checked={checked}

                                    onCheckedChange={(checked)=>{


                                        const current =
                                            form.getValues(
                                                "permissions"
                                            );


                                        form.setValue(

                                            "permissions",

                                            checked

                                            ? [
                                                ...current,
                                                value
                                            ]

                                            :

                                            current.filter(
                                                p=>p!==value
                                            ),

                                            {
                                                shouldValidate:true
                                            }

                                        );


                                    }}

                                />


                                <span className="capitalize text-sm">
                                    {action}
                                </span>


                            </label>

                            )

                        })

                    }


                    </div>


                </div>


                ))
            }


        </div>

    );

}