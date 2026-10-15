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
import { getLocations, getLocationSelectors } from "@/features/locations/location.service";
import TopSellingModifiers from "./tables/TopSellingModifiers";
import { OrderType } from "@/types/order-type";
import TopSellingItems from "./tables/TopSellingItems";
import HourlyBreakdownByOrders from "./tables/HourlyBreakdownByOrders";
import PageLoader from "@/components/common/PageLoader";
import DailyEmailSummary from "./DailyEmailSummary";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/useAuth";
import TopGrossingModifiers from "./tables/TopGrossingModifiers";
import TopGrossingItems from "./tables/TopGrossingItems";
import SalesByPaymentMethod, { PaymentMethodSale } from "./tables/SalesByPaymentMethod";
import SalesByCategory, { SalesByCategoryItem } from "./tables/SalesByCategory";
import SalesByDiscount, { SalesByDiscountItem } from "./tables/SalesByDiscount";


export default function SalesDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState<SalesStat[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [orderTypes, setOrderTypes] = useState<OrderType[]>([]);
    const [salesOrderTypes, setSalesOrderTypes] = useState<OrderTypeSales[]>([]);
    const [topSellingItems, setTopSellingItems] = useState<TopItem[]>([]);
    const [topSellingModifiers, setTopSellingModifiers] = useState<TopModifier[]>([]);
    const [topGrossingModifiers, setTopGrossingModifiers] = useState<TopModifier[]>([]);
    const [topGrossingItems, setTopGrossingItems] = useState<TopItem[]>([]);
    const [hourlyBreakdown, setHourlyBreakdown] = useState<HourlyBreakdown[]>([]);
    const [salesByPaymentMethod, setSalesByPaymentMethod] = useState<PaymentMethodSale[]>([]);
    const [salesByCategory, setSalesByCategory] = useState<SalesByCategoryItem[]>([]);
    const [salesByDiscount, setSalesByDiscount] = useState<SalesByDiscountItem[]>([]);

    const [activeLocationId, setActiveLocationId] =
        useState<number | undefined>(undefined);

    const [locationsReady, setLocationsReady] = useState(false);

    const isSuperAdmin = user?.roles?.some(
        (role) => role.name === "Super Admin"
    );

    const permittedLocationIds = locations.map(
        (location) => Number(location.id)
    );

    const visibleLocations = isSuperAdmin
        ? locations
        : locations.filter(
            (location) =>
                Number(location.id) === activeLocationId
        );

    const [filters, setFilters] =
        useState<SalesDashboardFilters>({
            range: "today",
            order_type: undefined,
            location_id: undefined,
        });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [trend, setTrend] = useState([]);

    const router = useRouter();
    // 1. Load permitted locations and initialize the active location.

    useEffect(() => {
        async function initialize() {
            try {
                setLocationsReady(false);

                const response = await getLocationSelectors();
                const availableLocations: Location[] =
                    response;

                setLocations(availableLocations);

                const storedId = Number(
                    Cookies.get("active_location_id")
                );

                const permittedLocation = availableLocations.find(
                    (location) => Number(location.id) === storedId
                );

                // Automatically select the only permitted location.
                const selectedLocation =
                    availableLocations.length === 1
                        ? availableLocations[0]
                        : permittedLocation;

                // No location to select, or stored location is invalid.
                if (!selectedLocation) {
                    router.replace("/select-location");
                    return;
                }

                const locationId = Number(selectedLocation.id);

                Cookies.set(
                    "active_location_id",
                    String(locationId),
                    {
                        expires: 7,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "strict",
                    }
                );

                setActiveLocationId(locationId);

                setFilters((current) => ({
                    ...current,
                    location_id: locationId,
                }));

                const orderTypesResponse = await getOrderTypes();

                setOrderTypes(
                    orderTypesResponse.data.data ??
                    orderTypesResponse.data
                );

                setLocationsReady(true);
            } catch (error) {
                console.error(
                    "Failed to initialize sales dashboard:",
                    error
                );
            }
        }

        initialize();
    }, [router]);


    // 2. Fetch sales only after the active location is initialized.
    useEffect(() => {
        if (!locationsReady || filters.location_id == null) {
            return;
        }

        if (
            filters.range === "custom" &&
            (!filters.start_date || !filters.end_date)
        ) {
            return;
        }

        async function loadSales() {
            setLoading(true);

            try {
                const response = await getSalesDashboard(filters);
                console.log("Sales dashboard response:", response.data);
                setStats(response.data.stats);
                setTrend(response.data.sales_trend);
                setSalesOrderTypes(response.data.sales_by_order_type);
                setTopSellingItems(response.data.top_selling_items);
                setTopSellingModifiers(response.data.top_selling_modifiers);
                setTopGrossingModifiers(response.data.top_grossing_modifiers);
                setHourlyBreakdown(response.data.hourly_breakdown);
                setSalesByPaymentMethod(response.data.sales_by_payment_method);
                setTopGrossingItems(
                    response.data.top_grossing_items ?? []
                );
                setSalesByCategory(
                    response.data.sales_by_category ?? []
                );
                setSalesByDiscount(
                    response.data.sales_by_discount ?? []
                );
            } catch (error) {
                console.error("Failed to load sales dashboard:", error);
            } finally {
                setLoading(false);
            }
        }

        loadSales();
    }, [filters, locationsReady]);

    return (

        <div className="space-y-6">

            <DailyEmailSummary />
            <SalesFilters
                orderTypes={orderTypes}
                locations={visibleLocations}
                filters={filters}
                onChange={setFilters}
                activeLocationId={activeLocationId}
                permittedLocationIds={permittedLocationIds}
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
                <TopGrossingItems data={topGrossingItems} />
               
            </div>
            <div className="
            grid
            gap-6
            xl:grid-cols-3
            ">
                <TopSellingModifiers data={topSellingModifiers} />

                <SalesByDiscount
                    data={salesByDiscount}
                />
                <TopGrossingModifiers data={topGrossingModifiers} />

            </div>
             <div className="
            grid
            gap-6
            xl:grid-cols-2
            ">

                <SalesByPaymentMethod
                    data={salesByPaymentMethod}
                />
                <SalesByCategory
                    data={salesByCategory}
                />
            </div>



            <HourlyBreakdownByOrders data={hourlyBreakdown} />


        </div>

    );

}