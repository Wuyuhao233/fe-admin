import { http } from '@/request/http';
// @ts-ignore
import { UploadProgressEvent } from 'rc-upload/lib/interface';
export interface UploadFileParams {
  fileName: string;
  data: any;
  uploadProgress?: (progressEvent: UploadProgressEvent) => void;
  onSuccess?: (res: any) => void;
}
export const uploadFile = async ({
  fileName,
  data,
  uploadProgress,
  onSuccess,
}: UploadFileParams) => {
  const name = encodeURI(fileName);

  const formData = new FormData();
  formData.set(name, data);
  console.log('get form data ', name, formData);
  const res = await http.post('/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data;charset=utf-8',
    },
    onUploadProgress: ({ total, loaded }) => {
      console.log('uploading...', loaded, total);
      uploadProgress?.({ percent: Number((loaded / total).toFixed(2)) * 100 });
    },
  });
  // note 需要在这里调用下，否则上传多个文件，只会触发最后一个文件的onSuccess
  onSuccess?.(res);
  return res;
};
