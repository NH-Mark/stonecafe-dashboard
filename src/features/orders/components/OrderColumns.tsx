import { ColumnDef } from "@tanstack/react-table";
import { Order } from "../orders.types";
import OrderActions from "./OrderActions";
import { CircleAlert, CircleCheck, Clock3, RotateCcw } from "lucide-react";

interface OrderColumnsProps {
  onSuccess: () => Promise<void>;
}

export function OrderColumns({
  onSuccess,
}: OrderColumnsProps): ColumnDef<Order>[] {
  return [
    {
      accessorKey: "order_no",
      header: "Order No",
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "source",
      header: "Source",
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => {
        return `QAR ${Number(row.original.total).toFixed(2)}`;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
    },
   {
    accessorKey: "payment_status",
    header: "Payment Status",
    cell: ({ row }) => {
        const status = row.original.payment_status;

       const styles = {
        unpaid: {
            label: "Unpaid",
            icon: CircleAlert,
            className: "bg-red-50 text-red-700 border-red-200",
        },
        partial: {
            label: "Partial",
            icon: Clock3,
            className: "bg-yellow-50 text-yellow-700 border-yellow-200",
        },
        paid: {
            label: "Paid",
            icon: CircleCheck,
            className: "bg-green-50 text-green-700 border-green-200",
        },
        refunded: {
            label: "Refunded",
            icon: RotateCcw,
            className: "bg-gray-50 text-gray-700 border-gray-200",
        },
    };

        const config =
            styles[status as keyof typeof styles] ??
            styles.unpaid;

        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${config.className}`}>
                <Icon className="h-3.5 w-3.5" />
                {config.label}
            </span>
        );
    },
},
    {
      id: "payment_method",
      header: "Payment Method",
      cell: ({ row }) => {

        return row.original.payments
          ?.map((p) => p.method)
          .join(", ") || "-";
      },
    },
   
    {
      accessorKey: "ordered_at",
      header: "OrderedAt",
      cell: ({ row }) => {
        return new Date(row.original.ordered_at).toLocaleString();
      },
    },
    
    {
      id: "actions",
      cell: ({ row }) => (
          <OrderActions
              order={row.original}
              onSuccess={onSuccess}
          />
      )
      
      }
    
  ];
}