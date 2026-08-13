import { AdminMenuItem } from "@/types/admin-menu";
import {
    LayoutDashboard,
    Package,
    Shapes,
    ShoppingCart,
    Users,
    Warehouse,
    FileBarChart2,
    Settings,
    MapPin,
    CircleUserRound,
    UtensilsCrossed,
    BookOpen,
    SlidersHorizontal,
    BarChart3,
    CalendarDays,
    CreditCard,
    RotateCcw,
    BadgePercent,
    BadgeDollarSign,
    ChefHat,
} from "lucide-react";

export const adminMenu: AdminMenuItem[] = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        permission: null,
    },

    {
        title: "Menu Management",
        href: "/",
        icon: UtensilsCrossed,
        children: [
            {
                title: "Modifiers",
                href: "/modifiers",
                icon: SlidersHorizontal,
                permission: "menu.view",
            },
            {
                title: "Items",
                href: "/menu",
                icon: BookOpen,
                permission: "menu.view",
            },
        ],
    },
    {
        title: "Sales",
        href: "/sales",
        icon: BadgeDollarSign,

        children: [

            {
                title: "Dashboard",
                href: "/sales",
                icon: LayoutDashboard,
                permission: "sales.view",
            },

            {
                title: "Orders",
                href: "/sales/orders",
                icon: ShoppingCart,
                permission: "sales.orders.view",
            },
            // {
            //     title: "Reports",
            //     href: "/sales/reports",
            //     icon: BarChart3,
            //     permission: "sales.reports.view",
            //     children: [
            //         {
            //             title: "Daily Sales",
            //             href: "/sales/reports/daily",
            //             icon: CalendarDays,
            //             permission: "",
            //         },

            //         {
            //             title: "Product Sales",
            //             href: "/sales/reports/products",
            //             icon: Package,
            //             permission: "",
            //         },
            //         {
            //             title: "Payment Report",
            //             href: "/sales/reports/payments",
            //             icon: CreditCard,
            //             permission: "",
            //         },
            //     ],
            // },
            {
                title: "Customers",
                href: "/sales/customers",
                icon: Users,
                permission: "sales.customers.view",
            },


            {
                title: "Refunds",
                href: "/sales/refunds",
                icon: RotateCcw,
                permission: "sales.refunds.view",
            },


            {
                title: "Discounts",
                href: "/sales/discounts",
                icon: BadgePercent,
                permission: "sales.discounts.view",
            },


            {
                title: "Settings",
                href: "/sales/settings",
                icon: Settings,
                permission: "sales.settings.view",
            },

        ],
    },
    {
        title: "POS",
        href: "/walk-in",
        icon: Package,
        permission: "menu.view",
    },
    {
        title: "Kitchen Display",
        href: "/kitchen-display",
        icon: ChefHat,
        permission: "menu.view",
    },
    {
        title: "Setup",
        href: "/",
        icon: Settings,
        children: [
            {
                title: "Payment Methods",
                href: "/payment-methods",
                icon: CreditCard,
                permission: "payment-methods.view",
            },
            {
                title: "Order Sources",
                href: "/order-sources",
                icon: Shapes,
                permission: "order-sources.view",
            },
            {
                title: "Discounts",
                href: "/discounts",
                icon: BadgePercent,
                permission: "discounts.view",
            },
            {
                title: "Staff",
                href: "/staff",
                icon: CircleUserRound,
                permission: "users.view",
            },
            {
                title: "Location Setup",
                href: "/locations",
                icon: MapPin,
                permission: "locations.view",
            },
        ],
    },
   
    // {
    //     title: "Categories",
    //     href: "/categories",
    //     icon: Shapes,
    //     permission: "categories.view",
    // },
    // {
    //     title: "Orders",
    //     href: "/orders",
    //     icon: ShoppingCart,
    //     permission: "orders.view",
    // },
    // {
    //     title: "Customers",
    //     href: "/customers",
    //     icon: Users,
    //     permission: "customers.view",
    // },
    // {
    //     title: "Inventory",
    //     href: "/inventory",
    //     icon: Warehouse,
    //     permission: "inventory.view",
    // },
    // {
    //     title: "Reports",
    //     href: "/reports",
    //     icon: FileBarChart2,
    //     permission: "reports.view",
    // },
    // {
    //     title: "Settings",
    //     href: "/settings",
    //     icon: Settings,
    //     permission: "settings.view",
    // },
];  