"use client";

import SalesFilters from "./filters/SalesFilters";
import SalesTrendChart from "./charts/SalesTrendChart";
import OrderTypeChart from "./charts/OrderTypeChart";
import SalesStats from "./cards/SalesStats";
import { useEffect, useState } from "react";
import { HourlyBreakdown, OrderTypeSales, SalesStat, TopItem, TopModifier } from "../sales.types";
import { getOrderTypes, getSalesDashboard } from "../sales.service";
import { SalesDashboardFilters } from "../sales.schema";
import { Location } from "@/types/location";
import { getLocations } from "@/features/locations/location.service";
import TopSellingModifiers from "./tables/TopSellingModifiers";
import { OrderType } from "@/types/order-type";
import TopSellingItems from "./tables/TopSellingItems";
import HourlyBreakdownByOrders from "./tables/HourlyBreakdownByOrders";
import PageLoader from "@/components/common/PageLoader";



export default function SalesDashboard() {

    const [stats, setStats] = useState<SalesStat[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [orderTypes, setOrderTypes] = useState<OrderType[]>([]);
    const [salesOrderTypes, setSalesOrderTypes] = useState<OrderTypeSales[]>([]);
    const [topSellingItems, setTopSellingItems] = useState<TopItem[]>([]);
    const [topSellingModifiers, setTopSellingModifiers] = useState<TopModifier[]>([]);
    const [hourlyBreakdown, setHourlyBreakdown] = useState<HourlyBreakdown[]>([]);

    const [filters, setFilters] =
        useState<SalesDashboardFilters>({
            range: "today",
            order_type: undefined,
            location_id: undefined,
        });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [trend, setTrend] = useState([]);
    useEffect(() => {

        async function load() {
            setLoading(true);
            try {
                const response =
                    await getSalesDashboard(filters);
                setStats(response.data.stats);
                setTrend(response.data.sales_trend);
                setSalesOrderTypes(response.data.sales_by_order_type);
                setTopSellingItems(response.data.top_selling_items);
                setTopSellingModifiers(response.data.top_selling_modifiers);
                setHourlyBreakdown(response.data.hourly_breakdown);
                console.log(response.data.stats);
            } finally {
                setLoading(false);
            }
        }

         if (
                filters.range === "custom" &&
                (!filters.start_date ||
                    !filters.end_date)
            ) {
                return;
            }

        async function loadLocations() {

            const response =
                await getLocations();
            setLocations(response.data.data ?? response.data);
        }
        async function loadOrderTypes() {

            const response =
                await getOrderTypes();
            setOrderTypes(response.data.data ?? response.data);
        }
        load();
        loadLocations();
        loadOrderTypes();


    }, [filters])

    return (

        <div className="space-y-6">


            <SalesFilters
                orderTypes={orderTypes}
                locations={locations}
                filters={filters}
                onChange={setFilters}
            />
            {loading && (
                <div>
                    <PageLoader />
                </div>
            )}
            <SalesStats
                data={stats}
            />


            <div className="
            grid
            gap-6
            xl:grid-cols-2
            ">


                <SalesTrendChart data={trend} />

                <OrderTypeChart data={salesOrderTypes} />

            </div>



            <div className="
            grid
            gap-6
            xl:grid-cols-2
            ">

                <TopSellingItems data={topSellingItems} />

                <TopSellingModifiers data={topSellingModifiers} />
            </div>



            <HourlyBreakdownByOrders data={hourlyBreakdown} />


        </div>

    );

}