import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {
    // 需要完整的数据结构
    dataField: '',
  },
  layout: {
    title: '@umijs/max',
  },
  routes: [
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
      name: ' 用户管理',
      path: '/user',
      component: './User',
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
  ],
  proxy: {
    '/ff': {
      target: 'http://localhost:3000/',
      changeOrigin: true,
      pathRewrite: { '^/ff': '' },
    },
  },
  npmClient: 'pnpm',
  tailwindcss: {},
});
