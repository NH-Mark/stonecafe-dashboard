export function isCsvFile(file: File) {
  return (
    file.name.toLowerCase().endsWith(".csv") ||
    file.type === "text/csv"
  );
}

export function formatFileSize(bytes: number) {
  if (bytes === 0) {
    return "0 Bytes";
  }

  const units = ["Bytes", "KB", "MB", "GB"];

  const index = Math.floor(
    Math.log(bytes) / Math.log(1024)
  );

  return `${(bytes / Math.pow(1024, index)).toFixed(
    index === 0 ? 0 : 1
  )} ${units[index]}`;
}