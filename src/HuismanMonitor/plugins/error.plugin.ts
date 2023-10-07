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

const errorPlugin: BasePluginType = {
  name: BrowserEventTypes.ERROR,
  monitor(notify) {
    on(
      window,
      'error',
      (e) => {
        notify(BrowserEventTypes.ERROR, e);
      },
      false,
    );
  },
  /**
   * 资源加载错误 -- 需要判断 todo 资源类型的判断
   * 代码错误
   * @param args
   */
  transform(args: ErrorEvent) {
    console.log('转换前获取的数据', args);
    const { message, filename, lineno, colno, error } = args;
    let result: ReportDataType;
    if (error && isError(error)) {
      result = {
        type: 'error',
        time: Date.now(),
        url: getLocationHref(),
        name: error.name,
        level: Severity.Normal,
        message: error.message,
        stack: [],
      };
      if (error.stack) {
        result.stack = error.stack.split('\n');
      }
    } else {
      result = {
        type: 'unknown',
        time: Date.now(),
        url: getLocationHref(),
        name: 'unknown',
        level: Severity.Normal,
        message: message,
        stack: [
          {
            line: lineno,
            column: colno,
            url: filename || getLocationHref(),
          },
        ],
      };
    }
    return result;
  },
  consumer(monitor, data: ReportDataType) {
    // 压入堆栈
    const breadCrumbData: BreadcrumbPushData = {
      type: BreadcrumbTypes.CODE_ERROR,
      level: '',
      time: Date.now(),
      category: BREADCRUMBCATEGORYS.EXCEPTION,
    };
    monitor.pushBreadCrumb(breadCrumbData);
    console.log('消费数据--用于上报', data);
    monitor.sendToServer(data);
  },
};
export default errorPlugin;
