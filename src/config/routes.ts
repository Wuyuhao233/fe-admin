import { IRoutes } from '@/config/index';

export const routes: IRoutes[] = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    name: '首页',
    path: '/home',
    component: './Home',
  },
  {
    name: '权限演示',
    path: '/access',
    component: './Access',
  },
  {
    name: ' 系统管理',
    path: '/system',
    routes: [
      {
        name: '用户列表',
        path: 'user',
        component: './System/User/index.tsx',
      },
      {
        name: '角色管理',
        path: 'role',
        component: './System/Role/index.tsx',
      },
      {
        name: '权限管理',
        path: 'permission',
        component: './System/Permission/index.tsx',
      },
      {
        name: '菜单管理',
        path: 'menu',
        component: './System/Menu/index.tsx',
      },
    ],
  },
  {
    name: '仓库管理',
    path: '/warehouse',
    routes: [
      {
        name: '物料管理',
        path: 'component',
        component: './Warehouse/ComponentPage/index.tsx',
      },
      {
        name: '类别管理',
        path: 'series',
        component: './Warehouse/series/index.tsx',
      },
    ],
  },
  {
    name: '个人中心',
    path: '/personal',
    routes: [
      {
        name: '修改资料',
        path: 'profile',
        component: './Personal/Profile/index.tsx',
      },
    ],
  },
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
];
