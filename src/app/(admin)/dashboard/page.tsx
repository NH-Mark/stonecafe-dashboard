import SalesDashboard from "@/features/sales/components/SalesDashboard";



export default function DashbaordPage(){

    return (

        <div className="space-y-8">

            <div>
                <h1 className="text-xl font-bold">
                    Dashboard
                </h1>

                <p className="text-muted-foreground text-sm">
                    Monitor cafe performance and revenue.
                </p>
            </div>
            <SalesDashboard />
        </div>
    );
}