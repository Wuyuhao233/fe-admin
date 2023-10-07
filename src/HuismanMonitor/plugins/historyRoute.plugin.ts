/* eslint-disable @typescript-eslint/no-unused-expressions */
import {
  BasePluginType,
  ReportDataType,
  Severity,
} from '@/HuismanMonitor/types';
import {
  BREADCRUMBCATEGORYS,
  BreadcrumbPushData,
  BreadcrumbTypes,
  RouteChangeCollectType,
} from '@/HuismanMonitor/types/breadCrumbs';
import { BrowserEventTypes } from '@/HuismanMonitor/utils/constants';
import { getLocationHref, replaceOld } from '@/HuismanMonitor/utils/helpers';

/**
 * 监控路由变化
 * 重写history.onpopstate,history.pushState 和 history.replaceState
 */
const historyRoutePlugin: BasePluginType = {
  name: BrowserEventTypes.HISTORY,
  monitor(notify) {
    let lastHref: string = '';
    if (!window.history) return;
    const _onpopstate = window.onpopstate;
    window.onpopstate = function (this, ev: PopStateEvent) {
      const from = lastHref;
      const to = getLocationHref();
      notify(BrowserEventTypes.HISTORY, {
        from,
        to,
      });
      _onpopstate && _onpopstate.call(window, ev);
      lastHref = to;
    };
    function historyReplaceFn(oriFn: (...a: any[]) => void): VoidFunction {
      return function (this: History, ...args: any[]) {
        const url = args.length > 2 ? args[2] : undefined;
        if (url) {
          const from = lastHref;
          const to = url;
          notify(BrowserEventTypes.HISTORY, {
            from,
            to,
          });
          lastHref = to;
        }
        oriFn && oriFn.apply(this, args);
      };
    }
    replaceOld(window.history, 'pushState', historyReplaceFn);
  },
  transform(data: RouteChangeCollectType): ReportDataType {
    console.log('historyRoutePlugin -- transform', data);
    return {
      level: Severity.Normal,
      name: 'routeChange',
      time: Date.now(),
      type: 'route',
      from: data.from,
      to: data.to,
    };
  },
  consumer(monitor, data: ReportDataType) {
    // 压入堆栈
    const breadCrumbData: BreadcrumbPushData = {
      type: BreadcrumbTypes.ROUTE,
      level: 'normal',
      time: Date.now(),
      category: BREADCRUMBCATEGORYS.USER,
    };
    monitor.pushBreadCrumb(breadCrumbData);
    console.log('消费数据--用于上报 -- historyRoutePlugin', data);
    monitor.sendToServer(data);
  },
};
export default historyRoutePlugin;
