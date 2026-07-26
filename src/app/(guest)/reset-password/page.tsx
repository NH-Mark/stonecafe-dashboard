"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Lock } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";

import api from "@/services/api";
import { toast } from "sonner";


export default function ResetPasswordPage() {

    const router = useRouter();

    const searchParams = useSearchParams();

    const token = searchParams.get("token");
    const email = searchParams.get("email");


    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");



    async function submit(e: React.FormEvent) {

        e.preventDefault();


        try {

            setLoading(true);
            setError("");
            setMessage("");


            await api.post(
                "/api/reset-password",
                {
                    token,
                    email,
                    password,
                    password_confirmation: passwordConfirmation
                }
            );

            toast.success(
                "Password reset successfully. Redirecting..."
            );
          


            setTimeout(() => {
                router.push("/login");
            }, 2000);


        } catch (error: any) {
             toast.error(
                error.message ??
                "Unable to reset password."
            );

        } finally {

            setLoading(false);

        }

    }



    return (

        <main
            className="
                min-h-screen
                flex
                items-center
                justify-center
                bg-[#f3f3f3]
                px-4
            "
        >

            <Card
                className="
                    w-full
                    max-w-md
                    rounded-3xl
                    shadow-xl
                    border-0
                "
            >

                <CardHeader>

                    <CardTitle
                        className="
                            text-center
                            text-2xl
                            text-[#40332a]
                        "
                    >
                        Reset Password
                    </CardTitle>

                    <p
                        className="
                            text-center
                            text-sm
                            text-[#a57653]
                        "
                    >
                        Create your new password
                    </p>

                </CardHeader>



                <CardContent>

                    <form
                        onSubmit={submit}
                        className="space-y-5"
                    >


                        <div className="relative">

                            <Lock
                                size={19}
                                className="
                                    absolute
                                    left-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-[#a57653]
                                "
                            />

                            <Input
                                type="password"
                                placeholder="New password"
                                value={password}
                                onChange={(e)=>
                                    setPassword(e.target.value)
                                }
                                className="
                                    h-12
                                    rounded-xl
                                    pl-12
                                "
                            />

                        </div>



                        <div className="relative">

                            <Lock
                                size={19}
                                className="
                                    absolute
                                    left-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-[#a57653]
                                "
                            />

                            <Input
                                type="password"
                                placeholder="Confirm password"
                                value={passwordConfirmation}
                                onChange={(e)=>
                                    setPasswordConfirmation(
                                        e.target.value
                                    )
                                }
                                className="
                                    h-12
                                    rounded-xl
                                    pl-12
                                "
                            />

                        </div>



                        {
                            error &&
                            <p className="text-sm text-red-500">
                                {error}
                            </p>
                        }



                        {
                            message &&
                            <p className="text-sm text-green-600">
                                {message}
                            </p>
                        }



                        <Button
                            type="submit"
                            disabled={loading}
                            className="
                                w-full
                                h-12
                                rounded-xl
                                bg-[#40332a]
                                hover:bg-[#a57653]
                            "
                        >

                            {
                                loading
                                ? "Resetting..."
                                : "Reset Password"
                            }

                        </Button>


                    </form>

                </CardContent>


            </Card>


        </main>

    );
}