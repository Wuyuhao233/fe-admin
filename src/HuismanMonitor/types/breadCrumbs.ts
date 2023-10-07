import { ReportDataType } from '@/HuismanMonitor/types/index';
export interface RouteChangeCollectType {
  from: string;
  to: string;
}
export interface ConsoleCollectType {
  args: any[];
  level: string;
}
/**
 * 用户行为类型
 */
export const enum BREADCRUMBCATEGORYS {
  HTTP = 'http',
  USER = 'user',
  DEBUG = 'debug',
  EXCEPTION = 'exception',
  LIFECYCLE = 'lifecycle',
}
export const enum BreadcrumbTypes {
  ROUTE = 'Route',
  CLICK = 'UI.Click',
  CONSOLE = 'Console',
  XHR = 'Xhr',
  FETCH = 'Fetch',
  UNHANDLEDREJECTION = 'Unhandledrejection',
  RESOURCE = 'Resource',
  CODE_ERROR = 'Code Error',
  CUSTOMER = 'Customer',
  REACT = 'React',
}
export interface BreadcrumbPushData {
  /**
   * 事件类型
   */
  type: BreadcrumbTypes;
  // string for click dom
  data?: ReportDataType | RouteChangeCollectType | ConsoleCollectType;
  /**
   * 分为user action、debug、http、
   */
  category?: BREADCRUMBCATEGORYS;
  time: number;
  level: string;
}
