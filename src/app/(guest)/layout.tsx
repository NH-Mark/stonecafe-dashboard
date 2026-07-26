import GuestRoute from "@/features/auth/GuestRoute";
import { Toaster } from "sonner";

export default function GuestLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <GuestRoute>
            {children}
            <Toaster richColors position="top-right" />
        </GuestRoute>
    );

}