export interface UploadSimulatorOptions {
  onProgress: (progress: number) => void;
  signal?: AbortSignal;
}

export const simulateUpload = (
  _file: File,
  options: UploadSimulatorOptions
): Promise<void> => {
  const { onProgress, signal } = options;

  return new Promise((resolve, reject) => {
    let progress = 0;

    const interval = setInterval(() => {
      if (signal?.aborted) {
        clearInterval(interval);
        reject(new Error("Upload cancelled"));
        return;
      }

      progress += Math.floor(Math.random() * 10) + 5;

      if (progress >= 100) {
        progress = 100;
      }

      onProgress(progress);

      if (progress === 100) {
        clearInterval(interval);
        resolve();
      }
    }, 300);

    signal?.addEventListener("abort", () => {
      clearInterval(interval);
      reject(new Error("Upload cancelled"));
    });
  });
};