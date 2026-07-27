import { ColumnDef } from "@tanstack/react-table";
import { Order } from "../orders.types";
import OrderActions from "./OrderActions";

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
      header: "Payment",
    },
    {
      accessorKey: "ordered_at",
      header: "Ordered At",
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