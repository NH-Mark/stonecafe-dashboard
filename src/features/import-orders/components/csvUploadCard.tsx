"use client";

import {
  CheckCircle2,
  FileSpreadsheet,
  Upload,
  X,
} from "lucide-react";



import { formatFileSize } from "../utils/file.utils";
import { CsvUploadCardProps } from "../import-order.types";

export function CsvUploadCard({
  type,
  title,
  description,
  icon,
  file,
  dragging,
  onDragEnter,
  onDragLeave,
  onDrop,
  onFile,
  onRemove,
}: CsvUploadCardProps) {
  const inputId = `file-${type}`;

  return (
    <div>
      {/* Header */}
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
          {icon}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            {title}
          </h3>

          <p className="text-xs text-gray-500">
            {description}
          </p>
        </div>
      </div>

      {/* Empty state */}
      {!file && (
        <label htmlFor={inputId}>
          <div
            onDragEnter={(event) => {
              event.preventDefault();
              onDragEnter();
            }}
            onDragOver={(event) => {
              event.preventDefault();
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              onDragLeave();
            }}
            onDrop={onDrop}
            className={[
              "flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 text-center transition",
              dragging
                ? "border-[#40332a] bg-gray-50"
                : "border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50",
            ].join(" ")}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <Upload className="h-5 w-5 text-gray-600" />
            </div>

            <p className="text-sm font-medium text-gray-900">
              Drop your CSV file here
            </p>

            <p className="mt-1 text-sm text-gray-500">
              or{" "}
              <span className="font-medium text-gray-900 underline">
                browse files
              </span>
            </p>

            <p className="mt-4 text-xs text-gray-400">
              CSV files only
            </p>

            <input
              id={inputId}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(event) => {
                const selectedFile =
                  event.target.files?.[0];

                if (selectedFile) {
                  onFile(selectedFile);
                }

                event.target.value = "";
              }}
            />
          </div>
        </label>
      )}

      {/* Selected file */}
      {file && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-5">
          <div className="flex items-start justify-between">
            <div className="flex min-w-0 gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white">
                <FileSpreadsheet className="h-5 w-5 text-green-600" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-900">
                  {file.name}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onRemove}
              className="ml-3 rounded-md p-1 text-gray-400 transition hover:bg-white hover:text-gray-700"
              aria-label={`Remove ${title}`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs font-medium text-green-700">
            <CheckCircle2 className="h-4 w-4" />

            <span>File selected and ready</span>
          </div>
        </div>
      )}
    </div>
  );
}