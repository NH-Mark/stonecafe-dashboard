"use client";

import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AccountForm } from "../account.types";
import { Location } from "@/types/location";

type Props = {
    locations: Location[];
};
export default function AccountSettings({ locations }: Props) {
    const { register, setValue, watch,formState: { errors }, } = useFormContext<AccountForm>();

    const locationId = watch("location_id");
    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile Information</CardTitle>
            </CardHeader>

            <CardContent className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>

                    <Input
                        id="name"
                        placeholder="John Doe"
                        {...register("name")}
                    />
                    <p className="text-sm text-destructive">
                        {errors.name?.message}
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>

                    <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        {...register("email")}
                    />
                    <p className="text-sm text-destructive">
                        {errors.email?.message}
                    </p>
                </div>


                <div className="space-y-2">

                    <Label>Location</Label>

                    <select
                        className="w-full rounded-md border p-2"
                        {...register("location_id", {
                            valueAsNumber: true,
                        })}
                    >

                        <option value="">
                            Select Location
                        </option>

                        {locations.map(location => (

                            <option
                                key={location.id}
                                value={location.id}
                            >
                                {location.name}
                            </option>

                        ))}

                    </select>
                    <p className="text-sm text-destructive">
                        {errors.location_id?.message}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}