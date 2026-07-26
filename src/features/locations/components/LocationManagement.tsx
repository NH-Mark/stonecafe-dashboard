"use client";

import { useEffect, useState } from "react";

import {
    Location
} from "@/types/location";
import { getLocations } from "../location.service";
import CreateLocationDialog from "./CreateLocationDialog";
import LocationTable from "./LocationTable";



export default function LocationManagement(){


    const [locations,setLocations] =
        useState<Location[]>([]);



    async function loadLocations(){

        const response =
            await getLocations();


        setLocations(
            response.data.data ??
            response.data
        );

    }



    useEffect(()=>{

        loadLocations();

    },[]);



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
                    onSuccess={loadLocations}
                />


            </div>




            <LocationTable

                locations={locations}

                onSuccess={loadLocations}

            />


        </div>

    );

}