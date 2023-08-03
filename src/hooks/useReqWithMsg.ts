import { useRequest } from '@umijs/max';
import { message } from 'antd';
import { useEffect, useState } from 'react';
interface Flag {
  type: 'success' | 'error';
  msg: string;
}
export const useReqWithMsg = <T, I extends any>(
  req: (params: I) => Promise<T>,
  reload?: () => any,
) => {
  const [flag, setFlag] = useState<Flag>({ type: 'success', msg: '' });
  useEffect(() => {
    if (flag.msg) {
      message[flag.type](flag.msg);
    }
  }, [flag]);
  return useRequest(req, {
    manual: true,
    onSuccess: (res) => {
      console.log('onSuccess', res);
      if (res.code === 200) {
        setFlag({ type: 'success', msg: res.msg || '成功' });
        reload?.();
      } else {
        setFlag({ type: 'error', msg: res.msg || '失败' });
      }
    },
    onError: (err) => {
      console.log('onError', err);
      setFlag({ type: 'error', msg: '出错啦' });
    },
  });
};
