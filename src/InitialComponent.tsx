import { SocketMessageDto } from '@/config/socket.config';
import initialController from '@/initial.controller';
import { setAccessToken, setRefreshToken, setUserInfo } from '@/store/auth';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setLatestMessage } from '@/store/ws';
import darkTheme from '@/theme/dark/dark.theme';
import lightTheme from '@/theme/light/light.theme';
import { useRequest } from '@umijs/max';
import { ConfigProvider, message } from 'antd';
import { ConfigProviderProps } from 'antd/lib/config-provider';
import { useEffect } from 'react';
import { Socket, io } from 'socket.io-client';
import { EnvConfig } from '../config/env.config';

const { getCurrUser } = initialController;
const InitialComponent = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  // login 页面不用连接websocket

  console.log('location', window.location.pathname);
  /**------userInfo ----------- */
  // note token 有更新的话，需要重新获取user信息
  const dispatch = useAppDispatch();
  const { refreshToken, accessToken } = useAppSelector((state) => state.auth);
  const { themeType } = useAppSelector((state) => state.theme);
  const { run } = useRequest(getCurrUser, {
    // note ready 只负责初始的时候执行，不会因为依赖变化而变化
    manual: true,
    onSuccess: (res) => {
      console.log('onSuccess... ', res);
      dispatch(setUserInfo(res.data));
      localStorage.setItem('user', JSON.stringify(res.data));
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
  /**
   * 获取用户信息
   */
  useEffect(() => {
    if (refreshToken && accessToken) {
      run();
    }
  }, [accessToken, refreshToken, run]);
  /**
   * websocket 连接
   */
  useEffect(() => {
    /**------websocket ----------- */
    if (window.location.pathname === '/login') return;
    if (!accessToken) return;
    console.log('accessToken', accessToken);
    const socket: Socket = io(EnvConfig.getSocketUrl(), {
      transports: ['websocket'],
      //   只需一次连接
      auth: {
        token: accessToken,
      },
    });
    socket.on('connect', () => {
      console.log('connect...');
    });
    socket.on('message', (data: SocketMessageDto) => {
      dispatch(setLatestMessage(data));
    });
    socket.on('disconnect', () => {
      console.log('disconnect...');
    });
  }, [accessToken, dispatch]);
  // note 设置全局 message 最大显示数量
  message.config({
    maxCount: 1,
  });
  const providerProps: ConfigProviderProps = {};
  // note 设置 Modal、Message、Notification rootPrefixCls。
  useEffect(() => {
    const styles = document.body.style;
    if (themeType === 'dark') {
      Object.keys(darkTheme).forEach((key) => {
        if (key.includes('color')) {
          styles.setProperty(key, darkTheme[key]);
        }
      });
    }
    if (themeType === 'light') {
      Object.keys(lightTheme).forEach((key) => {
        if (key.includes('color')) {
          styles.setProperty(key, lightTheme[key]);
        }
      });
    }
  }, [themeType]);
  return <ConfigProvider {...providerProps}>{children}</ConfigProvider>;
};
export default InitialComponent;
