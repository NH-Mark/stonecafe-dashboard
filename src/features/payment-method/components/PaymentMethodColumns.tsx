import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { PaymentMethod } from "@/types/payment-method";
import PaymentMethodActions from "./PaymentMethodActions";


interface PaymentMethodColumnsProps {
  onSuccess: () => Promise<void>;
}

export function PaymentMethodColumns({
    onSuccess
}:PaymentMethodColumnsProps):ColumnDef<PaymentMethod>[] {

return [

{
    accessorKey:"name",
    header:"Name"
},
{
    accessorKey:"code",
    header:"Code"
},
{
    accessorKey: "status",

    header: "Status",

    cell: ({ row }) => (

        <Badge
            variant={
                row.original.status
                    ? "default"
                    : "destructive"
            }
        >

            {
                row.original.status
                    ? "Active"
                    : "Inactive"
            }

        </Badge>

    )
},


{
  id: "actions",
cell: ({ row }) => (
    <PaymentMethodActions
        paymentMethod={row.original}
        onSuccess={onSuccess}
    />
)

}

];


}