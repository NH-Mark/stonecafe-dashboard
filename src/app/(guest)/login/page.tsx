"use client";

import { useState } from "react";
import { login } from "@/features/auth/auth.service";
import { useAuth } from "@/features/auth/useAuth";
import { useRouter } from "next/navigation";
import {
    Coffee,
    Lock,
    Mail,
    Eye,
    EyeOff,
    Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import Image from "next/image";
import ProtectedRoute from "@/features/auth/ProtectedRoute";
import Cookies from "js-cookie";

export default function LoginPage() {

    const router = useRouter();
    const { refreshUser } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function submit(e: React.FormEvent) {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const response = await login({
                email,
                password
            });
            Cookies.set(
                "token",
                response.token,
                {
                    expires: 7,
                    secure: true,
                    sameSite: "strict",
                }
            );
            await refreshUser();

            router.push("/dashboard");

        } catch (error) {
            setError("Invalid email or password");
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

            <div
                className="
                    grid
                    md:grid-cols-2
                    w-full
                    max-w-5xl
                    overflow-hidden
                    rounded-3xl
                    shadow-2xl
                    bg-white
                "
            >

                {/* Left branding */}
                <section
                    className="
                        hidden
                        md:flex
                        flex-col
                        justify-center
                        px-12
                        bg-[#40332a]
                        text-white
                        relative
                    "
                >

                    <div className="absolute inset-0 bg-gradient-to-br from-[#a57653]/40 to-transparent" />

                    <div className="relative z-10">

                        <div
                            className="
                                h-16
                                w-16
                                rounded-2xl
                                bg-[#ddcfbe]
                                flex
                                items-center
                                justify-center
                                mb-6
                                overflow-hidden
                            "
                        >
                            <Image
                                src="/images/stone-logo.webp"
                                alt="Stone Cafe Logo"
                                width={64}
                                height={64}
                                className="
                                    h-full
                                    w-full
                                    object-contain
                                "
                            />
                        </div>
                        <h1 className="
                            text-2xl
                            font-bold
                            tracking-tight
                        ">
                            STONE SPECIALITY COFFEE
                        </h1>


                        {/* <p
                            className="
                                mt-4
                                text-[#ddcfbe]
                                leading-relaxed
                            "
                        >
                            Manage your cafe,
                            orders and customers
                            with a simple,
                            elegant dashboard.
                        </p> */}


                        {/* <div
                            className="
                                mt-8
                                flex
                                items-center
                                gap-2
                                text-sm
                                text-[#c3b6a4]
                            "
                        >
                            <Sparkles size={16}/>
                            Premium Cafe Management
                        </div> */}

                    </div>

                </section>



                {/* Login Card */}
                <section
                    className="
                        p-6
                        md:p-12
                        flex
                        items-center
                    "
                >

                    <Card
                        className="
                            w-full
                            border-0
                            shadow-none
                            bg-transparent
                        "
                    >

                        <CardHeader
                            className="space-y-3"
                        >

                            <div
                                className="
                                    md:hidden
                                    mx-auto
                                    h-14
                                    w-14
                                    rounded-2xl
                                    bg-[#40332a]
                                    flex
                                    items-center
                                    justify-center
                                "
                            >
                                <Coffee
                                    className="text-[#ddcfbe]"
                                />
                            </div>


                            <CardTitle
                                className="
                                    text-center
                                    text-3xl
                                    text-[#40332a]
                                "
                            >
                                Welcome Back
                            </CardTitle>

                            <p
                                className="
                                    text-center
                                    text-[#a57653]
                                "
                            >
                                Login to Stone Cafe Dashboard
                            </p>

                        </CardHeader>


                        <CardContent>

                            <form
                                onSubmit={submit}
                                className="space-y-5"
                            >

                                <div className="space-y-2">

                                    <Label
                                        className="text-[#40332a]"
                                    >
                                        Email
                                    </Label>

                                    <div className="relative">

                                        <Mail
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
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            className="
                                                h-12
                                                rounded-xl
                                                pl-12
                                                text-sm
                                                border-[#d9d9d8]
                                                bg-white
                                                focus-visible:ring-[#a57653]
                                                focus-visible:ring-2
                                            "
                                        />

                                    </div>

                                </div>



                                <div className="space-y-2">

                                    <Label
                                        className="text-[#40332a]"
                                    >
                                        Password
                                    </Label>

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
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            className="
                                h-12
                                rounded-xl
                                pl-12
                                pr-12
                                text-sm
                                border-[#d9d9d8]
                                bg-white
                                focus-visible:ring-[#a57653]
                                focus-visible:ring-2
                            "
                                        />


                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="
                                absolute
                                right-4
                                top-1/2
                                -translate-y-1/2
                                text-[#a57653]
                                hover:text-[#40332a]
                                transition
                            "
                                        >
                                            {
                                                showPassword
                                                    ? <EyeOff size={19} />
                                                    : <Eye size={19} />
                                            }

                                        </button>

                                    </div>

                                </div>



                                {
                                    error &&
                                    <p
                                        className="
                                            text-sm
                                            text-red-500
                                        "
                                    >
                                        {error}
                                    </p>
                                }
                                <button
                                    type="button"
                                    onClick={() => router.push("/forgot-password")}
                                    className="
                                        text-sm
                                        text-[#a57653]
                                        hover:text-[#40332a]
                                    "
                                >
                                    Forgot password?
                                </button>


                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="
                                        w-full
                                        h-11
                                        bg-[#40332a]
                                        hover:bg-[#a57653]
                                        text-white
                                        rounded-xl
                                        transition
                                    "
                                >
                                    {
                                        loading
                                            ? "Logging in..."
                                            : "Login"
                                    }
                                </Button>


                            </form>

                        </CardContent>

                    </Card>

                </section>

            </div>

        </main>
    );
}