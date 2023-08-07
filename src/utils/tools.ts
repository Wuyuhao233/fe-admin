import { UploadFileParams } from '@/declare/utils';
import { http } from '@/request/http';
import { Modal } from 'antd';
// @ts-ignore
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
  // note 将返回的data传递给onSuccess，这样就可以在fileList中的response中获取到data
  onSuccess?.(res.data);
  return res;
};
/**
 * easyConfirm
 *
 */

const { confirm } = Modal;
export const easyConfirm = (title: string, content: string) => {
  return new Promise((resolve, reject) => {
    confirm({
      title,
      content,
      okText: '确认',
      cancelText: '取消',
      onCancel: () => {
        return reject('cancel');
      },
      onOk: () => {
        return resolve('ok');
      },
    });
  });
};
