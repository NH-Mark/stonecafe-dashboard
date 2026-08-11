import { Button } from "@/components/ui/button";
import React from "react";

interface PaymentButtonProps {
    icon: React.ReactNode;
    label: string;
    active: boolean;
    disabled?: boolean;
    onClick: () => void;
}

export function PaymentButton({

    icon,

    label,

    active,

    disabled = false,

    onClick

}: PaymentButtonProps) {

    return (

        <Button

            type="button"

            variant="outline"

            disabled={disabled}

            onClick={onClick}

            className={`
                h-24
                flex
                flex-col
                items-center
                justify-center
                gap-3
                rounded-2xl
                border-2
                transition-all
                duration-200

                ${
                    active
                        ? "border-primary bg-primary/10 text-primary shadow-md"
                        : "hover:border-primary/40 hover:bg-primary/5"
                }
            `}
        >

            <div
                className={`
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    ${
                        active
                            ? "bg-primary text-primary-foreground"
                            : "bg-slate-100"
                    }
                `}
            >
                {icon}
            </div>

            <span className="text-sm font-semibold">
                {label}
            </span>

        </Button>

    );
}