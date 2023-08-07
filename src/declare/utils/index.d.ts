export interface UploadFileParams {
  fileName: string;
  data: any;
  uploadProgress?: (progressEvent: UploadProgressEvent) => void;
  onSuccess?: (res: any) => void;
}
