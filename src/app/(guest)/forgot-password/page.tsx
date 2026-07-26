"use client";

import { useState } from "react";
import { forgotPassword } from "@/features/auth/auth.service";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function ForgotPasswordPage() {

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    async function submit(e: React.FormEvent) {
        e.preventDefault();
        try {
            setLoading(true);
            setError("");
            setMessage("");

            const response = await forgotPassword(email);

            toast.success(
               response.message
            );
        } catch {
             toast.error(
                "Unable to send reset email."
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
                        Forgot Password
                    </CardTitle>

                    <p
                        className="
                            text-center
                            text-sm
                            text-[#a57653]
                        "
                    >
                        Enter your email to reset your password
                    </p>

                </CardHeader>


                <CardContent>

                    <form
                        onSubmit={submit}
                        className="space-y-5"
                    >

                        <div className="relative">

                            <Mail
                                className="
                                    absolute
                                    left-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-[#a57653]
                                "
                                size={19}
                            />

                            <Input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e)=>
                                    setEmail(e.target.value)
                                }
                                className="
                                    h-12
                                    rounded-xl
                                    pl-12
                                "
                            />

                        </div>


                        {
                            message &&
                            <p className="text-sm text-green-600">
                                {message}
                            </p>
                        }


                        {
                            error &&
                            <p className="text-sm text-red-500">
                                {error}
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
                                ? "Sending..."
                                : "Send Reset Link"
                            }
                        </Button>


                    </form>

                </CardContent>

            </Card>

        </main>
    );
}