import { AlertCircle } from "lucide-react";

export function ImportInfo() {
  return (
    <div className="mx-6 mb-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
      <div className="flex gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

        <div>
          <p className="text-sm font-medium text-blue-900">
            Before importing
          </p>

          <p className="mt-1 text-sm leading-6 text-blue-700">
            Make sure both CSV files are exported from Sapaad
            and contain the same date range. The files will be
            validated before any historical orders are imported.
          </p>
        </div>
      </div>
    </div>
  );
}