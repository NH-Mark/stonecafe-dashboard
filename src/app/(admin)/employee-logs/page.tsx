import EmployeeLogsTable from "@/features/employee-logs/components/EmployeeLogsTable";

export default function EmployeeLogsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-lg font-semibold">Employee Logs</h2>
                <p className="text-sm text-muted-foreground">
                    Track employee sign in and sign out activity across the venue.
                </p>
            </div>

            <EmployeeLogsTable />
        </div>
    );
}
