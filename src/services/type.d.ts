export interface ResponseMsg<T> {
  success: boolean;
  msg: string;
  code: number;
  timestamp: number;
  totalRecords?: number;
  data: T | string;
}
export interface PageInfo {
  pageSize: number;
  current: number;
}
