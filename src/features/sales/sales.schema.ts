import { z } from "zod";

export const salesDashboardFilterSchema = z.object({
    range: z.string().optional(),
    start_date: z.string().optional(),
    end_date: z.string().optional(),
    location_id: z.number().optional(),
    order_type: z.string().optional(),
    order_source_id: z.number().optional(),
    payment_method_id: z.number().optional(),
    status: z.string().optional(),
    cashier_id: z.number().optional(),
    customer_id: z.number().optional(),
});

export type SalesDashboardFilters = z.infer<
    typeof salesDashboardFilterSchema
>;