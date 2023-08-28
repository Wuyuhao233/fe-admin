import { defineConfig } from '@umijs/max';
import defaultSettings from './defaultSettings';
import { routes } from './routes';
export default defineConfig({
  antd: {},
  icons: {},
  access: {},
  model: {},
  initialState: {},
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: false,
  },
  request: {
    // 需要完整的数据结构
    dataField: '',
  },
  layout: {
    title: '@umijs/max',
    ...defaultSettings,
  },
  routes,
  plugins: ['./src/plugins/readPageFile.plugin.ts'],
  proxy: {
    '/ff': {
      target: 'http://localhost:3333/',
      changeOrigin: true,
      pathRewrite: { '^/ff': '' },
    },
  },
  npmClient: 'pnpm',
  tailwindcss: {},
  theme: {
    // 如果不想要 configProvide 动态设置主题需要把这个设置为 default
    // 只有设置为 variable， 才能使用 configProvide 动态设置主色调
    'root-entry-name': 'variable',
  },
});
