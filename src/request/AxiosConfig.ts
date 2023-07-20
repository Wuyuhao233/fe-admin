import { NO_NEED_TOKEN_URL, PREFIX } from '@/constants';
import { http } from '@/request/http';
import { history } from '@umijs/max';
import { message } from 'antd';
// @ts-ignore
import { AxiosRequestConfig, AxiosResponse } from 'axios';
interface RequestQueue {
  config: AxiosRequestConfig;
  resolve: (value?: AxiosRequestConfig) => void;
  type: 'request' | 'response';
}
export class AxiosConfig {
  static isRefreshing = false;
  static queue: RequestQueue[] = [];
  static requestInterceptor(config: AxiosRequestConfig): AxiosRequestConfig {
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
    if (!NO_NEED_TOKEN_URL.includes(config.url)) {
      // add token to header
      config.headers.Authorization =
        'Bearer ' + localStorage.getItem('access_token');
    }

    if (!config.url.startsWith(PREFIX)) {
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
  static responseInterceptor(response: AxiosResponse): AxiosResponse {
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
        }
      })
      .finally(() => {
        AxiosConfig.isRefreshing = false;
        Array(AxiosConfig.queue.length)
          .fill(0)
          .forEach(() => {
            console.log('forEach', AxiosConfig.queue);
            const req = AxiosConfig.queue.shift();
            if (req) {
              const { config, resolve, type } = req;
              if (type === 'response') {
                http.common(config).then((res) => {
                  console.log('resolve...', res);
                  resolve(res);
                });
              }
              if (type === 'request') {
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
