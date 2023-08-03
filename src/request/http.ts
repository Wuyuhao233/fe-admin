import { ResponseMsg } from '@/services/type';
import { RequestConfig, request } from '@umijs/max';

interface Http {
  get<T = any>(
    url: string,
    params?: Record<string, any>,
  ): Promise<ResponseMsg<T>>;
  post<T = any>(
    url: string,
    data: Record<string, any>,
    config?: Omit<RequestConfig, 'Data'>,
  ): Promise<ResponseMsg<T>>;
  delete<T = any>(
    url: string,
    params: Record<string, any>,
  ): Promise<ResponseMsg<T>>;
  common(config: RequestConfig): any;
}
export const http: Http = {
  get(url: string, params: Record<string, any>) {
    return request(url, {
      method: 'GET',
      params,
    });
  },
  post(url: string, data: Record<string, any>, config?: RequestConfig) {
    return request(url, {
      method: 'POST',
      data,
      ...config,
    });
  },
  delete(url: string, params: Record<string, any>) {
    return request(url, {
      method: 'DELETE',
      params,
    });
  },
  common(config: RequestConfig) {
    const { url = '', method = '', ...rest } = config;
    console.log('RequestConfig', config);
    return request(url, {
      ...rest,
      method: method.toUpperCase() || 'GET',
      // 多次走request的逻辑，会取多次的data，所以这里需要返回最初始的响应
      getResponse: true,
    });
  },
};
