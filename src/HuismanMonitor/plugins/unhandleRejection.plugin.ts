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
import { getLocationHref, on } from '@/HuismanMonitor/utils/helpers';
import { isError } from 'lodash';

const unhandleRejectionPlugin: BasePluginType = {
  name: BrowserEventTypes.UNHANDLEDREJECTION,
  monitor(notify) {
    on(window, 'unhandledrejection', (e) => {
      console.log('unhandledRejectionPlugin -- notify', e);
      notify(BrowserEventTypes.UNHANDLEDREJECTION, e);
    });
  },
  transform(e: PromiseRejectionEvent) {
    console.log('unhandledRejectionPlugin -- transform', e);
    let data: ReportDataType = {
      level: Severity.Low,
      name: e.reason.name,
      time: Date.now(),
      type: 'unhandledrejection',
      url: getLocationHref(),
      message: e.reason.message,
    };
    if (isError(e.reason)) {
      data.name = e.reason.name;
      data.message = e.reason.message;
      if (e.reason.stack) {
        data.stack = e.reason.stack.split('\n');
      }
    }
    return data;
  },
  consumer(monitor, data: PromiseRejectionEvent) {
    // 压入堆栈
    const breadCrumbData: BreadcrumbPushData = {
      type: BreadcrumbTypes.UNHANDLEDREJECTION,
      level: '',
      time: Date.now(),
      category: BREADCRUMBCATEGORYS.EXCEPTION,
    };
    monitor.pushBreadCrumb(breadCrumbData);
    console.log('消费数据--用于上报 -- unhandledRejection', data);
    monitor.sendToServer(data);
  },
};
export default unhandleRejectionPlugin;
