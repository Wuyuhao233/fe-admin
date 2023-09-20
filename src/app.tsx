// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
import stores from '@/store';
import { history, RequestConfig } from '@umijs/max';
import settings from '../config/defaultSettings';
// @ts-ignore
import {
  AvatarDropdown,
  AvatarName,
  LangSelect,
  ThemeChanger,
} from '@/components/rightContent';
import SocketHandler from '@/components/SocketHandler';
import renderIcon from '@/config/iconMap';
import { User } from '@/declare/User';
import InitialComponent from '@/InitialComponent';
import { MenuInfo } from '@/pages/System/controller/menu.controller';
import { AxiosConfig } from '@/request/AxiosConfig';
import { traverse } from '@/request/fetch';
import { refreshToken } from '@/utils/normalFetch';
import { RunTimeLayoutConfig } from '@@/plugin-layout/types';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import { message } from 'antd';
import { createElement, useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { EnvConfig } from '../config/env.config';
/**
 * 初始化数据
 */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  user?: User;
}> {
  console.log('getInitialState... ');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return {
    settings: settings as Partial<LayoutSettings>,
    user: user as User,
  };
}
let fetchedMenu: MenuInfo[] = [];
// note 不要做成异步的，否则会导致路由失效
export function patchClientRoutes({ routes }: { routes: any[] }) {
  //note 最后一个是菜单的配置,并且只需插入到children内即可，会自动同步到route内
  // note require.default 方法可以获取到组件
  if (fetchedMenu.length > 0) {
    traverse(fetchedMenu, routes);
  }
}
export const layout: RunTimeLayoutConfig = ({
  initialState,
  setInitialState,
}) => {
  return {
    // layout: 'mix',
    // logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    // menu: {
    //   locale: false,
    // },
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
    actionsRender: () => [
      <ThemeChanger key="theme" />,
      <LangSelect key="SelectLang" />,
    ],
    avatarProps: {
      src: initialState?.user?.avatar,
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          <SettingDrawer
            disableUrlParams
            enableDarkTheme
            settings={initialState?.settings}
            onSettingChange={(settings) => {
              setInitialState((preInitialState) => ({
                ...preInitialState,
                settings,
              }));
            }}
          />
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * 渲染前的动作
 * @param oldRender
 */
export function render(oldRender: any) {
  console.log('root', document.getElementById('root'));
  console.log('render... ');
  //note render 后才有route
  // note 写在这里在推出登录后，再次登录，会导致菜单失效
  // 所以需要在patchClientRoutes中进行处理
  // 由于登录后会刷新页面，所以登录页面无需获取菜单
  if (localStorage.getItem('refresh_token')) {
    const url = EnvConfig.getFetchUrl();

    const fetchAndRender = () => {
      try {
        fetch(url, {
          method: 'GET',
          headers: {
            // 添加  token
            // todo 改成refresh_token，需要后端支持
            Authorization: 'Bearer ' + localStorage.getItem('access_token'),
          },
        }).then((res) => {
          res.json().then((data) => {
            console.log('fetch menuList...', data);
            if (data.code === 200) {
              fetchedMenu = data.data;
              oldRender();
            } else {
              message.error('重新获取菜单').then(() => {
                refreshToken().then((r) => {
                  if (r === 'success') {
                    fetchAndRender();
                  } else {
                    oldRender();
                  }
                });
              });
            }
          });
        });
      } catch (e: any) {
        oldRender();
      }
    };

    fetchAndRender();
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
/**
 * RTK Provider --全局store，状态管理
 * PersistGate --持久化
 * ConfigProvider --antd全局配置
 * @param children
 * @constructor
 */
const RTKProvider = ({ children }: { children: JSX.Element }) => {
  return (
    <Provider store={stores.store}>
      <PersistGate loading={null} persistor={stores.persistor}>
        <InitialComponent>
          <>
            <SocketHandler />
            <CheckPermissions>{children}</CheckPermissions>
          </>
        </InitialComponent>
      </PersistGate>
    </Provider>
  );
};
/**
 * 修改交给 react-dom 渲染时的根组件。
 * args 包含：
 *
 * routes.ts，全量路由配置
 * plugin，运行时插件机制
 * history，history 实例
 */
export function rootContainer(container: React.ReactNode) {
  console.log('rootContainer... ', document.getElementById('root'));
  return createElement(RTKProvider, null, container);
}
