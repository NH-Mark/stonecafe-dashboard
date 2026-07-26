import StaffTable from "@/features/staff/components/StaffTable";
import StaffManagement from "@/features/staff/StaffManagement";



export default function StaffPage() {


    return (
        <div className="space-y-8">

            <div>
                <h2 className="text-lg font-semibold">
                    Staff Management
                </h2>


                <p className="text-sm text-muted-foreground">
                    Manage employees, roles and permissions
                </p>

            </div>


            <StaffManagement />

        </div>

    )

} 