export interface UploadSimulatorOptions {
  onProgress: (progress: number) => void;
  onChunkUploaded?: (uploadedChunks: number) => void;
  signal?: AbortSignal;
  startChunk?: number;
}

export const simulateUpload = (
  _file: File,
  options: UploadSimulatorOptions
): Promise<void> => {
  const { 
    onProgress, 
    onChunkUploaded,
    signal,
    startChunk=0,
  } = options;

  return new Promise((resolve, reject) => {
    const CHUNK_SIZE = 1024 * 1024; // 1 MB

    const totalChunks = Math.max(
      1,
      Math.ceil(_file.size / CHUNK_SIZE)
    );

    let uploadedChunks = startChunk;

    const uploadNextChunk = () => {
      if (signal?.aborted) {
        reject(new Error("Upload cancelled"));
        return;
      }

      if (uploadedChunks >= totalChunks) {
        resolve();
        return;
      }
      
      const uploadTime = Math.floor(Math.random() * 500) + 500;

      setTimeout(() => {
        if (signal?.aborted) {
          reject(new Error("Upload cancelled"));
          return;
        }

        const shouldFail = Math.random() < 0.2;

        if (shouldFail) {
          reject(new Error("Upload failed. Please try again."));
          return;
        }

        uploadedChunks += 1;

        onChunkUploaded?.(uploadedChunks);

        const progress = Math.round(
          (uploadedChunks / totalChunks) * 100
        );

        onProgress(progress);

        if (uploadedChunks === totalChunks) {
          resolve();
          return;
        }

        uploadNextChunk();
      }, uploadTime);
    };

    uploadNextChunk();
  });
};