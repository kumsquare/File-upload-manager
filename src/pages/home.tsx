import { useState, useRef } from "react";
import { FileUp } from "lucide-react";
import UploadZone from "../components/upload/upload-zone";
import UploadList from "../components/upload/upload-list";
import type { UploadFile } from "../types/upload";
import {simulateUpload} from "../utils/upload-simulator";

const Home = () => {
  const [uploads, setUploads] = useState<UploadFile[]>([]);
  const uploadControllers = useRef<Map<string, AbortController>>(new Map());
  const MAX_CONCURRENT_UPLOADS = 3;
  const activeUploads = useRef(0);
  const uploadQueue = useRef<UploadFile[]>([]);
  const handleFilesSelected = (files: File[]) => {
    const newUploads: UploadFile[] = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      name: file.name,
      size: file.size,
      progress: 0,
      status: "pending",
      uploadedChunks: 0,
      totalChunks: Math.max(1, Math.ceil(file.size / (1024 * 1024))), // 1 MB chunk size
    }));

    setUploads((previous) => [
      ...previous,
      ...newUploads,
    ]);
    uploadQueue.current.push(...newUploads);
    processUploadQueue();
 };

  const processUploadQueue = () => {
    while (
      activeUploads.current < MAX_CONCURRENT_UPLOADS &&
      uploadQueue.current.length > 0
    ) {
      const upload = uploadQueue.current.shift();

      if (!upload) {
        return;
      }

      activeUploads.current += 1;

      startUpload(upload);
    }
  };

  const startUpload = async (upload: UploadFile) => {
    const controller = new AbortController();
    uploadControllers.current.set(upload.id, controller);

    setUploads((previous) =>
      previous.map((item) =>
        item.id === upload.id
          ? {
              ...item,
              status: "uploading",
            }
          : item
      )
    );

    try {
      await simulateUpload(upload.file, {
        startChunk: upload.uploadedChunks,
        signal: controller.signal,
        onProgress: (progress) => {
          setUploads((previous) =>
            previous.map((item) =>
              item.id === upload.id
                ? {
                    ...item,
                    progress,
                  }
                : item
            )
          );
        },
      });

      setUploads((previous) =>
        previous.map((item) =>
          item.id === upload.id
            ? {
                ...item,
                progress: 100,
                status: "completed",
              }
            : item
        )
      );
    } catch (error) {
      if(controller.signal.aborted) {
        setUploads((previous) =>
        previous.map((item) =>
          item.id === upload.id
            ? {
                ...item,
                status: "cancelled",
                error:
                  error instanceof Error
                    ? error.message
                    : "Upload failed",
              }
            : item
        )
      );
      } else {
        setUploads((previous) =>
        previous.map((item) =>
          item.id === upload.id
            ? {
                ...item,
                status: "failed",
                error:
                  error instanceof Error
                    ? error.message
                    : "Upload failed",
              }
            : item
        )
      );
      } 
    } finally {
        uploadControllers.current.delete(upload.id);
        activeUploads.current -= 1;
        processUploadQueue();
      }
    }

  const handleCancelUpload = (uploadId: string) => {
    const controller = uploadControllers.current.get(uploadId);
    controller?.abort();
  };

  const handleRetryUpload = (upload: UploadFile) => {
    const retryUpload = {
      ...upload,
      status: "pending" as const,
      error: undefined,
    };

    setUploads((previous) =>
      previous.map((item) =>
        item.id === upload.id
          ? retryUpload
          : item
      )
    );

    uploadQueue.current.push(retryUpload);

    processUploadQueue();
  };

  return (
    <main className="min-h-screen bg-white">
      <section className="relative isolate overflow-hidden px-6 py-20 sm:py-28 lg:py-32">

        {/* Background Gradient */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36rem] -translate-x-1/2 rotate-30 bg-gradient-to-tr from-rose-200 to-red-200 opacity-50 sm:left-[calc(50%-30rem)] sm:w-[72rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>

        <div className="mx-auto max-w-4xl text-center">

          {/* Upload Icon */}
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-red-600 shadow-lg shadow-red-200">
            <FileUp className="size-8 text-white" />
          </div>

          {/* Heading */}
          <h1 className="mt-8 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Upload your files.
            <span className="block text-red-600">
              Simple and fast.
            </span>
          </h1>

          {/* Description */}
            <div className="mt-6 flex justify-center">
                <p className="max-w-2xl text-center text-lg leading-8 text-gray-600">
                    Upload multiple files at once and track every upload with real-time progress and status updates.
                </p>
            </div>

          <UploadZone onFilesSelected={handleFilesSelected} />
          <UploadList files={uploads} onCancelUpload={handleCancelUpload} onRetryUpload={handleRetryUpload} />

          {/* Features */}
          <div className="mt-16 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-gray-500">
            <span>✓ Multiple files</span>
            <span>✓ Progress tracking</span>
            <span>✓ Cancel uploads</span>
            <span>✓ Drag & Drop</span>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;