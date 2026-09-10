export type UploadStatus =
  | "pending"
  | "uploading"
  | "completed"
  | "failed"
  | "cancelled";

export interface UploadFile {
  id: string;
  file: File;
  name: string;
  size: number;
  progress: number;
  status: UploadStatus;
  error?: string;
}

export interface UploadItemProps {
  upload: UploadFile;
  onCancelUpload: (uploadId: string) => void;
}