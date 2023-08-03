import { uploadFile } from '@/utils/tools';
import { useRequest } from '@umijs/max';
import { message } from 'antd';
import { useState } from 'react';

export const useUpload = () => {
  const [files, setFile] = useState<any[]>([]);
  const { run, ...rest } = useRequest(uploadFile, {
    onSuccess: (res, params) => {
      console.log('onSuccess', res, params);
      if (res.code === 200) {
        setFile([...files, res.data]);
        message.success(res.msg || '上传成功');
      } else {
        message.error(res.msg || '上传失败');
      }
    },
    onError: (err) => {
      message.error('上传失败').then(() => console.log('上传失败', err));
    },
    manual: true,
  });
  return {
    files,
    run,
    ...rest,
  };
};
