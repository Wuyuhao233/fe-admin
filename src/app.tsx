// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
import stores from '@/store';
import { history, RequestConfig } from '@umijs/max';
// @ts-ignore
import RightAvatar from '@/components/RightAvartar';
import renderIcon from '@/config/iconMap';
import InitialComponent from '@/InitialComponent';
import { MenuInfo } from '@/pages/System/controller/menu.controller';
import { AxiosConfig } from '@/request/AxiosConfig';
import { traverse } from '@/request/fetch';
import { RunTimeLayoutConfig } from '@@/plugin-layout/types';
import { message } from 'antd';
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
let fetchedMenu: MenuInfo[] = [];
// note 不要做成异步的，否则会导致路由失效
export function patchClientRoutes({ routes }: { routes: any[] }) {
  //note 最后一个是菜单的配置,并且只需插入到children内即可，会自动同步到route内
  // note require.default 方法可以获取到组件
  if (fetchedMenu.length > 0) {
    traverse(fetchedMenu, routes);
  }
  console.log('patchClientRoutes...', routes);
}
export const layout: RunTimeLayoutConfig = () => {
  return {
    layout: 'mix',
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
    menuDataRender: (menuData) => {
      console.log('menuDataRender...', menuData);
      // note 需要这样处理，否则菜单收缩会有异常，icon 没有完全收缩
      return menuData.map((item) => {
        if (item.parentId === null) {
          return {
            ...item,
            icon: renderIcon(item.icon as string),
          };
        }
        return item;
      });
    },
    // note 设置子菜单的icon，可以增加埋点等
    menuItemRender: (item, defaultDom) => {
      return (
        <span className={'flex gap-2 cusMenu'}>
          <span>{renderIcon(item.icon as string)}</span>
          <span>
            <a onClick={() => history.push(item.path || '/home')}>
              {defaultDom}
            </a>
          </span>
        </span>
      );
    },
    rightContentRender: (headerProps, dom, props) => <RightAvatar {...props} />,
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
  //note render 后才有route
  // note 写在这里在推出登录后，再次登录，会导致菜单失效
  // 所以需要在patchClientRoutes中进行处理
  // 由于登录后会刷新页面，所以登录页面无需获取菜单
  if (localStorage.getItem('refresh_token')) {
    fetch('http://localhost:3333/api/v1/menu/getCurUserMenu', {
      method: 'GET',
      headers: {
        // 添加  token
        // todo 改成refresh_token，需要后端支持
        Authorization: 'Bearer ' + localStorage.getItem('refresh_token'),
      },
    }).then((res) => {
      res.json().then((data) => {
        console.log('fetch menuList...', data);
        if (data.code === 200) {
          fetchedMenu = data.data;
        } else {
          message.error('获取菜单失败');
        }
        oldRender();
      });
    });
  } else {
    oldRender();
  }
}

/**
 * 请求配置
 */
export const request: RequestConfig = {
  timeout: AxiosConfig.timeout,
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
      <InitialComponent>
        <CheckPermissions>{children}</CheckPermissions>
      </InitialComponent>
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
export function rootContainer(container: React.ReactNode, args: any) {
  console.log('rootContainer... ', args);
  return createElement(RTKProvider, null, container);
}
