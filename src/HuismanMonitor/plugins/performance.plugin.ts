import {
  BasePluginType,
  ReportDataType,
  Severity,
} from '@/HuismanMonitor/types';
import { BrowserEventTypes } from '@/HuismanMonitor/utils/constants';
import { getLocationHref, on } from '@/HuismanMonitor/utils/helpers';

interface IPerformanceData {
  entries: PerformanceEntry[];
  resourceTimes: PerformanceEntry[];
}
const performancePlugin: BasePluginType = {
  name: BrowserEventTypes.PERFORMANCE,
  monitor(notify) {
    on(window, 'load', () => {
      console.log('performancePlugin -- load');
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        for (const entry of entries) {
          if (entry.name === 'first-paint') {
            observer.disconnect();
          }
        }
        notify('performance', {
          entries,
          resourceTimes: performance.getEntriesByType('resource'),
        });
        observer.disconnect();
      });
      // buffered 属性表示是否观察缓存数据，也就是说观察代码添加时机比事情触发时机晚也没关系。
      observer.observe({ type: 'paint', buffered: true });
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
      //   监听资源加载
      observer.observe({ type: 'resource', buffered: true });
    });
  },
  transform(data: IPerformanceData): ReportDataType {
    const { entries, resourceTimes } = data;
    // FP，FCP,LCP
    const FP = entries.find((item) => item.name === 'first-paint');
    const FCP = entries.find((item) => item.name === 'first-contentful-paint');
    const LCP = entries.find(
      (item) => item.name === 'largest-contentful-paint',
    );
    // 耗时超过250ms的资源
    const over250msResource = resourceTimes.filter(
      (item) => item.duration > 250,
    );
    return {
      name: 'performance',
      time: Date.now(),
      type: BrowserEventTypes.PERFORMANCE,
      level: Severity.Info,
      url: getLocationHref(),
      data: {
        FP,
        FCP,
        LCP,
        over250msResource,
      },
    };
  },
  consumer(monitor, data: any) {
    monitor.sendToServer(data);
  },
};
export default performancePlugin;
