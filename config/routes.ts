import { IRoutes } from './index';

export const routes: IRoutes[] = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    name: 'home',
    path: '/home',
    component: './Home',
  },
  // {
  //   name: ' 系统管理',
  //   path: '/system',
  //   routes: [
  //     {
  //       name: '用户列表',
  //       path: 'user',
  //       component: './System/User/index.js',
  //     },
  //     {
  //       name: '角色管理',
  //       path: 'role',
  //       component: './System/Role/index.js',
  //     },
  //     {
  //       name: '权限管理',
  //       path: 'permission',
  //       component: './System/Permission/index.js',
  //     },
  //     {
  //       name: '菜单管理',
  //       path: 'menu',
  //       component: './System/Menu/index.js',
  //     },
  //   ],
  // },
  // {
  //   name: '仓库管理',
  //   path: '/warehouse',
  //   routes: [
  //     {
  //       name: '物料管理',
  //       path: 'component',
  //       component: './Warehouse/ComponentPage/index.js',
  //     },
  //     {
  //       name: '类别管理',
  //       path: 'series',
  //       component: './Warehouse/series/index.js',
  //     },
  //   ],
  // },
  // 非菜单路由
  {
    name: '登录',
    path: '/login',
    component: './Login',
    layout: false,
  },
  {
    name: '测试',
    path: '/test',
    component: './Test',
    layout: false,
  },
  {
    name: '404',
    path: '*',
    component: './NotFound',
    layout: false,
  },
];
