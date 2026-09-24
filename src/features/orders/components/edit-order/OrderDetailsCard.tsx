import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { User, ShoppingBag, MapPin, Table2 } from "lucide-react"

export default function OrderDetailsCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Order Details</CardTitle>

                <CardDescription>
                    Manage the basic information for this order.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <InfoField
                        icon={User}
                        label="Customer"
                        value="Walk-in Customer"
                    />

                    <InfoField
                        icon={ShoppingBag}
                        label="Order Type"
                        value="Dine In"
                    />

                    <InfoField
                        icon={MapPin}
                        label="Location"
                        value="Main Branch"
                    />

                    <InfoField
                        icon={Table2}
                        label="Table"
                        value="Table 12"
                    />
                </div>
            </CardContent>
        </Card>
    )
}

function InfoField({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType
    label: string
    value: string
}) {
    return (
        <div className="rounded-lg border bg-muted/20 p-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon className="h-3.5 w-3.5" />
                {label}
            </div>

            <p className="mt-1 text-sm font-medium">
                {value}
            </p>
        </div>
    )
}