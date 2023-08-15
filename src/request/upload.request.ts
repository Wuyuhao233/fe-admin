import { http } from '@/request/http';

export const baseUpload = (
  formData: any,
  {
    onUploadProgress,
  }: {
    onUploadProgress: (progressEvent: any) => void;
  },
) =>
  http.post('/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
export const mergeFile = (
  fileHash: string,
  fileName: string,
  metaData: Record<string, string>,
) => http.post('/file/merge', { fileHash, fileName, metaData });

export const verifyFile = (fileHash: string, fileName: string) =>
  http.post('/file/verifyFileIsExist', { fileHash, fileName });
