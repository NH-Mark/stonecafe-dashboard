"use client";

import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AccountForm } from "../account.schema";

export default function ChangePassword() {
  const { register,formState:{errors} } = useFormContext<AccountForm>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
      </CardHeader>

      <CardContent className="grid md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label>Current Password</Label>

          <Input
            type="password"
            {...register("currentPassword")}
          />
           <p className="text-sm text-destructive">
                {errors.currentPassword?.message}
            </p>
        </div>

        <div className="space-y-2">
          <Label>New Password</Label>

          <Input
            type="password"
            {...register("newPassword")}
          />
          {errors.newPassword && (
            <p className="text-sm text-destructive">
                {errors.newPassword.message}
            </p>
            )}
        </div>

        <div className="space-y-2">
          <Label>Confirm Password</Label>

          <Input
            type="password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                    {errors.confirmPassword.message}
                </p>
                )}
        </div>
      </CardContent>
    </Card>
  );
}