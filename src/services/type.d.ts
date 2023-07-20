export interface ResponseMsg<T> {
  success: boolean;
  message: string;
  code: number;
  timestamp: number;
  totalRecords?: number;
  data: T;
}
export interface PageInfo {
  pageSize: number;
  current: number;
}
