import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {
    configProvider: {},
    appConfig: {},
  },
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '@umijs/max',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '用户管理',
      path: '/home',
      component: './User',
    },
  ],
  npmClient: 'pnpm',
  proxy: {
    '/api': {
      target: 'http://localhost:3100',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
});
