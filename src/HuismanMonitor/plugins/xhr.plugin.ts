import {
  BasePluginType,
  ReportDataType,
  Severity,
} from '@/HuismanMonitor/types';
import {
  BREADCRUMBCATEGORYS,
  BreadcrumbPushData,
  BreadcrumbTypes,
} from '@/HuismanMonitor/types/breadCrumbs';
import { BrowserEventTypes } from '@/HuismanMonitor/utils/constants';
import {
  getLocationHref,
  on,
  replaceOld,
} from '@/HuismanMonitor/utils/helpers';
import { isString } from 'lodash';

interface HuismanXMLHttpRequest extends XMLHttpRequest {
  [key: string]: any;
}
const xhrPlugin: BasePluginType = {
  name: BrowserEventTypes.XHR,
  monitor(notify) {
    if (!window.XMLHttpRequest) return;
    const originalXhrProto = XMLHttpRequest.prototype;
    function xhrOpenReplaceFn(oriFn: (...a: any[]) => void): VoidFunction {
      return function (this: HuismanXMLHttpRequest, ...args: any[]) {
        console.log('替换xhr open', this);
        this.httpCollect = {
          request: {
            httpType: 'xhr',
            method: isString(args[0]) ? args[0].toUpperCase() : args[0],
            url: args[1],
          },
          response: {},
          startTime: Date.now(),
        };
        oriFn.apply(this, args);
      };
    }
    function xhrSendReplaceFn(oriFn: (...a: any[]) => void): VoidFunction {
      return function (this: HuismanXMLHttpRequest, ...args: any[]) {
        on(this, 'loadend', function (this: HuismanXMLHttpRequest) {
          const { response, status } = this;
          this.httpCollect.response = {
            data: response,
            status,
          };
          if (args[0]) {
            this.httpCollect.request.body = args[0];
          }
          this.httpCollect.costTime = Date.now() - this.httpCollect.startTime;
          notify(BrowserEventTypes.XHR, this.httpCollect);
        });
        oriFn.apply(this, args);
      };
    }
    replaceOld(originalXhrProto, 'open', xhrOpenReplaceFn);
    replaceOld(originalXhrProto, 'send', xhrSendReplaceFn);
  },
  transform(data: any): ReportDataType {
    console.log('xhrPlugin -- transform', data);
    return {
      level: Severity.Normal,
      name: data.request.method + ':' + data.request.url,
      time: Date.now(),
      type: 'xhr',
      url: getLocationHref(),
      data,
    };
  },
  consumer(monitor, data: ReportDataType) {
    // 压入堆栈
    const breadCrumbData: BreadcrumbPushData = {
      type: BreadcrumbTypes.XHR,
      level: '',
      time: Date.now(),
      category: BREADCRUMBCATEGORYS.HTTP,
    };
    monitor.pushBreadCrumb(breadCrumbData);
    console.log('消费数据--用于上报 -- unhandledRejection', data);
    monitor.sendToServer(data);
  },
};
export default xhrPlugin;
