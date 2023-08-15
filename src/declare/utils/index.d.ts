export interface UploadFileParams {
  fileName: string;
  data: File;
  uploadProgress?: (progressEvent: UploadProgressEvent) => void;
  onSuccess?: (res: any) => void;
  isMulti?: boolean;
  hash?: string;
  chunkIndex?: number;
}
