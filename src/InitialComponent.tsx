import initialController from '@/initial.controller';
import { setUserInfo } from '@/store/auth';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useRequest } from '@umijs/max';
const { getCurrUser } = initialController;
const InitialComponent = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  // note token 有更新的话，需要重新获取user信息
  const dispatch = useAppDispatch();
  const { refreshToken, accessToken } = useAppSelector((state) => state.auth);
  useRequest(getCurrUser, {
    ready: !!accessToken,
    refreshDeps: [refreshToken],
    onSuccess: (res) => {
      console.log('onSuccess... ', res);
      dispatch(setUserInfo(res.data));
    },
  });
  return children;
};
export default InitialComponent;
