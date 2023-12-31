import { NO_NEED_TOKEN_URL, PREFIX } from '@/config/constants';
import { http } from '@/request/http';
import { history } from '@umijs/max';
import { message } from 'antd';
// @ts-ignore
import { AxiosRequestConfig } from 'axios';
interface RequestQueue {
  config: AxiosRequestConfig;
  resolve: (value?: AxiosRequestConfig) => void;
  type: 'request' | 'response';
}
export class AxiosConfig {
  static isRefreshing = false;
  static queue: RequestQueue[] = [];
  static timeout: 5000;
  static requestInterceptor(
    config: AxiosRequestConfig,
  ): Promise<unknown> | AxiosRequestConfig {
    if (config.url !== '/auth/refreshToken' && AxiosConfig.isRefreshing) {
      // add request to queue
      console.log('add request to queue');
      return new Promise((resolve) => {
        AxiosConfig.queue.push({
          resolve,
          config,
          type: 'request',
        });
      });
    }
    if (!NO_NEED_TOKEN_URL.includes(<string>config.url)) {
      // add token to header
      if (!config.headers) config.headers = {};
      config.headers.Authorization =
        'Bearer ' + localStorage.getItem('access_token');
    }
    // 重新发送不需要加前缀
    if (config.url && !config.url.startsWith(PREFIX)) {
      config.url = PREFIX + config.url;
    }
    return { ...config };
  }
  /**
   * 短期token过期后，返回code === 99998
   *  1. 使用refresh_token获取新的token
   *  2. 拦截所有请求，放到一个队列中
   *  3. refresh_token获取到新的token后，更新token，将队列中的请求重新发送
   * 长效token过期后，返回401，回到登录页面
   */
  static responseInterceptor(response: any): any {
    // 将重新发送
    if (response.data.code === 99998) {
      console.log('responseInterceptor');
      // 未resolve的请求将卡在这里
      return new Promise((resolve) => {
        AxiosConfig.queue.push({
          resolve,
          config: response.config,
          type: 'response',
        });
        if (!AxiosConfig.isRefreshing) {
          AxiosConfig.refreshToken();
        }
      });
    }
    // 403 消息提示
    if (response.data.code === 403) {
      message.error('没有权限');
    }
    return response;
  }
  // static responseErrorInterceptor(error: any) {}
  static refreshToken() {
    console.log('refreshToken');
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      message.error('登录已过期，请重新登录').then(() => {
        history.push('/login');
      });
      return;
    }
    AxiosConfig.isRefreshing = true;
    http
      .post<string>('/auth/refreshToken', {
        refreshToken,
      })
      .then((res) => {
        if (res.code === 200) {
          localStorage.setItem('access_token', res.data);
        } else {
          message.error('登录已过期，请重新登录').then(() => {
            history.push('/login');
            AxiosConfig.queue.length = 0;
          });
        }
      })
      .finally(() => {
        AxiosConfig.isRefreshing = false;
        Array(AxiosConfig.queue.length)
          .fill(0)
          .forEach(() => {
            const req = AxiosConfig.queue.shift();
            if (req) {
              const { config, resolve, type } = req;
              console.log('resend...', req);
              if (type === 'response') {
                http.common(config as any).then((res: any) => {
                  console.log('resolve...', res);
                  resolve(res);
                });
              }
              if (type === 'request' && config.headers) {
                config.headers.Authorization = `Bearer ${localStorage.getItem(
                  'access_token',
                )}`;
                resolve(config);
              }
            }
          });
      });
  }
}
