// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
import stores from '@/store';
import { history, RequestConfig } from '@umijs/max';
// @ts-ignore
import { AxiosConfig } from '@/request/AxiosConfig';
import { RunTimeLayoutConfig } from '@@/plugin-layout/types';
import { createElement, useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

export async function getInitialState(): Promise<{
  name: string;
  loginToken: string;
}> {
  console.log('getInitialState... ');
  const loginToken = localStorage.getItem('access_token') || '';
  return { name: '@umijs/max', loginToken };
}

export const layout: RunTimeLayoutConfig = () => {
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
    noFound: <div>not found page</div>,
    unAccessible: <div>no access</div>,
  };
};

/**
 * 渲染前的动作
 * @param oldRender
 */
export function render(oldRender: any) {
  console.log('render... ');
  // render 后才有route
  oldRender();
}

/**
 * 请求配置
 */
export const request: RequestConfig = {
  timeout: 1000,
  // other axios options you want
  errorConfig: {
    errorHandler() {},
    errorThrower() {},
  },
  requestInterceptors: [AxiosConfig.requestInterceptor],
  responseInterceptors: [AxiosConfig.responseInterceptor],
};
// 解决umi下 rootContainer导致菜单权限失效的bug
const CheckPermissions = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const accessToken = localStorage.getItem('access_token') || '';
  const { location } = history;
  useEffect(() => {
    if (!accessToken && location.pathname !== '/login') {
      history.push('/login');
    }
  }, [accessToken, location.pathname]);
  return children;
};
const RTKProvider = ({ children }: { children: JSX.Element }) => (
  <Provider store={stores.store}>
    <PersistGate loading={null} persistor={stores.persistor}>
      <CheckPermissions>{children}</CheckPermissions>
    </PersistGate>
  </Provider>
);
/**
 * 修改交给 react-dom 渲染时的根组件。
 * args 包含：
 *
 * routes.ts，全量路由配置
 * plugin，运行时插件机制
 * history，history 实例
 */
export function rootContainer(container: React.ReactNode) {
  return createElement(RTKProvider, null, container);
}
