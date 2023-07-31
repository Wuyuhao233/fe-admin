import { AxiosRequestConfig, AxiosResponseHeaders } from 'axios';

export interface ResponseMsg<T> {
  success: boolean;
  msg: string;
  code: number;
  timestamp: number;
  totalRecords?: number;
  data: T;
  status: number;
  statusText: string;
  headers: AxiosResponseHeaders;
  config: AxiosRequestConfig<D>;
  request?: any;
}
export interface PageInfo {
  pageSize: number;
  current: number;
}
