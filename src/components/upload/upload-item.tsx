import {
  CheckCircle2,
  File,
  RotateCcw,
  X,
  XCircle,
} from "lucide-react";

import type { UploadFile } from "../../types/upload";

interface UploadItemProps {
  upload: UploadFile;
  onCancelUpload: (uploadId: string) => void;
  onRetryUpload: (upload: UploadFile) => void;
}

const UploadItem = ({ 
  upload, 
  onCancelUpload, 
  onRetryUpload 
}: UploadItemProps) => {
  const formatFileSize = (size: number) => {
    if (size < 1024) {
      return `${size} B`;
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getStatusText = () => {
    switch (upload.status) {
      case "pending":
        return "Pending";

      case "uploading":
        return `Uploading · ${upload.progress}%`;

      case "completed":
        return "Upload successful";

      case "failed":
        return "Upload failed";

      case "cancelled":
        return "Upload cancelled";
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">

        {/* File Icon */}
        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-red-50">
          <File className="size-5 text-red-600" />
        </div>

        {/* File Information */}
        <div className="min-w-0 flex-1">

          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-gray-900">
                {upload.name}
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                {formatFileSize(upload.size)}
              </p>
            </div>

            {upload.status === "uploading" && (
              <button
                type="button"
                onClick={() => onCancelUpload(upload.id)}
                className="flex items-center gap-1 rounded-lg bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-200"
              >
                <X className="size-4" />
                Cancel
              </button>
            )}

            {/* Status Icon */}
            {upload.status === "completed" && (
              <CheckCircle2 className="size-5 shrink-0 text-green-500" />
            )}

            {upload.status === "failed" && (
              <XCircle className="size-5 shrink-0 text-red-500" />
            )}

            {upload.status === "cancelled" && (
              <X className="size-5 shrink-0 text-gray-400" />
            )}
          </div>

          {/* Status */}
          <p
            className={`mt-3 text-sm font-medium ${
              upload.status === "completed"
                ? "text-green-600"
                : upload.status === "failed"
                ? "text-red-600"
                : upload.status === "cancelled"
                ? "text-gray-500"
                : "text-gray-600"
            }`}
          >
            {getStatusText()}
          </p>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  upload.status === "completed"
                    ? "bg-green-500"
                    : upload.status === "failed"
                    ? "bg-red-500"
                    : "bg-red-600"
                }`}
                style={{
                  width: `${upload.progress}%`,
                }}
              />
            </div>

            <div className="mt-2 flex justify-between text-xs text-gray-500">
              <span>{upload.progress}%</span>

              {upload.status === "completed" && (
                <span>Completed</span>
              )}
            </div>

            {upload.status === "failed" && (
                <button
                  type="button"
                  onClick={() => onRetryUpload(upload)}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
                >
                  <RotateCcw className="size-4" />
                  Retry
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadItem;