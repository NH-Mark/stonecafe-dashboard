"use client";

import { useEffect, useState } from "react";

import { DataTable } from "@/components/data-table/data-table";
import { getEmployeeLogs } from "@/features/employee-logs/employee-log.service";
import type { EmployeeLog } from "@/types/employee-log";
import { employeeLogColumns } from "./EmployeeLogColumns";

function normalizeEmployeeLog(log: EmployeeLog): EmployeeLog {
    const employeeName =
        log.user?.name ??
        log.employee_name ??
        (log.user_id ? `Employee #${log.user_id}` : "Unknown Employee");

    const normalizedRole =
        log.role ??
        log.user?.roles?.find((role) => role.name)?.name ??
        "Staff";

    return {
        ...log,
        employee_name: employeeName,
        role: normalizedRole,
        status: log.signed_out_at ? "Logged Out" : "Signed In",
    };
}

export default function EmployeeLogsTable() {
    const [logs, setLogs] = useState<EmployeeLog[]>([]);
    const [loading, setLoading] = useState(true);

    async function loadLogs() {
        try {
            const response = await getEmployeeLogs();
            const mappedRows = response.data.map(normalizeEmployeeLog);

            setLogs(mappedRows);
        } catch {
            setLogs([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadLogs();
    }, []);

    return (
        <DataTable
            columns={employeeLogColumns({ onSuccess: loadLogs })}
            data={logs}
            placeholder="Search employee logs..."
            loading={loading}
        />
    );
}
