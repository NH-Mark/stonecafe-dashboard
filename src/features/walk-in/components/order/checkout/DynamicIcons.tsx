import {
    Banknote,
    CreditCard,
    Smartphone,
    Wallet
} from "lucide-react";

export function getPaymentIcon(code: string) {

    switch (code) {

        case "CASH":
            return <Banknote className="h-8 w-8" />;

        case "CARD":
            return <CreditCard className="h-8 w-8" />;

        case "QR":
            return <Smartphone className="h-8 w-8" />;

        default:
            return <Wallet className="h-8 w-8" />;
    }

}