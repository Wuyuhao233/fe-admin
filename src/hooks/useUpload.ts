import { UploadFileParams } from '@/declare/utils';
import { uploadFile } from '@/utils/tools';
import { message } from 'antd';

export const useUpload = () => {
  const run = async (params: UploadFileParams) => {
    const res = await uploadFile(params);
    if (res.code === 200) {
      message.success('上传成功');
      // note 这里需要用函数式更新，否则会出现多次上传，只有最后一个文件的问题
    } else {
      message.error('上传失败');
    }
  };
  return {
    run,
  };
};
