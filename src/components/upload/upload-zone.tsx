import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void;
}

const UploadZone = ({ onFilesSelected }: UploadZoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (selectedFiles.length > 0) {
      onFilesSelected(selectedFiles);
    }

    event.target.value = "";
  };

  const handleBrowse = () => {
    inputRef.current?.click();
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(event.dataTransfer.files);

    if (droppedFiles.length > 0) {
      onFilesSelected(droppedFiles);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`mx-auto mt-10 max-w-2xl rounded-2xl border-2 border-dashed p-10 text-center transition ${
        isDragging
          ? "border-red-500 bg-red-50"
          : "border-gray-300 bg-white hover:border-red-400 hover:bg-red-50/40"
      }`}
    >
      <div className="mx-auto flex size-14 items-center justify-center rounded-xl bg-red-50">
        <UploadCloud className="size-7 text-red-600" />
      </div>

      <h2 className="mt-5 text-lg font-semibold text-gray-900">
        Drag & drop your files here
      </h2>

      <p className="mt-2 text-sm text-gray-500">
        or choose multiple files from your computer
      </p>

      <button
        type="button"
        onClick={handleBrowse}
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-500"
      >
        Choose Files
      </button>

      <input
        ref={inputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default UploadZone;