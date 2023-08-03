import { defineConfig } from '@umijs/max';
import { routes } from './src/config/routes';
export default defineConfig({
  antd: {},
  icons: {},
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
  routes,

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
