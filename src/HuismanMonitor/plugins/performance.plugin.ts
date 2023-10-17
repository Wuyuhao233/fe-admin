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
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        console.log('entries', entries);
        if (observer) {
          observer.disconnect();
          notify('performance', {
            entries,
            resourceTimes: performance.getEntriesByType('resource'),
          });
        }
        // const resourceTimes = entries.filter((item) => item.initiatorType);
      });
      observer.observe({
        entryTypes: ['resource', 'paint', 'largest-contentful-paint'],
        buffered: true,
      });
    });
  },
  transform(data: IPerformanceData): ReportDataType {
    const { entries, resourceTimes } = data;
    // FP，FCP,LCP
    const FP = entries.find((item) => item.name === 'first-paint');
    const FCP = entries.find((item) => item.name === 'first-contentful-paint');
    const LCP = entries.find(
      (item) => item.entryType === 'largest-contentful-paint',
    );
    console.log('performancePlugin -- transform', entries, {
      FP,
      FCP,
      LCP,
    });
    // 耗时超过250ms的资源
    const over250msResource = resourceTimes.filter(
      (item) => item.duration > 250,
    );
    return {
      name: 'performance',
      time: Date.now(),
      type: 'performance' as const,
      level: Severity.Info,
      url: getLocationHref(),
      data: {
        FP: FP?.startTime,
        FCP: FCP?.startTime,
        LCP: LCP?.startTime,
        over250msResource:
          over250msResource.length > 0 ? over250msResource : null,
      },
    };
  },
  consumer(monitor, data: any) {
    monitor.sendToServer(data);
  },
};
export default performancePlugin;
