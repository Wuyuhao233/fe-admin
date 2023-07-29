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
  ): Promise<ResponseMsg<T>>;
  delete<T = any>(
    url: string,
    params: Record<string, any>,
  ): Promise<ResponseMsg<T>>;
  common<T = any>(config: RequestConfig): Promise<T>;
}
export const http: Http = {
  get(url: string, params: Record<string, any>) {
    return request(url, {
      method: 'GET',
      params,
    });
  },
  post(url: string, data: Record<string, any>) {
    return request(url, {
      method: 'POST',
      data,
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
    });
  },
};
