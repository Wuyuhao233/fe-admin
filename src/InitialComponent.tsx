import initialController from '@/initial.controller';
import { setAccessToken, setRefreshToken, setUserInfo } from '@/store/auth';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useRequest } from '@umijs/max';
import { useEffect } from 'react';
const { getCurrUser } = initialController;
const InitialComponent = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  // note token 有更新的话，需要重新获取user信息
  const dispatch = useAppDispatch();
  const { refreshToken, accessToken } = useAppSelector((state) => state.auth);

  const { run } = useRequest(getCurrUser, {
    // note ready 只负责初始的时候执行，不会因为依赖变化而变化
    manual: true,
    onSuccess: (res) => {
      console.log('onSuccess... ', res);
      dispatch(setUserInfo(res.data));
    },
  });
  /**
   * 由于登录后，准备刷新页面，所以需要从localStorage中获取token
   */
  useEffect(() => {
    const access_token = localStorage.getItem('access_token');
    const refresh_token = localStorage.getItem('refresh_token');
    if (access_token && refresh_token) {
      dispatch(setAccessToken(access_token));
      dispatch(setRefreshToken(refresh_token));
    }
  }, []);
  useEffect(() => {
    if (refreshToken && accessToken) {
      run();
    }
  }, [accessToken, refreshToken, run]);
  return children;
};
export default InitialComponent;
