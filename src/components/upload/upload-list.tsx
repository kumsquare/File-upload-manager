import UploadItem from "./upload-item";
import type { UploadFile } from "../../types/upload";

interface UploadListProps {
  files: UploadFile[];
  onCancelUpload: (uploadId: string) => void;
  onRetryUpload: (upload: UploadFile) => void;
}

const UploadList = ({ 
  files, 
  onCancelUpload, 
  onRetryUpload 
}: UploadListProps) => {
  if (files.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto mt-10 max-w-3xl text-left">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Your Files
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {files.length}{" "}
            {files.length === 1 ? "file" : "files"} selected
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {files.map((file) => (
          <UploadItem
            key={file.id}
            upload={file}
            onCancelUpload={onCancelUpload}
            onRetryUpload={onRetryUpload}
          />
        ))}
      </div>
    </section>
  );
};

export default UploadList;