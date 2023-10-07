import HuismanMonitor from '@/HuismanMonitor/core';
import domClickPlugin from '@/HuismanMonitor/plugins/domClick.plugin';
import errorPlugin from '@/HuismanMonitor/plugins/error.plugin';
import HistoryRoutePlugin from '@/HuismanMonitor/plugins/historyRoute.plugin';
import performancePlugin from '@/HuismanMonitor/plugins/performance.plugin';
import unhandleRejectionPlugin from '@/HuismanMonitor/plugins/unhandleRejection.plugin';
import xhrPlugin from '@/HuismanMonitor/plugins/xhr.plugin';
import { HuismanMonitorOptions } from '@/HuismanMonitor/types';

function createMonitorInstance(
  options: HuismanMonitorOptions,
  plugins: any = [],
) {
  const monitor = new HuismanMonitor(options);
  const monitorPlugins = [
    errorPlugin,
    unhandleRejectionPlugin,
    HistoryRoutePlugin,
    xhrPlugin,
    domClickPlugin,
    performancePlugin,
    ...plugins,
  ];
  monitor.use(monitorPlugins);
  return monitor;
}
const init = createMonitorInstance;
export { createMonitorInstance, init };
