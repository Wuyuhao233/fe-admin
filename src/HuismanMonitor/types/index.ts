export type HuismanMonitorOptions = BrowserOptionsHooksType &
  BaseOptionsType &
  SilentOptionType;
export interface SilentOptionType {
  /**
   * 默认会监控xhr，为true时，将不再监控
   */
  silentXhr?: boolean;
  /**
   * 默认会监控fetch，为true时，将不再监控
   */
  silentFetch?: boolean;
  /**
   * 默认会监控console，为true时，将不再监控
   */
  silentConsole?: boolean;
  /**
   * 默认会监听click事件，当用户点击的标签不是body时就会被放入breadcrumb，为true，将不在监听
   */
  silentDom?: boolean;
  /**
   * 默认会监控popstate、pushState、replaceState，为true时，将不再监控
   */
  silentHistory?: boolean;
  /**
   * 默认会监控hashchange，为true时，将不在监控
   */
  silentHashchange?: boolean;
  /**
   * 默认会监控error，为true时，将不在监控
   */
  silentError?: boolean;
  /**
   * 默认会监控unhandledrejection，为true时，将不在监控
   */
  silentUnhandledrejection?: boolean;
}
export interface BaseOptionsType {
  /**
   * report to server's url
   */
  dsn?: string;
  /**
   * default is closed,sdk all functions will be turned off when set ture
   */
  disabled?: boolean;
  /**
   * default is ''(empty string),it mean that every project has a unique key
   */
  apikey?: string;
  /**
   * default is closed,it will be print in Console when set true
   */
  debug?: boolean;
  /**
   * default is closed,all page's http request will add a unique id in request header
   */
  enableTraceId?: boolean;
  /**
   * Should config this field if you set `enableTraceId` true.Considering that random addition of redundant request headers maybe cause cross-domain error,so here is regular containing relationship
   */
  traceIdFieldName?: string;
  /**
   * When set `enableTraceId` true,traceId will be added in request header, defaul value is `Trace-Id`.
   * You can configure this field to appoint name
   */
  includeHttpUrlTraceIdRegExp?: RegExp;
  /**
   * default value is null,mean all ajax http will be monitored.You can set some value to filter url.
   * It will filter when `filterXhrUrlRegExp.test(xhr.url) === true`
   */
  filterXhrUrlRegExp?: RegExp;
  /**
   * defaul value is 20,it will be 100 if value more than 100.it mean breadcrumb stack length
   */
  maxBreadcrumbs?: number;
  /**
   * defaul value is 0,it mean throttle delay time of button click event and weixin touch event
   */
  throttleDelayTime?: number;
  /**
   * default value is 2,it mean max report count of the same error
   */
  maxDuplicateCount?: number;

  /**
   * 默认为true，todo 采用gif的形式进行上报，
   * 为true时，则使用img上报的方式，会在dsn后面追加data=encodeURIComponent(reportData)，在服务端接受时需要decodeURIComponent
   */
  useImgUpload?: boolean;
  /**
   * 是否关闭性能监控，默认为false
   */
  silentPerformance?: boolean;
}
export interface BrowserOptionsHooksType {
  /**
   * 钩子函数，配置发送到服务端的xhr
   * 可以对当前xhr实例做一些配置：xhr.setRequestHeader()、xhr.withCredentials
   *
   * @param {XMLHttpRequest} xhr XMLHttpRequest的实例
   * @param {*} reportData 上报的数据
   * @memberof BrowserOptionsHooksType
   */
  configReportXhr?(xhr: XMLHttpRequest, reportData: any): void;
}
export interface BasePluginType<T extends any = any, C extends any = any> {
  // 事件枚举
  name: T;
  // 监控事件，并在该事件中用notify通知订阅中心
  monitor: (this: C, notify: (eventName: T, data: any) => void) => void;
  // 在monitor中触发数据并将数据传入当前函数，拿到数据做数据格式转换(会将tranform放入Subscrib的handers)
  transform?: (this: C, collectedData: any) => any;
  // 拿到转换后的数据进行breadcrumb、report等等操作
  consumer?: (this: C, transformedData: any, res: any) => void;
}
export const enum HttpTypes {
  XHR = 'xhr',
  FETCH = 'fetch',
}
/**
 * 上报错误类型
 */
export const enum ErrorTypes {
  UNKNOWN = 'UNKNOWN',
  UNKNOWN_FUNCTION = 'UNKNOWN_FUNCTION',
  JAVASCRIPT = 'JAVASCRIPT',
  LOG = 'LOG',
  HTTP = 'HTTP',
  VUE = 'VUE',
  REACT = 'REACT',
  RESOURCE = 'RESOURCE',
  PROMISE = 'PROMISE',
  ROUTE = 'ROUTE',
}
export interface HttpCollectedType {
  request: {
    httpType?: HttpTypes;
    traceId?: string;
    method?: string;
    url?: string;
    data?: any;
  };
  response: {
    status?: number;
    data?: any;
  };
  // for wx
  errMsg?: string;
  elapsedTime?: number;
  time?: number;
}
export interface BaseTransformType {
  type?: ErrorTypes;
  message?: string;
  time?: number;
  name?: string;
  level?: string;
  url: string;
}
export interface HttpTransformedType
  extends HttpCollectedType,
    BaseTransformType {}
type Types =
  | 'performance'
  | 'error'
  | 'unhandledrejection'
  | 'fetch'
  | 'xhr'
  | 'click'
  | 'dom'
  | 'route'
  | 'unknown';
/** 等级程度枚举 */
export enum Severity {
  Else = 'else',
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
  Debug = 'debug',
  /** 上报的错误等级 */
  Low = 'low',
  Normal = 'normal',
  High = 'high',
  Critical = 'critical',
}
export interface ReportDataType {
  userId?: string;
  userName?: string;
  time: number;
  url?: string;
  from?: string;
  to?: string;
  name: string;
  stack?: any;
  errorId?: string;
  level: Severity;
  message?: string;
  // logError 手动报错 MITO.log
  customTag?: string;
  type: Types;
  data?: any;
}
