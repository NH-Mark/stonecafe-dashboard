export type ImportFileType = "orders" | "items";

export interface ImportFiles {
  orders: File | null;
  items: File | null;
}

export interface CsvUploadCardProps {
  type: ImportFileType;
  title: string;
  description: string;
  icon: React.ReactNode;
  file: File | null;
  dragging: boolean;

  onDragEnter: () => void;
  onDragLeave: () => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  onFile: (file: File) => void;
  onRemove: () => void;
}